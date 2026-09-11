/**
 * ExamPulse - Reactive State Store
 */

import { DEFAULT_EXAMS } from './mockExams.js';

const STORAGE_KEYS = {
  EXAMS: 'exampulse_exams_v1',
  ATTEMPTS: 'exampulse_attempts_v1',
  THEME: 'exampulse_theme_v1',
  CURRENT_USER: 'exampulse_user_v1'
};

const DEFAULT_ATTEMPTS = [
  {
    id: "ATT-1001",
    candidateName: "Elena Rostova",
    candidateId: "24BCSE101",
    examId: "EXAM-DSA-201",
    examTitle: "Data Structures & Algorithms - Mid-Term Assessment",
    examCode: "CS201",
    score: 18.75,
    totalMarks: 20,
    percentage: 94,
    passed: true,
    correctCount: 4,
    incorrectCount: 1,
    unattemptedCount: 0,
    trustScore: 100,
    violationCount: 0,
    date: "2026-09-10 14:30"
  },
  {
    id: "ATT-1002",
    candidateName: "Marcus Vance",
    candidateId: "24BCSE102",
    examId: "EXAM-DSA-201",
    examTitle: "Data Structures & Algorithms - Mid-Term Assessment",
    examCode: "CS201",
    score: 16.0,
    totalMarks: 20,
    percentage: 80,
    passed: true,
    correctCount: 4,
    incorrectCount: 1,
    unattemptedCount: 0,
    trustScore: 75,
    violationCount: 1,
    date: "2026-09-10 15:10"
  },
  {
    id: "ATT-1003",
    candidateName: "Devon Chen",
    candidateId: "24BCSE104",
    examId: "EXAM-DBMS-202",
    examTitle: "Database Management Systems (DBMS) Certification",
    examCode: "CS202",
    score: 15.0,
    totalMarks: 20,
    percentage: 75,
    passed: true,
    correctCount: 3,
    incorrectCount: 1,
    unattemptedCount: 0,
    trustScore: 100,
    violationCount: 0,
    date: "2026-09-11 11:00"
  }
];

class Store {
  constructor() {
    this.subscribers = [];
    this.exams = this.load(STORAGE_KEYS.EXAMS, DEFAULT_EXAMS);
    this.attempts = this.load(STORAGE_KEYS.ATTEMPTS, DEFAULT_ATTEMPTS);
    this.theme = localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
    this.currentUser = this.load(STORAGE_KEYS.CURRENT_USER, {
      name: "Alex Mercer",
      id: "24BCSE108",
      role: "student", // 'student' or 'faculty'
      branch: "Computer Science & Engineering",
      year: "2nd Year"
    });
  }

  load(key, fallback) {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  save() {
    try {
      localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(this.exams));
      localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(this.attempts));
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(this.currentUser));
    } catch (e) {
      console.error(e);
    }
    this.notify();
  }

  subscribe(cb) {
    this.subscribers.push(cb);
    return () => {
      this.subscribers = this.subscribers.filter(fn => fn !== cb);
    };
  }

  notify() {
    this.subscribers.forEach(cb => cb(this));
  }

  setTheme(theme) {
    this.theme = theme;
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    document.documentElement.setAttribute('data-theme', theme);
    this.notify();
  }

  toggleTheme() {
    this.setTheme(this.theme === 'light' ? 'dark' : 'light');
  }

  setUserRole(role) {
    this.currentUser.role = role;
    this.save();
  }

  setCandidateName(name, id) {
    if (name) this.currentUser.name = name;
    if (id) this.currentUser.id = id;
    this.save();
  }

  getExamById(id) {
    return this.exams.find(e => e.id === id);
  }

  addAttempt(attemptData) {
    const attempt = {
      id: `ATT-${Date.now().toString().slice(-4)}`,
      candidateName: this.currentUser.name,
      candidateId: this.currentUser.id,
      date: new Date().toLocaleString(),
      ...attemptData
    };
    this.attempts.unshift(attempt);
    this.save();
    return attempt;
  }

  createExam(examData) {
    const newExam = {
      id: `EXAM-CSE-${Date.now().toString().slice(-4)}`,
      ...examData
    };
    this.exams.push(newExam);
    this.save();
    return newExam;
  }

  resetData() {
    this.exams = JSON.parse(JSON.stringify(DEFAULT_EXAMS));
    this.attempts = JSON.parse(JSON.stringify(DEFAULT_ATTEMPTS));
    this.save();
  }
}

export const store = new Store();
