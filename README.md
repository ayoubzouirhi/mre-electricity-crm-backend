# 🌌 OmniCRM Backend | Multi-Tenant SaaS Engine

> A highly scalable, code-first GraphQL backend built for Omnichannel CRM systems. Designed with strict data isolation, dynamic workflows, and advanced RBAC at its core.

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![GraphQL](https://img.shields.io/badge/GraphQL-E10098?style=for-the-badge&logo=graphql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Architecture & Advanced Features](#-architecture--advanced-features)
- [Local Setup & Running the App](#-local-setup--running-the-app)
- [Exploring the GraphQL API](#-exploring-the-graphql-api-apollo-sandbox)
- [Ready-to-use Queries & Mutations](#-ready-to-use-queries--mutations)
- [Roadmap](#-roadmap--work-in-progress)

---

## 🎯 Project Overview

OmniCRM is not just a CRUD application — it is a **backend engine** designed to handle complex business logic for Sales and CRM platforms. It empowers organizations to enforce strict sales pipelines, ensuring that Agents cannot advance a Lead's status without completing dynamically assigned mandatory checklists.

---

> **Note on Development History:** The core foundational architecture (Auth, RBAC, Multi-tenancy) was prototyped and tested in a separate local environment before being consolidated into this repository. Subsequent feature developments (e.g., the Leads module) follow standard iterative commit history.

---

## 🏗 Architecture & Advanced Features

This project demonstrates production-ready architectural patterns across four key pillars:

### 🏢 Header-Based Multi-Tenancy (Environments)

The system is SaaS-ready. Tenant isolation is handled via `Environment` entities. The GraphQL API remains stateless and extracts the `x-environment-id` directly from the HTTP headers using custom decorators, ensuring **strict data boundaries** between different organizations/workspaces without bloating GraphQL payloads.

### 🚦 Dynamic Workflows & Mandatory Transition Gates

Instead of simple status enums, Leads move through `WorkflowSteps`.

**Engineering Highlight:** A State-Machine-like validation is built into the Service layer. If a transition to a new Step requires specific `ChecklistItems` to be validated, the API actively **rejects the transition** until the `LeadChecklistResponses` are confirmed — guaranteeing data integrity and adherence to enterprise sales processes.

### 🔐 Advanced RBAC (Role-Based Access Control)

Implemented custom NestJS Guards (`@Roles()`) and Context Decorators. The system supports a **hierarchical role structure**:

| Role | Access Level |
|------|-------------|
| `SUPER_ADMIN` | Global platform access |
| `ADMIN` | Full environmental visibility |
| `RESPONSABLE` | Scoped team access |
| `AGENT` | Own & unassigned leads only |

### 🔄 Code-First GraphQL & Exception Handling

Fully typed end-to-end. TypeScript classes auto-generate the GraphQL schema. A **Global Prisma Exception Filter** catches and formats database constraint violations (e.g. Unique Constraint errors) into clean, consumable GraphQL errors.

---

## 🛠 Local Setup & Running the App

### Prerequisites

- Node.js & npm
- Docker & Docker Compose

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd omnicrm-backend
npm install
```

### 2. Setup Database (Docker)

The `docker-compose.yml` is pre-configured. Just run:

```bash
npm run db:dev:up
```

### 3. Run Prisma Migrations & Generate Client

```bash
npx prisma migrate dev
npx prisma generate
```

### 4. Start the Application

```bash
npm run start:dev
```

---

## 🎮 Exploring the GraphQL API (Apollo Sandbox)

Once the app is running, navigate to:

**👉 http://localhost:3000/graphql**

### ⚠️ Headers Configuration

To successfully interact with the API, configure the following headers in the Apollo Sandbox:

| Header | Description | Required |
|--------|-------------|----------|
| `x-environment-id` | Tenant isolation — required for most operations | ✅ Always (except Super Admin global actions) |
| `Authorization` | JWT bearer token — required after login | ✅ After login |

```json
{
  "x-environment-id": "1",
  "Authorization": "Bearer YOUR_JWT_TOKEN_HERE"
}
```

---

## 🧪 Ready-to-use Queries & Mutations

### 1. Create a Super Admin & Login
> ℹ️ No headers required for this step.

```graphql
mutation Auth {
  signup(signupInput: {
    email: "admin@omnicrm.com",
    password: "securePassword123"
  }) {
    accessToken
    user {
      id
      role
    }
  }
}
```

### 2. Fetch Leads with Workflow Checklists
> ℹ️ Requires both `Authorization` and `x-environment-id` headers. Create an Environment and some leads first.

```graphql
query GetLeadsOverview {
  leads {
    id
    firstName
    lastName
    phone
    source
    step {
      name
      isFinal
    }
    leadChecklistResponses {
      isChecked
      checklistItemId
    }
    histories {
      action
      createdAt
    }
  }
}
```

---

## 🚀 Roadmap / Work in Progress

- [ ] **Event-Driven Architecture** — Emit events on Lead step changes to trigger Webhooks and notifications
- [ ] **Redis Caching** — Cache Workflow Steps and Environment configs to reduce DB load on high-frequency queries
- [ ] **Unit & E2E Testing** — Expand Jest coverage, with a focus on Workflow transition validation logic
