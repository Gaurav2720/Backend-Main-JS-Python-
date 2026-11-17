const kafka = require('./kafka');

const TOPIC = 'orders';
// A different groupId means this service gets its OWN copy of every event,
// independent of the inventory service.
const GROUP_ID = 'notification-group';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// This consumer is the Kafka client that reads events from the topic.
const consumer = kafka.consumer({ groupId: GROUP_ID });

// Called once for every event in the topic.
async function handleMessage(message) {
  const event = JSON.parse(message.value.toString());
  console.log(`[Notification] received order ${event.orderId}`);

  await sleep(500); // pretend sending an email takes a moment
  console.log(`[Notification] email sent to ${event.userEmail} about order ${event.orderId}`);
}

async function start() {
  await consumer.connect();
  console.log('[Notification] consumer connected to Kafka');

  // Subscribe to the topic, reading history from the beginning.
  await consumer.subscribe({ topic: TOPIC, fromBeginning: true });

  // Start reading in a loop; eachMessage handles one event at a time.
  await consumer.run({ eachMessage: async ({ message }) => handleMessage(message) });
}

start();
