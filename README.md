# ⚡ IronPulse: Offline-First Workout & Macro-Cycle Tracker

IronPulse is a high-performance, fully offline gym tracker built for Android using React, Tailwind CSS, and Ionic Capacitor. Designed with a heavy-duty "iron and neon" dark mode aesthetic, it eliminates the friction of traditional workout logs by offering granular set-by-set tracking, smart daily state resets, and macro-cycle progression comparisons—all saved permanently to the device's native storage.

## ✨ Core Features

*   **Granular Set Tracking:** Log weight, reps, and RPE (Rate of Perceived Exertion) on a 1-10 scale. Each set tracks distinct Complete, Fail, or Skip states.
*   **"Fresh Day" Target Persistence:** When opening a new workout day, button states reset to neutral, but previous weights, reps, and RPE remain pre-filled as today's baseline targets. A "Last Session" badge reminds you of your previous performance.
*   **Calendar History Logbook:** A full monthly calendar grid visually maps out training days. Clicking any date reveals total volume, average intensity, and exercise-by-exercise breakdowns.
*   **Macro-Cycle Progress Comparison:** Select a date range (e.g., all of October to November) to instantly calculate your delta in working weight, sets, and volume. Results are logically grouped by your training split (Push, Pull, Legs).
*   **Native Offline Storage:** Utilizes `@capacitor/preferences` to bypass volatile browser `localStorage`, ensuring all data is saved securely to the Android device's native `SharedPreferences`.

## 🛠️ Tech Stack

*   **Frontend UI:** React (TypeScript), Vite
*   **Styling:** Tailwind CSS, Lucide React (Icons)
*   **Mobile Engine:** Ionic Capacitor
*   **Local Database:** Capacitor Preferences API

## 🚀 Local Development (Web Preview)

To run the web environment of IronPulse locally on your machine:

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/YOUR_USERNAME/ironpulse-android.git](https://github.com/YOUR_USERNAME/ironpulse-android.git)
    cd ironpulse-android
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Start the Vite development server:**
    ```bash
    npm run dev
    ```
    *Navigate to `http://localhost:5173` in your browser to view the app.*

## 📱 Building the Android APK

IronPulse is designed to be compiled as a native Android application. Ensure you have **Node.js** and **Android Studio** (with Gradle JVM 21 configured) installed.

1.  **Build the production web bundle:**
    ```bash
    npm run build
    ```
2.  **Sync web assets to the native Android project:**
    ```bash
    npx cap sync
    ```
3.  **Open Android Studio:**
    ```bash
    npx cap open android
    ```
4.  **Compile the APK:**
    *   Wait for the background Gradle Sync to complete.
    *   In the top menu, go to **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
    *   Once finished, locate the generated `app-debug.apk` file in your build outputs to install directly on your Android device.

## 🧠 Architecture Notes
To prevent data loss from Android's aggressive memory management, standard browser `localStorage` was intentionally bypassed. All read/write operations utilize asynchronous `Preferences.get()` and `Preferences.set()` wrappers, parsing custom JSON objects containing the user's splits, exercise targets, and historical calendar states.

---
*Designed and engineered by Niloy Sarker Bappy.*