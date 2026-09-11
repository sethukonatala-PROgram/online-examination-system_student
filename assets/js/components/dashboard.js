/**
 * ExamPulse - Candidate Assessment Catalog & Dashboard
 */

import { store } from '../store.js';

export function renderDashboard() {
  const exams = store.exams;
  const user = store.currentUser;
  const attempts = store.attempts.filter(a => a.candidateId === user.id || a.candidateName === user.name);

  const examCards = exams.map(exam => `
    <div class="panel-card" style="display: flex; flex-direction: column; justify-content: space-between; border-top: 4px solid var(--primary);">
      <div>
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
          <span style="font-family: var(--font-code); font-weight: 700; font-size: 0.82rem; background: var(--primary-subtle); color: var(--primary); padding: 0.2rem 0.6rem; border-radius: var(--radius-sm);">
            ${exam.code}
          </span>
          <span style="font-size: 0.78rem; font-weight: 600; color: var(--text-muted);">
            ${exam.semester}
          </span>
        </div>

        <h3 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--text-main); line-height: 1.35;">
          ${exam.title}
        </h3>

        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.25rem; line-height: 1.5;">
          ${exam.description}
        </p>
      </div>

      <div>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; padding: 0.75rem 0; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); margin-bottom: 1.25rem; font-size: 0.8rem; text-align: center;">
          <div>
            <div style="color: var(--text-muted); font-size: 0.72rem; text-transform: uppercase;">Duration</div>
            <div style="font-weight: 700; color: var(--text-main);">${exam.durationMinutes} Mins</div>
          </div>
          <div>
            <div style="color: var(--text-muted); font-size: 0.72rem; text-transform: uppercase;">Questions</div>
            <div style="font-weight: 700; color: var(--text-main);">${exam.questions.length} MCQs</div>
          </div>
          <div>
            <div style="color: var(--text-muted); font-size: 0.72rem; text-transform: uppercase;">Max Score</div>
            <div style="font-weight: 700; color: var(--text-main);">${exam.totalMarks} Marks</div>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 0.76rem; color: ${exam.negativeMarking ? 'var(--danger)' : 'var(--text-muted)'}; font-weight: 600;">
            ${exam.negativeMarking ? `Negative: -${exam.negativeValue} marks` : 'No negative marking'}
          </span>
          <button class="btn-primary btn-start-exam" data-exam-id="${exam.id}">
            Start Assessment →
          </button>
        </div>
      </div>
    </div>
  `).join('');

  const attemptsRows = attempts.map(att => `
    <tr style="border-bottom: 1px solid var(--border);">
      <td style="padding: 0.85rem 1rem; font-weight: 600;">${att.examTitle}</td>
      <td style="padding: 0.85rem 1rem; font-family: var(--font-code); font-size: 0.85rem;">${att.examCode}</td>
      <td style="padding: 0.85rem 1rem; font-weight: 700;">${att.score} / ${att.totalMarks}</td>
      <td style="padding: 0.85rem 1rem;">
        <span style="display: inline-block; padding: 0.2rem 0.6rem; border-radius: var(--radius-sm); font-weight: 700; font-size: 0.76rem; background: ${att.passed ? 'var(--cbt-answered-bg)' : 'var(--cbt-not-answered-bg)'}; color: ${att.passed ? 'var(--cbt-answered)' : 'var(--cbt-not-answered)'};">
          ${att.passed ? 'PASSED' : 'FAILED'} (${att.percentage}%)
        </span>
      </td>
      <td style="padding: 0.85rem 1rem; font-size: 0.82rem; color: var(--text-muted);">${att.date}</td>
      <td style="padding: 0.85rem 1rem; text-align: right;">
        <button class="btn-secondary btn-sm btn-view-certificate" data-attempt-id="${att.id}">
          View Certificate & Breakdown
        </button>
      </td>
    </tr>
  `).join('');

  return `
    <!-- Candidate Info Banner -->
    <div class="panel-card" style="margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; background: var(--bg-surface-subtle);">
      <div style="display: flex; align-items: center; gap: 1rem;">
        <div style="width: 44px; height: 44px; border-radius: var(--radius-sm); background: var(--primary); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.2rem;">
          ${user.name.charAt(0)}
        </div>
        <div>
          <div style="font-weight: 700; font-size: 1.1rem; color: var(--text-main);">${user.name}</div>
          <div style="font-size: 0.82rem; color: var(--text-muted);">
            Roll No: <strong>${user.id}</strong> · ${user.branch} (${user.year})
          </div>
        </div>
      </div>

      <div style="display: flex; gap: 0.6rem;">
        <button class="btn-secondary btn-sm" id="btn-edit-candidate-info">
          Change Candidate Details
        </button>
      </div>
    </div>

    <!-- Active Examinations Catalog -->
    <div style="margin-bottom: 2rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
        <div>
          <h2 style="font-size: 1.25rem; font-weight: 700; color: var(--text-main);">Available Computer Science Assessments</h2>
          <p style="font-size: 0.84rem; color: var(--text-muted);">Department of Computer Science & Engineering · Academic Year 2026</p>
        </div>
        <span style="font-size: 0.85rem; font-weight: 600; color: var(--text-muted);">${exams.length} Modules Active</span>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.25rem;">
        ${examCards}
      </div>
    </div>

    <!-- Completed Assessments History -->
    ${attempts.length > 0 ? `
      <div class="panel-card">
        <div style="margin-bottom: 1rem;">
          <h3 style="font-size: 1.1rem; font-weight: 700;">Completed Assessment History</h3>
          <p style="font-size: 0.82rem; color: var(--text-muted);">Your evaluated scorecards and verified completion certificates</p>
        </div>

        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.88rem;">
            <thead>
              <tr style="border-bottom: 2px solid var(--border); background: var(--bg-surface-subtle); color: var(--text-muted); font-size: 0.78rem; text-transform: uppercase;">
                <th style="padding: 0.75rem 1rem;">Assessment Title</th>
                <th style="padding: 0.75rem 1rem;">Code</th>
                <th style="padding: 0.75rem 1rem;">Score</th>
                <th style="padding: 0.75rem 1rem;">Status</th>
                <th style="padding: 0.75rem 1rem;">Submitted At</th>
                <th style="padding: 0.75rem 1rem; text-align: right;">Action</th>
              </tr>
            </thead>
            <tbody>
              ${attemptsRows}
            </tbody>
          </table>
        </div>
      </div>
    ` : ''}
  `;
}
