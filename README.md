# RateMyStore

A full-stack store rating web application where users can view stores and submit ratings from **1 to 5**.

## Tech Stack

* **Frontend:** React.js
* **Backend:** Node.js, Express.js
* **Database:** PostgreSQL
* **Authentication:** JWT
* **Authorization:** Role-based access control

## Features

* User registration and login
* JWT authentication
* Role-based dashboards
* Admin management of users and stores
* Store owner store management
* Users can rate stores from 1–5
* Search stores
* View ratings and statistics

## Roles

* **ADMIN** – Manage users, stores and ratings
* **USER** – View stores and submit ratings
* **STORE_OWNER** – Manage their stores and view ratings

## Run Locally

### Backend

```bash
cd backend
npm install
npm start
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Make sure PostgreSQL is running and configure your database credentials in `.env`.

## Author

Sahityika
