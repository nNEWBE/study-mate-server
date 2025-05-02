# 🛠️ Study Mate - Backend

This is the backend API for the **Study Mate** platform. It provides a RESTful service for handling authentication, content management, and user operations using **Node.js**, **Express**, and **MongoDB**.

---

## 🧰 Tech Stack

- **Node.js** – JavaScript runtime
- **Express.js** – Web framework for building RESTful APIs
- **MongoDB** – NoSQL database for storing user and content data
- **Mongoose** – ODM for MongoDB
- **dotenv** – Manage environment variables
- **CORS** – Enable cross-origin requests
- **JWT** – Secure authentication

---

## 📁 Project Structure

```
study-mate-backend/
│
├── index.js            # Server entry point
├── .env                # Environment variables
├── server.js           # Entry point
└── package.json
```

---

## 📦 Setup Instructions

1. **Clone the repository:**

   ```bash
   git clone https://github.com/nNEWBE/study-mate-server
   cd study-mate-backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Create `.env` file and configure:**

   ```env
   PORT=5000
   MONGODB_URI=your-mongodb-connection-uri
   JWT_SECRET=your_jwt_secret
   ```

4. **Run the server:**

   ```bash
   npm start
   ```

   Server will be running at `http://localhost:5000`.

---

## 🔐 API Features

- **User Authentication**

  - Register / Login / JWT

- **Protected Routes**

  - Middleware for route guarding

- **CRUD Operations**

  - For content (lessons/courses/etc.)

---

## 🧪 Testing the API

Use [Postman](https://www.postman.com/) or [Thunder Client](https://www.thunderclient.io/) with the token received after login for accessing protected routes.

---

## 🤝 Contributions

Feel free to fork and create a pull request with improvements or bug fixes. Don’t forget to include relevant documentation for any new features.

---

## 🧑‍💻 Author

🔗[![Linkedin Badge](https://img.shields.io/badge/-LinkedIn-blue?style=flat-square&logo=linkedin&logoColor=white&link=https://www.linkedin.com/in/shuvochandra/)](https://www.linkedin.com/in/shuvochandra/)
[![Gmail Badge](https://img.shields.io/badge/-Gmail-d14836?style=flat-square&logo=gmail&logoColor=white&link=mailto:shuvochandra999@gmail.com)](mailto:shuvochandra999@gmail.com)
[![Facebook Badge](https://img.shields.io/badge/-Facebook-blue?style=flat-square&logo=facebook&logoColor=white&link=https://www.facebook.com/shuvochandra999)](https://www.facebook.com/shuvo.chandra.3745)
