const { Kafka } = require('kafkajs');

// Shared Kafka client. Creating it does not connect - each service connects itself.
const kafka = new Kafka({ clientId: 'kafka-demo', brokers: ['localhost:9092'] });

module.exports = kafka;
