/**
 * ExamPulse - Computer-Based Testing (CBT) Assessment Environment
 */

import { formatTime } from '../utils/helpers.js';

export function renderExamRoom(exam, state) {
  const currentIdx = state.currentQuestionIndex;
  const q = exam.questions[currentIdx];
  const selectedOption = state.answers[currentIdx];
  const marksPerQ = (exam.totalMarks / exam.questions.length).toFixed(1);
  const negMarks = exam.negativeMarking ? (exam.negativeValue * marksPerQ).toFixed(2) : '0';

  // Calculate palette status summary counts
  let countAnswered = 0;
  let countNotAnswered = 0;
  let countMarked = 0;
  let countUnvisited = 0;

  exam.questions.forEach((_, i) => {
    const isAns = state.answers[i] !== undefined && state.answers[i] !== null;
    const isMarked = state.markedForReview.has(i);
    const isVisited = state.visited.has(i);

    if (isMarked) countMarked++;
    else if (isAns) countAnswered++;
    else if (isVisited) countNotAnswered++;
    else countUnvisited++;
  });

  // Render question palette grid
  const paletteBoxes = exam.questions.map((_, i) => {
    const isCurrent = i === currentIdx;
    const isAns = state.answers[i] !== undefined && state.answers[i] !== null;
    const isMarked = state.markedForReview.has(i);
    const isVisited = state.visited.has(i);

    let statusClass = '';
    if (isMarked) statusClass = 'q-marked';
    else if (isAns) statusClass = 'q-answered';
    else if (isVisited) statusClass = 'q-not-answered';

    return `
      <div class="q-box ${statusClass} ${isCurrent ? 'current' : ''}" data-index="${i}">
        ${i + 1}
      </div>
    `;
  }).join('');

  // Options HTML
  const letters = ['A', 'B', 'C', 'D'];
  const optionsHtml = q.options.map((opt, optIdx) => {
    const isSelected = selectedOption === optIdx;
    return `
      <label class="option-item ${isSelected ? 'selected' : ''}" data-option-index="${optIdx}">
        <input type="radio" name="exam_option" class="option-radio" value="${optIdx}" ${isSelected ? 'checked' : ''}>
        <div class="option-letter">${letters[optIdx]}</div>
        <div class="option-text">${opt}</div>
      </label>
    `;
  }).join('');

  return `
    <div class="exam-layout">
      <!-- Main Question Pane -->
      <div class="question-pane">
        <div class="question-header">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <span class="q-badge">Question ${currentIdx + 1} of ${exam.questions.length}</span>
            <span style="font-size: 0.78rem; color: var(--text-muted); font-weight: 600;">Single Choice MCQ</span>
          </div>
          <div style="display: flex; gap: 0.5rem;">
            <span class="q-marks-pill" style="color: var(--success);">+${marksPerQ} Marks</span>
            ${exam.negativeMarking ? `<span class="q-marks-pill" style="color: var(--danger);">-${negMarks} Marks</span>` : ''}
          </div>
        </div>

        <div class="question-content">
          <div class="question-text">${q.text}</div>

          ${q.codeSnippet ? `
            <pre class="code-block"><code>${escapeHtml(q.codeSnippet)}</code></pre>
          ` : ''}

          <div class="options-list">
            ${optionsHtml}
          </div>
        </div>

        <div class="question-footer">
          <div style="display: flex; gap: 0.6rem;">
            <button class="btn-secondary" id="btn-q-clear" ${selectedOption === undefined ? 'disabled' : ''}>
              Clear Response
            </button>
            <button class="btn-marked" id="btn-q-mark">
              ${state.markedForReview.has(currentIdx) ? 'Unmark Review' : 'Mark for Review & Next'}
            </button>
          </div>

          <div style="display: flex; gap: 0.6rem;">
            <button class="btn-secondary" id="btn-q-prev" ${currentIdx === 0 ? 'disabled' : ''}>
              ← Previous
            </button>
            <button class="btn-primary" id="btn-q-next">
              ${currentIdx === exam.questions.length - 1 ? 'Save & Review' : 'Save & Next →'}
            </button>
          </div>
        </div>
      </div>

      <!-- Right Palette Sidebar -->
      <aside class="palette-pane">
        <div class="palette-header">
          Question Palette
        </div>

        <!-- CBT Status Legend -->
        <div class="palette-legend">
          <div class="legend-item">
            <span class="legend-badge badge-answered">${countAnswered}</span>
            <span>Answered</span>
          </div>
          <div class="legend-item">
            <span class="legend-badge badge-not-answered">${countNotAnswered}</span>
            <span>Not Answered</span>
          </div>
          <div class="legend-item">
            <span class="legend-badge badge-marked">${countMarked}</span>
            <span>Marked for Review</span>
          </div>
          <div class="legend-item">
            <span class="legend-badge badge-unvisited">${countUnvisited}</span>
            <span>Not Visited</span>
          </div>
        </div>

        <!-- Question Grid -->
        <div class="palette-grid">
          ${paletteBoxes}
        </div>

        <!-- Palette Submission Trigger -->
        <div class="palette-footer">
          <button class="btn-success" id="btn-open-submit-modal" style="width: 100%; justify-content: center; padding: 0.75rem;">
            Submit Assessment
          </button>
        </div>
      </aside>
    </div>
  `;
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
