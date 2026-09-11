/**
 * ExamPulse - Faculty & Examiner Administration Console
 */

import { store } from '../store.js';
import { exportAttemptsToCSV } from '../utils/exportResults.js';
import { showToast } from '../utils/helpers.js';

export function renderAdminPanel() {
  const exams = store.exams;
  const attempts = store.attempts;

  // Build Leaderboard table rows
  const sortedAttempts = [...attempts].sort((a, b) => b.score - a.score);
  const leaderboardRows = sortedAttempts.map((att, rank) => `
    <tr style="border-bottom: 1px solid var(--border);">
      <td style="padding: 0.85rem 1rem; font-weight: 700; color: ${rank === 0 ? '#d97706' : 'var(--text-main)'};">
        #${rank + 1} ${rank === 0 ? '🏆' : ''}
      </td>
      <td style="padding: 0.85rem 1rem;">
        <div style="font-weight: 700;">${att.candidateName}</div>
        <div style="font-size: 0.75rem; color: var(--text-muted); font-family: var(--font-code);">${att.candidateId}</div>
      </td>
      <td style="padding: 0.85rem 1rem;">${att.examCode}: ${att.examTitle}</td>
      <td style="padding: 0.85rem 1rem; font-weight: 800; font-size: 0.95rem;">${att.score} / ${att.totalMarks}</td>
      <td style="padding: 0.85rem 1rem;">
        <span style="font-weight: 700; color: ${att.passed ? 'var(--success)' : 'var(--danger)'};">${att.percentage}%</span>
      </td>
      <td style="padding: 0.85rem 1rem;">
        <span style="display: inline-block; padding: 0.15rem 0.5rem; border-radius: var(--radius-sm); font-size: 0.75rem; font-weight: 700; background: ${att.trustScore >= 80 ? 'var(--cbt-answered-bg)' : 'var(--cbt-not-answered-bg)'}; color: ${att.trustScore >= 80 ? 'var(--cbt-answered)' : 'var(--cbt-not-answered)'};">
          ${att.trustScore}% (${att.violationCount || 0} violations)
        </span>
      </td>
      <td style="padding: 0.85rem 1rem; font-size: 0.8rem; color: var(--text-muted);">${att.date}</td>
    </tr>
  `).join('');

  return `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
      <div>
        <h2 style="font-size: 1.35rem; font-weight: 800; color: var(--text-main);">Faculty & Examination Controller Console</h2>
        <p style="font-size: 0.85rem; color: var(--text-muted);">Manage computer science question banks, configure assessments, and audit proctoring reports</p>
      </div>

      <div style="display: flex; gap: 0.65rem;">
        <button class="btn-secondary" id="btn-export-admin-csv">
          Export Candidate Roster (CSV)
        </button>
        <button class="btn-primary" id="btn-open-create-exam-modal">
          + Create New Assessment
        </button>
      </div>
    </div>

    <!-- Metrics Row -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem; margin-bottom: 1.5rem;">
      <div class="panel-card">
        <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted);">Configured Assessments</div>
        <div style="font-size: 1.8rem; font-weight: 800; color: var(--primary); margin: 0.25rem 0;">${exams.length}</div>
        <div style="font-size: 0.8rem; color: var(--text-muted);">DSA, DBMS, OS & Networks</div>
      </div>

      <div class="panel-card">
        <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted);">Total Submissions</div>
        <div style="font-size: 1.8rem; font-weight: 800; color: var(--success); margin: 0.25rem 0;">${attempts.length}</div>
        <div style="font-size: 0.8rem; color: var(--text-muted);">Evaluated & logged</div>
      </div>

      <div class="panel-card">
        <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted);">Proctoring Trust Average</div>
        <div style="font-size: 1.8rem; font-weight: 800; color: var(--text-main); margin: 0.25rem 0;">
          ${Math.round(attempts.reduce((acc, a) => acc + (a.trustScore || 100), 0) / (attempts.length || 1))}%
        </div>
        <div style="font-size: 0.8rem; color: var(--text-muted);">Integrity compliance</div>
      </div>
    </div>

    <!-- Candidate Leaderboard -->
    <div class="panel-card">
      <div style="margin-bottom: 1.25rem;">
        <h3 style="font-size: 1.1rem; font-weight: 700;">Candidate Performance & Proctoring Audit Trail</h3>
        <p style="font-size: 0.82rem; color: var(--text-muted);">Verified exam submissions with anti-cheat infractions and raw scores</p>
      </div>

      <div style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.88rem;">
          <thead>
            <tr style="border-bottom: 2px solid var(--border); background: var(--bg-surface-subtle); color: var(--text-muted); font-size: 0.78rem; text-transform: uppercase;">
              <th style="padding: 0.75rem 1rem;">Rank</th>
              <th style="padding: 0.75rem 1rem;">Candidate</th>
              <th style="padding: 0.75rem 1rem;">Assessment</th>
              <th style="padding: 0.75rem 1rem;">Score</th>
              <th style="padding: 0.75rem 1rem;">Accuracy</th>
              <th style="padding: 0.75rem 1rem;">Trust Score</th>
              <th style="padding: 0.75rem 1rem;">Date</th>
            </tr>
          </thead>
          <tbody>
            ${leaderboardRows.length ? leaderboardRows : `
              <tr><td colspan="7" style="text-align: center; padding: 2rem; color: var(--text-muted);">No candidate attempts registered yet.</td></tr>
            `}
          </tbody>
        </table>
      </div>
    </div>
  `;
}
