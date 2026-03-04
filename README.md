# Flashpoint

Flashpoint is a full-stack tactical intelligence dashboard.

## Project Structure

This repository is split into two independent parts:
*   `server/` - The backend Node.js API that handles real-time WebSockets, background SQLite data aggregation, and routing.
*   `client/` - The frontend Vite + React dashboard interface.

---

## 🚀 Deployment Guide

To host this application for free on the public internet, you must host the Backend API and the Frontend Interface on two separate services because they require different runtime environments.

### Part 1: Host the Backend Server (Render.com)

Render allows you to host long-running Node.js backend processes for free.

1.  Create an account at [Render](https://render.com/).
2.  Click **New +** and select **Web Service**.
3.  Connect your GitHub account and select the `Flashpoint` repository.
4.  Configure the settings exactly as follows:
    *   **Root Directory:** `server`
    *   **Environment:** `Node`
    *   **Build Command:** `npm install`
    *   **Start Command:** `node index.js`
5.  Click **Deploy**. 
6.  Once deployed, Render will provide a live URL (e.g., `https://flashpoint-a7q8.onrender.com`).
    *   *Note: Because this is an API, visiting the root URL may show "Not Found". To verify the server is running, navigate to `YOUR_RENDER_URL/api/health`.*

### Part 2: Connect the Frontend to the New Backend

Before hosting the frontend, it needs to know where the new live backend is. 

1. Edit your `client/src/App.jsx` file.
2. Search for any endpoints pointing to `http://localhost:3001` or `ws://localhost:3001`.
3. Change all occurrences to point to your new Render URL (e.g., `https://flashpoint-a7q8.onrender.com` or `wss://...` for websockets).
4. Commit and push these changes to GitHub.

### Part 3: Host the Frontend Client (Vercel.com)

Vercel is an optimized static hosting provider perfect for Vite/React applications.

1.  Create an account at [Vercel](https://vercel.com).
2.  Click **Add New...** -> **Project**.
3.  Connect your GitHub account and import the `Flashpoint` repository.
4.  In the Configuration screen:
    *   **Framework Preset:** Vercel should automatically detect `Vite`.
    *   **Root Directory:** Click "Edit" and type in `client`.
5.  Click **Deploy**.
6.  Vercel will build the frontend and provide you with a live, shareable URL for your dashboard!
