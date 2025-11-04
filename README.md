# 🧾 Insurance Agency ERP Dashboard

An internal-use **ERP web application** built for an **insurance broker company** to manage customers, policies, commissions, and payment tracking — complete with in-dashboard analytics and reporting.

---

## 🚀 Overview

This system enables insurance agency staff to efficiently **input, manage, and analyze** customer and policy data in one place.  
It replaces Excel-based workflows with a secure, scalable web dashboard powered by **Supabase** and **React**.

---

## 🏗️ Tech Stack

| Layer | Technology | Purpose |
|-------|-------------|----------|
| **Frontend** | React (Next.js) + TypeScript + Tailwind + Shadcn UI | Responsive UI, form validation, and charts |
| **Validation** | Zod + React Hook Form | Strong client-side schema validation |
| **Backend** | Supabase (PostgreSQL + Auth + Storage) | Authentication, database, and row-level security |
| **Analytics** | Recharts + SQL Views | Built-in dashboard analytics (no Power BI) |
| **Automation (future)** | n8n | Workflow and reporting automation (optional) |

---

## 📊 Key Features

### 🔹 Core Modules
- **Customer & Policy Management** – unified input form to create customers and their policies.  
- **Commission Tracking** – record payments, mark as paid/unpaid, and generate reports.  
- **Due Date Dashboard** – visualize upcoming or overdue policy payments.  
- **Search & Filter** – find policies or clients by name, company, or date range.

### 🔹 Reporting
- **Dynamic PDF Report Generator** – export formatted reports directly from dashboard.  
- **SQL View–Driven Analytics** – e.g., `sales_summary_view`, `commission_summary_view`.  
- **Charts** – monthly sales, outstanding policies, commission by agent, etc.

### 🔹 Security
- **Supabase Auth (Email/Password)**  
- **Row-Level Security (RLS)** with role-based access control (planned).  
- **Audit Logging** (future extension).

---

## 🧠 Architecture Summary
Frontend (Next.js)
├── Authentication (Supabase Auth)
├── Data Fetching (Supabase JS Client)
├── Validation (Zod + RHF)
├── UI (Tailwind + Shadcn + TanStack Table)
└── Analytics (Recharts + SQL Views)

Backend (Supabase)
├── PostgreSQL Database
├── RPC Functions (Business Logic)
├── SQL Views (Reporting Layer)
└── Row-Level Security Policies

---

## 🧩 Example Workflow

1. **Staff logs in** using Supabase Auth.  
2. **Create customer + policy** via unified input form.  
3. **Track commission payments** with dynamic table and modal updates.  
4. **Generate PDF report** via Supabase RPC + HTML export.  
5. **Filter data** by time range, company, or status for analytics.

---

## 🧱 Database Schema Highlights

- `customer`  
- `policy`  
- `insurance_company`  
- `detail_premi`  
- `detail_komisi`  
- `pembayaran_komisi`  
- SQL views: `sales_summary_view`, `commission_report_view`

---

## 🧾 Reporting Workflow

1. RPC function aggregates data into an array of objects.  
2. The array is rendered as an HTML table preview.  
3. User can export it to PDF.  
4. Filters available (date range, policy type, agent, etc.).

---

## 🧭 Roadmap

- [ ] Partial payment support  
- [ ] RBAC (Role-Based Access Control)  
- [ ] Audit logs  
- [ ] Automation with n8n  
- [ ] Embedded analytics sharing  

---

## 🧑‍💼 Intended Users

Internal staff of the insurance agency — including sales agents, accounting, and management — to simplify daily operations and reporting.

---

## 📄 License

Private/internal project. Not open for public redistribution.
