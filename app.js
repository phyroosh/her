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
    lives: 2,
    attempts: 0,
    isEvasive: !isMobileMode(), // True on Desktop (hover evasion from start), false on Mobile (2 hearts game)
    yesScale: 1.0,
    soundEnabled: true,
    herName: '',
    yourName: '',
    customMessage: '',
    lastEvadeTime: 0
  };

  // Teasing messages cycling during evasions
  const teasingMessages = [
    "Nice try! You're stuck with me forever! 😜💕",
    "Oops! Too slow, cutie! 🏃‍♀️💨",
    "Resistance is futile, just click YES! 🥰",
    "Look how irresistible that YES button is! 👉👈",
    "You know in your heart you love me! 💖✨",
    "The cat has declared: 'No' is strictly illegal! 🐾",
    "You can run, but you can't escape my cuddles! 😘",
    "Destiny has already chosen YES for you! 🌟",
    "Are you really still trying to click that?! 🥺💖"
  ];

  // --- DOM ELEMENT REFERENCES ---
  const elements = {
    heart1: document.getElementById('heart1'),
    heart2: document.getElementById('heart2'),
    livesCard: document.getElementById('livesCard'),
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
    letterBody: document.getElementById('letterBody'),

    musicBtn: document.getElementById('musicBtn'),
    soundIcon: document.getElementById('soundIcon')
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

  function playTone(freq, type = 'sine', duration = 0.2, gainValue = 0.15) {
    if (!state.soundEnabled) return;
    initAudio();
    if (!audioCtx) return;

    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gain.gain.setValueAtTime(gainValue, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.warn("Audio play issue", e);
    }
  }

  function playPopSound() {
    playTone(520, 'sine', 0.12, 0.12);
  }

  function playHeartBreakSound() {
    if (!state.soundEnabled) return;
    initAudio();
    if (!audioCtx) return;

    try {
      // Descending minor chord
      const notes = [440, 415, 370, 330];
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          playTone(freq, 'triangle', 0.25, 0.1);
        }, idx * 75);
      });
    } catch (e) {}
  }

  function playWhooshSound() {
    if (!state.soundEnabled) return;
    initAudio();
    if (!audioCtx) return;

    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(650, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(220, audioCtx.currentTime + 0.18);

      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.18);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.18);
    } catch (e) {}
  }

  function playCelebrationFanfare() {
    if (!state.soundEnabled) return;
    initAudio();
    if (!audioCtx) return;

    try {
      // Romantic celestial arpeggio (C Major 9 / F Major chords)
      const arpeggio = [
        { f: 523.25, d: 0.18, t: 0 },    // C5
        { f: 659.25, d: 0.18, t: 120 },  // E5
        { f: 783.99, d: 0.22, t: 240 },  // G5
        { f: 987.77, d: 0.26, t: 360 },  // B5
        { f: 1046.50, d: 0.45, t: 480 }, // C6
        { f: 1318.51, d: 0.65, t: 620 }  // E6
      ];

      arpeggio.forEach(note => {
        setTimeout(() => {
          playTone(note.f, 'sine', note.d, 0.18);
        }, note.t);
      });
    } catch (e) {}
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
  // GAME MECHANICS: LIVES (Mobile only) & EVASION (Desktop & post-lives mobile)
  // ============================================================
  function handleNoClick(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    state.attempts++;


    // On Desktop, the hearts game is not used; button only dodges!
    if (!isMobileMode()) {
      evadeButton();
      state.yesScale = Math.min(state.yesScale + 0.1, 2.2);
      updateYesButtonScale();
      const randomIndex = Math.floor(Math.random() * teasingMessages.length);
      elements.reactionSubtitle.textContent = teasingMessages[randomIndex];
      return;
    }

    // On Mobile: 2-Heart Game Mechanic
    if (state.lives === 2) {
      state.lives = 1;
      elements.heart1.classList.remove('alive');
      elements.heart1.classList.add('shattered');
      playHeartBreakSound();
      setCatMood('pleading');

      // Update dialogue & scale Yes
      elements.reactionSubtitle.textContent = "Wait... are you sure?! Please think carefully! 🥺💔";
      state.yesScale = 1.25;
      updateYesButtonScale();

      // Quick playful nudge
      elements.btnNo.style.animation = 'cuteWiggle 0.5s ease';
      setTimeout(() => elements.btnNo.style.animation = '', 500);

    } else if (state.lives === 1) {
      state.lives = 0;
      elements.heart2.classList.remove('alive');
      elements.heart2.classList.add('shattered');
      playHeartBreakSound();
      setCatMood('shocked');

      // Trigger evasive mode on mobile after losing both hearts!
      state.isEvasive = true;
      elements.btnNo.classList.add('evasive');
      elements.reactionSubtitle.textContent = "🚨 System Alert: 'No' revoked! The universe insists on YES! 🙀";
      state.yesScale = 1.5;
      updateYesButtonScale();

      // Instantly dodge away!
      evadeButton();

    } else {
      // Already 0 lives on Mobile - hyper-evasive dodge
      evadeButton();
      state.yesScale = Math.min(state.yesScale + 0.1, 2.2);
      updateYesButtonScale();

      // Pick a random tease
      const randomIndex = Math.floor(Math.random() * teasingMessages.length);
      elements.reactionSubtitle.textContent = teasingMessages[randomIndex];
    }
  }

  function updateYesButtonScale() {
    document.documentElement.style.setProperty('--yes-scale', state.yesScale);
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
  // Smoothly dodges within a small bounded area inside proposalCard
  // ============================================================
  let currentNoX = 0;
  let currentNoY = 0;

  function evadeButton(cursorX, cursorY) {
    const now = Date.now();
    // Throttle to 180ms to let the smooth glide animation play
    if (now - state.lastEvadeTime < 180) return;
    state.lastEvadeTime = now;

    playWhooshSound();

    const btn = elements.btnNo;
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

    // Allowed translation offsets to stay strictly within proposalCard
    const pad = 16;
    const minDx = (cardRect.left + pad) - origLeft;
    const maxDx = (cardRect.right - pad - btnWidth) - origLeft;
    const minDy = (cardRect.top + 130) - origTop; // Keep below cat mascot
    const maxDy = (cardRect.bottom - pad - btnHeight) - origTop;

    if (maxDx <= minDx || maxDy <= minDy) return;

    // Collision check with YES button
    const yesRect = elements.btnYes.getBoundingClientRect();
    const margin = 16;

    function overlapsYes(testDx, testDy) {
      const testLeft = origLeft + testDx;
      const testTop = origTop + testDy;
      return (
        testLeft < yesRect.right + margin &&
        testLeft + btnWidth > yesRect.left - margin &&
        testTop < yesRect.bottom + margin &&
        testTop + btnHeight > yesRect.top - margin
      );
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

    // Moderate step size (75px - 110px) for local, smooth gliding
    const step = 75 + Math.random() * 35;

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
        !overlapsYes(candDx, candDy)
      ) {
        bestX = candDx;
        bestY = candDy;
        break;
      }
    }

    // Fallback: pick any safe spot inside card that maximizes distance from cursor
    if (bestX === null || bestY === null) {
      let maxDist = -1;
      for (let i = 0; i < 30; i++) {
        const randDx = Math.floor(Math.random() * (maxDx - minDx)) + minDx;
        const randDy = Math.floor(Math.random() * (maxDy - minDy)) + minDy;
        if (!overlapsYes(randDx, randDy)) {
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

    // 1. NEVER EVADE IF CURSOR IS NEAR OR HOVERING ON YES BUTTON
    if (isCursorOnYes(e.clientX, e.clientY)) {
      return;
    }

    const btn = elements.btnNo;
    const btnRect = btn.getBoundingClientRect();

    // Trigger only when cursor directly approaches No button (< 40px from edge)
    const dist = distanceToRect(e.clientX, e.clientY, btnRect);

    if (dist < 40) {
      evadeButton(e.clientX, e.clientY);
      // Gentle enlargement of YES button
      state.yesScale = Math.min(state.yesScale + 0.07, 2.2);
      updateYesButtonScale();
      state.attempts++;

      const msg = teasingMessages[Math.floor(Math.random() * teasingMessages.length)];
      elements.reactionSubtitle.textContent = msg;
    }
  });

  // Mobile / Touch handling: dodge instantly on touchstart or pointerdown
  elements.btnNo.addEventListener('touchstart', (e) => {
    if (state.isEvasive) {
      e.preventDefault();
      const touch = e.touches[0];
      evadeButton(touch ? touch.clientX : undefined, touch ? touch.clientY : undefined);
      state.yesScale = Math.min(state.yesScale + 0.1, 2.2);
      updateYesButtonScale();
      state.attempts++;
    } else {
      handleNoClick(e);
    }
  }, { passive: false });

  elements.btnNo.addEventListener('mouseenter', (e) => {
    if (state.isEvasive) {
      if (isCursorOnYes(e.clientX, e.clientY)) return;
      evadeButton(e.clientX, e.clientY);
      state.yesScale = Math.min(state.yesScale + 0.07, 2.2);
      updateYesButtonScale();
      state.attempts++;

      const msg = teasingMessages[Math.floor(Math.random() * teasingMessages.length)];
      elements.reactionSubtitle.textContent = msg;
    }
  });

  elements.btnNo.addEventListener('click', handleNoClick);

  // ============================================================
  // CELEBRATION ON 'YES' CLICK
  // ============================================================
  elements.btnYes.addEventListener('click', () => {
    triggerCelebration();
  });

  function triggerCelebration() {
    playCelebrationFanfare();
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
    playPopSound();
    const isOpened = elements.letterSheet.classList.contains('opened');

    if (isOpened) {
      elements.letterSheet.classList.remove('opened');
      elements.envelopeFlap.classList.remove('opened');
      elements.openLetterBtn.innerHTML = "<span>💌 Click to Open Love Letter</span>";
    } else {
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
    state.lives = 2;
    state.attempts = 0;
    state.isEvasive = false;
    state.yesScale = 1.0;

    elements.heart1.classList.remove('shattered');
    elements.heart1.classList.add('alive');
    elements.heart2.classList.remove('shattered');
    elements.heart2.classList.add('alive');

    elements.btnNo.classList.remove('evasive');
    elements.btnNo.style.transform = '';
    currentNoX = 0;
    currentNoY = 0;

    updateYesButtonScale();

    elements.reactionSubtitle.textContent = "Choose wisely... your heart knows the answer! 💕";

    setCatMood('normal');

    // Close celebration view
    elements.celebrationView.classList.remove('active');
    elements.celebrationView.setAttribute('aria-hidden', 'true');

    // Close letter if open
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
    state.yourName = fromParam || savedFrom || '';
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

    if (state.yourName) {
      elements.letterFrom.textContent = `With all my love forever and ever, ${escapeHtml(state.yourName)} ❤️`;

    } else {
      elements.letterFrom.textContent = `With all my love forever and ever, ❤️`;

    }

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


  // Sound Toggle Control
  elements.musicBtn.addEventListener('click', () => {
    state.soundEnabled = !state.soundEnabled;
    elements.soundIcon.textContent = state.soundEnabled ? '🔊' : '🔇';
    if (state.soundEnabled) {
      playTone(523.25, 'sine', 0.2, 0.15);
    }
  });

  // Initialize custom settings on boot
  loadCustomSettings();

})();
