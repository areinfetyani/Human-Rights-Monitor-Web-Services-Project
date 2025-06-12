# 📊 Human Rights Monitor - MIS System

A full-stack **Human Rights Monitoring Management Information System (MIS)** designed to track human rights violations, manage victim and witness records, generate incident reports, and provide data visualization and analysis.

## 👥 Team Members

* **Ehab Ellati** — 1211567
* **Rami Tawafsha** — 1212400
* **Areen Fetyani** — 1212673

---

## 🚀 Project Overview

This system is developed as part of the COMP4382 Final Project to manage cases of human rights violations and streamline reporting and data analysis. It provides role-based access control for different user types including **Admin**, **Employee**, and **Reporter**.

---

## 🛠️ Technologies Used

### 🔧 Backend

* **FastAPI** – For building high-performance RESTful APIs.
* **Pydantic** – For data validation and schema modeling.
* **MongoDB** – NoSQL database for storing case, victim, report, and analysis data.
* **Motor** – Async MongoDB driver for FastAPI.
* **JWT (JSON Web Token)** – For secure authentication and role-based authorization.
* **bcrypt** – For password hashing.
* **Uvicorn** – ASGI server to run FastAPI apps.
* **Python** – Main backend programming language.

### 🖼️ Frontend

* **React.js** – For building the interactive and modular user interface.
* **Axios** – For making HTTP requests to the FastAPI backend.
* **React Router** – For frontend routing and navigation.
* **CSS3** – For styling all UI components with responsive design.
* **Base64 File Handling** – For uploading and displaying evidence files securely.

### 📦 Dev Tools & Deployment

* **VS Code** – Code editing.
* **Postman** – API testing.
* **MongoDB Compass** – GUI for MongoDB.
* **Git & GitHub** – Version control and team collaboration.

---

## 📂 Project Structure

### 🧠 Modules Implemented

1. **Case Management**

   * Add, view, update, delete (archive), and filter cases.
   * Track case status history in a separate collection.
2. **Incident Reporting**

   * Submit, update, and view detailed incident reports.
3. **Victim/Witness Management**

   * Add, search, and update risk level for victims.
   * Assign victims to cases.
4. **Data Analysis & Visualization**

   * Real-time analytics on violations, regions, priorities, and timelines.
5. **Authentication & Authorization**

   * Login and role-based navigation.
   * JWT tokens stored in localStorage.

---

## 👤 User Roles & Access

| Role                   | Access                                                     |
| ---------------------- | ---------------------------------------------------------- |
| **Admin**              | Full access to all modules including reports and analytics |
| **Employee**           | Access to Case Management and Victim modules only          |
| **Reporter**           | Can submit reports only and view analytics                 |

---

## 📸 Key Features

* 📁 **Case CRUD Operations**
* 🧾 **Incident Reports with Evidence Upload**
* 🧍 **Victim Database with Risk Assessment**
* 📊 **Interactive Charts and Analytics**
* 🔐 **JWT Authentication**
* 🧠 **Role-based Navigation and Authorization**
* 🧼 **Real-time Form Validation**
* 🌍 **Country/Region Auto-fill using API**
* 🧾 **Archive Functionality for Deleted Records**
* 🕓 **Date Filters and Time-Based Queries**

---

## 🧪 How to Run

1. **Backend (FastAPI)**

   ```bash
   cd backend
   uvicorn app.main:app --reload
   ```

2. **Frontend (React)**

   ```bash
   cd frontend
   npm install
   npm start
   ```

3. **MongoDB**

   * Start local MongoDB service.

---

