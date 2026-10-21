# VoltCalc TN — Tamil Nadu Electricity Bill Calculator

A modern, high-voltage aesthetic web application to calculate Tamil Nadu bimonthly domestic electricity bills based on the latest revised tariff slabs.

![VoltCalc TN](assets/transformer.jpg)

---

## ✨ Features

- **⚡ Real-Time Bill Calculation**: Instant energy charge computation as you type or adjust units.
- **🌓 Dark & Light Mode**: Seamless theme switching with high-contrast electric neon accents and persistent `localStorage` preference.
- **🏭 Power Grid Atmospheric Background**: Photorealistic high-voltage substation transformer visual with responsive glassmorphism blur overlay.
- **🔢 Intuitive Stepper Controls**: Visible increase and decrease arrow controls positioned directly before the `Units (kWh)` badge, fully styled for dark and light modes.
- **📊 Interactive Slab Distribution**: Detailed breakdown table is neatly hidden by default and accessible via the **"⚡ View Slab Distribution Details"** button.
- **💡 Proactive Tariff Shift Notice**: Alerts consumers when approaching or crossing the 500-unit threshold where the free unit quota shifts from 200 units to 100 units.
- **🚫 Zero Official Logos**: Clean, modern electric iconography without official proprietary logos.

---

## 📋 Latest Tariff Slabs Reference

### Category 1: Consumption Upto 500 Units
| Slab # | Units Range | Price per Unit |
| :---: | :--- | :--- |
| **1** | 1 to 200 units | **₹ 0.00 (Free)** |
| **2** | 201 to 400 units | **₹ 4.70** |
| **3** | 401 to 500 units | **₹ 6.30** |

### Category 2: Consumption Above 500 Units
| Slab # | Units Range | Price per Unit |
| :---: | :--- | :--- |
| **1** | 1 to 100 units | **₹ 0.00 (Free)** |
| **2** | 101 to 400 units | **₹ 4.70** |
| **3** | 401 to 500 units | **₹ 6.30** |
| **4** | 501 to 600 units | **₹ 8.40** |
| **5** | 601 to 800 units | **₹ 9.45** |
| **6** | 801 to 1000 units | **₹ 10.50** |
| **7** | Above 1000 Units | **₹ 11.55** |

---

## 📁 Project Structure

```text
├── assets/
│   └── transformer.jpg       # High-voltage substation background image
├── css/
│   └── style.css             # Glassmorphic, electric neon styling & themes
├── js/
│   ├── tariff.js             # Tariff calculation engine
│   └── app.js                # UI controls, canvas spark effects, & state
├── index.html                # Semantic HTML5 entry page
├── vercel.json               # Vercel static deployment configuration
├── .gitignore                # Protects secrets, temporary, and system files
└── README.md                 # Project documentation
```

---

## 🚀 How to Run Locally

You can serve the project using Python's built-in web server:

```bash
# From the project root directory
python -m http.server 8080
```

Open `http://localhost:8080` in your web browser.

---

## 🌐 Deploy to Vercel

### Method 1: Via GitHub (Recommended)
1. Push this repository to GitHub (see instructions below).
2. Go to [Vercel](https://vercel.com/) and sign in with GitHub.
3. Click **"Add New..."** > **"Project"**.
4. Import your `voltcalc-tn` GitHub repository.
5. In the configuration window:
   - **Framework Preset**: *Other* (Zero configuration required)
   - **Root Directory**: `./`
6. Click **Deploy**. Your site will be live on an HTTPS `.vercel.app` domain in seconds!

### Method 2: Via Vercel CLI
```bash
npm i -g vercel
vercel
```

---

## 📤 Publishing to GitHub

### Option A: Using Git CLI (if Git is installed on your computer)
1. Open terminal in the project folder `d:\antigravity`:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: VoltCalc TN Electricity Bill Calculator"
   git branch -M main
   git remote add origin https://github.com/<YOUR-USERNAME>/<YOUR-REPO-NAME>.git
   git push -u origin main
   ```

### Option B: Using GitHub Desktop
1. Download and open [GitHub Desktop](https://desktop.github.com/).
2. Click **File** > **Add Local Repository...**
3. Choose `D:\antigravity`.
4. Click **Publish repository** to push it directly to your GitHub profile.

### Option C: Direct Upload via GitHub Web
1. Go to [github.com/new](https://github.com/new) and create a new repository (e.g. `voltcalc-tn`).
2. Click **"uploading an existing file"**.
3. Drag and drop all the files and folders (`index.html`, `assets/`, `css/`, `js/`, `vercel.json`, `package.json`, `.gitignore`, `README.md`).
4. Click **Commit changes**.

---

## 🔒 Security & Privacy
- No secrets, API keys, or environment files are used or required.
- `.gitignore` ensures credentials and temporary files are never pushed to the repository.
