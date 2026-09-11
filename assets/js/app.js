/**
 * ExamPulse - Master Application Router & State Controller
 */

import { store } from './store.js';
import { ProctorEngine } from './proctor.js';
import { renderDashboard } from './components/dashboard.js';
import { renderExamRoom } from './components/examRoom.js';
import { renderResultReview } from './components/resultReview.js';
import { renderAdminPanel } from './components/adminPanel.js';
import { calculateScore, formatTime, showToast } from './utils/helpers.js';
import { exportAttemptsToCSV } from './utils/exportResults.js';

class ExamPulseApp {
  constructor() {
    this.currentView = 'dashboard'; // 'dashboard' | 'exam-room' | 'result' | 'admin'
    
    // Active Exam Session State
    this.activeExam = null;
    this.examState = {
      currentQuestionIndex: 0,
      answers: {},
      markedForReview: new Set(),
      visited: new Set([0]),
      remainingSeconds: 0,
      timerInterval: null
    };

    this.lastAttempt = null;
    this.proctor = null;

    this.init();
  }

  init() {
    // Set theme
    document.documentElement.setAttribute('data-theme', store.theme);

    // Bind theme toggle
    const themeBtn = document.getElementById('btn-theme-toggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        store.toggleTheme();
        themeBtn.textContent = store.theme === 'light' ? '🌙' : '☀️';
      });
    }

    // Bind navigation buttons
    this.bindGlobalNavigation();
    this.bindModals();

    // Initial View
    this.navigate('dashboard');
  }

  bindGlobalNavigation() {
    document.querySelectorAll('.header-nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const view = btn.getAttribute('data-view');
        if (this.currentView === 'exam-room') {
          if (!confirm('You have an active examination session in progress. Leaving this page will end your attempt. Are you sure?')) {
            return;
          }
          this.endExamSession(false);
        }
        this.navigate(view);
      });
    });

    // Brand click -> home
    const brand = document.getElementById('brand-home-link');
    if (brand) {
      brand.addEventListener('click', () => {
        if (this.currentView === 'exam-room') {
          if (!confirm('Exit ongoing examination?')) return;
          this.endExamSession(false);
        }
        this.navigate('dashboard');
      });
    }
  }

  navigate(viewName, data = null) {
    this.currentView = viewName;

    // Update active nav button
    document.querySelectorAll('.header-nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-view') === viewName);
    });

    const headerExamPills = document.getElementById('header-exam-pills');
    if (headerExamPills) {
      headerExamPills.style.display = viewName === 'exam-room' ? 'flex' : 'none';
    }

    this.render();
  }

  render() {
    const container = document.getElementById('app-content');
    if (!container) return;

    if (this.currentView === 'dashboard') {
      container.innerHTML = renderDashboard();
      this.attachDashboardEvents();
    } else if (this.currentView === 'exam-room') {
      container.innerHTML = renderExamRoom(this.activeExam, this.examState);
      this.attachExamRoomEvents();
    } else if (this.currentView === 'result') {
      container.innerHTML = renderResultReview(this.lastAttempt, this.activeExam);
      this.attachResultEvents();
    } else if (this.currentView === 'admin') {
      container.innerHTML = renderAdminPanel();
      this.attachAdminEvents();
    }
  }

  // --- Dashboard Handlers ---
  attachDashboardEvents() {
    // Start Exam button
    document.querySelectorAll('.btn-start-exam').forEach(btn => {
      btn.addEventListener('click', () => {
        const examId = btn.getAttribute('data-exam-id');
        this.launchExam(examId);
      });
    });

    // View Certificate button from past attempts
    document.querySelectorAll('.btn-view-certificate').forEach(btn => {
      btn.addEventListener('click', () => {
        const attemptId = btn.getAttribute('data-attempt-id');
        const attempt = store.attempts.find(a => a.id === attemptId);
        if (attempt) {
          const exam = store.getExamById(attempt.examId) || store.exams[0];
          this.lastAttempt = attempt;
          this.activeExam = exam;
          this.navigate('result');
        }
      });
    });

    // Edit Candidate Details
    const editBtn = document.getElementById('btn-edit-candidate-info');
    if (editBtn) {
      editBtn.addEventListener('click', () => {
        const name = prompt('Enter Candidate Full Name:', store.currentUser.name);
        const roll = prompt('Enter Student Registration / Roll No:', store.currentUser.id);
        if (name || roll) {
          store.setCandidateName(name, roll);
          showToast('Candidate credentials updated.', 'success');
          this.render();
        }
      });
    }
  }

  // --- Exam Lifecycle ---
  launchExam(examId) {
    const exam = store.getExamById(examId);
    if (!exam) return;

    this.activeExam = exam;
    this.examState = {
      currentQuestionIndex: 0,
      answers: {},
      markedForReview: new Set(),
      visited: new Set([0]),
      remainingSeconds: exam.durationMinutes * 60,
      timerInterval: null
    };

    // Initialize Proctor Engine
    this.proctor = new ProctorEngine({
      maxStrikes: 3,
      onViolation: (evt, strikes, max) => {
        const strikeCounter = document.getElementById('proctor-strike-count');
        if (strikeCounter) {
          strikeCounter.textContent = `${strikes} / ${max}`;
        }
        showToast(`Proctoring Alert: ${evt.details} (Warning ${strikes} of ${max})`, 'danger');
      },
      onMaxStrikesExceeded: (violations) => {
        alert("PROCTORING AUDIT VIOLATION:\n\nYou have exceeded the maximum of 3 integrity violations (tab switches / focus loss). Your assessment has been automatically locked and submitted.");
        this.submitAssessment(true);
      }
    });

    this.proctor.start();

    // Start Timer
    this.startTimer();

    // Navigate to Exam Room
    this.navigate('exam-room');
    showToast(`Assessment session started for ${exam.code}. Proctoring enabled.`, 'info');
  }

  startTimer() {
    if (this.examState.timerInterval) clearInterval(this.examState.timerInterval);

    const updateTimerDisplay = () => {
      const timerEl = document.getElementById('header-timer-val');
      const timerPill = document.getElementById('header-timer-pill');
      if (timerEl) {
        timerEl.textContent = formatTime(this.examState.remainingSeconds);
      }
      if (timerPill) {
        timerPill.classList.toggle('timer-urgent', this.examState.remainingSeconds < 180);
      }
    };

    updateTimerDisplay();

    this.examState.timerInterval = setInterval(() => {
      this.examState.remainingSeconds--;
      updateTimerDisplay();

      if (this.examState.remainingSeconds <= 0) {
        clearInterval(this.examState.timerInterval);
        alert("Time is up! Your assessment is now being submitted automatically.");
        this.submitAssessment(false);
      }
    }, 1000);
  }

  attachExamRoomEvents() {
    const exam = this.activeExam;
    const currentIdx = this.examState.currentQuestionIndex;

    // Option selection
    document.querySelectorAll('.option-item').forEach(item => {
      item.addEventListener('click', () => {
        const optIdx = parseInt(item.getAttribute('data-option-index'), 10);
        this.examState.answers[currentIdx] = optIdx;
        this.render();
      });
    });

    // Clear Response
    const clearBtn = document.getElementById('btn-q-clear');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        delete this.examState.answers[currentIdx];
        this.render();
      });
    }

    // Mark for Review & Next
    const markBtn = document.getElementById('btn-q-mark');
    if (markBtn) {
      markBtn.addEventListener('click', () => {
        if (this.examState.markedForReview.has(currentIdx)) {
          this.examState.markedForReview.delete(currentIdx);
        } else {
          this.examState.markedForReview.add(currentIdx);
        }

        if (currentIdx < exam.questions.length - 1) {
          this.examState.currentQuestionIndex++;
          this.examState.visited.add(this.examState.currentQuestionIndex);
        }
        this.render();
      });
    }

    // Previous Question
    const prevBtn = document.getElementById('btn-q-prev');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (this.examState.currentQuestionIndex > 0) {
          this.examState.currentQuestionIndex--;
          this.examState.visited.add(this.examState.currentQuestionIndex);
          this.render();
        }
      });
    }

    // Next / Save & Next Question
    const nextBtn = document.getElementById('btn-q-next');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (currentIdx < exam.questions.length - 1) {
          this.examState.currentQuestionIndex++;
          this.examState.visited.add(this.examState.currentQuestionIndex);
          this.render();
        } else {
          // At last question, open submit confirmation
          this.openSubmitModal();
        }
      });
    }

    // Palette box jump
    document.querySelectorAll('.q-box').forEach(box => {
      box.addEventListener('click', () => {
        const targetIdx = parseInt(box.getAttribute('data-index'), 10);
        this.examState.currentQuestionIndex = targetIdx;
        this.examState.visited.add(targetIdx);
        this.render();
      });
    });

    // Submit Assessment button
    const submitBtn = document.getElementById('btn-open-submit-modal');
    if (submitBtn) {
      submitBtn.addEventListener('click', () => {
        this.openSubmitModal();
      });
    }
  }

  openSubmitModal() {
    const modal = document.getElementById('submit-confirm-modal');
    const summaryEl = document.getElementById('submit-modal-summary');
    if (!modal || !summaryEl) return;

    let answered = 0;
    this.activeExam.questions.forEach((_, i) => {
      if (this.examState.answers[i] !== undefined && this.examState.answers[i] !== null) {
        answered++;
      }
    });

    const total = this.activeExam.questions.length;
    summaryEl.innerHTML = `
      You have answered <strong>${answered}</strong> out of <strong>${total}</strong> questions.<br>
      Unanswered: <strong>${total - answered}</strong> questions.<br><br>
      Are you sure you want to finalize and submit your assessment? Once submitted, you cannot change your answers.
    `;

    modal.classList.add('open');
  }

  submitAssessment(wasTerminatedByProctor = false) {
    if (this.examState.timerInterval) {
      clearInterval(this.examState.timerInterval);
    }

    // Stop Proctoring & retrieve audit
    let proctorAudit = { strikes: 0, violations: [], trustScore: 100 };
    if (this.proctor) {
      this.proctor.stop();
      proctorAudit = this.proctor.getAuditTrail();
    }

    // Calculate score
    const scoreSummary = calculateScore(this.activeExam, this.examState.answers);

    // Save attempt
    const attempt = store.addAttempt({
      examId: this.activeExam.id,
      examTitle: this.activeExam.title,
      examCode: this.activeExam.code,
      score: scoreSummary.score,
      totalMarks: scoreSummary.totalMarks,
      percentage: scoreSummary.percentage,
      passed: scoreSummary.passed,
      correctCount: scoreSummary.correctCount,
      incorrectCount: scoreSummary.incorrectCount,
      unattemptedCount: scoreSummary.unattemptedCount,
      trustScore: proctorAudit.trustScore,
      violationCount: proctorAudit.strikes,
      userAnswers: { ...this.examState.answers },
      terminatedByProctor: wasTerminatedByProctor
    });

    this.lastAttempt = attempt;
    document.getElementById('submit-confirm-modal')?.classList.remove('open');
    this.navigate('result');
    showToast('Assessment submitted and evaluated successfully!', 'success');
  }

  endExamSession(promptUser = true) {
    if (this.examState.timerInterval) clearInterval(this.examState.timerInterval);
    if (this.proctor) this.proctor.stop();
    this.activeExam = null;
  }

  // --- Result View Handlers ---
  attachResultEvents() {
    const printBtn = document.getElementById('btn-print-certificate');
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        window.print();
      });
    }

    const returnBtn = document.getElementById('btn-return-dashboard');
    if (returnBtn) {
      returnBtn.addEventListener('click', () => {
        this.navigate('dashboard');
      });
    }
  }

  // --- Admin Panel Handlers ---
  attachAdminEvents() {
    const exportBtn = document.getElementById('btn-export-admin-csv');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        exportAttemptsToCSV(store.attempts);
        showToast('Candidate attempt roster exported to CSV.', 'success');
      });
    }

    const createModalBtn = document.getElementById('btn-open-create-exam-modal');
    if (createModalBtn) {
      createModalBtn.addEventListener('click', () => {
        document.getElementById('create-exam-modal')?.classList.add('open');
      });
    }
  }

  bindModals() {
    // Close modal triggers
    document.querySelectorAll('.modal-close-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('open'));
      });
    });

    // Confirm Submission button in modal
    const confirmSubmitBtn = document.getElementById('btn-modal-confirm-submit');
    if (confirmSubmitBtn) {
      confirmSubmitBtn.addEventListener('click', () => {
        this.submitAssessment(false);
      });
    }

    // Create Exam Form Submission
    const examForm = document.getElementById('create-exam-form');
    if (examForm) {
      examForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = examForm.elements['examTitle'].value.trim();
        const code = examForm.elements['examCode'].value.trim();
        const duration = parseInt(examForm.elements['examDuration'].value, 10) || 15;
        const totalMarks = parseInt(examForm.elements['examMarks'].value, 10) || 20;

        store.createExam({
          code,
          title,
          department: "Computer Science & Engineering",
          semester: "Semester 3 / 4",
          durationMinutes: duration,
          totalMarks,
          passingMarks: totalMarks / 2,
          negativeMarking: true,
          negativeValue: 0.25,
          description: "Faculty configured assessment module.",
          questions: [
            {
              id: 1,
              text: "Which data structure follows the LIFO (Last In First Out) principle?",
              options: ["Queue", "Stack", "Array", "Linked List"],
              correctIndex: 1,
              explanation: "A Stack enforces Last-In-First-Out access order."
            },
            {
              id: 2,
              text: "What is the average time complexity of QuickSort?",
              options: ["O(N)", "O(N log N)", "O(N^2)", "O(log N)"],
              correctIndex: 1,
              explanation: "QuickSort achieves O(N log N) average-case time complexity with good pivot choices."
            }
          ]
        });

        document.getElementById('create-exam-modal')?.classList.remove('open');
        showToast(`Created new assessment: ${code}`, 'success');
        this.render();
      });
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.examPulse = new ExamPulseApp();
});
