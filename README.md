# 🚀 Healthcare Proposal Management System

A production-ready, domain-driven insurance proposal engine built with **Node.js**, **TypeScript**, and **PostgreSQL**. This project demonstrates a decoupled architecture designed to handle complex healthcare pricing strategies and scalable member management.

---

## 🏗️ Architecture & Core Concepts

The project is built following **Clean Architecture** and **DDD (Domain-Driven Design)** principles to ensure the business logic is isolated from external frameworks and databases.

### Layered Structure

- **`src/domain`**: Contains the **Aggregate Roots** (`Proposal`, `Plan`), **Entities** (`Member`, `Coverage`), and **Repository Interfaces**. This layer has zero dependencies on external libraries.
- **`src/application`**: Implements **Use Cases** (e.g., `CreateProposal`, `GetProposal`) that orchestrate domain logic.
- **`src/infrastructure`**: Concrete implementations of external concerns, including **PostgreSQL Repositories**, **Database Pooling**, and **Environment Configurations**.
- **`src/presentation`**: **Express Controllers** and Routes that manage the HTTP interface.

---

## 🧩 Applied Design Patterns

- **Strategy Pattern**: Implemented in the `PricingStrategy` to handle different calculation rules for providers like **SulAmérica** and **Bradesco** without altering the core Use Case.
- **Factory Pattern**: The `PricingStrategyFactory` dynamically instantiates the correct strategy based on environment variables or provider metadata.
- **Repository Pattern**: Decouples the domain from the data source, allowing seamless switching between **In-Memory** (for unit testing) and **PostgreSQL** (for production).
- **Aggregate Root**: The `Proposal` entity manages the lifecycle and consistency of its internal `Members` and `Plan` references.

---

## 🛠️ Tech Stack

- **Runtime**: Node.js 20+
- **Language**: TypeScript
- **Database**: PostgreSQL 15
- **Containerization**: Docker & Docker Compose
- **Testing**: Jest (Unit & Integration)

---

## 🚀 Getting Started

### Prerequisites

- Docker & Docker Compose

### Setup & Execution

1.  Clone the repository.
2.  Configure your `.env` file:
    ```env
    PORT=3000
    DB_TYPE=postgres
    DATABASE_URL=postgres://user:password@db:5432/qualicorp_db
    PRICING_PROVIDER=sulamerica
    ```
3.  Spin up the environment:
    ```bash
    docker-compose up --build
    ```
    _Note: The `init.sql` script will automatically initialize the schema and seed initial health plans._

---

## 📡 API Endpoints

| Method | Endpoint         | Description                                                                    |
| :----- | :--------------- | :----------------------------------------------------------------------------- |
| `POST` | `/proposals`     | Validates data, calculates price based on strategy, and persists the proposal. |
| `GET`  | `/proposals/:id` | Returns a fully rehydrated Proposal with its Plan, Coverages, and Members.     |

---

## 🔮 Roadmap & Future Scalability

To evolve this system into a global-scale platform, the following architectural enhancements are proposed:

### 1. Payment Integration & Anti-Corruption Layer (ACL)

Integration with external gateways (e.g., **Stripe**). By using an **ACL**, we prevent external API changes from leaking into our Domain. A **Webhook** system would listen for payment success events to transition proposals from `PAID` to `ACTIVE`.

### 2. Event-Driven Microservices

Migrate to a distributed architecture using **Apache Kafka** or **RabbitMQ**.

- **Proposal Service** emits `ProposalCreated`.
- **Payment Service** consumes it and processes the charge.
- **Notification Service** alerts the user via Email/SMS.

### 3. Dynamic Pricing Engine (NoSQL)

Move complex, frequently changing pricing matrices to a **NoSQL (MongoDB/DynamoDB)** store. This allows healthcare providers to update rules in real-time without code deployments.

### 4. Graph-Based Fraud Detection (Neo4j)

Implement **Neo4j** to analyze relationships between beneficiaries and providers, enabling real-time **fraud detection** and **intelligent plan recommendations** based on network behavior.

---

### Author

**Jonatas Reis** _Software & DevOps Engineer_ _CKA | AWS Certified Developer | AWS Solutions Architect | Neo4j Professional_
