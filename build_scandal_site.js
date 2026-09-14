const fs = require('fs');
const path = require('path');

const codeHtmlPath = 'C:\\Users\\Lenovo\\Downloads\\unzip\\code.html';
const codeHtml = fs.readFileSync(codeHtmlPath, 'utf8');

// 1. Extract Tailwind Config
const twConfigMatch = codeHtml.match(/<script id="tailwind-config">([\s\S]*?)<\/script>/);
const twConfig = twConfigMatch ? twConfigMatch[1] : '';

// 2. Extract Top Notification Pill
const pillMatch = codeHtml.match(/(<!-- Top Subtle Notification Pill & Breadcrumb Bar -->[\s\S]*?)(?=<!-- Section 1: Editorial Hero Showcase -->)/);
const topPillHtml = pillMatch ? pillMatch[1].trim() : '';

// 3. Extract Left Column (Story & Purchasing Panel) from Hero
const leftColMatch = codeHtml.match(/(<!-- Left: Editorial Story & Title -->[\s\S]*?)(?=<!-- Center \/ Right: Flacon Hero Display)/);
const leftColHtml = leftColMatch ? leftColMatch[1].trim() : '';

// 4. Extract Section 2 onwards (Olfactory Architecture to end of main)
const sec2Start = codeHtml.indexOf('<!-- Section 2: Olfactory Note Architecture');
const bodyEnd = codeHtml.indexOf('</body>');
let remainingSections = codeHtml.substring(sec2Start, bodyEnd).trim();

// Remove old inline scripts that could crash
remainingSections = remainingSections.replace(/<script>[\s\S]*?<\/script>/g, '');

const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
  <title>SCANDAL Eau de Parfum • Ultra HD 3D Studio</title>
  
  <!-- Material Symbols & Fonts -->
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
  <link href="https://fonts.googleapis.com" rel="preconnect"/>
  <link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&amp;family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&amp;display=swap" rel="stylesheet"/>
  
  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script id="tailwind-config">
${twConfig}
  </script>

  <!-- Custom Styles with cache-buster -->
  <link rel="stylesheet" href="style.css?v=frames_perfume_1"/>
</head>
<body class="bg-background font-body-md text-on-surface antialiased">

  <!-- Preloader Screen -->
  <div id="preloader" class="preloader">
    <div class="preloader-card">
      <span class="preloader-badge">SIALKOT HAUTE PARFUMERIE</span>
      <h2 class="preloader-title">SCANDAL Ultra-HD Studio</h2>
      <div class="preloader-bar-bg">
        <div id="preloader-bar" class="preloader-bar-fill"></div>
      </div>
      <div class="preloader-meta">
        <span id="preloader-percent">0%</span>
        <span id="preloader-count">Loading Crystal HD Video...</span>
      </div>
    </div>
  </div>

  <!-- Announcement Bar & Luxury Header -->
  <header class="fixed top-0 left-0 w-full z-50 bg-surface/90 backdrop-blur-xl border-b border-outline-variant/30 shadow-[0_1px_12px_rgba(0,0,0,0.04)]">
    <div class="h-7 bg-surface-container text-tertiary flex items-center justify-center font-label-caps text-label-caps uppercase tracking-widest px-gutter-mobile">
      Complimentary Worldwide Atelier Shipping on Orders Over $150 · Handcrafted in Sialkot
    </div>
    <div class="h-20 max-w-container-max mx-auto px-gutter-mobile lg:px-gutter-desktop flex items-center justify-between gap-space-sm">
      <div class="flex items-center gap-space-xs">
        <img alt="Scandal Parfums Sialkot Logo" class="h-8 w-auto object-contain" src="https://lh3.googleusercontent.com/aida/AEtjO1WEkeItt0swq2xrn5XUHGayYLx-hqyTIG0o1aic_DxJmaOxihh8u6F55K57djJh_wqI6w37F1FbH2ZQqqNTVgv5rRsZ8P-gP4A08G8fWjV9XcdPoRAFboqlAHY5lsQboOExnVlOaAPfhq231KMBOFfpDW3uWnteiednFbFcgemGgr6gtkHzsMaM2Ne42hIiJB2xrcbejzMDfQ2BqLB78u1jFNmQ7DOlUQ3W6x4wUeWQmLxk9M1Ap0q3O4s"/>
        <span class="font-headline-sm text-headline-sm text-on-surface tracking-tight hidden sm:inline font-normal">Scandal Parfums</span>
      </div>
      <nav class="hidden xl:flex items-center gap-space-md">
        <a class="uppercase transition-colors text-primary font-semibold border-b-2 border-primary pb-0.5" href="#hero-stage">Ultra HD Flacon</a>
        <a class="font-label-caps text-label-caps uppercase text-on-surface-variant hover:text-on-surface transition-colors" href="#olfactory-architecture">Olfactory Notes</a>
        <a class="font-label-caps text-label-caps uppercase text-on-surface-variant hover:text-on-surface transition-colors" href="#sialkot-heritage">Sialkot Heritage</a>
        <a class="font-label-caps text-label-caps uppercase text-on-surface-variant hover:text-on-surface transition-colors" href="#flacon-anatomy">Craftsmanship</a>
        <a class="font-label-caps text-label-caps uppercase text-on-surface-variant hover:text-on-surface transition-colors" href="#reviews-section">Memoirs</a>
      </nav>
      <div class="flex items-center gap-space-xs sm:gap-space-sm">
        <div class="hidden md:flex items-center bg-surface-container-low px-space-2xs py-1 rounded-full text-on-surface-variant font-label-sm text-label-sm">
          <span class="cursor-pointer text-on-surface font-semibold">USD</span>
          <span class="mx-1 opacity-40">/</span>
          <span class="cursor-pointer hover:text-on-surface">EUR</span>
          <span class="mx-1 opacity-40">/</span>
          <span class="cursor-pointer hover:text-on-surface">PKR</span>
        </div>
        <button class="p-1.5 text-on-surface-variant hover:text-on-surface transition-colors" type="button" title="Search">
          <span class="material-symbols-outlined text-[20px]">search</span>
        </button>
        <button id="save-wishlist-top" class="relative p-1.5 text-on-surface-variant hover:text-primary transition-colors" type="button" title="Wishlist">
          <span class="material-symbols-outlined text-[20px]">favorite</span>
          <span class="absolute top-0 right-0 w-4 h-4 bg-primary text-on-primary rounded-full font-label-caps text-[9px] flex items-center justify-center font-bold">2</span>
        </button>
        <a href="#hero-stage" class="relative p-1.5 text-on-surface-variant hover:text-primary transition-colors flex items-center" title="Bag">
          <span class="material-symbols-outlined text-[20px]">shopping_bag</span>
          <span class="absolute top-0 right-0 w-4 h-4 bg-secondary text-on-secondary rounded-full font-label-caps text-[9px] flex items-center justify-center font-bold">1</span>
        </a>
      </div>
    </div>
  </header>

  <!-- Main Content Body -->
  <main class="w-full pt-28 bg-background min-h-screen">
    <div class="flex flex-col w-full">
      ${topPillHtml}

      <!-- Section 1: Bespoke Ultra-HD Video Hero Showcase Stage -->
      <section class="relative w-full overflow-hidden bg-gradient-to-b from-surface via-surface-container-lowest to-surface py-space-md lg:py-space-xl" id="hero-stage">
        <!-- Ambient Rose-Gold Glow Rings -->
        <div class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[38rem] h-[38rem] rounded-full bg-gradient-to-tr from-primary/10 via-secondary/15 to-transparent blur-3xl pointer-events-none -z-10"></div>
        <div class="absolute -bottom-24 right-10 w-96 h-96 rounded-full bg-secondary-container/20 blur-2xl pointer-events-none -z-10"></div>

        <div class="max-w-container-max mx-auto px-gutter-mobile lg:px-gutter-desktop">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-space-lg lg:gap-space-xl items-center">

            <!-- Left: Ultra-HD Hardware-Accelerated 3D Video Studio (7 cols) -->
            <div class="lg:col-span-7 flex flex-col items-center justify-center relative order-1">
              <div class="relative w-full rounded-2xl bg-gradient-to-b from-[#14161a] via-[#0e1013] to-[#07080a] p-space-md overflow-hidden shadow-2xl border border-white/15 flex flex-col items-center">
                
                <!-- Ambient Glow inside Frame -->
                <div class="absolute -top-20 -left-20 w-72 h-72 bg-secondary/25 rounded-full blur-3xl pointer-events-none"></div>
                <div class="absolute -bottom-20 -right-20 w-80 h-80 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>

                <!-- Top Badges on 3D Stage -->
                <div class="absolute top-4 left-4 z-10 flex flex-col gap-1.5 pointer-events-none">
                  <span class="bg-black/70 backdrop-blur-md px-3 py-1 rounded-full font-label-caps text-[10px] text-secondary-fixed uppercase tracking-widest shadow-sm flex items-center gap-1 border border-white/15">
                    <span class="material-symbols-outlined text-[13px] text-secondary">auto_awesome</span> Ultra-HD 3D Studio
                  </span>
                  <span class="bg-primary text-on-primary px-3 py-1 rounded-full font-label-caps text-[10px] uppercase tracking-widest shadow-sm flex items-center gap-1 w-fit">
                    <span class="material-symbols-outlined text-[13px]">flare</span> 28% Extrait Concentré
                  </span>
                </div>

                <!-- Fullscreen Button -->
                <div class="absolute top-4 right-4 z-10 flex items-center gap-2">
                  <button id="btn-toggle-fullscreen" class="w-9 h-9 rounded-full bg-black/60 backdrop-blur-md text-white/80 hover:text-white flex items-center justify-center shadow-sm transition-all border border-white/15" title="Toggle Fullscreen" type="button">
                    <span class="material-symbols-outlined text-[18px]">fullscreen</span>
                  </button>
                </div>

                <!-- 240-Frame Crystal Animation Canvas from frames perfume -->
                <div class="relative w-full h-[400px] lg:h-[480px] flex items-center justify-center cursor-pointer rounded-xl overflow-hidden bg-black" id="canvas-wrapper" title="Click to Play/Pause 3D Flacon Animation">
                  <canvas id="animation-canvas" class="w-full h-full object-contain drop-shadow-2xl rounded-xl"></canvas>
                  <video id="perfume-video" src="/video/perfume.mp4" loop muted playsinline preload="none" class="w-full h-full object-contain drop-shadow-2xl rounded-xl hidden"></video>
                </div>

                <!-- Floating Video Dock: Play/Pause, Scrubber, Frame Display -->
                <div class="w-full max-w-[500px] px-4 py-2 rounded-full bg-black/80 backdrop-blur-xl border border-white/20 shadow-2xl flex items-center gap-3 z-10 mt-3 text-white">
                  <button id="btn-play-pause" class="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center shadow-md hover:bg-secondary-fixed transition-all flex-shrink-0" title="Play / Pause 3D Video">
                    <span class="material-symbols-outlined text-[18px]" id="play-icon">pause</span>
                  </button>
                  <div class="flex items-center gap-1.5 text-xs font-bold text-white min-w-[95px] font-mono flex-shrink-0">
                    <span class="w-2 h-2 rounded-full bg-secondary-fixed animate-pulse"></span>
                    <span id="hud-frame-display">001 / 240</span>
                  </div>
                  <div class="flex-1 flex items-center">
                    <input type="range" id="frame-scrubber" min="0" max="239" value="0" step="1" class="w-full h-1.5 bg-white/20 accent-secondary rounded-full cursor-pointer" title="Scrub 3D Flacon Angle"/>
                  </div>
                  <span id="hud-scroll-percent" class="text-xs font-bold text-secondary-fixed min-w-[32px] text-right flex-shrink-0">0%</span>
                </div>

                <!-- Bottom Spec Tags -->
                <div class="flex items-center justify-between w-full mt-3 px-2 text-white/80 font-label-caps text-label-caps text-[10px]">
                  <span class="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full">Atelier Flacon No. 4410</span>
                  <span class="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-secondary-fixed font-semibold">100% Solid Brass Topper</span>
                  <span class="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full">420g Heavy Base</span>
                </div>
              </div>

              <!-- 4 Feature Thumbnails -->
              <div class="grid grid-cols-4 gap-space-xs w-full mt-space-sm">
                <button class="thumb-btn active py-2 px-1 rounded-xl bg-surface-container-lowest ring-2 ring-primary shadow-sm flex flex-col items-center gap-1 transition-all" onclick="selectThumb(0)" type="button">
                  <span class="font-label-caps text-[10px] font-bold text-primary">Ultra HD 3D Loop</span>
                </button>
                <button class="thumb-btn py-2 px-1 rounded-xl bg-surface-container hover:bg-surface-container-lowest shadow-sm flex flex-col items-center gap-1 transition-all" onclick="selectThumb(1)" type="button">
                  <span class="font-label-caps text-[10px] text-on-surface-variant">Atomizer Mist</span>
                </button>
                <button class="thumb-btn py-2 px-1 rounded-xl bg-surface-container hover:bg-surface-container-lowest shadow-sm flex flex-col items-center gap-1 transition-all" onclick="selectThumb(2)" type="button">
                  <span class="font-label-caps text-[10px] text-on-surface-variant">Sculpted Legs Cap</span>
                </button>
                <button class="thumb-btn py-2 px-1 rounded-xl bg-surface-container hover:bg-surface-container-lowest shadow-sm flex flex-col items-center gap-1 transition-all" onclick="selectThumb(3)" type="button">
                  <span class="font-label-caps text-[10px] text-on-surface-variant">Faceted Glass</span>
                </button>
              </div>
            </div>

            <!-- Right: Editorial Purchasing Suite (5 cols) -->
            ${leftColHtml}

          </div>
        </div>
      </section>

      <!-- Section 2 Onwards: Complete Editorial Suite -->
      <div id="stitch-content">
        ${remainingSections}
      </div>

    </div>
  </main>

  <script src="app.js?v=frames_perfume_1"></script>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, 'index.html'), fullHtml, 'utf8');
console.log('Successfully written index.html with Ultra HD player! File size:', fullHtml.length, 'bytes');
