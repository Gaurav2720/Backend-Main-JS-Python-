const express = require('express');
const { randomUUID } = require('crypto');
const kafka = require('./kafka');

const PORT = 3001;
const TOPIC = 'orders';

const app = express();
app.use(express.json());

// A producer is the Kafka client that writes (publishes) events to a topic.
const producer = kafka.producer();

app.post('/orders', async (req, res) => {
  const { productId, quantity, userEmail } = req.body;

  // Simple check only: we just need a product and an amount.
  if (!productId || !quantity) {
    return res.status(400).json({ error: 'productId and quantity are required' });
  }

  const orderId = randomUUID();
  const event = { orderId, productId, quantity, userEmail };

  // Send the event to the "orders" topic. We wait only for Kafka to confirm
  // the write - NOT for inventory or notification to process it.
  await producer.send({
    topic: TOPIC,
    messages: [{ value: JSON.stringify(event) }],
  });

  console.log(`[Order] published order ${orderId} for ${productId} x${quantity}`);

  // 202 means "accepted, will be handled later". Reply right away.
  res.status(202).json({ orderId, status: 'accepted' });
});

async function start() {
  // Connect to the broker before we start accepting requests.
  await producer.connect();
  console.log('[Order] producer connected to Kafka');

  app.listen(PORT, () => {
    console.log(`[Order] listening on http://localhost:${PORT}`);
  });
}

start();
