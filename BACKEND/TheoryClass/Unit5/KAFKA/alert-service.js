const kafka = require('./kafka');

const TOPIC = 'attendance';
// Separate groupId so Alert Service receives its own copy of every event.
const GROUP_ID = 'alert-group';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const consumer = kafka.consumer({ groupId: GROUP_ID });

async function handleMessage(message) {
  let event;
  try {
    event = JSON.parse(message.value.toString());
  } catch (err) {
    console.error('[Alert] invalid JSON message:', err.message);
    return;
  }

  console.log(`[Alert] received ${event.status} for ${event.studentId} (${event.recordId})`);
  await sleep(500);

  if (event.status === 'ABSENT') {
    const recipient = event.parentEmail || 'parent-on-file';
    console.log(
      `[Alert] ABSENCE ALERT sent to ${recipient}: ${event.studentName} (${event.studentId}) missed ${event.courseCode}`
    );
  } else {
    console.log(
      `[Alert] check-in confirmed for ${event.studentName} (${event.studentId}) in ${event.courseCode}`
    );
  }
}

async function start() {
  await consumer.connect();
  console.log('[Alert] consumer connected to Kafka');

  await consumer.subscribe({ topic: TOPIC, fromBeginning: true });
  await consumer.run({ eachMessage: async ({ message }) => handleMessage(message) });
}

start().catch((err) => {
  console.error('[Alert] startup error:', err);
  process.exit(1);
});
