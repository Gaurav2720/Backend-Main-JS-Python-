const express = require('express');
const fs = require('fs');
const kafka = require('./kafka');

const PORT = 3002;
const TOPIC = 'orders';
const GROUP_ID = 'inventory-group';
const STOCK_FILE = __dirname + '/stock.json';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const readStock = () => JSON.parse(fs.readFileSync(STOCK_FILE, 'utf8'));
const saveStock = (stock) => fs.writeFileSync(STOCK_FILE, JSON.stringify(stock, null, 2));

// Tiny web API so we can check the stock with curl or a browser.
const app = express();
app.get('/stock/:productId', (req, res) => {
  const id = req.params.productId;
  res.json({ productId: id, stock: readStock()[id] });
});

// A consumer is the Kafka client that reads events from a topic.
// The groupId puts this consumer in "inventory-group".
const consumer = kafka.consumer({ groupId: GROUP_ID });

// Runs once for every event the consumer reads from the topic.
async function handleMessage(message) {
  const event = JSON.parse(message.value.toString());
  console.log(`[Inventory] received order ${event.orderId} for ${event.productId} x${event.quantity}`);

  // Pretend the warehouse is slow (3 seconds) so eventual consistency is visible.
  await sleep(3000);

  const stock = readStock();
  const available = stock[event.productId] || 0;
  if (available < event.quantity) {
    console.log(`[Inventory] not enough stock for ${event.productId}`);
    return;
  }

  stock[event.productId] = available - event.quantity;
  saveStock(stock);
  console.log(`[Inventory] stock ${event.productId}: ${available} -> ${stock[event.productId]}`);
}

async function start() {
  app.listen(PORT, () => console.log(`[Inventory] listening on http://localhost:${PORT}`));

  await consumer.connect();
  console.log('[Inventory] consumer connected to Kafka');

  // Subscribe to the topic. fromBeginning reads history from the first event.
  await consumer.subscribe({ topic: TOPIC, fromBeginning: true });

  // Start reading; eachMessage runs for every event, one at a time.
  await consumer.run({ eachMessage: async ({ message }) => handleMessage(message) });
}

start();
