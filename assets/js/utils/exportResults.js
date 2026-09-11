/**
 * ExamPulse - Results Exporter (CSV & JSON)
 */

export function exportAttemptsToCSV(attempts, filename = 'exampulse_candidate_results.csv') {
  if (!attempts || !attempts.length) return;

  const headers = [
    'Candidate Name',
    'Candidate ID',
    'Exam Title',
    'Exam Code',
    'Score',
    'Max Marks',
    'Percentage (%)',
    'Status',
    'Correct',
    'Incorrect',
    'Unattempted',
    'Proctoring Trust Score (%)',
    'Violations',
    'Date Submitted'
  ];

  const rows = attempts.map(a => [
    `"${a.candidateName}"`,
    `"${a.candidateId}"`,
    `"${a.examTitle}"`,
    `"${a.examCode}"`,
    a.score,
    a.totalMarks,
    `${a.percentage}%`,
    a.passed ? 'PASSED' : 'FAILED',
    a.correctCount,
    a.incorrectCount,
    a.unattemptedCount,
    `${a.trustScore}%`,
    a.violationCount,
    `"${a.date}"`
  ]);

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
