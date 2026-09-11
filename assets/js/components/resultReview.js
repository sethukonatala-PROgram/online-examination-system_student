/**
 * ExamPulse - Assessment Evaluation, Scorecard & Certificate Generator
 */

export function renderResultReview(attempt, exam) {
  const isPassed = attempt.passed;
  const questionsReviewHtml = exam.questions.map((q, idx) => {
    const userAns = attempt.userAnswers ? attempt.userAnswers[idx] : undefined;
    const isCorrect = userAns === q.correctIndex;
    const isSkipped = userAns === undefined || userAns === null;

    let statusBadge = '';
    if (isSkipped) {
      statusBadge = '<span style="color: var(--text-muted); font-weight: 700; font-size: 0.8rem;">SKIPPED (0 Marks)</span>';
    } else if (isCorrect) {
      statusBadge = '<span style="color: var(--success); font-weight: 700; font-size: 0.8rem;">CORRECT (+4.00 Marks)</span>';
    } else {
      statusBadge = '<span style="color: var(--danger); font-weight: 700; font-size: 0.8rem;">INCORRECT (-1.00 Mark)</span>';
    }

    const letters = ['A', 'B', 'C', 'D'];
    const optionsHtml = q.options.map((opt, optIdx) => {
      const isCandidatePick = userAns === optIdx;
      const isActualCorrect = optIdx === q.correctIndex;

      let borderStyle = 'border: 1px solid var(--border);';
      let bgStyle = 'background: var(--bg-surface);';
      let tag = '';

      if (isActualCorrect) {
        borderStyle = 'border: 1.5px solid var(--success);';
        bgStyle = 'background: var(--cbt-answered-bg);';
        tag = '<span style="font-size: 0.72rem; font-weight: 700; color: var(--success); margin-left: auto;">CORRECT KEY</span>';
      } else if (isCandidatePick && !isCorrect) {
        borderStyle = 'border: 1.5px solid var(--danger);';
        bgStyle = 'background: var(--cbt-not-answered-bg);';
        tag = '<span style="font-size: 0.72rem; font-weight: 700; color: var(--danger); margin-left: auto;">YOUR ANSWER</span>';
      }

      return `
        <div style="display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1rem; border-radius: var(--radius-sm); ${borderStyle} ${bgStyle} font-size: 0.9rem;">
          <div style="font-weight: 700; color: var(--text-muted);">${letters[optIdx]}.</div>
          <div style="color: var(--text-main);">${opt}</div>
          ${tag}
        </div>
      `;
    }).join('');

  return `
    <div class="panel-card" style="margin-bottom: 1.25rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
        <span style="font-weight: 700; font-size: 0.95rem;">Question ${idx + 1}</span>
        ${statusBadge}
      </div>

      <div style="font-weight: 600; font-size: 1.05rem; margin-bottom: 1rem; line-height: 1.5;">${q.text}</div>

      <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1.25rem;">
        ${optionsHtml}
      </div>

      <div style="padding: 0.85rem 1rem; background: var(--bg-surface-subtle); border-left: 3px solid var(--primary); border-radius: 0 var(--radius-sm) var(--radius-sm) 0; font-size: 0.86rem; line-height: 1.5;">
        <strong style="color: var(--primary);">Detailed Explanation:</strong>
        <p style="margin-top: 0.35rem; color: var(--text-main);">${q.explanation}</p>
      </div>
    </div>
  `;
  }).join('');

  return `
    <!-- Top Summary Card -->
    <div class="panel-card" style="margin-bottom: 2rem; border-top: 5px solid ${isPassed ? 'var(--success)' : 'var(--danger)'};">
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem;">
        <div>
          <span style="font-size: 0.78rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Official Evaluation Result</span>
          <h2 style="font-size: 1.45rem; font-weight: 800; color: var(--text-main);">${attempt.examTitle}</h2>
          <div style="font-size: 0.85rem; color: var(--text-muted);">
            Candidate: <strong>${attempt.candidateName}</strong> (${attempt.candidateId}) · Evaluated on ${attempt.date}
          </div>
        </div>

        <div style="display: flex; gap: 0.75rem;">
          <button class="btn-primary" id="btn-print-certificate">
            Print Certificate (PDF)
          </button>
          <button class="btn-secondary" id="btn-return-dashboard">
            Return to Assessment Catalog
          </button>
        </div>
      </div>

      <!-- Metrics Row -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; padding: 1.25rem; background: var(--bg-surface-subtle); border-radius: var(--radius-md); border: 1px solid var(--border);">
        <div>
          <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Final Score</div>
          <div style="font-size: 1.6rem; font-weight: 800; color: var(--text-main);">${attempt.score} / ${attempt.totalMarks}</div>
          <div style="font-size: 0.8rem; font-weight: 700; color: ${isPassed ? 'var(--success)' : 'var(--danger)'};">
            ${isPassed ? 'QUALIFIED / PASSED' : 'NEEDS IMPROVEMENT'}
          </div>
        </div>

        <div>
          <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Accuracy</div>
          <div style="font-size: 1.6rem; font-weight: 800; color: var(--primary);">${attempt.percentage}%</div>
          <div style="font-size: 0.78rem; color: var(--text-muted);">Cutoff: 50%</div>
        </div>

        <div>
          <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Responses</div>
          <div style="font-size: 1.1rem; font-weight: 700; margin-top: 0.3rem;">
            <span style="color: var(--success);">${attempt.correctCount} Correct</span> · 
            <span style="color: var(--danger);">${attempt.incorrectCount} Wrong</span>
          </div>
          <div style="font-size: 0.78rem; color: var(--text-muted);">${attempt.unattemptedCount} Skipped</div>
        </div>

        <div>
          <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Proctoring Integrity</div>
          <div style="font-size: 1.6rem; font-weight: 800; color: ${attempt.trustScore >= 80 ? 'var(--success)' : 'var(--warning)'};">${attempt.trustScore}%</div>
          <div style="font-size: 0.78rem; color: var(--text-muted);">${attempt.violationCount} Infractions Logged</div>
        </div>
      </div>
    </div>

    <!-- Printable Certificate Area -->
    <div class="printable-certificate certificate-wrapper">
      <div class="certificate-frame">
        <div class="cert-header">
          <div class="logo-badge">EXAMPULSE ACADEMIC COUNCIL</div>
          <div class="cert-title">CERTIFICATE OF ASSESSMENT</div>
          <div class="cert-subtitle">DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING</div>
        </div>

        <div class="cert-body">
          <div class="cert-presentation">This is to officially certify that</div>
          <div class="cert-candidate-name">${attempt.candidateName}</div>
          <div style="font-family: var(--font-code); font-weight: 600; font-size: 0.9rem; color: #64748b; margin-bottom: 1.25rem;">
            Student Registration ID: ${attempt.candidateId}
          </div>
          <div class="cert-statement">
            has successfully undertaken the computer-based assessment for <strong>${attempt.examTitle}</strong> (${attempt.examCode}) under active browser proctoring and verified examination conditions.
          </div>

          <div class="cert-metrics-row">
            <div class="cert-metric-box">
              <div class="val">${attempt.score} / ${attempt.totalMarks}</div>
              <div class="lbl">Final Score</div>
            </div>
            <div class="cert-metric-box">
              <div class="val">${attempt.percentage}%</div>
              <div class="lbl">Percentile / Marks</div>
            </div>
            <div class="cert-metric-box">
              <div class="val">${attempt.trustScore}%</div>
              <div class="lbl">Integrity Score</div>
            </div>
          </div>
        </div>

        <div class="cert-footer">
          <div class="cert-signature-box">
            <div class="cert-signature-line"></div>
            <div class="cert-signature-title">Controller of Examinations</div>
          </div>

          <div class="cert-seal">
            OFFICIAL<br>VERIFIED
          </div>

          <div class="cert-signature-box">
            <div class="cert-signature-line"></div>
            <div class="cert-signature-title">Head of Department (CSE)</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Question by Question Review -->
    <div style="margin-top: 3rem;">
      <h3 style="font-size: 1.2rem; font-weight: 700; margin-bottom: 1rem;">Comprehensive Question-by-Question Review</h3>
      ${questionsReviewHtml}
    </div>
  `;
}
