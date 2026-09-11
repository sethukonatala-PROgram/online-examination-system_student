/**
 * ExamPulse - Anti-Cheat & Auto-Proctoring Engine
 * Monitored browser environment for high-integrity academic examinations.
 */

export class ProctorEngine {
  constructor(options = {}) {
    this.maxStrikes = options.maxStrikes || 3;
    this.strikes = 0;
    this.violations = [];
    this.isActive = false;
    this.onViolation = options.onViolation || (() => {});
    this.onMaxStrikesExceeded = options.onMaxStrikesExceeded || (() => {});
    
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    this.handleWindowBlur = this.handleWindowBlur.bind(this);
    this.handleContextMenu = this.handleContextMenu.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  start() {
    if (this.isActive) return;
    this.isActive = true;
    this.strikes = 0;
    this.violations = [];

    // 1. Tab switch / Window focus loss detection
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
    window.addEventListener('blur', this.handleWindowBlur);

    // 2. Prevent right-click context menu (inspect element)
    document.addEventListener('contextmenu', this.handleContextMenu);

    // 3. Prevent keyboard shortcuts (Ctrl+C, Ctrl+V, Ctrl+U, F12)
    document.addEventListener('keydown', this.handleKeyDown);

    // 4. Request Fullscreen (graceful fallback if user declines)
    this.requestFullScreen();

    this.logEvent("PROCTOR_SESSION_STARTED", "Integrity monitoring active.");
  }

  stop() {
    if (!this.isActive) return;
    this.isActive = false;

    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    window.removeEventListener('blur', this.handleWindowBlur);
    document.removeEventListener('contextmenu', this.handleContextMenu);
    document.removeEventListener('keydown', this.handleKeyDown);

    this.logEvent("PROCTOR_SESSION_ENDED", "Monitoring completed.");
  }

  requestFullScreen() {
    try {
      const docEl = document.documentElement;
      if (docEl.requestFullscreen) {
        docEl.requestFullscreen().catch(() => {});
      }
    } catch (e) {
      // Ignore fullscreen policy rejection if unprompted by gesture
    }
  }

  handleVisibilityChange() {
    if (document.hidden) {
      this.recordViolation("TAB_SWITCH", "Candidate switched away from assessment tab or minimized browser.");
    }
  }

  handleWindowBlur() {
    // Secondary check if user clicked outside the test window
    if (this.isActive && !document.hidden) {
      this.recordViolation("WINDOW_BLUR", "Focus lost to another application window.");
    }
  }

  handleContextMenu(e) {
    e.preventDefault();
    this.recordViolation("CONTEXT_MENU", "Attempted right-click during active exam session.");
    return false;
  }

  handleKeyDown(e) {
    // Block Ctrl+C (copy), Ctrl+V (paste), Ctrl+U (source), F12 (devtools)
    if (
      (e.ctrlKey && ['c', 'v', 'u', 'a', 's'].includes(e.key.toLowerCase())) ||
      e.key === 'F12'
    ) {
      e.preventDefault();
      this.recordViolation("RESTRICTED_KEY", `Blocked shortcut: ${e.ctrlKey ? 'Ctrl+' : ''}${e.key}`);
      return false;
    }
  }

  recordViolation(type, details) {
    if (!this.isActive) return;

    this.strikes++;
    const event = {
      type,
      details,
      timestamp: new Date().toLocaleTimeString(),
      strikeNumber: this.strikes
    };

    this.violations.push(event);
    this.logEvent(type, details);

    // Trigger violation callback
    this.onViolation(event, this.strikes, this.maxStrikes);

    // Check if limit exceeded
    if (this.strikes >= this.maxStrikes) {
      this.stop();
      this.onMaxStrikesExceeded(this.violations);
    }
  }

  logEvent(action, message) {
    console.info(`[ExamPulse Proctor] [${new Date().toLocaleTimeString()}] ${action}: ${message}`);
  }

  getAuditTrail() {
    return {
      strikes: this.strikes,
      maxStrikes: this.maxStrikes,
      violations: this.violations,
      trustScore: Math.max(0, 100 - (this.strikes * 25))
    };
  }
}
