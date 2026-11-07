const express = require('express');
const { randomUUID } = require('crypto');
const kafka = require('./kafka');

const PORT = 3001;
const TOPIC = 'attendance';
const VALID_STATUSES = new Set(['PRESENT', 'ABSENT']);

const app = express();
app.use(express.json());

// Producer writes attendance events to the Kafka topic.
const producer = kafka.producer();

app.post('/attendance', async (req, res) => {
  const { studentId, studentName, courseCode, status, parentEmail } = req.body || {};

  if (!studentId || typeof studentId !== 'string') {
    return res.status(400).json({ error: 'studentId is required' });
  }

  const normalizedStatus = typeof status === 'string' ? status.trim().toUpperCase() : '';
  if (!VALID_STATUSES.has(normalizedStatus)) {
    return res.status(400).json({ error: 'status must be PRESENT or ABSENT' });
  }

  const recordId = randomUUID();
  const event = {
    recordId,
    studentId: studentId.trim(),
    studentName: studentName ? String(studentName).trim() : studentId.trim(),
    courseCode: courseCode ? String(courseCode).trim() : 'GENERAL',
    status: normalizedStatus,
    parentEmail: parentEmail ? String(parentEmail).trim() : null,
    markedAt: new Date().toISOString(),
  };

  try {
    // Wait only for Kafka to acknowledge the event, not downstream consumers.
    await producer.send({
      topic: TOPIC,
      messages: [{ key: event.studentId, value: JSON.stringify(event) }],
    });

    console.log(`[Attendance] published ${event.status} for ${event.studentId} (${recordId})`);
    return res.status(202).json({ recordId, status: 'accepted', event });
  } catch (err) {
    console.error('[Attendance] failed to publish event:', err.message);
    return res.status(500).json({ error: 'Failed to publish attendance event' });
  }
});

async function start() {
  await producer.connect();
  console.log('[Attendance] producer connected to Kafka');

  app.listen(PORT, () => {
    console.log(`[Attendance] listening on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error('[Attendance] startup error:', err);
  process.exit(1);
});
