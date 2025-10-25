# 🚀 BookInn Hub – Hotel Management & Booking App

## 📖 Overview

**BookInn Hub** is a **full-stack hotel management and booking platform** built to streamline hotel operations and provide a seamless experience for guests. The project delivers a **robust backend**, a **modern frontend**, and **scalable deployment** for both hotel managers and customers.

## 📚 Documentation

Comprehensive technical documentation is available in the [`docs/`](./docs/) directory:

- **[API Documentation](./docs/API_DOCUMENTATION.md)** - Complete REST API reference with endpoints, request/response formats, and examples
- **[Architecture Guide](./docs/ARCHITECTURE.md)** - System architecture, technology stack, and design patterns
- **[Development Setup](./docs/DEVELOPMENT_SETUP.md)** - Step-by-step guide for local development environment
- **[Deployment Guide](./docs/DEPLOYMENT.md)** - Production deployment instructions for all services
- **[Database Schema](./docs/DATABASE_SCHEMA.md)** - Database design, relationships, and query examples
- **[Security Documentation](./docs/SECURITY.md)** - Authentication, authorization, and security best practices
- **[Contributing Guidelines](./docs/CONTRIBUTING.md)** - How to contribute to the project
- **[Troubleshooting Guide](./docs/TROUBLESHOOTING.md)** - Common issues and solutions

---

## ⚙️ Deployment & Environment

* **Frontend:** Deployed on **Vercel**
* **Backend:** Hosted on **Render** (cold start may take up to \~1 min)
* **Database:** **NeonDB PostgreSQL**
* **Storage:** Images served from **AWS S3**

### 🔑 Environment Variables

```env
JWT_SECRET=

AWS_ACCESS_KEY=
AWS_SECRET_KEY=
BUCKET_NAME=

DB_URL=
DB_USER=
DB_PASSWORD=
```

---

## ✨ Features

### **For Customers:**

* Room browsing with real-time availability
* Easy booking & cancellation
* Secure payments *(upcoming)*
* Feedback & reviews

### **For Hotel Managers:**

* Admin dashboard for room & booking management
* Customer insights & analytics
* Automated notifications & updates

### **Role-Based Access:**

* **Admin & User roles** with restricted access control
* **Automatic database seeding** with sample data (users, rooms, bookings)
* Demo login credentials:

  * **Email:** `demouser@gmail.com`
  * **Password:** `password123`
  * **Admin Email:** `admin@bookinn.com`
  * **Admin Password:** `password123`
* You can test booking lookups using confirmation codes:

  * `MFST1FUDJZ`
  * `JR5K5NVT1G`
  * `OY3OJBOXR8`

### **Tech Highlights:**

* **Backend:** Spring Boot + REST API
* **Frontend:** React 
* **Database:** PostgreSQL
* **Deployment:** Fully deployed on **AWS**
* **Access Control:** Role-based (Admin/User)

---

## 📂 Project Structure

```
BookInn-Hub/
│── backend/   # Spring Boot Backend (Completed & Tested)
│── frontend/  # React Frontend (Completed & Deployed)
│── docs/      # Documentation & API References
│── README.md
```

---

## 🌐 Live Demo

🔗 **[Deployed App](your-deployment-link)**

---

## 🔐 Access & Roles

* **Roles:** Admin and User (role-based access enforced)
* **Demo Login**

  * **Email:** `demouser@gmail.com`
  * **Password:** `demouser`

### 🔎 Sample Booking Confirmation Codes

Use any of the following codes to look up bookings:

* `MFST1FUDJZ`
* `JR5K5NVT1G`
* `OY3OJBOXR8`

---

## 🛠️ Quick Start

### Prerequisites
- Java 21+
- PostgreSQL 12+
- Maven (included via wrapper)

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create `.env` file** (see [Development Setup](./docs/DEVELOPMENT_SETUP.md) for details)
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Run the backend**
   ```bash
   ./mvnw spring-boot:run
   ```

   Backend will start on `http://localhost:8080`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

   Frontend will start on `http://localhost:3000`

For detailed setup instructions, see the [Development Setup Guide](./docs/DEVELOPMENT_SETUP.md).

---

## 📬 Additional Resources

- **[API Reference](./docs/API_DOCUMENTATION.md)** - Explore all available endpoints
- **[Architecture Overview](./docs/ARCHITECTURE.md)** - Understand the system design
- **[Contribution Guide](./docs/CONTRIBUTING.md)** - Learn how to contribute
- **[Troubleshooting](./docs/TROUBLESHOOTING.md)** - Get help with common issues

⭐ **Star this repo** to follow the progress and updates.

---

*Thank you for your support!*
— **Skywalker ❤️**
