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
    "Error 404: 'No' button is physically unclickable! 😼",
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
    attemptsCounter: document.getElementById('attemptsCounter'),
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
    customizerBtn: document.getElementById('customizerBtn'),
    customizerModal: document.getElementById('customizerModal'),
    closeModalBtn: document.getElementById('closeModalBtn'),
    saveCustomBtn: document.getElementById('saveCustomBtn'),
    resetDefaultsBtn: document.getElementById('resetDefaultsBtn'),
    inputHerName: document.getElementById('inputHerName'),
    inputYourName: document.getElementById('inputYourName'),
    inputLoveMessage: document.getElementById('inputLoveMessage'),
    copyLinkBtn: document.getElementById('copyLinkBtn'),
    toastMessage: document.getElementById('toastMessage'),
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
    elements.attemptsCounter.textContent = `Attempted escapes: ${state.attempts}`;

    // On Desktop, the hearts game is not used; button only dodges!
    if (!isMobileMode()) {
      evadeButton();
      state.yesScale = Math.min(state.yesScale + 0.16, 3.2);
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
      state.yesScale = 1.6;
      updateYesButtonScale();

      // Instantly dodge away!
      evadeButton();

    } else {
      // Already 0 lives on Mobile - hyper-evasive dodge
      evadeButton();
      state.yesScale = Math.min(state.yesScale + 0.16, 3.2);
      updateYesButtonScale();

      // Pick a random tease
      const randomIndex = Math.floor(Math.random() * teasingMessages.length);
      elements.reactionSubtitle.textContent = teasingMessages[randomIndex];
    }
  }

  function updateYesButtonScale() {
    document.documentElement.style.setProperty('--yes-scale', state.yesScale);
  }

  // ============================================================
  // EVASIVE PHYSICS & DODGING ENGINE
  // Flawless on desktop (mouse proximity) & mobile (touch/pointer)
  // ============================================================
  function evadeButton() {
    const now = Date.now();
    // Throttle to prevent glitching
    if (now - state.lastEvadeTime < 110) return;
    state.lastEvadeTime = now;

    playWhooshSound();

    if (!elements.btnNo.classList.contains('evasive')) {
      elements.btnNo.classList.add('evasive');
    }

    const btn = elements.btnNo;
    const btnRect = btn.getBoundingClientRect();
    const btnWidth = btnRect.width || 120;
    const btnHeight = btnRect.height || 50;

    // Viewport boundaries with safety padding
    const padding = 20;
    const topSafe = 85; // Avoid colliding with top lives bar
    const maxX = window.innerWidth - btnWidth - padding;
    const maxY = window.innerHeight - btnHeight - padding;

    // Compute new position that is substantially different from current position
    let newX, newY;
    let attempts = 0;
    do {
      newX = Math.max(padding, Math.floor(Math.random() * maxX));
      newY = Math.max(topSafe, Math.floor(Math.random() * maxY));
      attempts++;
    } while (
      attempts < 8 &&
      Math.hypot(newX - btnRect.left, newY - btnRect.top) < 140
    );

    btn.style.left = `${newX}px`;
    btn.style.top = `${newY}px`;

    // Spawn cute heart dust at old position
    spawnEvadeDust(btnRect.left + btnWidth / 2, btnRect.top + btnHeight / 2);
  }

  function spawnEvadeDust(x, y) {
    const emojis = ['💖', '✨', '💨', '💕', '🐾'];
    for (let i = 0; i < 3; i++) {
      const dust = document.createElement('div');
      dust.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      dust.style.position = 'fixed';
      dust.style.left = `${x + (Math.random() - 0.5) * 40}px`;
      dust.style.top = `${y + (Math.random() - 0.5) * 40}px`;
      dust.style.pointerEvents = 'none';
      dust.style.fontSize = '1.2rem';
      dust.style.zIndex = '99';
      dust.style.transition = 'all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)';
      document.body.appendChild(dust);

      requestAnimationFrame(() => {
        dust.style.transform = `translate(${(Math.random() - 0.5) * 60}px, -45px) scale(1.3)`;
        dust.style.opacity = '0';
      });

      setTimeout(() => {
        dust.remove();
      }, 650);
    }
  }

  // Proximity detection for Desktop
  document.addEventListener('mousemove', (e) => {
    if (!state.isEvasive) return;

    const btn = elements.btnNo;
    const btnRect = btn.getBoundingClientRect();

    // Center of the No button
    const btnCenterX = btnRect.left + btnRect.width / 2;
    const btnCenterY = btnRect.top + btnRect.height / 2;

    const distance = Math.hypot(e.clientX - btnCenterX, e.clientY - btnCenterY);

    // Evasion trigger radius (85px)
    if (distance < 85) {
      evadeButton();
      // Incremental Yes button enlargement on narrow escape
      state.yesScale = Math.min(state.yesScale + 0.05, 3.2);
      updateYesButtonScale();
      state.attempts++;
      elements.attemptsCounter.textContent = `Attempted escapes: ${state.attempts}`;

      const msg = teasingMessages[Math.floor(Math.random() * teasingMessages.length)];
      elements.reactionSubtitle.textContent = msg;
    }
  });

  // Mobile / Touch handling: dodge instantly on touchstart or pointerdown
  elements.btnNo.addEventListener('touchstart', (e) => {
    if (state.isEvasive) {
      e.preventDefault();
      evadeButton();
      state.yesScale = Math.min(state.yesScale + 0.16, 3.2);
      updateYesButtonScale();
      state.attempts++;
      elements.attemptsCounter.textContent = `Attempted escapes: ${state.attempts}`;
    } else {
      handleNoClick(e);
    }
  }, { passive: false });

  elements.btnNo.addEventListener('mouseenter', () => {
    if (state.isEvasive) {
      evadeButton();
      state.yesScale = Math.min(state.yesScale + 0.12, 3.2);
      updateYesButtonScale();
      state.attempts++;
      elements.attemptsCounter.textContent = `Attempted escapes: ${state.attempts}`;
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
    elements.btnNo.style.position = '';
    elements.btnNo.style.left = '';
    elements.btnNo.style.top = '';

    updateYesButtonScale();
    elements.attemptsCounter.textContent = 'Attempted escapes: 0';
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
      elements.inputHerName.value = state.herName;
    } else {
      elements.questionTitle.innerHTML = `Do You Love Me ? <span class="cat-emoji">😼</span>`;
      elements.letterTo.textContent = `My Dearest Love,`;
      elements.inputHerName.value = '';
    }

    if (state.yourName) {
      elements.letterFrom.textContent = `With all my love forever and ever, ${escapeHtml(state.yourName)} ❤️`;
      elements.inputYourName.value = state.yourName;
    } else {
      elements.letterFrom.textContent = `With all my love forever and ever, ❤️`;
      elements.inputYourName.value = '';
    }

    if (state.customMessage) {
      elements.letterBody.innerHTML = escapeHtml(state.customMessage).replace(/\n/g, '<br>');
      elements.inputLoveMessage.value = state.customMessage;
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

  // Modal Controls
  elements.customizerBtn.addEventListener('click', () => {
    playPopSound();
    elements.customizerModal.classList.add('active');
    elements.customizerModal.setAttribute('aria-hidden', 'false');
  });

  elements.closeModalBtn.addEventListener('click', () => {
    elements.customizerModal.classList.remove('active');
    elements.customizerModal.setAttribute('aria-hidden', 'true');
  });

  elements.saveCustomBtn.addEventListener('click', () => {
    playPopSound();
    state.herName = elements.inputHerName.value.trim();
    state.yourName = elements.inputYourName.value.trim();
    state.customMessage = elements.inputLoveMessage.value.trim();

    localStorage.setItem('proposal_herName', state.herName);
    localStorage.setItem('proposal_yourName', state.yourName);
    localStorage.setItem('proposal_message', state.customMessage);

    // Update URL query parameters for easy sharing
    const url = new URL(window.location);
    if (state.herName) url.searchParams.set('to', state.herName);
    else url.searchParams.delete('to');
    if (state.yourName) url.searchParams.set('from', state.yourName);
    else url.searchParams.delete('from');
    if (state.customMessage) url.searchParams.set('msg', state.customMessage);
    else url.searchParams.delete('msg');

    window.history.replaceState({}, '', url);

    applyCustomSettings();
    elements.customizerModal.classList.remove('active');
    elements.customizerModal.setAttribute('aria-hidden', 'true');
  });

  elements.resetDefaultsBtn.addEventListener('click', () => {
    localStorage.removeItem('proposal_herName');
    localStorage.removeItem('proposal_yourName');
    localStorage.removeItem('proposal_message');
    const url = new URL(window.location.origin + window.location.pathname);
    window.history.replaceState({}, '', url);

    state.herName = '';
    state.yourName = '';
    state.customMessage = '';
    applyCustomSettings();
    elements.customizerModal.classList.remove('active');
    elements.customizerModal.setAttribute('aria-hidden', 'true');
  });

  // Toast Helper
  function showToast(msg) {
    if (!elements.toastMessage) return;
    elements.toastMessage.textContent = msg;
    elements.toastMessage.classList.add('show');
    setTimeout(() => {
      elements.toastMessage.classList.remove('show');
    }, 2500);
  }

  // Copy Link Button
  if (elements.copyLinkBtn) {
    elements.copyLinkBtn.addEventListener('click', () => {
      playPopSound();
      const url = window.location.href;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(() => {
          showToast("💌 Shareable link copied to clipboard!");
        }).catch(() => {
          showToast("💌 Link is ready in your browser bar!");
        });
      } else {
        showToast("💌 Link is ready in your browser bar!");
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
