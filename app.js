/* ============================================================
   ROMANTIC PROPOSAL APP - JAVASCRIPT ENGINE
   Features:
   - 2-Heart Life System with dramatic shatter animations
   - Hyper-Evasive 'No' button with cursor proximity & touch dodging
   - Exponentially expanding 'Yes' button
   - Web Audio API Sound Synthesizer (Zero dependencies)
   - Interactive SVG Cat Mascot with dynamic expressions
   - Heart Fireworks & Confetti Celebration Engine
   - 3D Unfolding Love Letter Envelope
   - URL Params & LocalStorage Customization
   ============================================================ */

(function () {
  'use strict';

  function isMobileMode() {
    return window.innerWidth <= 768 || window.matchMedia('(hover: none) and (pointer: coarse)').matches;
  }

  // --- APPLICATION STATE ---
  const state = {
    attempts: 0,
    postLivesTaps: 0,
    isEvasive: true,
    yesScale: 1.0,
    soundEnabled: true,
    herName: '',
    yourName: 'Piyush',
    customMessage: '',
    lastEvadeTime: 0,
    hasLetterMusicPlayed: false
  };

  // Teasing message during evasions
  const teasingMessages = [
    "Oops! Too slow, cutie! 🏃‍♀️💨"
  ];

  // --- DOM ELEMENT REFERENCES ---
  const elements = {
    btnYes: document.getElementById('btnYes'),
    btnNo: document.getElementById('btnNo'),
    buttonsArena: document.getElementById('buttonsArena'),
    yesBtnText: document.getElementById('yesBtnText'),
    noBtnText: document.getElementById('noBtnText'),
    questionTitle: document.getElementById('questionTitle'),
    reactionSubtitle: document.getElementById('reactionSubtitle'),
    proposalCard: document.getElementById('proposalCard'),
    mascotContainer: document.getElementById('mascotContainer'),
    catWrapper: document.getElementById('catWrapper'),
    catEyesNormal: document.getElementById('catEyesNormal'),
    catEyesPleading: document.getElementById('catEyesPleading'),
    catEyesShocked: document.getElementById('catEyesShocked'),
    catEyesLove: document.getElementById('catEyesLove'),
    catMouth: document.getElementById('catMouth'),
    celebrationView: document.getElementById('celebrationView'),
    celebrationCanvas: document.getElementById('celebrationCanvas'),
    ambientCanvas: document.getElementById('ambientCanvas'),
    envelopeContainer: document.getElementById('envelopeContainer'),
    envelopeFlap: document.getElementById('envelopeFlap'),
    letterSheet: document.getElementById('letterSheet'),
    openLetterBtn: document.getElementById('openLetterBtn'),
    letterTo: document.getElementById('letterTo'),
    letterFrom: document.getElementById('letterFrom'),
    letterBody: document.getElementById('letterBody')
  };

  // ============================================================
  // AUDIO SYNTHESIZER (Web Audio API)
  // Generates dreamy chimes, pops, and celebration fanfare without MP3 files
  // ============================================================
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Mouse click sound for 'Yes' button
  const mouseClickAudio = new Audio('assets/mouse_click.mp3');
  mouseClickAudio.preload = 'auto';

  function playMouseClickSound() {
    if (!state.soundEnabled) return;
    try {
      mouseClickAudio.currentTime = 0;
      mouseClickAudio.play().catch(() => {});
    } catch (e) {}
  }

  // ============================================================
  // GENTLE MUSIC FOR LOVE LETTER (Tender Music Box / Celesta Chimes)
  // ============================================================
  let letterMusicTimers = [];

  function stopGentleLetterMusic() {
    letterMusicTimers.forEach(t => clearTimeout(t));
    letterMusicTimers = [];
  }

  function playMusicBoxChime(freq, duration = 1.4) {
    if (!audioCtx) return;
    try {
      const t = audioCtx.currentTime;
      // Fundamental warm sine wave
      const osc1 = audioCtx.createOscillator();
      const gain1 = audioCtx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(freq, t);

      // Delicate celestial harmonic (shimmer)
      const osc2 = audioCtx.createOscillator();
      const gain2 = audioCtx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 2, t);

      gain1.gain.setValueAtTime(0.001, t);
      gain1.gain.linearRampToValueAtTime(0.10, t + 0.02);
      gain1.gain.exponentialRampToValueAtTime(0.0001, t + duration);

      gain2.gain.setValueAtTime(0.001, t);
      gain2.gain.linearRampToValueAtTime(0.035, t + 0.02);
      gain2.gain.exponentialRampToValueAtTime(0.0001, t + duration * 0.7);

      osc1.connect(gain1);
      gain1.connect(audioCtx.destination);
      osc2.connect(gain2);
      gain2.connect(audioCtx.destination);

      osc1.start(t);
      osc1.stop(t + duration);
      osc2.start(t);
      osc2.stop(t + duration);
    } catch (e) {}
  }

  function playGentleLetterMusic() {
    if (!state.soundEnabled) return;
    initAudio();
    if (!audioCtx) return;

    stopGentleLetterMusic();

    // Tender, dreamy music box melody that gently unfolds with the love letter
    const melody = [
      { f: 523.25, time: 0.00, dur: 1.4 }, // C5
      { f: 659.25, time: 0.28, dur: 1.4 }, // E5
      { f: 783.99, time: 0.56, dur: 1.4 }, // G5
      { f: 987.77, time: 0.88, dur: 1.6 }, // B5
      { f: 1046.50, time: 1.25, dur: 1.8 }, // C6
      { f: 880.00, time: 1.65, dur: 1.5 }, // A5
      { f: 783.99, time: 2.05, dur: 1.6 }, // G5
      { f: 659.25, time: 2.50, dur: 1.8 }, // E5
      { f: 587.33, time: 3.00, dur: 2.0 }, // D5
      { f: 523.25, time: 3.50, dur: 2.5 }  // C5 (peaceful resolution)
    ];

    melody.forEach(note => {
      const timer = setTimeout(() => {
        if (!state.soundEnabled || !audioCtx) return;
        playMusicBoxChime(note.f, note.dur);
      }, note.time * 1000);
      letterMusicTimers.push(timer);
    });
  }


  // ============================================================
  // MASCOT EMOTION CONTROLLER
  // ============================================================
  function setCatMood(mood) {
    elements.catEyesNormal.style.display = 'none';
    elements.catEyesPleading.style.display = 'none';
    elements.catEyesShocked.style.display = 'none';
    elements.catEyesLove.style.display = 'none';

    if (mood === 'pleading') {
      elements.catEyesPleading.style.display = 'block';
      elements.catMouth.setAttribute('d', 'M 94,112 Q 100,107 100,109 Q 100,107 106,112'); // slightly sad/pleading
    } else if (mood === 'shocked') {
      elements.catEyesShocked.style.display = 'block';
      elements.catMouth.setAttribute('d', 'M 95,108 A 5,7 0 0,0 105,108 A 5,7 0 0,0 95,108'); // Open mouth O
    } else if (mood === 'love') {
      elements.catEyesLove.style.display = 'block';
      elements.catMouth.setAttribute('d', 'M 92,108 Q 100,118 108,108'); // Big happy smile
    } else {
      // Normal
      elements.catEyesNormal.style.display = 'block';
      elements.catMouth.setAttribute('d', 'M 94,108 Q 100,113 100,111 Q 100,113 106,108');
    }
  }

  // ============================================================
  // GAME MECHANICS: PURE EVASION (Unified Desktop & Mobile)
  // ============================================================
  function handleNoClick(e, touchX, touchY) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // If the button has already surrendered into YES, clicking it triggers celebration!
    if (elements.btnNo.classList.contains('btn-surrender-yes')) {
      playMouseClickSound();
      triggerCelebration();
      return;
    }

    state.attempts++;
    state.postLivesTaps++;

    // Evade to a new position inside the allowed arena
    evadeButton(touchX, touchY);

    // On Desktop only: show tease text in subtitle. On mobile: subtitle is completely hidden!
    if (!isMobileMode() && elements.reactionSubtitle) {
      elements.reactionSubtitle.textContent = teasingMessages[0];
    }

    // Cute progressive cat mood
    if (state.postLivesTaps === 1) {
      setCatMood('pleading');
    } else if (state.postLivesTaps >= 3) {
      setCatMood('shocked');
    }

    const teasingTexts = [
      "No 😿",
      "Can't catch me! 💨",
      "Still trying? 🥺",
      "Too fast! 😜",
      "Just say YES! 🙈"
    ];

    if (state.postLivesTaps < teasingTexts.length) {
      elements.noBtnText.textContent = teasingTexts[state.postLivesTaps];
    } else {
      // Playful surrender: morph into YES!
      elements.noBtnText.textContent = "Okay, YES! 🥰💖";
      elements.btnNo.classList.remove('evasive');
      elements.btnNo.classList.add('btn-surrender-yes');
      const r = elements.btnNo.getBoundingClientRect();
      spawnEvadeDust(r.left + r.width / 2, r.top + r.height / 2);
    }
  }

  function updateYesButtonScale() {
    state.yesScale = 1.0;
    document.documentElement.style.setProperty('--yes-scale', '1');
    if (elements.btnYes) {
      elements.btnYes.style.transform = '';
    }
  }

  // Helper: Detect if cursor is hovering over or approaching the YES button
  function isCursorOnYes(x, y) {
    if (!elements.btnYes) return false;
    const yesRect = elements.btnYes.getBoundingClientRect();
    const buffer = 35; // Generous protection zone around YES button
    return (
      x >= yesRect.left - buffer &&
      x <= yesRect.right + buffer &&
      y >= yesRect.top - buffer &&
      y <= yesRect.bottom + buffer
    );
  }

  // Helper: Calculate distance from point (x, y) to a rectangle's closest edge
  function distanceToRect(x, y, rect) {
    const dx = Math.max(rect.left - x, 0, x - rect.right);
    const dy = Math.max(rect.top - y, 0, y - rect.bottom);
    return Math.hypot(dx, dy);
  }

  // ============================================================
  // EVASIVE PHYSICS & DODGING ENGINE
  // Desktop: wide arena per user specification
  // Mobile: stays contained within proposalCard
  // ============================================================
  let currentNoX = 0;
  let currentNoY = 0;

  function evadeButton(cursorX, cursorY) {
    const now = Date.now();
    // Throttle to 180ms to let the smooth glide animation play
    if (now - state.lastEvadeTime < 180) return;
    state.lastEvadeTime = now;

    const btn = elements.btnNo;
    if (!btn || btn.classList.contains('btn-surrender-yes')) return;

    if (!btn.classList.contains('evasive')) {
      btn.classList.add('evasive');
    }

    const card = elements.proposalCard || document.getElementById('proposalCard');
    const cardRect = card ? card.getBoundingClientRect() : {
      left: 20, right: window.innerWidth - 20, top: 80, bottom: window.innerHeight - 20
    };

    const btnRect = btn.getBoundingClientRect();
    const btnWidth = btnRect.width || 110;
    const btnHeight = btnRect.height || 46;

    // Resting origin of btnNo (where it would be at translate(0, 0))
    const origLeft = btnRect.left - currentNoX;
    const origTop = btnRect.top - currentNoY;

    const mobile = isMobileMode();
    let minAllowedLeft, maxAllowedRight, minAllowedTop, maxAllowedBottom;

    if (mobile) {
      // Mobile mode: keep strictly within proposal card
      const pad = 12;
      minAllowedLeft = cardRect.left + pad;
      maxAllowedRight = cardRect.right - pad;

      const titleRect = elements.questionTitle ? elements.questionTitle.getBoundingClientRect() : null;
      minAllowedTop = titleRect ? (titleRect.bottom + 10) : (cardRect.top + 180);
      maxAllowedBottom = cardRect.bottom - pad;
    } else {
      // Desktop mode: wide arena as marked by user (~8% to ~92% width, ~6% to ~94% height)
      const marginX = Math.max(70, window.innerWidth * 0.08);
      const marginY = Math.max(45, window.innerHeight * 0.06);
      minAllowedLeft = marginX;
      maxAllowedRight = window.innerWidth - marginX;
      minAllowedTop = marginY;
      maxAllowedBottom = window.innerHeight - marginY;
    }

    const minDx = minAllowedLeft - origLeft;
    const maxDx = (maxAllowedRight - btnWidth) - origLeft;
    let minDy = minAllowedTop - origTop;
    let maxDy = (maxAllowedBottom - btnHeight) - origTop;

    if (maxDy < minDy) {
      minDy = Math.min(minDy, maxDy - 8);
    }

    if (maxDx <= minDx) return;

    // Collision check helper
    const yesRect = elements.btnYes ? elements.btnYes.getBoundingClientRect() : null;
    const mascotRect = (!mobile && elements.mascotContainer) ? elements.mascotContainer.getBoundingClientRect() : null;
    const titleRect = (!mobile && elements.questionTitle) ? elements.questionTitle.getBoundingClientRect() : null;
    const subRect = (!mobile && elements.reactionSubtitle) ? elements.reactionSubtitle.getBoundingClientRect() : null;

    function hasCollision(candDx, candDy) {
      const testLeft = origLeft + candDx;
      const testTop = origTop + candDy;
      const testRight = testLeft + btnWidth;
      const testBottom = testTop + btnHeight;

      function collides(rect, margin) {
        if (!rect) return false;
        return (
          testLeft < rect.right + margin &&
          testRight > rect.left - margin &&
          testTop < rect.bottom + margin &&
          testBottom > rect.top - margin
        );
      }

      // Check Yes button collision with generous margin
      if (collides(yesRect, 28)) return true;

      // On desktop, also avoid covering cat mascot, title, or subtitle pill
      if (!mobile) {
        if (collides(mascotRect, 14)) return true;
        if (collides(titleRect, 14)) return true;
        if (collides(subRect, 14)) return true;
      }

      return false;
    }

    // Determine angle away from cursor
    const btnCenterX = btnRect.left + btnWidth / 2;
    const btnCenterY = btnRect.top + btnHeight / 2;

    let baseAngle;
    if (typeof cursorX === 'number' && typeof cursorY === 'number') {
      baseAngle = Math.atan2(btnCenterY - cursorY, btnCenterX - cursorX);
    } else {
      baseAngle = Math.random() * Math.PI * 2;
    }

    // Step size: on mobile keep small (50-80px), on desktop expand for lively wide-area dodging (120-185px)
    const step = mobile ? (55 + Math.random() * 25) : (120 + Math.random() * 65);

    // Test angles away from cursor first
    const angleOffsets = [0, 0.45, -0.45, 0.9, -0.9, 1.4, -1.4, 2.0, -2.0, Math.PI];
    let bestX = null;
    let bestY = null;

    for (const offset of angleOffsets) {
      const angle = baseAngle + offset;
      const candDx = currentNoX + Math.cos(angle) * step;
      const candDy = currentNoY + Math.sin(angle) * step;

      if (
        candDx >= minDx && candDx <= maxDx &&
        candDy >= minDy && candDy <= maxDy &&
        !hasCollision(candDx, candDy)
      ) {
        bestX = candDx;
        bestY = candDy;
        break;
      }
    }

    // Fallback: pick spot in allowed arena maximizing distance from cursor
    if (bestX === null || bestY === null) {
      let maxDist = -1;
      for (let i = 0; i < 50; i++) {
        const randDx = Math.floor(Math.random() * (maxDx - minDx)) + minDx;
        const randDy = Math.floor(Math.random() * (maxDy - minDy)) + minDy;
        if (!hasCollision(randDx, randDy)) {
          const testLeft = origLeft + randDx;
          const testTop = origTop + randDy;
          const d = (typeof cursorX === 'number')
            ? Math.hypot(testLeft + btnWidth / 2 - cursorX, testTop + btnHeight / 2 - cursorY)
            : 100;
          if (d > maxDist) {
            maxDist = d;
            bestX = randDx;
            bestY = randDy;
          }
        }
      }
    }

    // If still null, clamp current position
    if (bestX === null) bestX = Math.max(minDx, Math.min(currentNoX, maxDx));
    if (bestY === null) bestY = Math.max(minDy, Math.min(currentNoY, maxDy));

    bestX = Math.max(minDx, Math.min(bestX, maxDx));
    bestY = Math.max(minDy, Math.min(bestY, maxDy));

    currentNoX = bestX;
    currentNoY = bestY;

    btn.style.transform = `translate(${bestX}px, ${bestY}px)`;

    spawnEvadeDust(btnCenterX, btnCenterY);
  }

  function spawnEvadeDust(x, y) {
    const emojis = ['💖', '✨', '💨', '💕', '🐾'];
    for (let i = 0; i < 2; i++) {
      const dust = document.createElement('div');
      dust.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      dust.style.position = 'fixed';
      dust.style.left = `${x + (Math.random() - 0.5) * 30}px`;
      dust.style.top = `${y + (Math.random() - 0.5) * 30}px`;
      dust.style.pointerEvents = 'none';
      dust.style.fontSize = '1.1rem';
      dust.style.zIndex = '99';
      dust.style.transition = 'all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)';
      document.body.appendChild(dust);

      requestAnimationFrame(() => {
        dust.style.transform = `translate(${(Math.random() - 0.5) * 40}px, -30px) scale(1.2)`;
        dust.style.opacity = '0';
      });

      setTimeout(() => {
        dust.remove();
      }, 550);
    }
  }

  // Proximity detection for Desktop
  document.addEventListener('mousemove', (e) => {
    if (!state.isEvasive) return;
    if (elements.btnNo.classList.contains('btn-surrender-yes')) return;

    // 1. NEVER EVADE IF CURSOR IS NEAR OR HOVERING ON YES BUTTON
    if (isCursorOnYes(e.clientX, e.clientY)) {
      return;
    }

    const btn = elements.btnNo;
    const btnRect = btn.getBoundingClientRect();

    // Trigger only when cursor directly approaches No button (< 45px from edge)
    const dist = distanceToRect(e.clientX, e.clientY, btnRect);

    if (dist < 45) {
      evadeButton(e.clientX, e.clientY);
      state.attempts++;
      if (!isMobileMode() && elements.reactionSubtitle) {
        elements.reactionSubtitle.textContent = teasingMessages[0];
      }
    }
  });

  // Mobile / Touch handling: clean unified touch handler with duplicate click debounce
  let lastTouchTime = 0;

  elements.btnNo.addEventListener('touchstart', (e) => {
    e.preventDefault();
    lastTouchTime = Date.now();
    const touch = e.touches && e.touches[0];
    handleNoClick(e, touch ? touch.clientX : undefined, touch ? touch.clientY : undefined);
  }, { passive: false });

  elements.btnNo.addEventListener('mouseenter', (e) => {
    if (state.isEvasive) {
      if (elements.btnNo.classList.contains('btn-surrender-yes')) return;
      if (isCursorOnYes(e.clientX, e.clientY)) return;
      evadeButton(e.clientX, e.clientY);
      state.attempts++;
      if (!isMobileMode() && elements.reactionSubtitle) {
        elements.reactionSubtitle.textContent = teasingMessages[0];
      }
    }
  });

  elements.btnNo.addEventListener('click', (e) => {
    // Prevent synthetic duplicate click on touch devices
    if (Date.now() - lastTouchTime < 450) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      return;
    }
    handleNoClick(e);
  });

  // ============================================================
  // CELEBRATION ON 'YES' CLICK
  // ============================================================
  elements.btnYes.addEventListener('click', () => {
    playMouseClickSound();
    triggerCelebration();
  });

  function triggerCelebration() {
    setCatMood('love');

    // Show celebration modal
    elements.celebrationView.classList.add('active');
    elements.celebrationView.setAttribute('aria-hidden', 'false');

    // Start celebration canvas confetti & fireworks
    startCelebrationFX();
  }

  // ============================================================
  // INTERACTIVE LOVE LETTER ENVELOPE
  // ============================================================
  function toggleLoveLetter() {
    const isOpened = elements.letterSheet.classList.contains('opened');

    if (isOpened) {
      stopGentleLetterMusic();
      elements.letterSheet.classList.remove('opened');
      elements.envelopeFlap.classList.remove('opened');
      elements.openLetterBtn.innerHTML = "<span>💌 Click to Open Love Letter</span>";
    } else {
      // Play gentle music ONLY for the first time she opens the letter
      if (!state.hasLetterMusicPlayed) {
        state.hasLetterMusicPlayed = true;
        playGentleLetterMusic();
      }
      elements.envelopeFlap.classList.add('opened');
      setTimeout(() => {
        elements.letterSheet.classList.add('opened');
      }, 250);
      elements.openLetterBtn.innerHTML = "<span>💌 Close Love Letter</span>";
    }
  }

  elements.envelopeContainer.addEventListener('click', toggleLoveLetter);
  elements.openLetterBtn.addEventListener('click', toggleLoveLetter);

  // Replay Game (helper retained for external resets)
  function resetGame() {
    state.attempts = 0;
    state.postLivesTaps = 0;
    state.isEvasive = true;
    state.yesScale = 1.0;
    state.hasLetterMusicPlayed = false;

    elements.noBtnText.textContent = "No 😿";
    elements.btnNo.classList.remove('evasive');
    elements.btnNo.classList.remove('btn-surrender-yes');
    elements.btnNo.style.transform = '';
    currentNoX = 0;
    currentNoY = 0;

    updateYesButtonScale();

    if (!isMobileMode() && elements.reactionSubtitle) {
      elements.reactionSubtitle.textContent = "Choose wisely... your heart knows the answer! 💕";
    }

    setCatMood('normal');

    // Close celebration view
    elements.celebrationView.classList.remove('active');
    elements.celebrationView.setAttribute('aria-hidden', 'true');

    // Close letter if open
    stopGentleLetterMusic();
    elements.letterSheet.classList.remove('opened');
    elements.envelopeFlap.classList.remove('opened');
    elements.openLetterBtn.innerHTML = "<span>💌 Click to Open Love Letter</span>";
  }

  // ============================================================
  // CELEBRATION FIREWORKS & CONFETTI CANVAS ENGINE
  // ============================================================
  let fxAnimationId = null;
  const particles = [];
  const fxCanvas = elements.celebrationCanvas;
  const fxCtx = fxCanvas.getContext('2d');

  function resizeFxCanvas() {
    fxCanvas.width = window.innerWidth * window.devicePixelRatio;
    fxCanvas.height = window.innerHeight * window.devicePixelRatio;
    fxCtx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  window.addEventListener('resize', resizeFxCanvas);

  const colors = ['#ff3366', '#ff758c', '#ff8da1', '#ffd166', '#06d6a0', '#118ab2', '#ffbe0b', '#fb5607', '#ff006e', '#8338ec', '#3a86ff'];

  class Particle {
    constructor(x, y, isHeart = false) {
      this.x = x;
      this.y = y;
      this.isHeart = isHeart;
      this.size = isHeart ? Math.random() * 16 + 14 : Math.random() * 8 + 6;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 9 + 4;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed - 3;
      
      this.gravity = 0.18;
      this.friction = 0.96;
      this.alpha = 1;
      this.decay = Math.random() * 0.012 + 0.008;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.2;
    }

    update() {
      this.vx *= this.friction;
      this.vy = (this.vy * this.friction) + this.gravity;
      this.x += this.vx;
      this.y += this.vy;
      this.rotation += this.rotationSpeed;
      this.alpha -= this.decay;
    }

    draw(ctx) {
      if (this.alpha <= 0) return;
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);

      if (this.isHeart) {
        // Draw heart shape
        ctx.fillStyle = this.color;
        ctx.beginPath();
        const d = this.size;
        ctx.moveTo(0, d / 4);
        ctx.quadraticCurveTo(0, 0, d / 4, 0);
        ctx.quadraticCurveTo(d / 2, 0, d / 2, d / 4);
        ctx.quadraticCurveTo(d / 2, 0, (3 * d) / 4, 0);
        ctx.quadraticCurveTo(d, 0, d, d / 4);
        ctx.quadraticCurveTo(d, d / 2, (3 * d) / 4, (3 * d) / 4);
        ctx.lineTo(d / 2, d);
        ctx.lineTo(d / 4, (3 * d) / 4);
        ctx.quadraticCurveTo(0, d / 2, 0, d / 4);
        ctx.fill();
      } else {
        // Confetti rect
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.6);
      }

      ctx.restore();
    }
  }

  function launchExplosion(x, y, count = 45) {
    for (let i = 0; i < count; i++) {
      particles.push(new Particle(x, y, Math.random() > 0.45));
    }
  }

  function startCelebrationFX() {
    resizeFxCanvas();
    particles.length = 0;

    // Launch multiple bursts
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight * 0.45;

    launchExplosion(centerX, centerY, 70);
    launchExplosion(centerX - 160, centerY + 80, 50);
    launchExplosion(centerX + 160, centerY + 80, 50);

    // Continuous soft fireworks bursts
    const intervalId = setInterval(() => {
      if (!elements.celebrationView.classList.contains('active')) {
        clearInterval(intervalId);
        return;
      }
      const rx = Math.random() * window.innerWidth * 0.8 + window.innerWidth * 0.1;
      const ry = Math.random() * window.innerHeight * 0.5 + 50;
      launchExplosion(rx, ry, 35);
    }, 900);

    if (fxAnimationId) cancelAnimationFrame(fxAnimationId);

    function loop() {
      fxCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw(fxCtx);
        if (p.alpha <= 0) {
          particles.splice(i, 1);
        }
      }

      if (elements.celebrationView.classList.contains('active') || particles.length > 0) {
        fxAnimationId = requestAnimationFrame(loop);
      }
    }

    loop();
  }

  // ============================================================
  // AMBIENT BACKGROUND FLOATING HEARTS & PARTICLES
  // ============================================================
  const ambCanvas = elements.ambientCanvas;
  const ambCtx = ambCanvas.getContext('2d');
  const ambientHearts = [];

  function resizeAmbCanvas() {
    ambCanvas.width = window.innerWidth * window.devicePixelRatio;
    ambCanvas.height = window.innerHeight * window.devicePixelRatio;
    ambCtx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  window.addEventListener('resize', resizeAmbCanvas);

  class AmbientParticle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * window.innerWidth;
      this.y = initial ? Math.random() * window.innerHeight : window.innerHeight + 20;
      this.size = Math.random() * 14 + 10;
      this.speed = Math.random() * 0.8 + 0.35;
      this.sway = Math.random() * 0.02 + 0.01;
      this.swayOffset = Math.random() * Math.PI * 2;
      this.alpha = Math.random() * 0.35 + 0.15;
      this.emoji = Math.random() > 0.4 ? '💖' : (Math.random() > 0.5 ? '✨' : '🌸');
    }

    update() {
      this.y -= this.speed;
      this.swayOffset += this.sway;
      this.x += Math.sin(this.swayOffset) * 0.6;

      if (this.y < -30) {
        this.reset();
      }
    }

    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.font = `${this.size}px serif`;
      ctx.fillText(this.emoji, this.x, this.y);
      ctx.restore();
    }
  }

  function initAmbient() {
    resizeAmbCanvas();
    const count = Math.min(24, Math.floor(window.innerWidth / 35));
    for (let i = 0; i < count; i++) {
      ambientHearts.push(new AmbientParticle());
    }

    function ambLoop() {
      ambCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (const p of ambientHearts) {
        p.update();
        p.draw(ambCtx);
      }
      requestAnimationFrame(ambLoop);
    }

    ambLoop();
  }

  initAmbient();

  // ============================================================
  // CUSTOMIZATION & URL PARAMETER MANAGER
  // ============================================================
  function loadCustomSettings() {
    const urlParams = new URLSearchParams(window.location.search);
    const toParam = urlParams.get('to');
    const fromParam = urlParams.get('from');
    const msgParam = urlParams.get('msg');

    const savedTo = localStorage.getItem('proposal_herName');
    const savedFrom = localStorage.getItem('proposal_yourName');
    const savedMsg = localStorage.getItem('proposal_message');

    state.herName = toParam || savedTo || '';
    state.yourName = fromParam || savedFrom || 'Piyush';
    state.customMessage = msgParam || savedMsg || '';

    applyCustomSettings();
  }

  function applyCustomSettings() {
    if (state.herName) {
      elements.questionTitle.innerHTML = `Do You Love Me, ${escapeHtml(state.herName)} ? <span class="cat-emoji">😼</span>`;
      elements.letterTo.textContent = `My Dearest ${escapeHtml(state.herName)},`;

    } else {
      elements.questionTitle.innerHTML = `Do You Love Me ? <span class="cat-emoji">😼</span>`;
      elements.letterTo.textContent = `My Dearest Love,`;

    }

    const sender = state.yourName ? escapeHtml(state.yourName) : 'Piyush';
    elements.letterFrom.innerHTML = `With all my love,<br><span class="signature-name">~ ${sender} ❤️</span>`;

    if (state.customMessage) {
      elements.letterBody.innerHTML = escapeHtml(state.customMessage).replace(/\n/g, '<br>');

    }
  }

  function escapeHtml(text) {
    if (!text) return '';
    return text.replace(/[&<>"']/g, function (m) {
      switch (m) {
        case '&': return '&amp;';
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '"': return '&quot;';
        case "'": return '&#39;';
        default: return m;
      }
    });
  }



  // Initialize scale and custom settings on boot
  updateYesButtonScale();
  loadCustomSettings();

  window.addEventListener('resize', () => {
    updateYesButtonScale();
  });

  // URL automation helper for testing/previewing states
  function checkAutoSteps() {
    const urlParams = new URLSearchParams(window.location.search);
    const steps = parseInt(urlParams.get('autoSteps') || '0', 10);
    if (steps > 0) {
      setTimeout(async () => {
        for (let i = 0; i < steps; i++) {
          handleNoClick();
          await new Promise(r => setTimeout(r, 120));
        }
      }, 300);
    }

    const openLetter = urlParams.get('openLetter');
    if (openLetter) {
      setTimeout(() => {
        triggerCelebration();
        setTimeout(() => {
          toggleLoveLetter();
        }, 350);
      }, 300);
    }
  }

  checkAutoSteps();

})();
