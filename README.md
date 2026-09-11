<div align="center">

# 🎓 ExamPulse - Online Examination & Assessment System

**A production-grade, zero-dependency Computer-Based Testing (CBT) portal with real-time countdown timers, interactive question palettes, automated grading, anti-cheat auto-proctoring, and official printable certificates.**

[![Build & Deploy](https://github.com/sethukonatala-PROgram/online-examination-system_student/actions/workflows/deploy.yml/badge.svg)](https://github.com/sethukonatala-PROgram/online-examination-system_student/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Curriculum](https://img.shields.io/badge/B.Tech%20CSE-2nd%20Year%20Capstone-2563eb.svg)](#academic-curriculum-alignment)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-Zero%20(Pure%20Vanilla)-16a34a.svg)](#)
[![Deployment](https://img.shields.io/badge/Deployment-GitHub%20Pages%20Live-16a34a.svg)](https://sethukonatala-program.github.io/online-examination-system_student/)
[![UI Style](https://img.shields.io/badge/UI-Professional%20Enterprise%20(HackerRank%20Style)-475569.svg)](#)

[Live Demo](#-quick-start) • [Key Features](#-key-features) • [Curriculum Fit](#academic-curriculum-alignment) • [Viva Q&A](#-viva-voce-lab-examination-guide) • [GitHub Setup](#-how-to-push-to-github)

</div>

---

## 📌 Project Overview

**ExamPulse** is engineered as a robust, modern Computer-Based Testing (CBT) platform tailored for **2nd Year B.Tech Computer Science & Engineering** students. Unlike AI-generated toy projects, ExamPulse adheres strictly to clean enterprise UI standards used by platforms like **HackerRank, LeetCode, Mettl, and GATE/NTA examination portals**.

It bridges foundational CSE coursework (**Data Structures & Algorithms, DBMS, Operating Systems, Computer Networks**) with real-world **Browser Security and Systems Programming concepts** (Page Visibility API, DOM security, anti-tamper mechanisms).

---

## 🌟 Key Features

### 🖥️ 1. Computer-Based Testing (CBT) Examination Engine
- **Synchronized Countdown Timer**: Persistent session timer with visual urgency alerts when under 3 minutes.
- **Interactive Question Palette**:
  - 🟢 **Answered** (Recorded response)
  - 🔴 **Not Answered** (Visited without selection)
  - 🟣 **Marked for Review** (Flagged for later review)
  - ⚪ **Not Visited** (Unseen questions)
- **Fluid Navigation**: 1-click jump to any question, Clear Response, Previous, and Save & Next controls.
- **Code Block Formatting**: Monospace syntax blocks for algorithmic questions with clean indentation.

### 🛡️ 2. Smart Auto-Proctoring & Anti-Cheat System
- **Tab-Switch & Blur Detection**: Utilizes the HTML5 **Page Visibility API** (`visibilitychange`) and window focus events to detect candidates minimizing or navigating away from the test tab.
- **Three-Strike Policy**:
  - Strike 1: Warning alert logged with timestamp.
  - Strike 2: High-severity modal alert.
  - Strike 3: Automatic assessment lockdown & auto-submission.
- **Restricted Keyboard & Mouse Operations**: Blocks right-click inspect (`contextmenu`), `Ctrl+C` (Copy), `Ctrl+V` (Paste), `Ctrl+U` (View Source), and developer tools shortcuts.
- **Integrity Trust Score**: Automatically deducts trust percentage per infraction for faculty audit.

### 📊 3. Automated Evaluation & Detailed Explanations
- **Instant Objective Grading**: Supports positive marks allocation and negative marking deduction rules (e.g. -0.25 penalty).
- **Comprehensive Solution Breakdown**: Complete question-by-question review showing the candidate's chosen answer, the correct answer key, and an in-depth technical explanation.

### 📜 4. Official Printable Certificate of Completion
- **Verifiable Credentials**: Formatted certificate displaying candidate full name, student ID, course title, final score, accuracy percentage, and integrity trust score.
- **Print & PDF Optimization**: Uses CSS `@media print` rules for physical printing or instant saving as PDF.

### 👨‍🏫 5. Faculty & Administrator Console
- **Candidate Leaderboard**: Real-time ranking of candidates by score, accuracy percentage, and proctoring trust rating.
- **Assessment Creator**: Intuitive modal to configure new course exams, duration, max marks, and passing cutoffs.
- **Export to CSV**: Single-click export of the entire candidate roster and scores for Excel / Google Sheets records.

---

## 🎓 Academic Curriculum Alignment

This project satisfies multiple 2nd Year B.Tech CSE learning outcomes:

| Subject | Project Application |
|---|---|
| **Data Structures & Algorithms (DSA)** | Preloaded assessment questions, asymptotic analysis, tree algorithms, graph traversals. |
| **Database Management Systems (DBMS)** | Relational normalization (1NF-BCNF), ACID transaction durability, B+ Tree indexing. |
| **Operating Systems (OS)** | Process synchronization, Coffman deadlock conditions, virtual memory thrashing, CPU scheduling. |
| **Web Technologies & Security** | Browser Page Visibility API, DOM event handling, local persistence, client-side session security. |

---

## 💬 Viva-Voce / Lab Examination Guide

Use these questions and answers during your college project review or semester viva:

<details>
<summary><strong>Q1: How does the auto-proctoring engine detect tab switching?</strong></summary>

> **Answer:** ExamPulse leverages the standard HTML5 **Page Visibility API**. By listening to the `visibilitychange` event on the `document` object and checking `document.hidden`, the system instantly detects whenever a candidate switches tabs, opens an external application, or minimizes the browser window.
</details>

<details>
<summary><strong>Q2: How is data stored without an external SQL server?</strong></summary>

> **Answer:** ExamPulse employs a modular reactive store utilizing browser **`localStorage`** and JSON serialization. It encapsulates state for available exams, candidate sessions, active question palettes, and historical attempt scorecards with zero external server dependencies.
</details>

<details>
<summary><strong>Q3: How does the negative marking algorithm calculate final scores?</strong></summary>

> **Answer:** For each question, if correct: `Score += (TotalMarks / NumQuestions)`. If incorrect and negative marking is active: `Score -= (NegativePenalty * MarksPerQuestion)`. Skipped questions carry zero penalty. Final scores are clamped to a non-negative floor.
</details>

---

## 🚀 Quick Start

### 1. Launch with Python Server (Zero Install)
```bash
python server.py --port 8080
```
Open **`http://localhost:8080`** in your browser.

### 2. Launch with Windows Script
Double-click [`run.bat`](run.bat) in the project directory.

---

## 🌐 Free GitHub Pages Hosting

1. Push this repository to your GitHub account.
2. Go to **Settings** → **Pages**.
3. Under **Build and deployment** → **Source**, choose **GitHub Actions**.
4. The included workflow in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) will deploy the site online at:
   👉 **`https://sethukonatala-program.github.io/online-examination-system_student/`**

---

## 📁 Repository Structure

```
online-examination-system_student/
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Pages CI/CD workflow
├── assets/
│   ├── css/
│   │   ├── style.css              # Professional CBT stylesheet (HackerRank style)
│   │   └── certificate.css        # Printable completion certificate styling
│   └── js/
│       ├── app.js                 # App router, test engine controller
│       ├── store.js               # Reactive state store with local persistence
│       ├── mockExams.js           # B.Tech CSE question bank (DSA, DBMS, OS)
│       ├── proctor.js             # Anti-cheat & proctoring detection engine
│       ├── components/
│       │   ├── dashboard.js       # Assessment catalog & history
│       │   ├── examRoom.js        # CBT test room & question palette
│       │   ├── resultReview.js    # Detailed scorecard & certificate view
│       │   └── adminPanel.js      # Faculty console & candidate leaderboard
│       └── utils/
│           ├── helpers.js         # Timer formatter, score calculation, toasts
│           └── exportResults.js   # Candidate roster CSV exporter
├── index.html                     # Main portal entry point
├── server.py                      # Lightweight Python 3 local server
├── run.bat                        # Windows 1-click launcher
├── run.sh                         # macOS/Linux launcher
├── .gitignore                     # Git exclusions
├── LICENSE                        # MIT License
├── CONTRIBUTING.md                # Contribution guidelines
└── README.md                      # Comprehensive academic showcase documentation
```

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for details.
