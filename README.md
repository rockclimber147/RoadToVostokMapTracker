# 🗺️ Road to Vostok Map Tracker

A lightweight, high-performance tactical dashboard for planning runs, tracking loot, and drawing routes in the hardcore survival game **Road to Vostok**. 

Built with React and Leaflet, this tool features a "Zero-Database" architecture—all map data is stored securely in your browser's local storage or shared via highly compressed Base64 clipboard strings.

🔗 **[Live Demo](https://rockclimber147.github.io/RoadToVostokMapTracker/)**

---

## ✨ Features

* **Interactive Tactical Mapping:** High-resolution rendering of Vostok's zones using fractional zooming and custom coordinate reference systems (CRS.Simple).
* **Route Planning & Layer Management:** Draw multi-node tactical paths. Drag waypoints to adjust routes, and use the Sidebar to rename, recolor, or toggle the visibility of individual routes to declutter your screen.
* **Smart Spatial Clustering:** Maps gracefully handle hundreds of pins without lagging. Close-proximity pins automatically group into tactical clusters that dynamically update based on your active color filters.
* **Global Visibility Filters:** Use the tri-state filter system to show full details, show pins only, or completely hide specific color categories.
* **Permadeath Zone Tracking:** Map selector actively highlights high-risk permadeath zones (like Vostok and the Border Zone) in tactical red.
* **Squad Data Sharing:** Share your tactical plans instantly. The app packages your pins and routes, applies structural JSON pruning for maximum compression, and generates a URL-safe Base64 string. Squadmates can paste this string to perfectly merge your data with theirs.

## 🛠️ Tech Stack

* **Frontend:** React 18, TypeScript
* **Build Tool:** Vite
* **Mapping Engine:** Leaflet & React-Leaflet
* **Styling:** Tailwind CSS
* **Deployment:** GitHub Pages (`gh-pages`)

---

## 🚀 Local Development

To run this project locally on your machine:

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/](https://github.com/)rockclimber147/RoadToVostokMapTracker.git
   cd RoadToVostokMapTracker
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173`.

---

## 📦 Deployment

This project uses a dual-pipeline deployment setup to safely host on GitHub pages via a subdirectory without breaking local routing.

To deploy the latest changes to the live site, simply run:
```bash
npm run deploy
```
*This command compiles the React app with the correct Vite base URL and pushes the optimized `dist` folder to the `gh-pages` branch.*

---

## 📝 Usage Guide

* **Drop Pins:** Right-click anywhere on the map to open the tactical menu and select a color.
* **Edit Pins:** Click an existing pin to add detailed notes or change its label.
* **Draw Routes:** Click `Start Route Tracking` in the sidebar. Left-click on the map to drop route waypoints. Right-click a waypoint to delete it. Drag waypoints to adjust the path.
* **Export Data:** Click `Copy to Clipboard` to generate a compressed string of your active map.
* **Import Data:** Click `Overwrite` to replace your local cache with clipboard data, or `Append` to merge a squadmate's pins/routes without losing your own.

---

*Disclaimer: This is a fan-made tool and is not officially affiliated with Road to Vostok.*