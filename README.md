
# 🧠 QuantumHR

**QuantumHR** is a modern, high-performance HR management platform built with **Next.js**, offering a scalable and efficient solution for workforce management.  
This repository contains the full frontend application setup, including build, deployment, and process management using **PM2**.

---

## 🚀 Features

- ⚡ **Next.js 14+** for blazing-fast performance  
- 🧩 **Modular architecture** for easy maintenance  
- 🌐 **Server-side rendering (SSR)** and **API routes** support  
- 🐳 **PM2** process management for production stability  
- 🔒 **Environment-based configuration** for flexible deployment  
- 🧰 Built-in support for **multiple environments** (development, staging, production)

---

## 📦 Repository

GitHub Repo: [git@github.com:charlicoder/quantumhr.git](git@github.com:charlicoder/quantumhr.git)

---

## 🧑‍💻 Prerequisites

Before setting up the app, ensure you have the following installed:

- **Node.js** (v18+ recommended)  
- **npm** or **yarn**  
- **PM2** globally installed  
- **Git**

To install PM2 globally:
```bash
npm install -g pm2
````

---

## 🛠️ Setup Instructions

### 1. Clone the repository

```bash
git clone git@github.com:charlicoder/quantumhr.git
cd quantumhr
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory and add your environment variables, for example:

```bash
NEXT_PUBLIC_API_URL=https://api.example.com
NEXTAUTH_SECRET=your_secret_key
```

---

## 🧱 Build and Run Locally

### Development mode

```bash
npm run dev
```

Visit: [http://localhost:3000](http://localhost:3000)

### Production build

```bash
npm run build
npm run start
```

By default, it runs on [http://localhost:3000](http://localhost:3000)

---

## ⚙️ Deployment (Using PM2)

This project includes a deployment script for smooth production setup.

### 1. Make the script executable

```bash
chmod +x deploy.sh
```

### 2. Run the deployment script

```bash
./deploy.sh
```

This script performs the following actions:

* Pulls the latest code from the `main` branch
* Installs dependencies
* Builds the project
* Starts the app using **PM2** on port `3002`
* Saves PM2 configuration for startup on system reboot

You can verify the process with:

```bash
pm2 list
```

To view logs:

```bash
pm2 logs quantumhr
```

To restart or stop the app:

```bash
pm2 restart quantumhr
pm2 stop quantumhr
pm2 delete quantumhr
```

---

## 🌐 Nginx Configuration (Optional)

If serving via Nginx, add a reverse proxy configuration:

```nginx
server {
    listen 80;
    server_name quantumhr.example.com;

    location / {
        proxy_pass http://127.0.0.1:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Then reload Nginx:

```bash
sudo systemctl reload nginx
```

---

## 🧩 Directory Structure

```
quantumhr/
├── components/       # Reusable UI components
├── pages/            # Next.js pages and API routes
├── public/           # Static files
├── styles/           # Global and modular CSS
├── deploy.sh         # Deployment script
├── package.json
└── README.md
```

---

## 🧠 Maintainer

**Khondoker Md. Mamunur Rashid**
Senior Full Stack Developer | AI & Blockchain Enthusiast
🌐 [https://charlicoder.com](https://charlicoder.com)
📧 [mamunur.rashid@charlicoder.com](mailto:mamunur.rashid@charlicoder.com)

---

## 📄 License

This project is licensed under the **MIT License** — you’re free to use, modify, and distribute it with attribution.

---
