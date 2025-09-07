<div align="center">

# 📦 Online Retail Insights

### *End-to-end E-commerce Analytics Dashboard Powered by Flask & React*

[![Made with React](https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Powered by Flask](https://img.shields.io/badge/Backend-Flask-000000?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![Data Source](https://img.shields.io/badge/Data-UCI_Olist_ORII-2196F3?style=for-the-badge&logo=sqlite&logoColor=white)](https://archive.ics.uci.edu/ml/datasets/online+retail+ii)
[![Responsive Design](https://img.shields.io/badge/Design-Responsive-4ECDC4?style=for-the-badge)](/)
[![Live Demo](https://img.shields.io/badge/Demo-Live-success?style=for-the-badge)](https://your-dashboard-link.com)

📦 **A full-stack retail analytics dashboard for exploring e-commerce insights with Python Flask, React, and Olist/UCI data**

[🚀 Live Demo](https://online-retail-insights.vercel.app) • [📖 Documentation](#features) • [🤝 Contributing](#contributing) • [💻 GitHub](https://github.com/Ujwal-27K/online-retail-insights)

</div>

---

## ✨ About The Project

A modern, interactive analytics platform to visualize, track, and discover insights from real e-commerce data (Olist/UCI Online Retail II). Analyze orders, customers, geography, top products, and more, using an elegant React frontend and a Python Flask REST backend.

---

### 🎯 Why This Project?

- **📊 Data-Driven**: Real retail performance metrics from Olist/UCI datasets
- **⚡ Lightning Fast**: Vite-powered frontend, efficient Flask API
- **📱 Responsive**: Optimized for all screens
- **🔒 Secure & Configurable**: Environment-controlled secrets and ports
- **🚀 Deploy Anywhere**: Easy deployment to Render, Vercel, Railway, or your own server

---

## 🚀 Features

| ⚡ Dashboard KPI           | 📈 Trends & Analysis         | 🛍️ Products & Segments        | 🌎 Geography              |
|---------------------------|-----------------------------|-------------------------------|--------------------------|
| Revenue, Orders, Avg. Value | Daily/Weekly Sales Trends  | Top Products, Units Sold      | City-level Sales         |
| Repeat & New Customers      | Product Category Breakdown | Customer Segments             | Interactive Maps         |
| Recent Orders Feed          | ...more analytics          | ...custom reports             | ...                      |

---

## 🛠️ Built With

<div align="center">

### **Frontend Stack**
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

### **Backend Stack**
![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Pandas](https://img.shields.io/badge/Pandas-150458?style=for-the-badge&logo=pandas&logoColor=white)

### **Dev & Deploy**
![Render](https://img.shields.io/badge/Backend-Render-3E3E3E?style=for-the-badge&logo=render)
![Vercel](https://img.shields.io/badge/Frontend-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-333333?style=for-the-badge&logo=github&logoColor=white)

</div>

---

## 🏗️ Project Architecture

online-retail-insights/
├── backend/
│ ├── app.py
│ ├── data/ # Olist/UCI CSV files
│ ├── requirements.txt
│ └── .env
├── frontend/
│ ├── src/
│ ├── public/
│ ├── package.json
│ └── .env

---

## 🚦 API Endpoints

| Endpoint                     | Method | Description                    |
|------------------------------|--------|--------------------------------|
| `/api/dashboard/overview`    | GET    | Main KPIs (revenue, orders, etc.)  |
| `/api/sales/trends`          | GET    | Daily/weekly sales trends           |
| `/api/products/top`          | GET    | Top selling products                 |
| `/api/customers/segments`    | GET    | Customer segmentation                |
| `/api/sales/geographic`      | GET    | Sales by geography                    |
| `/api/orders/recent`         | GET    | List of recent orders                |
| `/api/analytics/categories`  | GET    | Category performance                  |
| `/health`                    | GET    | Health status check                    |

---

## 📋 Getting Started

### Backend

cd backend
python -m venv venv
venv\Scripts\activate # Windows
source venv/bin/activate # Mac/Linux
pip install -r requirements.txt
python app.py

- Place your CSV files in the `data/` folder.

### Frontend

cd frontend
npm install
npm start

- Access at `http://localhost:3000` (or Vite port).

---

## ⚙️ Environment Variables

**Backend `.env`:**

FLASK_DEBUG=True
PORT=5000
SECRET_KEY=your-secret-key

**Frontend `.env`:**

REACT_APP_API_URL=http://localhost:5000

---

## 🚀 Deployment

**Deploy Backend on Render:**
- Connect repo and set build command:

pip install --upgrade pip setuptools wheel && pip install -r requirements.txt

- Add CSVs to repo and .env variables as above.

**Deploy Frontend on Vercel or Render:**
- Build command: `npm install && npm run build`
- Publish directory: `build`
- Set API URL environment variable if backend is remote.

---

## 🤝 Contributing

We welcome feature ideas, bug reports, PRs, and documentation improvements!
- Fork the repo
- Create a branch (`git checkout -b feature/amazing-feature`)
- Commit (`git commit -m "feat: add amazing feature"`)
- Pull request!

---

## 🐛 Troubleshooting & FAQ

<details>
<summary><strong>Server/API Errors</strong></summary>
Check backend and frontend logs for error stack traces.  
Verify CSV files are present and named correctly in the `backend/data` folder.  
Test API endpoints with Postman or curl.
</details>

<details>
<summary><strong>Frontend Build Issues</strong></summary>
Delete `node_modules` and `package-lock.json`, then run `npm install` again.  
Clear Vite cache: `npm run dev -- --force`
</details>

<details>
<summary><strong>Deployment Issues</strong></summary>
Make sure to add all required environment variables in Render/Vercel dashboard.  
Confirm Python/node versions are compatible.  
For large datasets, check resource type in Render.
</details>

---

## 📄 License

MIT © 2025 Ujwal Khairnar

---

## 🙏 Acknowledgments & Credits

- [UCI Online Retail II Dataset](https://archive.ics.uci.edu/ml/datasets/online+retail+ii)
- Flask & React teams
- Render, Vercel, Railway platforms

---

<div align="center">
💎 **Project by Ujwal Khairnar** ([@Ujwal-27K on GitHub](https://github.com/Ujwal-27K))  
Passionate about building accessible, beautiful, performant data products!
</div>

---

<sub>🚀 Built with ❤️ using Flask, React, Pandas, and Modern Web Technologies</sub>  
<sub>📦 Designed for analytics, businesses, and data enthusiasts worldwide</sub>

---

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png" width="100%" />


