# Kafka Demo: Event-Driven Attendance System

A simple event-driven **Attendance System** built with three independent Node.js microservices communicating over Apache Kafka (`attendance` topic).

What it demonstrates:
- **Async work** – `attendance-service` replies immediately (`HTTP 202`) instead of updating storage or sending alerts inline.
- **Eventual consistency** – `records-service` updates `attendance.json` after a 3-second simulated delay.
- **Fault tolerance** – events persist in Kafka; if `records-service` or `alert-service` goes down, it catches up automatically on restart.

---

## 1. Prerequisites
- **Node.js 18+**
- **Java 17+**
- **Apache Kafka** extracted to a short path (e.g., `C:\kafka`)

---

## 2. Start Kafka & Create the `attendance` Topic

In your Kafka folder (`C:\kafka`):

```bat
:: 1. Generate a cluster ID (first time only)
bin\windows\kafka-storage.bat random-uuid

:: 2. Format storage (first time only)
bin\windows\kafka-storage.bat format -t <CLUSTER_ID> -c config\server.properties --standalone

:: 3. Start the broker (keep terminal open)
bin\windows\kafka-server-start.bat config\server.properties
```

In a second terminal inside `C:\kafka`, create the `attendance` topic once:

```bat
bin\windows\kafka-topics.bat --create --topic attendance --bootstrap-server localhost:9092
```

---

## 3. Run Everything with One Command

Open **1 terminal** inside `BACKEND\KAFKA` and run:

```powershell
npm start
```

`start.js` automatically starts the Kafka broker (using JDK 25 if needed), ensures the `attendance` topic exists, and launches all 3 microservices together. Press `Ctrl+C` to stop everything cleanly.

*(Or run each service in 3 separate terminals: `npm run attendance`, `npm run records`, `npm run alert`.)*

---

## 4. Test the Flow (PowerShell)

### Mark a student PRESENT:
```powershell
Invoke-RestMethod -Method Post -Uri http://localhost:3001/attendance -ContentType "application/json" -Body '{"studentId":"S101","studentName":"Aarav","courseCode":"CS301","status":"PRESENT","parentEmail":"parent@example.com"}'
```

### Mark a student ABSENT (triggers absence alert):
```powershell
Invoke-RestMethod -Method Post -Uri http://localhost:3001/attendance -ContentType "application/json" -Body '{"studentId":"S101","studentName":"Aarav","courseCode":"CS301","status":"ABSENT","parentEmail":"parent@example.com"}'
```

### Check student attendance (immediately, then after 3 seconds):
```powershell
Invoke-RestMethod http://localhost:3002/attendance/S101
```

### Check all attendance records:
```powershell
Invoke-RestMethod http://localhost:3002/attendance
```

To reset stored records, set `attendance.json` back to `{}`.

---

## 5. Files

| File | Purpose |
| :--- | :--- |
| `kafka.js` | Shared KafkaJS client pointing at `localhost:9092` |
| `attendance-service.js` | Producer + `POST /attendance` on port `3001` |
| `records-service.js` | Consumer (`records-group`) + `GET /attendance` & `GET /attendance/:studentId` on port `3002` |
| `alert-service.js` | Consumer (`alert-group`) logging absence alerts and check-ins |
| `attendance.json` | JSON store for per-student attendance counts and history |
