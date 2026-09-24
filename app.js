/**
 * SCANDAL Eau de Parfum • Sialkot Haute Parfumerie
 * 240-Frame 3D Flacon Animation Studio from frames perfume
 */

(function () {
  'use strict';

  // DOM Elements
  const canvas = document.getElementById('animation-canvas');
  const canvasWrapper = document.getElementById('canvas-wrapper');
  const ctx = canvas ? canvas.getContext('2d', { alpha: true }) : null;
  const preloader = document.getElementById('preloader');
  const preloaderBar = document.getElementById('preloader-bar');
  const preloaderPercent = document.getElementById('preloader-percent');
  const preloaderCount = document.getElementById('preloader-count');
  const hudFrameDisplay = document.getElementById('hud-frame-display');
  const hudScrollPercent = document.getElementById('hud-scroll-percent');
  const frameScrubber = document.getElementById('frame-scrubber');
  const btnPlayPause = document.getElementById('btn-play-pause');
  const playIcon = document.getElementById('play-icon');
  const btnFullscreen = document.getElementById('btn-toggle-fullscreen');

  // Animation State
  let frameUrls = [];
  let images = [];
  let totalFrames = 240;
  let isLoaded = false;
  let currentFrameIndex = 0;
  let lastRenderedIndex = -1;

  // Video Loop State (30 FPS Continuous Loop)
  let isPlaying = true;
  let animId = null;
  let lastFrameTime = 0;
  const FPS = 30;
  const FRAME_DURATION = 1000 / FPS;
  let isScrubbing = false;
  let wasPlayingBeforeScrub = true;

  /**
   * 1. Initialize & Fetch All Frames from "frames perfume"
   */
  async function init() {
    try {
      if (preloaderCount) preloaderCount.textContent = 'Connecting to frames perfume...';
      let data = null;
      try {
        const response = await fetch('/api/frames');
        if (response.ok) {
          data = await response.json();
        }
      } catch (e) {
        console.log('Static host mode: loading frames directly from ./frames/');
      }

      if (data && data.frames && data.frames.length > 0) {
        frameUrls = data.frames;
        totalFrames = data.totalFrames || frameUrls.length;
      } else {
        totalFrames = 240;
        frameUrls = [];
        for (let i = 1; i <= totalFrames; i++) {
          const numStr = String(i).padStart(3, '0');
          frameUrls.push(`frames/ezgif-frame-${numStr}.jpg`);
        }
      }

      console.log('Loaded ' + totalFrames + ' flacon frames.');

      if (totalFrames === 0) {
        throw new Error('No frames detected in the frames directory.');
      }

      if (frameScrubber) {
        frameScrubber.min = 0;
        frameScrubber.max = totalFrames - 1;
        frameScrubber.value = 0;
      }

      resizeCanvas();
      await preloadAllFrames();

    } catch (err) {
      console.error('Initialization error:', err);
      if (preloaderPercent) {
        preloaderPercent.textContent = 'Error';
        preloaderPercent.style.color = '#ba1a1a';
      }
      if (preloaderCount) {
        preloaderCount.textContent = err.message || 'Failed to load frames';
      }
    }
  }

  /**
   * 2. High-Speed Preloading of All 240 Frames
   */
  function preloadAllFrames() {
    return new Promise((resolve) => {
      let loadedCount = 0;
      images = new Array(totalFrames);

      function onFrameLoaded(index) {
        loadedCount++;
        const percent = Math.floor((loadedCount / totalFrames) * 100);

        if (preloaderBar) preloaderBar.style.width = percent + '%';
        if (preloaderPercent) preloaderPercent.textContent = percent + '%';
        if (preloaderCount) preloaderCount.textContent = 'Cached ' + loadedCount + ' of ' + totalFrames + ' flacon frames';

        // Draw initial frame as soon as frame 0 loads
        if (index === 0 && lastRenderedIndex === -1) {
          renderFrame(0);
          updateHUD(0);
        }

        if (loadedCount === totalFrames) {
          onAllFramesReady();
          resolve();
        }
      }

      function onFrameError(index, url) {
        console.warn('Frame failed to load: ' + url);
        onFrameLoaded(index);
      }

      // Preload in parallel
      for (let i = 0; i < totalFrames; i++) {
        const img = new Image();
        img.decoding = 'async';
        img.src = frameUrls[i];
        img.onload = () => onFrameLoaded(i);
        img.onerror = () => onFrameError(i, frameUrls[i]);
        images[i] = img;
      }
    });
  }

  /**
   * Called when all frames are in memory
   */
  function onAllFramesReady() {
    isLoaded = true;
    console.log('All ' + totalFrames + ' flacon frames ready. Commencing continuous 3D loop.');

    renderFrame(currentFrameIndex);
    updateHUD(currentFrameIndex);

    setTimeout(() => {
      if (preloader) {
        preloader.classList.add('fade-out');
        setTimeout(() => {
          if (preloader) preloader.style.display = 'none';
        }, 500);
      }
      startVideo();
    }, 200);
  }

  /**
   * 3. High-DPI Responsive Canvas Sizing
   */
  function resizeCanvas() {
    if (!canvasWrapper || !canvas) return;
    const rect = canvasWrapper.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const width = rect.width || 680;
    const height = rect.height || 440;

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);

    if (isLoaded || (images[currentFrameIndex] && images[currentFrameIndex].complete)) {
      lastRenderedIndex = -1;
      renderFrame(currentFrameIndex);
    }
  }

  /**
   * 4. Draw Frame with High-Precision Contrast & Studio Shading
   */
  function renderFrame(index) {
    if (!ctx || !canvas) return;

    let img = images[index];
    if (!img || !img.complete || img.naturalWidth === 0) {
      img = images[lastRenderedIndex] || images[0];
    }
    if (!img || !img.complete || img.naturalWidth === 0) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    // Dark luxury studio radial gradient
    const grad = ctx.createRadialGradient(cw / 2, ch / 2, 20, cw / 2, ch / 2, Math.max(cw, ch) * 0.7);
    grad.addColorStop(0, '#1c1f24');
    grad.addColorStop(0.55, '#0e1014');
    grad.addColorStop(1, '#07080a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, cw, ch);

    // Aspect-ratio contain scaling (640x360 16:9)
    const scale = Math.min(cw / iw, ch / ih);
    const nw = iw * scale;
    const nh = ih * scale;
    const nx = (cw - nw) / 2;
    const ny = (ch - nh) / 2;

    ctx.drawImage(img, 0, 0, iw, ih, nx, ny, nw, nh);
    lastRenderedIndex = index;
  }

  /**
   * 5. Continuous 30 FPS Animation Loop
   */
  function videoTick(timestamp) {
    if (!isPlaying || isScrubbing) return;

    if (!lastFrameTime) lastFrameTime = timestamp;
    const elapsed = timestamp - lastFrameTime;

    if (elapsed >= FRAME_DURATION) {
      currentFrameIndex = (currentFrameIndex + 1) % totalFrames;
      renderFrame(currentFrameIndex);
      updateHUD(currentFrameIndex);
      lastFrameTime = timestamp - (elapsed % FRAME_DURATION);
    }

    animId = requestAnimationFrame(videoTick);
  }

  function startVideo() {
    isPlaying = true;
    if (playIcon) playIcon.textContent = 'pause';
    lastFrameTime = 0;
    if (!animId) {
      animId = requestAnimationFrame(videoTick);
    }
  }

  function pauseVideo() {
    isPlaying = false;
    if (playIcon) playIcon.textContent = 'play_arrow';
    if (animId) {
      cancelAnimationFrame(animId);
      animId = null;
    }
  }

  function togglePlay() {
    if (isPlaying) {
      pauseVideo();
    } else {
      startVideo();
    }
  }

  /**
   * Update HUD controls (Frame counter, scrubber, percent)
   */
  function updateHUD(frameIndex) {
    if (hudFrameDisplay) {
      const frameStr = String(frameIndex + 1).padStart(3, '0');
      const totalStr = String(totalFrames).padStart(3, '0');
      hudFrameDisplay.textContent = frameStr + ' / ' + totalStr;
    }

    if (hudScrollPercent) {
      const percent = Math.round((frameIndex / (totalFrames - 1)) * 100);
      hudScrollPercent.textContent = percent + '%';
    }

    if (frameScrubber && !isScrubbing) {
      frameScrubber.value = frameIndex;
    }
  }

  /**
   * 6. Interactive Controls (Play/Pause, Scrubber, Fullscreen, Shortcuts)
   */
  if (btnPlayPause) {
    btnPlayPause.addEventListener('click', (e) => {
      e.stopPropagation();
      togglePlay();
    });
  }

  if (canvasWrapper) {
    canvasWrapper.addEventListener('click', (e) => {
      if (e.target.closest('button') || e.target.closest('input')) return;
      togglePlay();
    });
  }

  if (frameScrubber) {
    frameScrubber.addEventListener('mousedown', () => {
      isScrubbing = true;
      wasPlayingBeforeScrub = isPlaying;
      pauseVideo();
    });

    frameScrubber.addEventListener('touchstart', () => {
      isScrubbing = true;
      wasPlayingBeforeScrub = isPlaying;
      pauseVideo();
    }, { passive: true });

    frameScrubber.addEventListener('input', (e) => {
      isScrubbing = true;
      const targetIndex = parseInt(e.target.value, 10);
      currentFrameIndex = targetIndex;
      renderFrame(targetIndex);
      updateHUD(targetIndex);
    });

    const onScrubEnd = () => {
      if (!isScrubbing) return;
      isScrubbing = false;
      if (wasPlayingBeforeScrub) {
        startVideo();
      }
    };

    frameScrubber.addEventListener('mouseup', onScrubEnd);
    frameScrubber.addEventListener('touchend', onScrubEnd);
    frameScrubber.addEventListener('change', onScrubEnd);
  }

  if (btnFullscreen) {
    btnFullscreen.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!document.fullscreenElement) {
        (canvasWrapper || document.documentElement).requestFullscreen().catch(() => {});
      } else {
        if (document.exitFullscreen) document.exitFullscreen();
      }
    });
  }

  // Keyboard Shortcuts
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && e.target.tagName !== 'INPUT') {
      e.preventDefault();
      togglePlay();
    }
  });

  window.addEventListener('resize', resizeCanvas);
  window.addEventListener('DOMContentLoaded', init);

  /**
   * 7. Angle / Feature Thumbnails
   */
  window.selectThumb = function (index) {
    const thumbs = document.querySelectorAll('.thumb-btn');
    thumbs.forEach((t, i) => {
      if (i === index) {
        t.className = 'thumb-btn active py-2 px-1 rounded-xl bg-surface-container-lowest ring-2 ring-primary shadow-sm flex flex-col items-center gap-1 transition-all';
        const span = t.querySelector('span');
        if (span) span.className = 'font-label-caps text-[10px] font-bold text-primary';
      } else {
        t.className = 'thumb-btn py-2 px-1 rounded-xl bg-surface-container hover:bg-surface-container-lowest shadow-sm flex flex-col items-center gap-1 transition-all';
        const span = t.querySelector('span');
        if (span) span.className = 'font-label-caps text-[10px] text-on-surface-variant';
      }
    });

    if (index === 0) {
      // Continuous 3D Loop
      startVideo();
    } else {
      pauseVideo();
      let targetFrame = 0;
      if (index === 1) targetFrame = Math.floor(totalFrames * 0.25); // ~Frame 60
      if (index === 2) targetFrame = Math.floor(totalFrames * 0.50); // ~Frame 120
      if (index === 3) targetFrame = Math.floor(totalFrames * 0.75); // ~Frame 180
      currentFrameIndex = targetFrame;
      renderFrame(targetFrame);
      updateHUD(targetFrame);
    }
  };

  /**
   * 8. Interactive Purchasing Handlers (Volume, Bag, Wishlist)
   */
  document.addEventListener('DOMContentLoaded', () => {
    // Volume selection (30ml, 50ml, 85ml)
    const sizeBtns = document.querySelectorAll('#size-selector-group .size-btn');
    const priceDisplay = document.getElementById('product-price');

    sizeBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        sizeBtns.forEach((b) => {
          b.className = 'size-btn py-2.5 px-3 rounded-lg text-center font-body-sm text-body-sm transition-all bg-surface-container hover:bg-surface-variant text-on-surface';
        });
        btn.className = 'size-btn py-2.5 px-3 rounded-lg text-center font-body-sm text-body-sm transition-all bg-on-surface text-on-primary shadow-md';

        const newPrice = btn.getAttribute('data-price');
        if (priceDisplay && newPrice) {
          priceDisplay.textContent = newPrice;
        }
      });
    });

    // Wishlist Toggle
    const wishlistBtns = document.querySelectorAll('#save-wishlist, #save-wishlist-top');
    wishlistBtns.forEach((btn) => {
      btn.addEventListener('click', function () {
        const icon = this.querySelector('.material-symbols-outlined');
        if (!icon) return;
        if (icon.textContent === 'favorite_border') {
          icon.textContent = 'favorite';
          icon.classList.add('text-primary');
          icon.style.fontVariationSettings = "'FILL' 1";
        } else {
          icon.textContent = 'favorite_border';
          icon.classList.remove('text-primary');
          icon.style.fontVariationSettings = "'FILL' 0";
        }
      });
    });

    // Add to Bag CTA
    document.querySelectorAll('button').forEach((b) => {
      if (b.textContent.includes('Acquire The Flacon') || b.textContent.includes('Claim From Earliest Batch') || b.textContent.includes('Add to Bag')) {
        b.addEventListener('click', function () {
          const originalText = this.innerHTML;
          this.innerHTML = '<span class="material-symbols-outlined animate-spin text-[18px]">refresh</span> Added to Atelier Bag!';
          this.classList.add('bg-primary');
          setTimeout(() => {
            this.innerHTML = originalText;
            this.classList.remove('bg-primary');
          }, 1800);
        });
      }
    });
  });

})();