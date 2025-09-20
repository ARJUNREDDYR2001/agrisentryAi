# AgriSentryAI
_Your AI-Powered, Climate-Aware Farm Guardian_

AgriSentryAI is a web application designed to empower smallholder farmers in India by providing them with advanced, AI-driven tools for crop protection. It tackles the critical challenges of timely disease diagnosis, resource accessibility, and the growing impact of climate change on agriculture.

---

## 🚩 The Problem

Smallholder farmers face immense pressure from pests, diseases, and unpredictable weather patterns, which can devastate crop yields. Access to timely, accurate information and resources is often limited, leading to significant financial losses and food insecurity. AgriSentryAI bridges this gap with a user-friendly, mobile-first platform that acts as a digital agronomist in the farmer's pocket.

## ✨ Key Features

AgriSentryAI integrates several advanced AI capabilities to provide a comprehensive crop protection solution:

*   **📸 Instant AI Disease Diagnosis**: Snap a photo of a diseased plant, and the AI instantly identifies the issue, its confidence level, and provides actionable advice.
*   **🔭 Predictive Pest & Disease Forecasting**: Select your crop, and the AI analyzes local weather data to forecast the risk of specific pest and disease outbreaks, providing a risk score and timeline.
*   **🛍️ Intelligent Treatment Sourcing**: After diagnosis, the app automatically identifies the required remedy (e.g., bio-pesticide, fungicide) and uses an AI tool to locate nearby agro-dealers who stock those products.
*   **🗣️ Multi-Lingual AI Assistant**: A helpful chatbot, fluent in English, Hindi, Marathi, Tamil, Telugu, and Kannada, is available to answer any farming-related questions.
*   **☂️ Climate-Linked Insurance Check**: The diagnosis automatically determines if the disease is climate-related and eligible for micro-insurance claims, empowering farmers to seek financial protection.
*   **☀️ Hyper-Local Weather Analysis**: The dashboard displays real-time, localized weather conditions (temperature, humidity, rain forecast) that power the app's AI insights.

## 🛠️ Tech Stack

*   **Framework**: Next.js (App Router)
*   **UI**: React, TypeScript, Tailwind CSS, ShadCN UI
*   **AI & Backend**:
    *   **Google Gemini Pro & Gemini TTS**: For all generative AI tasks, including diagnosis, forecasting, chat, and text-to-speech.
    *   **Genkit**: The core AI orchestration framework used to build and manage the AI flows and tools.
    *   **Next.js Server Actions**: For secure, efficient communication between the client and the server-side AI functions.
*   **Languages Supported**: English, Hindi, Marathi, Tamil, Telugu, Kannada.

## 🚀 Getting Started

Follow these steps to set up and run the project locally.

### 1. Prerequisites

*   Node.js (v18 or later)
*   npm or yarn

### 2. Get a Gemini API Key

This project uses the Google Gemini API. You will need a free API key to run the application.

*   Go to **[Google AI Studio](https://aistudio.google.com/app/apikey)**.
*   Click **"Create API key"** and copy the generated key.

### 3. Clone the Repository

```bash
git clone https://github.com/ARJUNREDDYR2001/agrisentry-hack.git
cd agrisentry-hack
```

### 4. Install Dependencies

```bash
npm install
```

### 5. Set Up Environment Variables

Create a new file named `.env` in the root of your project and add your Gemini API key to it:

```env
GEMINI_API_KEY=YOUR_API_KEY_HERE
```

### 6. Run the Development Server

```bash
npm run dev
```

The application will now be running at [http://localhost:9002](http://localhost:9002).

## 🧑‍💻 Developed By

*   **Arjun Reddy**
    *   Full Stack Developer - Broadridge Fintech
    *   Karnataka, India
    *   Email: [arjunredyr2001@gmail.com](mailto:arjunredyr2001@gmail.com)
    *   Phone: +91 9380724044
