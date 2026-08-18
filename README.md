# PrepWise AI - AI-Powered Interview Preparation Chatbot

PrepWise AI is a premium, full-stack, AI-powered mock interview simulator designed to help job seekers practice and evaluate their interview performance. By leveraging the power of Google Gemini AI, the application conducts interactive mock interviews, evaluates user answers in real-time across four crucial performance metrics, and tracks historical progress on a visual dashboard.

---

## ✨ Key Features

* **🎭 Configurable AI Mock Interviews:** Custom-tailored questions generated dynamically based on your chosen **Job Role**, **Category** (Technical, HR, Behavior), and **Difficulty Level**.
* **📈 Apple Watch-Style Concentric Activity Rings:** Real-time visual tracking of key performance metrics after every answer:
  * 🔵 **Relevance** (Outermost ring)
  * 🟢 **Technical Accuracy**
  * 🟢 **Communication Clarity**
  * 🟡 **Confidence** (Innermost ring)
* **💡 Real-time Granular Feedback:** Conversational inline evaluation cards detailing:
  * **Strengths:** Key aspects you got right.
  * **Weaknesses:** Gaps in knowledge or delivery.
  * **Ideal Answer:** A sample high-scoring response.
  * **Suggested Improvement:** Actionable tips to elevate your score.
* **📊 Analytics Dashboard:** A comprehensive view tracking preparation stats, average scores, performance trends (via area charts), and category competency (via column charts).
* **📄 PDF Performance Reports:** Downloadable, beautifully formatted PDF report files compiling your full chat transcripts and performance metrics.
* **🔒 Secure Authentication:** JWT-based user login and sign-up with password hashing.

---

## 🛠️ Technology Stack

### Frontend
* **Core:** React, Vite
* **Styling:** Tailwind CSS v4 (Glassmorphic dark mode styling)
* **Animations:** Framer Motion
* **Charts:** Recharts (RadialBarChart, AreaChart, BarChart)
* **Icons:** Lucide React

### Backend
* **Core:** FastAPI (Python)
* **Database & ORM:** SQLite, SQLAlchemy
* **AI Integration:** Google Generative AI (Gemini API)
* **PDF Utility:** ReportLab
* **Authentication:** JWT tokens, Passlib, Bcrypt

---

## 🚀 Getting Started

### Prerequisites
Make sure you have the following installed:
* [Node.js](https://nodejs.org/) (v16 or higher)
* [Python](https://www.python.org/) (v3.9 or higher)

---

### 📂 Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. Install the required python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file in the `backend/` folder and insert your Gemini API key:
   ```env
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   JWT_SECRET=your_jwt_secret_token_here
   ```

5. Start the FastAPI development server:
   ```bash
   uvicorn main:app --reload
   ```
   *The backend will be running at:* `http://localhost:8000`

---

### 📂 Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install the node packages:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The app will be running at:* `http://localhost:5173`

---

## 🎨 User Interface Theme
The application features a modern **Deep Midnight Blue & Teal** dark-mode visual aesthetic:
* Translucent container glassmorphism utilizing backdrop blurs.
* Floating teal and sky blue glowing mesh background orbs.
* Apple Watch-style concentric radial charts for intuitive metric comprehension.
* Uniform Arial typography settings across all panels.
