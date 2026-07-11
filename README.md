# Decode-Labs Internship - Week 1 Submission

## Platform: EduCircuit Labs
An interactive educational platform designed for engineering students to learn practical hardware concepts and simulate microcontroller circuits (such as Arduino, IoT telemetry, robotics, and embedded systems kits).

### Submission Contents
This repository represents the **Task 1 (Frontend Only)** project submission for Week 1:
* **Interactive Frontend Application**: Fully responsive React & Vite dashboard layout mapped to curriculum kits.
* **Premium UX Features**: Sleek category filters, hover zoom visual indicators, simulated serial logs, and custom micro-animations.
* **Local Data Mock Layer**: Client-side storage and simulation (Axios mock emulator) for auth, orders, and inquiries, completely disconnected from real backend configurations.

### Directory Structure
```text
Decode-Labs/
├── Week-1/
│   ├── src/                 # React source code (pages, components, context, utils)
│   ├── public/              # Visual assets, logos, and kit graphics
│   ├── package.json         # Dependencies and scripts (React, Vite, Axios)
│   ├── vite.config.js       # Vite server configurations
│   └── index.html           # Main template
└── README.md                # Project information
```

### Getting Started Locally
1. Navigate to the project directory:
   ```bash
   cd Week-1
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the Vite development server:
   ```bash
   npm run dev
   ```
4. Access the web app in your browser at `http://localhost:3000`.
