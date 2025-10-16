#!/bin/bash

# ----------------------------------------
# Deployment script for Next.js + PM2
# App Name: quantumhr
# Port: 3002
# ----------------------------------------

APP_NAME="quantumhr"
PORT=3002

echo "========================================="
echo "🚀 Deploying $APP_NAME on port $PORT..."
echo "========================================="

# Step 1: Pull latest code
echo "🔄 Pulling latest changes from git..."
git stash
git pull origin main || { echo "❌ Git pull failed!"; exit 1; }

# Step 2: Install dependencies
echo "📦 Installing dependencies..."
npm install || { echo "❌ npm install failed!"; exit 1; }

# Step 3: Build the Next.js app
echo "🏗️ Building Next.js app..."
npm run build || { echo "❌ Build failed!"; exit 1; }

# Step 4: Start or restart app with PM2
echo "🚦 Starting $APP_NAME with PM2..."
pm2 delete "$APP_NAME" >/dev/null 2>&1
pm2 start npm --name "$APP_NAME" -- run start -- -p $PORT || { echo "❌ PM2 start failed!"; exit 1; }

# Step 5: Save PM2 process list for auto-start on reboot
pm2 save

# Step 6: Show PM2 process list
pm2 list

echo "✅ Deployment completed successfully!"
echo "🌐 App running at: http://your-server-ip:$PORT"

