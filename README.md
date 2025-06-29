
# Inventory Management System

A full-stack Inventory Management System built with **React**, **Flask**, and **PostgreSQL**, designed to help users manage products, suppliers, and categories efficiently. The app includes user authentication and dynamic data visualization using **Recharts**, styled with **Bootstrap** and **Material UI**, and deployed on **Render**.

---

## Live Demo

🔗 [(Render)](https://inventory-admin-1.onrender.com/dashboard/users)  


---

## 📦 Tech Stack

**Frontend:**
- React (Create React App)
- React Router DOM
- Bootstrap
- Material UI
- Recharts

**Backend:**
- Flask
- Flask-RESTful
- Flask SQLAlchemy
- PostgreSQL

**Deployment:**
- Render (Frontend, Backend & Postgres)

---

## Features

- User authentication (Register, Login, Logout)
- Product CRUD operations
- Category & Supplier management
- Recharts for data visualization
- React/Flask proxy for smooth API integration
- Deployed full-stack on Render

---

## Getting Started

### Prerequisites
- Python 3.8>
- Node.js & npm
- PostgreSQL
- pipenv (or virtualenv)

---

### Clone the repository

```bash
git clone https://github.com/BoruIsakoJ/inventory-admin.git
cd inventory-system
```

---

### Backend Setup

```bash
cd server
pipenv install
pipenv shell
createdb inventory_db
flask db init
flask db migrate -m "Initial migration"
flask db upgrade
python seed.py
flask run
```

Make sure to set up a `.env` file or configure your `config.py` with the appropriate PostgreSQL URI.

---

### Frontend Setup

```bash
cd client
npm install
npm start
```

Make sure `proxy` is correctly set in `client/package.json`:

```json
"proxy": "http://localhost:5000"
```

---

## Environment Variables

Create a `.env` file in the backend and include:

```
FLASK_APP=app.py
FLASK_DATABASE_URI=postgresql://username:password@localhost/inventory_db
FLASK_SECRET_KEY=your-secret-key
FLASK_DEBUG=True
FLASK_RUN_PORT=5000
FLASK_SQLALCHEMY_TRACK_MODIFICATIONS=False 
```

---

## Future Improvements

- Auto-update inventory when a product is sold
- Track sales and calculate profit
- Generate sales reports in PDF/CSV
- Improve mobile responsiveness

