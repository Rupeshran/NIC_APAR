# NIC APAR - Annual Performance Appraisal Report System

A full-stack web application for managing Annual Performance Appraisal Reports (APAR) for Government of India employees. Built with **React (Vite)** frontend and **Spring Boot** backend.

## 🏛️ Features

- **Admin Dashboard** — Manage employees, send reminders, review APARs, forward to Reporting Officers
- **Employee Dashboard** — View APAR status, fill & submit ACR, receive notifications
- **Role-Based Access** — Secure login with Admin/Employee role-based routing
- **APAR Review Panel** — Admin can review, rate, and comment on employee submissions
- **Reminder System** — Admin can send APAR submission reminders to pending employees
- **Real-Time Status Tracking** — Live APAR progress timeline for employees

## 📁 Project Structure

```
NIC_APAR/
├── frontend/          # React + Vite frontend
│   ├── src/
│   │   ├── pages/          # Login, AdminDashboard, EmployeeDashboard, MyACR
│   │   ├── components/     # Reusable components (GovHeader, APARReviewPanel, etc.)
│   │   └── styles/         # CSS stylesheets
│   ├── package.json
│   └── vite.config.js
│
├── backend/           # Spring Boot backend
│   ├── src/main/java/com/example/springboot_getapi/
│   │   ├── EmployeeDetailsController.java
│   │   ├── LoginController.java
│   │   ├── EmployeeAcrDetailsController.java
│   │   └── ...
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
│
├── .gitignore
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18+) and **npm**
- **Java** (JDK 17+)
- **Maven**
- **MySQL** or compatible database

### Backend Setup

```bash
cd backend
./mvnw spring-boot:run
```

The backend runs on `http://localhost:8083`.

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173`.

### Default Admin Credentials

| Username | Password   | Role  |
|----------|------------|-------|
| admin    | admin123   | ADMIN |

## 🛠️ Tech Stack

| Layer    | Technology              |
|----------|------------------------|
| Frontend | React 19, Vite, React Router |
| Backend  | Spring Boot, Spring Data JPA |
| Database | MySQL                   |
| Styling  | Vanilla CSS  |

## 📋 API Endpoints

| Method | Endpoint                        | Description                    |
|--------|---------------------------------|--------------------------------|
| POST   | `/login`                        | User authentication            |
| GET    | `/employees`                    | List all employees             |
| POST   | `/employees`                    | Add new employee               |
| DELETE | `/employees/{id}`               | Delete employee                |
| POST   | `/acr/submit`                   | Submit ACR                     |
| GET    | `/acr/submitted`                | Get submitted ACRs             |
| POST   | `/acr/review`                   | Submit review for an ACR       |
| GET    | `/acr-status/{id}`              | Get ACR status for employee    |
| POST   | `/acr-status/sendToRO`          | Forward APARs to Reporting Officer |
| POST   | `/reminders/send`               | Send reminders to employees    |
| GET    | `/reminders/employee/{id}`      | Get reminders for an employee  |

## 📄 License

This project is developed for the **National Informatics Centre (NIC)**, Government of India.
