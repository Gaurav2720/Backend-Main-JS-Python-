const { spawn, execSync } = require('child_process');
const net = require('net');
const fs = require('fs');
const path = require('path');
const kafka = require('./kafka');

const KAFKA_DIR = 'C:\\kafka';
const KAFKA_START_BAT = path.join(KAFKA_DIR, 'bin', 'windows', 'kafka-server-start.bat');
const KAFKA_CONFIG = path.join(KAFKA_DIR, 'config', 'server.properties');
const JDK_25_PATH = 'C:\\Program Files\\Java\\jdk-25';

const children = [];
let shuttingDown = false;

function isPortOpen(port, host = '127.0.0.1') {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(1000);
    socket.once('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.once('error', () => resolve(false));
    socket.once('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    socket.connect(port, host);
  });
}

async function waitForKafka(timeoutMs = 45000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (await isPortOpen(9092)) return true;
    await new Promise((r) => setTimeout(r, 1000));
  }
  return false;
}

function startKafkaBroker() {
  if (!fs.existsSync(KAFKA_START_BAT)) {
    throw new Error(`Kafka not found at ${KAFKA_START_BAT}. Please start Kafka manually on localhost:9092.`);
  }

  const env = { ...process.env };
  if (fs.existsSync(JDK_25_PATH)) {
    env.JAVA_HOME = JDK_25_PATH;
  }
  if (!env.KAFKA_HEAP_OPTS) {
    env.KAFKA_HEAP_OPTS = '-Xmx1G -Xms1G';
  }

  console.log('[Launcher] Starting Kafka broker on localhost:9092...');
  const proc = spawn('cmd.exe', ['/c', KAFKA_START_BAT, KAFKA_CONFIG], {
    cwd: KAFKA_DIR,
    env,
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  proc.stderr.on('data', (chunk) => {
    const text = chunk.toString().trim();
    if (text && !text.includes('wmic')) {
      console.error(`[Kafka] ${text}`);
    }
  });

  proc.on('exit', (code) => {
    if (!shuttingDown && code !== 0) {
      console.error(`[Kafka] Broker exited with code ${code}. If first time, format storage first (see README.md).`);
    }
  });

  children.push(proc);
  return proc;
}

async function ensureTopicExists(topic) {
  const admin = kafka.admin();
  await admin.connect();
  try {
    const created = await admin.createTopics({
      topics: [{ topic, numPartitions: 1, replicationFactor: 1 }],
    });
    console.log(created ? `[Launcher] Created topic "${topic}"` : `[Launcher] Topic "${topic}" ready`);
  } finally {
    await admin.disconnect();
  }
}

function startService(scriptName) {
  const proc = spawn(process.execPath, [path.join(__dirname, scriptName)], {
    cwd: __dirname,
    stdio: 'inherit',
  });

  proc.on('exit', (code) => {
    if (!shuttingDown && code !== 0) {
      console.error(`[Launcher] ${scriptName} exited with code ${code}`);
    }
  });

  children.push(proc);
}

function shutdown() {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log('\n[Launcher] Shutting down all services...');

  for (const proc of children) {
    if (proc.pid) {
      try {
        if (process.platform === 'win32') {
          execSync(`taskkill /pid ${proc.pid} /T /F`, { stdio: 'ignore' });
        } else {
          proc.kill('SIGTERM');
        }
      } catch {
        // Process may already have exited
      }
    }
  }
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

async function main() {
  const alreadyRunning = await isPortOpen(9092);
  if (alreadyRunning) {
    console.log('[Launcher] Kafka broker already running on localhost:9092');
  } else {
    startKafkaBroker();
    const ready = await waitForKafka();
    if (!ready) {
      console.error('[Launcher] Timed out waiting for Kafka on localhost:9092.');
      shutdown();
      return;
    }
    console.log('[Launcher] Kafka broker is ready');
  }

  await ensureTopicExists('attendance');

  startService('attendance-service.js');
  startService('records-service.js');
  startService('alert-service.js');
}

main().catch((err) => {
  console.error('[Launcher] Error:', err.message);
  shutdown();
});
