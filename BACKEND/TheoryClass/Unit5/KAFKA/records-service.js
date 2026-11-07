const express = require('express');
const fs = require('fs');
const path = require('path');
const kafka = require('./kafka');

const PORT = 3002;
const TOPIC = 'attendance';
const GROUP_ID = 'records-group';
const DATA_FILE = path.join(__dirname, 'attendance.json');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function readRecords() {
  if (!fs.existsSync(DATA_FILE)) return {};
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function saveRecords(records) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(records, null, 2));
}

// Read API to inspect stored attendance and observe eventual consistency.
const app = express();

app.get('/attendance', (req, res) => {
  res.json(readRecords());
});

app.get('/attendance/:studentId', (req, res) => {
  const records = readRecords();
  const student = records[req.params.studentId];
  if (!student) {
    return res.status(404).json({ error: 'No attendance records found for student' });
  }
  return res.json({ studentId: req.params.studentId, ...student });
});

const consumer = kafka.consumer({ groupId: GROUP_ID });

async function handleMessage(message) {
  let event;
  try {
    event = JSON.parse(message.value.toString());
  } catch (err) {
    console.error('[Records] invalid JSON message:', err.message);
    return;
  }

  console.log(`[Records] received ${event.status} for ${event.studentId} (${event.recordId})`);

  // Simulate async persistence delay (3s) so eventual consistency is visible.
  await sleep(3000);

  const records = readRecords();
  if (!records[event.studentId]) {
    records[event.studentId] = {
      studentName: event.studentName || event.studentId,
      present: 0,
      absent: 0,
      history: [],
    };
  }

  const studentRecord = records[event.studentId];
  studentRecord.studentName = event.studentName || studentRecord.studentName;
  if (event.status === 'PRESENT') {
    studentRecord.present += 1;
  } else if (event.status === 'ABSENT') {
    studentRecord.absent += 1;
  }

  studentRecord.history.push({
    recordId: event.recordId,
    courseCode: event.courseCode,
    status: event.status,
    markedAt: event.markedAt,
  });

  saveRecords(records);
  console.log(
    `[Records] updated ${event.studentId}: present=${studentRecord.present}, absent=${studentRecord.absent}`
  );
}

async function start() {
  app.listen(PORT, () => console.log(`[Records] listening on http://localhost:${PORT}`));

  await consumer.connect();
  console.log('[Records] consumer connected to Kafka');

  await consumer.subscribe({ topic: TOPIC, fromBeginning: true });
  await consumer.run({ eachMessage: async ({ message }) => handleMessage(message) });
}

start().catch((err) => {
  console.error('[Records] startup error:', err);
  process.exit(1);
});
