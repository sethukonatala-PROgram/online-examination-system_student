/**
 * ExamPulse - Helper Utilities
 */

export function formatTime(totalSeconds) {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

export function calculateScore(exam, userAnswers) {
  let correctCount = 0;
  let incorrectCount = 0;
  let unattemptedCount = 0;
  let totalScore = 0;

  const marksPerQuestion = exam.totalMarks / exam.questions.length;
  const negValue = exam.negativeMarking ? (exam.negativeValue || 0.25) * marksPerQuestion : 0;

  exam.questions.forEach((q, idx) => {
    const ans = userAnswers[idx];
    if (ans === undefined || ans === null) {
      unattemptedCount++;
    } else if (ans === q.correctIndex) {
      correctCount++;
      totalScore += marksPerQuestion;
    } else {
      incorrectCount++;
      totalScore -= negValue;
    }
  });

  // Clamp score
  totalScore = Math.max(0, parseFloat(totalScore.toFixed(2)));
  const percentage = Math.round((totalScore / exam.totalMarks) * 100);
  const passed = totalScore >= exam.passingMarks;

  return {
    totalMarks: exam.totalMarks,
    passingMarks: exam.passingMarks,
    score: totalScore,
    percentage,
    passed,
    correctCount,
    incorrectCount,
    unattemptedCount,
    totalQuestions: exam.questions.length
  };
}
