## 📖 Documentation

### Overview

FloodGuardian is a mobile-first application designed to predict, prepare for, and respond to floods in vulnerable areas. By combining real-time satellite data and community-driven alerts, the app empowers users with life-saving tools from early warnings and safe route navigation to emergency SOS messaging and resource access. Whether you're planning ahead or facing rising waters, FloodGuardian helps communities stay informed, connected, and protected.

---

### Features

- **Flood Risk Dashboard:** View current flood risk levels and alerts.
- **Safe Routes:** Get recommended safe evacuation routes and nearby shelters.
- **Emergency SOS:** Quickly access emergency contacts and share your location.
- **Flood Gallery:** Browse and filter flood images by state, LGA, and ward.
- **AI Chat Assistant:** Ask flood safety questions and get instant answers.
- **Report Flooding:** Submit flood reports with location, photo, and water depth.
- **Settings:** Manage notifications, offline mode, emergency contacts, and language.
- **Flood Safety Guide:** Access tips for before, during, and after a flood.
- **Offline Bluetooth Chat:** Communicate with nearby users using Bluetooth/Mesh, even without internet.

---

### Project Folder Structure

```
Flood-Guardian/
├── .github/
│   └── workflows/           # GitHub Actions for CI/CD
│
├── public/                  # Static assets served directly
│   ├── audio/               # Audio files (alerts, sounds)
│   ├── data/                # JSON or static datasets
│   ├── flood-gallery/       # Flood-related image assets
│   ├── Home/                # Static assets for Home page
│   ├── Gallery/             # Static assets for Gallery page
│   ├── Pages/               # Assets for static pages
│   ├── SafeRoutes/          # Route maps, directions, etc.
│   ├── SOSMessage/          # Media/assets for SOS message UI
│   ├── favicon.ico          # Browser tab icon
│   ├── placeholder.svg      # Placeholder images
│   └── robots.txt           # SEO-related file for web crawlers
│
├── src/                     # Main application source code
│   ├── components/          # Reusable UI components (Button, Card, Sidebar, etc.)
│   ├── hooks/               # Custom React hooks (e.g., useLocation, useFetch)
│   ├── lib/                 # Utility functions, API services, constants
│   ├── pages/               # Main app pages (Home, Map, Guide, SOS, etc.)
│   ├── App.css              # Global app-level CSS
│   ├── App.tsx              # Main App component including routing logic
│   ├── index.css            # Tailwind or other global styles
│   ├── main.tsx             # App entry point (ReactDOM renders App)
│   └── vite-env.d.ts        # Vite/TypeScript environment declarations
│
├── .gitignore               # Files and folders ignored by Git
├── .npmrc                   # NPM configuration (e.g., registry, cache)
├── README.md                # Project overview, setup instructions
├── bun. lockb                # Bun package manager lock file
├── components.json          # Component registry or metadata (possibly for a UI builder)
├── eslint.config.js         # Linting rules and configurations
├── index.html               # HTML entry point for Vite
├── package-lock.json        # Dependency lock file for npm
├── package.json             # Project metadata and dependencies
├── postcss.config.js        # PostCSS configuration (used with Tailwind)
├── tailwind.config.ts       # Tailwind CSS configuration
├── tsconfig.app.json        # TypeScript config specific to the app
├── tsconfig.json            # Base TypeScript config
├── tsconfig.node.json       # TypeScript config for Node-related code
└── vite.config.ts           # Vite build tool configuration

```

---

### Getting Started

1. **Clone the repository:**
   ```sh
   https://github.com/prithaprith/flood-guardian.git
   cd flood-guardian
   ```

2. **Install dependencies:**
   ```sh
   npm install
   # node version v22.15.0
   # npm version v10.9.2
   ```

3. **Start the development server:**
   ```sh
   npm run dev
   ```

4. **Open your browser:**
   The app is hosted on Azure for easy access and testing. [Here is the link → http://48.217.68.36:8080/](http://48.217.68.36:8080/)


---

### Customization

- **Add Emergency Contacts:** Go to Settings → Emergency Contacts.
- **Report Flood:** Use the "Report Flooding" page to submit a new report.
- **Add Safe Shelter:** Use the "Add Safe Route" feature to add a new shelter.
- **Change Language/Notifications:** Manage these in the Settings page.
- **Offline Chat:** Use the "Offline Bluetooth Chat" page to send and receive messages locally.

---

### Technologies Used

### 🛠️ Technologies Used

- **[React](https://react.dev/)**  
  For interactive user interface.

- **[Tailwind CSS](https://tailwindcss.com/)**  
  For responsive design.

- **Local Storage**  
  Used for emergency contacts and preferences directly in the browser, enabling offline support.

- **JSON**  
  Employed as the primary data format for storing, parsing, and exchanging structured data across components and storage.

- **GeoJSON**  
  A geospatial data format used to represent geographical features and route data, enabling map visualization and spatial computations.

- **Maptiler Cloud**  
  A mapping platform used to render interactive, customizable maps and layers via MapLibre GL integration.

- **npm**  
  The Node.js package manager used to install and manage project dependencies and scripts during development.

- **Azure**  
  For easy access and testing

- **Turf.js**  
  A powerful geospatial analysis library used to calculate the nearest safe evacuation route based on the user’s current location and geographic data.


---

### API and Dataset
- [OpenEPI](https://developer.openepi.io/data-catalog/resource/0b792d08-c891-4929-b065-ded3615b45f6) Flood Forecast API 
- Nigeria Road Network from [World Bank](https://data.humdata.org/dataset/hotosm_nga_roads) 
- Integrated [Nominatim](https://nominatim.org) API to retrieve the address corresponding to the user’s real-time location


---

### Folder Reference

- **UI Components:** [`src/components/ui/`](src/components/ui/)
- **Pages:** [`src/pages/`](src/pages/)
- **Custom Hooks:** [`src/hooks/`](src/hooks/)
- **Main App:** [`src/App.tsx`](src/App.tsx)

---

### Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

### License

This project is licensed under the MIT License.
