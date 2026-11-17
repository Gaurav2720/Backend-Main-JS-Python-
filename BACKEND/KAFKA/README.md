# Kafka demo: Order → Inventory → Notification

A tiny Kafka project. One order comes in, and two separate services react to it
on their own time.

What it shows:

- **Async work** – the order service replies immediately (HTTP 202) instead of doing the stock update itself.
- **Eventual consistency** – stock does not change instantly; it changes 3 seconds later when the inventory service catches up.
- **Fault tolerance** – events wait in Kafka. If a service is down, it reads them when it comes back.

Four files, no Docker, no database, no frameworks beyond Express + KafkaJS.

---

## 1. What you need

- **Node.js** 18 or newer
- **Java 17 or newer** (Kafka is written in Java and needs it to start)
- **Apache Kafka** downloaded from <https://kafka.apache.org/downloads> and extracted somewhere, e.g. `C:\kafka`

You do **not** need Docker, Zookeeper, or a database.

---

## 2. Run Kafka locally (KRaft mode, no Zookeeper)

Open a terminal **inside the extracted Kafka folder** (e.g. `C:\kafka` - keep the
path short, long folders break the Windows scripts).

### Windows (`.bat`)

```bat
:: 1. Generate a cluster ID (copy the value it prints)
bin\windows\kafka-storage.bat random-uuid

:: 2. Format the storage with that ID
bin\windows\kafka-storage.bat format -t <CLUSTER_ID> -c config\server.properties --standalone

:: 3. Start the broker - leave this terminal open
bin\windows\kafka-server-start.bat config\server.properties
```

### Mac / Linux (`.sh`)

```sh
# 1. Generate a cluster ID (copy the value it prints)
bin/kafka-storage.sh random-uuid

# 2. Format the storage with that ID
bin/kafka-storage.sh format -t <CLUSTER_ID> -c config/server.properties --standalone

# 3. Start the broker - leave this terminal open
bin/kafka-server-start.sh config/server.properties
```

> - On Kafka 3.x the config file is `config/kraft/server.properties`, and `--standalone` does not exist (3.x uses `controller.quorum.voters` instead, so just drop it).
> - Kafka prints some `Reconfiguration failed` / `wmic is not recognized` noise on Windows. It is harmless.

When you see `Kafka Server started`, the broker is listening on `localhost:9092`.

Now **open a second terminal** in the same Kafka folder and create the topic once:

```bat
:: Windows
bin\windows\kafka-topics.bat --create --topic orders --bootstrap-server localhost:9092
```

```sh
# Mac / Linux
bin/kafka-topics.sh --create --topic orders --bootstrap-server localhost:9092
```

If it says the topic **already exists**, that is fine - skip this step.

### Windows: common problems

- `'wmic' is not recognized` and the broker does not start: newer Windows versions
  removed `wmic`, and Kafka's starter script uses it. Set the memory yourself first:
  ```bat
  set KAFKA_HEAP_OPTS=-Xmx1G -Xms1G
  bin\windows\kafka-server-start.bat config\server.properties
  ```
- `The input line is too long`: Kafka is sitting in a very long folder path.
  Move it to something like `C:\kafka`.
- Kafka 4.x needs **Java 17+**. Check with `java -version`. If you have several JDKs,
  point `JAVA_HOME` at the new one (e.g. `set JAVA_HOME=C:\Program Files\Java\jdk-25`).

---

## 3. Set up this project

In this folder:

```sh
npm install
```

---

## 4. Run the services

Use three separate terminals, all in this folder:

| Terminal | Command |
| --- | --- |
| 1 | `npm run order` |
| 2 | `npm run inventory` |
| 3 | `npm run notification` |

You should see:

```
[Order] producer connected to Kafka
[Order] listening on http://localhost:3001
[Inventory] listening on http://localhost:3002
[Notification] consumer connected to Kafka
```

---

## 5. Demo

The commands below are `curl` (Git Bash, Mac, Linux). In **Windows PowerShell**
`curl` mangles the quotes inside the JSON, so use the `Invoke-RestMethod` line
under each step instead - it does the same thing.

### A. Place an order and watch the logs

```sh
curl -X POST http://localhost:3001/orders -H "Content-Type: application/json" -d '{"productId":"p1","quantity":2,"userEmail":"student@example.com"}'
```

```powershell
# PowerShell version of the same request
Invoke-RestMethod -Method Post -Uri http://localhost:3001/orders -ContentType "application/json" -Body '{"productId":"p1","quantity":2,"userEmail":"student@example.com"}'
```

The response comes back **instantly** with a 202 and an `orderId`. Then look at
the other two terminals: inventory and notification both received the same order.

### B. Check stock immediately, then again after 3 seconds

```sh
curl http://localhost:3002/stock/p1
```

```powershell
# PowerShell version
Invoke-RestMethod http://localhost:3002/stock/p1
```

Right after ordering you still see the old value (100). Wait 3 seconds and run it
again: it is now 98. That gap is eventual consistency.

### C. Stop inventory, keep selling, then restart

1. Press `Ctrl+C` in the inventory terminal (service is down).
2. Place three orders:

```sh
curl -X POST http://localhost:3001/orders -H "Content-Type: application/json" -d '{"productId":"p2","quantity":1,"userEmail":"a@example.com"}'
curl -X POST http://localhost:3001/orders -H "Content-Type: application/json" -d '{"productId":"p2","quantity":1,"userEmail":"b@example.com"}'
curl -X POST http://localhost:3001/orders -H "Content-Type: application/json" -d '{"productId":"p2","quantity":1,"userEmail":"c@example.com"}'
```

```powershell
# PowerShell version: the same three orders
Invoke-RestMethod -Method Post -Uri http://localhost:3001/orders -ContentType "application/json" -Body '{"productId":"p2","quantity":1,"userEmail":"a@example.com"}'
Invoke-RestMethod -Method Post -Uri http://localhost:3001/orders -ContentType "application/json" -Body '{"productId":"p2","quantity":1,"userEmail":"b@example.com"}'
Invoke-RestMethod -Method Post -Uri http://localhost:3001/orders -ContentType "application/json" -Body '{"productId":"p2","quantity":1,"userEmail":"c@example.com"}'
```

Orders still succeed, so nothing is lost. Notification keeps logging, inventory is silent.

3. Start inventory again with `npm run inventory`.

It catches up on all three missed orders and reduces `p2` from 50 to 47. Give it
about 10-15 seconds: it has to rejoin its consumer group, then it handles one
order per 3 seconds.

To start over, set `stock.json` back to `{"p1": 100, "p2": 50}`.

---

## 6. Concepts in simple words

**Producer** – The part of your app that *writes* messages into Kafka. Here, the order service.

**Consumer** – The part that *reads* messages out of Kafka. Here, inventory and notification.

**Topic** – A named, append-only log of messages. Here, everything goes into `orders`. Readers never remove messages; they just remember their position.

**Consumer group** – Consumers that share a name split the work between them. Different names get their own full copy, which is why `inventory-group` and `notification-group` both see every order.

**Eventual consistency** – The data is correct *eventually*, not instantly. The order is accepted right away, and stock updates a few seconds later.

**Why Kafka instead of calling the other service with REST?** – With REST, the order service has to wait for inventory, and it fails if inventory is offline. With Kafka, it just drops the event in the log and moves on. Kafka also keeps the event, so a crashed consumer can catch up later.

---

## 7. Files

| File | What it does |
| --- | --- |
| `kafka.js` | Shared Kafka client pointing at `localhost:9092` |
| `order-service.js` | Producer + `POST /orders` on port 3001 |
| `inventory-service.js` | Consumer + `GET /stock/:productId` on port 3002, uses `stock.json` |
| `notification-service.js` | Consumer that only logs the "email" it would send |
| `stock.json` | Fake stock table: `{"p1": 100, "p2": 50}` |
