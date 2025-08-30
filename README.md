# 🚀 BookInn Hub – Hotel Management & Booking App

## 📖 Overview

**BookInn Hub** is a **full-stack hotel management and booking platform** built to streamline hotel operations and provide a seamless experience for guests. The project delivers a **robust backend**, a **modern frontend**, and **scalable deployment** for both hotel managers and customers.

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
* Demo login credentials:

  * **Email:** `demouser@gmail.com`
  * **Password:** `demouser`
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

## 🛠️ Local Setup

1. **Clone the repo**

   ```bash
   git clone https://github.com/Skywalker690/BookInn-Hub.git
   cd BookInn-Hub
   ```

2. **Backend Setup (Spring Boot)**

   * Navigate to `backend/`
   * Configure the environment variables in `application.properties` or as system envs (see variables above)
   * Run the Spring Boot app

   ```bash
   ./mvnw spring-boot:run
   ```

3. **Frontend Setup (React)**

   * Navigate to `frontend/`
   * Install dependencies

   ```bash
   npm install
   ```

   * Start the development server

   ```bash
   npm start
   ```

---

## 📬 Stay Connected

⭐ **Star this repo** to follow the progress and updates.

---

*Thank you for your support!*
— **Skywalker ❤️**
