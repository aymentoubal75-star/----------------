// من الفكرة إلى الأثر — محرك العرض التقديمي التفاعلي ثلاثي الأبعاد (3D Engine)
document.addEventListener('DOMContentLoaded', () => {
  const slides = Array.from(document.querySelectorAll('.slide'));
  const totalSlides = slides.length;
  let currentIndex = 0;

  // DOM Elements
  const slideDeck = document.getElementById('slideDeck');
  const currentSlideNumEl = document.getElementById('currentSlideNum');
  const totalSlideNumEl = document.getElementById('totalSlideNum');
  const progressBar = document.getElementById('progressBar');
  const btnPrev = document.getElementById('btnPrev');
  const btnNext = document.getElementById('btnNext');
  const btnFullscreen = document.getElementById('btnFullscreen');
  const btnTheme = document.getElementById('btnTheme');
  const btnPrint = document.getElementById('btnPrint');
  const btnOverview = document.getElementById('btnOverview');
  const overviewModal = document.getElementById('overviewModal');
  const btnCloseOverview = document.getElementById('btnCloseOverview');
  const overviewGrid = document.getElementById('overviewGrid');

  // Format 2-digit number (e.g., 01, 09, 12)
  const padZero = (n) => (n < 10 ? `0${n}` : `${n}`);

  if (totalSlideNumEl) {
    totalSlideNumEl.textContent = padZero(totalSlides);
  }

  // Go to slide with 3D Carousel Transition
  function goToSlide(index) {
    if (index < 0 || index >= totalSlides) return;

    slides.forEach((slide, i) => {
      slide.classList.remove('active', 'prev');
      if (i === index) {
        slide.classList.add('active');
      } else if (i < index) {
        slide.classList.add('prev');
      }
    });

    currentIndex = index;

    // Update Counter & Progress
    if (currentSlideNumEl) {
      currentSlideNumEl.textContent = padZero(currentIndex + 1);
    }

    if (progressBar) {
      const percentage = ((currentIndex + 1) / totalSlides) * 100;
      progressBar.style.width = `${percentage}%`;
    }

    // Enable / Disable buttons
    if (btnPrev) btnPrev.disabled = currentIndex === 0;
    if (btnNext) btnNext.disabled = currentIndex === totalSlides - 1;

    // Update Overview highlighted item if open
    updateOverviewHighlight();
  }

  function nextSlide() {
    if (currentIndex < totalSlides - 1) {
      goToSlide(currentIndex + 1);
    }
  }

  function prevSlide() {
    if (currentIndex > 0) {
      goToSlide(currentIndex - 1);
    }
  }

  // Button Listeners
  if (btnNext) btnNext.addEventListener('click', nextSlide);
  if (btnPrev) btnPrev.addEventListener('click', prevSlide);

  // Keyboard Navigation
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (overviewModal && overviewModal.classList.contains('open')) {
        closeOverview();
        return;
      }
    }

    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    switch (e.key) {
      case 'ArrowLeft': // Next slide in RTL flow
      case 'PageDown':
      case ' ': // Space
      case 'Enter':
        e.preventDefault();
        nextSlide();
        break;

      case 'ArrowRight': // Prev slide in RTL flow
      case 'PageUp':
      case 'Backspace':
        e.preventDefault();
        prevSlide();
        break;

      case 'Home':
        e.preventDefault();
        goToSlide(0);
        break;

      case 'End':
        e.preventDefault();
        goToSlide(totalSlides - 1);
        break;

      case 'f':
      case 'F':
        toggleFullscreen();
        break;

      case 'o':
      case 'O':
        toggleOverview();
        break;
    }
  });

  // Touch Swipe Support for Tablets / Mobiles
  let touchStartX = 0;
  let touchEndX = 0;

  document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 50) {
      if (diff < 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  }



  // Fullscreen Toggle
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.warn(`Fullscreen error: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  if (btnFullscreen) btnFullscreen.addEventListener('click', toggleFullscreen);

  // Theme Toggle (Light default / Dark toggle)
  if (btnTheme) {
    btnTheme.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
    });
  }

  // Print / Export to PDF
  if (btnPrint) {
    btnPrint.addEventListener('click', () => {
      window.print();
    });
  }

  // Overview Modal
  function populateOverview() {
    if (!overviewGrid) return;
    overviewGrid.innerHTML = '';

    slides.forEach((slide, idx) => {
      const title = slide.getAttribute('data-title') || `الشريحة ${idx + 1}`;
      const thumb = document.createElement('div');
      thumb.className = `overview-thumb ${idx === currentIndex ? 'current' : ''}`;
      thumb.innerHTML = `
        <span class="overview-num">SLIDE ${padZero(idx + 1)}</span>
        <span class="overview-title">${title}</span>
      `;
      thumb.addEventListener('click', () => {
        goToSlide(idx);
        closeOverview();
      });
      overviewGrid.appendChild(thumb);
    });
  }

  function updateOverviewHighlight() {
    if (!overviewGrid) return;
    const thumbs = overviewGrid.querySelectorAll('.overview-thumb');
    thumbs.forEach((th, i) => {
      if (i === currentIndex) {
        th.classList.add('current');
      } else {
        th.classList.remove('current');
      }
    });
  }

  function openOverview() {
    populateOverview();
    if (overviewModal) overviewModal.classList.add('open');
  }

  function closeOverview() {
    if (overviewModal) overviewModal.classList.remove('open');
  }

  function toggleOverview() {
    if (overviewModal && overviewModal.classList.contains('open')) {
      closeOverview();
    } else {
      openOverview();
    }
  }

  if (btnOverview) btnOverview.addEventListener('click', toggleOverview);
  if (btnCloseOverview) btnCloseOverview.addEventListener('click', closeOverview);
  if (overviewModal) {
    overviewModal.addEventListener('click', (e) => {
      if (e.target === overviewModal) closeOverview();
    });
  }

  // Initialize Canvas 3D Ambient Motion
  init3DBackground();

  // Initial call
  goToSlide(0);
});

// ==========================================
// 3-Minute Discussion Hold & 3D Answer Reveal
// ==========================================
const holdTimers = {};

function toggleHoldTimer(slideIndex, initialSeconds = 180) {
  const countEl = document.getElementById(`holdCount${slideIndex}`);
  const progressEl = document.getElementById(`holdProgress${slideIndex}`);
  const btnStart = document.getElementById(`btnHoldStart${slideIndex}`);
  if (!countEl) return;

  // Pause if currently running
  if (holdTimers[slideIndex] && holdTimers[slideIndex].interval) {
    clearInterval(holdTimers[slideIndex].interval);
    holdTimers[slideIndex].interval = null;
    countEl.classList.remove('timer-running');
    if (btnStart) {
      btnStart.innerHTML = '<span>▶</span> <span>استئناف الوقت</span>';
      btnStart.style.background = 'var(--accent-gold)';
    }
    return;
  }

  // Resume or start fresh (fix: if remaining <= 0, restart from initialSeconds)
  let remaining = (holdTimers[slideIndex] && holdTimers[slideIndex].remaining > 0)
    ? holdTimers[slideIndex].remaining
    : initialSeconds;

  countEl.classList.add('timer-running');
  if (btnStart) {
    btnStart.innerHTML = '<span>⏸</span> <span>إيقاف مؤقت</span>';
    btnStart.style.background = 'rgba(239, 68, 68, 0.85)';
  }

  const interval = setInterval(() => {
    remaining--;
    if (!holdTimers[slideIndex]) holdTimers[slideIndex] = {};
    holdTimers[slideIndex].remaining = remaining;

    const m = Math.floor(remaining / 60);
    const s = remaining % 60;
    countEl.textContent = `${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;

    if (progressEl) {
      const percentage = ((initialSeconds - remaining) / initialSeconds) * 100;
      progressEl.style.width = `${Math.min(100, Math.max(0, percentage))}%`;
    }

    if (remaining <= 0) {
      clearInterval(interval);
      holdTimers[slideIndex].interval = null;
      holdTimers[slideIndex].remaining = 0;
      countEl.classList.remove('timer-running');
      if (btnStart) {
        btnStart.innerHTML = '<span>🔄</span> <span>إعادة البدء</span>';
        btnStart.style.background = 'var(--dz-green)';
      }
      revealAnswer(slideIndex);
    }
  }, 1000);

  holdTimers[slideIndex] = {
    interval,
    remaining,
    total: initialSeconds
  };
}

function resetHoldTimer(slideIndex, initialSeconds = 180) {
  const countEl = document.getElementById(`holdCount${slideIndex}`);
  const progressEl = document.getElementById(`holdProgress${slideIndex}`);
  const btnStart = document.getElementById(`btnHoldStart${slideIndex}`);
  const holdCard = document.getElementById(`answerHold${slideIndex}`);
  const answerBox = document.getElementById(`answerBox${slideIndex}`);

  if (holdTimers[slideIndex] && holdTimers[slideIndex].interval) {
    clearInterval(holdTimers[slideIndex].interval);
  }

  holdTimers[slideIndex] = {
    interval: null,
    remaining: initialSeconds,
    total: initialSeconds
  };

  if (countEl) {
    countEl.classList.remove('timer-running');
    const m = Math.floor(initialSeconds / 60);
    const s = initialSeconds % 60;
    countEl.textContent = `${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
  }

  if (progressEl) {
    progressEl.style.width = '0%';
  }

  if (btnStart) {
    btnStart.innerHTML = '<span>▶</span> <span>بدء المؤقت</span>';
    btnStart.style.background = '';
  }

  if (holdCard) {
    holdCard.classList.remove('dismissed');
  }

  if (answerBox) {
    answerBox.classList.remove('revealed');
  }
}

function revealAnswer(slideIndex) {
  const holdCard = document.getElementById(`answerHold${slideIndex}`);
  const answerBox = document.getElementById(`answerBox${slideIndex}`);

  // Clear running timer if any
  if (holdTimers[slideIndex] && holdTimers[slideIndex].interval) {
    clearInterval(holdTimers[slideIndex].interval);
    holdTimers[slideIndex].interval = null;
  }

  if (holdCard) {
    holdCard.classList.add('dismissed');
  }

  if (answerBox) {
    setTimeout(() => {
      answerBox.classList.add('revealed');
      playTimerChime();
    }, 180);
  }
}

// ==========================================
// Interactive Audio-Chime Activity Timers
// ==========================================
const activeTimers = {};

function formatSeconds(secs) {
  const total = Math.max(0, secs);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
}

function playTimerChime() {
  try {
    const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtxClass) return;
    const audioCtx = new AudioCtxClass();
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    const now = audioCtx.currentTime;

    // Harmonic bell chime tone 1
    const osc1 = audioCtx.createOscillator();
    const gain1 = audioCtx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now); // D5
    gain1.gain.setValueAtTime(0.35, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
    osc1.connect(gain1);
    gain1.connect(audioCtx.destination);
    osc1.start(now);
    osc1.stop(now + 1.2);

    // Harmonic bell chime tone 2
    const osc2 = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, now + 0.2); // A5
    gain2.gain.setValueAtTime(0.35, now + 0.2);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.8);
    osc2.connect(gain2);
    gain2.connect(audioCtx.destination);
    osc2.start(now + 0.2);
    osc2.stop(now + 1.8);
  } catch (e) {
    console.log('AudioContext chime notice', e);
  }
}

function startActivityTimer(initialSeconds, elementId, btnTrigger) {
  const display = document.getElementById(elementId);
  if (!display) return;

  const container = display.closest('.timer-widget');
  const btnStart = btnTrigger || (container ? container.querySelector('.btn-timer:not(.reset)') : null);

  // If already running -> PAUSE
  if (activeTimers[elementId] && activeTimers[elementId].interval) {
    clearInterval(activeTimers[elementId].interval);
    activeTimers[elementId].interval = null;
    display.classList.remove('timer-running');
    display.style.opacity = '0.7';
    if (btnStart) {
      btnStart.innerHTML = '▶ استئناف';
      btnStart.classList.remove('running');
      btnStart.classList.add('paused');
    }
    return;
  }

  // Resume or start fresh
  display.style.opacity = '1';
  display.style.color = '';
  display.classList.add('timer-running');

  // If remaining is finished or uninitialized, start from initialSeconds
  let remaining = (activeTimers[elementId] && activeTimers[elementId].remaining > 0)
    ? activeTimers[elementId].remaining
    : initialSeconds;

  display.textContent = formatSeconds(remaining);

  if (btnStart) {
    btnStart.innerHTML = '⏸ إيقاف مؤقت';
    btnStart.classList.remove('paused');
    btnStart.classList.add('running');
  }

  const interval = setInterval(() => {
    remaining--;
    if (!activeTimers[elementId]) activeTimers[elementId] = {};
    activeTimers[elementId].remaining = remaining;
    display.textContent = formatSeconds(remaining);

    if (remaining <= 0) {
      clearInterval(interval);
      activeTimers[elementId].interval = null;
      activeTimers[elementId].remaining = 0;
      display.classList.remove('timer-running');
      display.style.color = '#ef4444';
      display.textContent = '00:00 🔔';
      playTimerChime();
      if (btnStart) {
        btnStart.innerHTML = '🔄 إعادة البدء';
        btnStart.classList.remove('running', 'paused');
      }
    }
  }, 1000);

  activeTimers[elementId] = {
    interval,
    remaining,
    initial: initialSeconds
  };
}

function resetActivityTimer(initialSeconds, elementId) {
  const display = document.getElementById(elementId);
  if (!display) return;

  const container = display.closest('.timer-widget');
  const btnStart = container ? container.querySelector('.btn-timer:not(.reset)') : null;

  if (activeTimers[elementId] && activeTimers[elementId].interval) {
    clearInterval(activeTimers[elementId].interval);
  }

  activeTimers[elementId] = {
    interval: null,
    remaining: initialSeconds,
    initial: initialSeconds
  };

  display.classList.remove('timer-running');
  display.style.opacity = '1';
  display.style.color = '';
  display.textContent = formatSeconds(initialSeconds);

  if (btnStart) {
    btnStart.innerHTML = '▶ بدء';
    btnStart.classList.remove('running', 'paused');
  }
}

// Global window bindings for foolproof HTML inline event handler support
window.startActivityTimer = startActivityTimer;
window.resetActivityTimer = resetActivityTimer;
window.toggleHoldTimer = toggleHoldTimer;
window.revealAnswer = revealAnswer;
window.resetHoldTimer = resetHoldTimer;

// ==========================================
// High-Performance 3D Ambient Background Engine
// ==========================================
function init3DBackground() {
  const canvas = document.getElementById('bg3dCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const mouseX = 0;
  const mouseY = 0;

  // 3D Polyhedra vertices and edges definitions
  class Shape3D {
    constructor(x, y, z, size, type = 'octahedron') {
      this.x = x;
      this.y = y;
      this.z = z;
      this.size = size;
      this.type = type;
      this.rotX = Math.random() * Math.PI;
      this.rotY = Math.random() * Math.PI;
      this.speedX = (Math.random() - 0.5) * 0.008;
      this.speedY = (Math.random() - 0.5) * 0.008;

      this.initVertices();
    }

    initVertices() {
      if (this.type === 'octahedron') {
        const s = this.size;
        this.vertices = [
          [0, -s, 0], [s, 0, 0], [0, 0, s],
          [-s, 0, 0], [0, 0, -s], [0, s, 0]
        ];
        this.edges = [
          [0,1], [0,2], [0,3], [0,4],
          [5,1], [5,2], [5,3], [5,4],
          [1,2], [2,3], [3,4], [4,1]
        ];
      } else {
        // Cube
        const s = this.size * 0.7;
        this.vertices = [
          [-s, -s, -s], [s, -s, -s], [s, s, -s], [-s, s, -s],
          [-s, -s, s], [s, -s, s], [s, s, s], [-s, s, s]
        ];
        this.edges = [
          [0,1], [1,2], [2,3], [3,0],
          [4,5], [5,6], [6,7], [7,4],
          [0,4], [1,5], [2,6], [3,7]
        ];
      }
    }

    update() {
      this.rotX += this.speedX;
      this.rotY += this.speedY;
    }

    draw(ctx, w, h, mx, my) {
      const fov = 450;
      const cameraZ = 500;

      // Project vertices
      const projected = this.vertices.map((v) => {
        // Rotate X
        let y1 = v[1] * Math.cos(this.rotX) - v[2] * Math.sin(this.rotX);
        let z1 = v[1] * Math.sin(this.rotX) + v[2] * Math.cos(this.rotX);

        // Rotate Y
        let x2 = v[0] * Math.cos(this.rotY) + z1 * Math.sin(this.rotY);
        let z2 = -v[0] * Math.sin(this.rotY) + z1 * Math.cos(this.rotY);

        // World position with mouse parallax
        let wx = x2 + this.x + mx;
        let wy = y1 + this.y + my;
        let wz = z2 + this.z + cameraZ;

        let scale = fov / Math.max(10, wz);
        return [w / 2 + wx * scale, h / 2 + wy * scale, wz];
      });

      // Draw edges with glowing emerald/gold gradient
      ctx.lineWidth = 1;
      this.edges.forEach((edge) => {
        const p1 = projected[edge[0]];
        const p2 = projected[edge[1]];

        const alpha = Math.max(0.04, Math.min(0.28, 450 / p1[2]));
        ctx.strokeStyle = `rgba(16, 185, 129, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(p1[0], p1[1]);
        ctx.lineTo(p2[0], p2[1]);
        ctx.stroke();
      });

      // Draw vertices points
      projected.forEach((p) => {
        const alpha = Math.max(0.08, Math.min(0.5, 450 / p[2]));
        ctx.fillStyle = `rgba(245, 158, 11, ${alpha})`;
        ctx.beginPath();
        ctx.arc(p[0], p[1], 2, 0, Math.PI * 2);
        ctx.fill();
      });
    }
  }

  // Create multiple floating 3D shapes
  const shapes = [
    new Shape3D(-380, -200, 100, 75, 'octahedron'),
    new Shape3D(420, -180, 80, 65, 'cube'),
    new Shape3D(-420, 220, 150, 85, 'cube'),
    new Shape3D(390, 240, 120, 70, 'octahedron'),
    new Shape3D(0, -320, 200, 55, 'octahedron')
  ];

  // Floating particles with depth
  const particles = Array.from({ length: 45 }, () => ({
    x: (Math.random() - 0.5) * 1200,
    y: (Math.random() - 0.5) * 800,
    z: Math.random() * 500,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3
  }));

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw and update 3D shapes
    shapes.forEach((shape) => {
      shape.update();
      shape.draw(ctx, width, height, mouseX, mouseY);
    });

    // Draw depth particles
    const fov = 400;
    particles.forEach((pt) => {
      pt.x += pt.vx;
      pt.y += pt.vy;
      if (pt.x < -600) pt.x = 600;
      if (pt.x > 600) pt.x = -600;
      if (pt.y < -400) pt.y = 400;
      if (pt.y > 400) pt.y = -400;

      const scale = fov / (pt.z + 400);
      const px = width / 2 + (pt.x + mouseX * 0.5) * scale;
      const py = height / 2 + (pt.y + mouseY * 0.5) * scale;
      const alpha = Math.max(0.05, 0.4 * (1 - pt.z / 500));

      ctx.fillStyle = `rgba(16, 185, 129, ${alpha})`;
      ctx.beginPath();
      ctx.arc(px, py, 1.8 * scale, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(animate);
  }

  animate();
}
