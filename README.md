# Email Automation Platform

An event-driven backend system designed to ingest incoming emails, persist them safely,
and queue them for asynchronous processing using a scalable architecture.

---

## Problem Statement

Handling emails synchronously does not scale as volume increases.  
Manual processing leads to delays, duplicate handling, and system bottlenecks.

This project solves the problem by:

- Ingesting emails through a webhook-based API
- Ensuring idempotent storage to avoid duplicates
- Offloading processing using a message queue
- Laying the foundation for ML-based classification and automation

---

## System Architecture

Email Provider  
→ Webhook API (Node.js)  
→ MongoDB (Persistent Storage)  
→ Redis + BullMQ (Async Queue)  
→ Background Worker (to be added)

The ingestion layer is intentionally lightweight and decoupled from processing
to ensure scalability and fault tolerance.

---

## Tech Stack

- **Backend:** Node.js, Express
- **Database:** MongoDB Atlas
- **Queue:** Redis, BullMQ
- **Containerization:** Docker (Redis)
- **Config Management:** dotenv
- **Version Control:** Git, GitHub

---

## Project Structure

```text
backend/
├── src/
│   ├── app.js              # Express app setup
│   ├── server.js           # Server & DB bootstrap
│   ├── routes.js           # Central route registration
│   ├── config/
│   │   ├── redis.js        # Redis connection
│   ├── modules/
│   │   ├── ingestion/
│   │   │   ├── ingestion.controller.js
│   │   │   └── ingestion.routes.js
│   │   ├── emails/
│   │   │   └── email.model.js
│   │   └── queue/
│   │       └── email.queue.js
├── .env                    # Environment variables (ignored)
├── package.json
└── README.md
```
