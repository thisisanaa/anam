const fs = require('fs');
const path = require('path');

const codeHtmlPath = 'C:\\Users\\Lenovo\\Downloads\\stitch_strawberry_crush_lip_balm_e_commerce\\code.html';
const codeHtml = fs.readFileSync(codeHtmlPath, 'utf8');

// 1. Extract Tailwind Config
const twConfigMatch = codeHtml.match(/<script id="tailwind-config">([\s\S]*?)<\/script>/);
const twConfig = twConfigMatch ? twConfigMatch[1] : '';

// 2. Extract Marquee Ticker
const marqueeMatch = codeHtml.match(/(<!-- Top Marquee Ticker -->[\s\S]*?)(?=<!-- Hero Section:)/);
const marqueeHtml = marqueeMatch ? marqueeMatch[1].trim() : '';

// 3. Extract Hero Purchasing Panel (Right Column, 5 cols)
const rightColStart = codeHtml.indexOf('<!-- Right Column: Editorial Purchasing Panel (5 cols) -->');
const heroEnd = codeHtml.indexOf('<!-- The Four Sensory Pillars (Benefits Grid) -->');
const rightColHtml = codeHtml.substring(rightColStart, heroEnd).replace('</section>', '').trim();

// 4. Extract Remaining Sections from Pillars onwards
const bodyEnd = codeHtml.indexOf('</body>');
let remainingSections = codeHtml.substring(heroEnd, bodyEnd).trim();

// Remove old inline scripts that would crash
remainingSections = remainingSections.replace(/<script>[\s\S]*?<\/script>/, '');

const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
  <title>Dot &amp; Key • Strawberry Crush Gloss Boss™ SPF 50+ Atelier</title>
  
  <!-- Fonts -->
  <link href="https://fonts.googleapis.com" rel="preconnect"/>
  <link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&amp;family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&amp;display=swap" rel="stylesheet"/>
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
  
  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script id="tailwind-config">
${twConfig}
  </script>

  <!-- Custom Styles -->
  <link rel="stylesheet" href="style.css"/>
</head>
<body class="bg-background font-body-md text-body-md text-on-surface antialiased">

  <!-- Preloader Screen -->
  <div id="preloader" class="preloader">
    <div class="preloader-card">
      <span class="preloader-badge">DOT &amp; KEY ATELIER</span>
      <h2 class="preloader-title">Gloss Boss™ 3D Studio</h2>
      <div class="preloader-bar-bg">
        <div id="preloader-bar" class="preloader-bar-fill"></div>
      </div>
      <div class="preloader-meta">
        <span id="preloader-percent">0%</span>
        <span id="preloader-count">Loading 240 Frames...</span>
      </div>
    </div>
  </div>

  <!-- Announcement Bar & Luxury Navbar -->
  <header class="w-full">
    <div class="bg-primary text-on-primary py-space-2xs px-margin-mobile md:px-margin-desktop text-center">
      <p class="font-label-sm text-label-sm tracking-wider uppercase font-semibold flex items-center justify-center gap-space-xs">
        <span class="material-symbols-outlined text-[14px]">auto_awesome</span>
        <span>Complimentary Strawberry Silk Pouch &amp; Mini Mist with orders over $45 • Free Climate-Neutral Shipping worldwide</span>
      </p>
    </div>
    <div class="h-20 bg-surface/85 backdrop-blur-xl border-b border-outline-variant/20 shadow-[0_4px_24px_rgba(229,26,59,0.06)] sticky top-0 z-50">
      <div class="max-w-[1360px] mx-auto h-full px-margin-mobile md:px-margin-desktop flex items-center justify-between gap-space-lg">
        <div class="flex items-center gap-space-md">
          <img alt="Dot &amp; Key Atelier Logo" class="h-8 w-auto object-contain" src="https://lh3.googleusercontent.com/aida/AEtjO1Ur2FsPIpJSCLiYg84WKqnZflLtL_ZYeu02Ah3C0u3CnlNnQorQgXElFhvYZREK8_Xd8XSFw1iTzE-Yr5cvHXJy3fRwGhfCoedxIYljrdm5ahbyFcQHk-GMo9WzRdk25100ltiVQM2T_o4I4tn05_cSzXXcYJfYAnJO7v6GXTHKx32Nyo7SSnewgXKuoa6QURrRqVuo9uQZqIHKNqWZ45Pksn-5xalEggCNOKLGfRYgCAHT2yDCT1jUujU"/>
          <a class="flex flex-col" href="#">
            <span class="font-headline-sm text-headline-sm tracking-tight text-on-surface font-semibold">Dot &amp; Key</span>
            <span class="font-label-sm text-label-sm text-primary uppercase tracking-[0.2em] -mt-1">Skincare Atelier</span>
          </a>
        </div>
        <nav class="hidden xl:flex items-center gap-space-lg">
          <a class="font-label-lg text-label-lg text-primary font-semibold border-b-2 border-primary pb-1" href="#hero-stage">Gloss Boss™ 3D</a>
          <a class="font-label-lg text-label-lg text-on-surface-variant hover:text-primary transition-colors" href="#sensory-pillars">Four Pillars</a>
          <a class="font-label-lg text-label-lg text-on-surface-variant hover:text-primary transition-colors" href="#clinical-proof">Clinical Proof</a>
          <a class="font-label-lg text-label-lg text-on-surface-variant hover:text-primary transition-colors" href="#ingredients">Actives</a>
          <a class="font-label-lg text-label-lg text-on-surface-variant hover:text-primary transition-colors" href="#reviews-anchor">Reviews</a>
        </nav>
        <div class="flex items-center gap-space-sm md:gap-space-md">
          <div class="hidden sm:flex items-center text-on-surface-variant font-label-md text-label-md px-space-xs py-space-2xs rounded-full hover:text-on-surface cursor-pointer">
            <span>USD ($)</span>
            <span class="material-symbols-outlined text-[16px] ml-1">expand_more</span>
          </div>
          <button class="w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors" type="button">
            <span class="material-symbols-outlined text-[20px]">search</span>
          </button>
          <a class="flex items-center gap-space-xs bg-primary text-on-primary px-space-md py-space-xs rounded-full shadow-[0_4px_16px_rgba(229,26,59,0.25)] hover:bg-tertiary transition-all" href="#hero-stage">
            <span class="material-symbols-outlined text-[18px]">shopping_bag</span>
            <span class="font-label-md text-label-md font-semibold tracking-wide whitespace-nowrap">Cart (1) • $16.00</span>
          </a>
        </div>
      </div>
    </div>
  </header>

  <!-- Top Marquee Ticker -->
  ${marqueeHtml}

  <!-- Main Hero Stage: Continuous 3D Animated Video + Purchasing Suite -->
  <main class="w-full bg-background" id="hero-stage">
    <section class="w-full max-w-[1360px] mx-auto px-margin-mobile md:px-margin-desktop py-space-lg lg:py-space-xl">
      <!-- Breadcrumb -->
      <div class="flex items-center gap-space-xs text-on-surface-variant font-label-md text-label-md mb-space-md">
        <a class="hover:text-primary transition-colors" href="#">Atelier Boutique</a>
        <span>/</span>
        <a class="hover:text-primary transition-colors" href="#">Sun Care &amp; Lip Formulations</a>
        <span>/</span>
        <span class="text-on-surface font-semibold">Strawberry Crush Gloss Boss™ SPF 50+</span>
      </div>

      <!-- 12-Column Hero Stage Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-space-xl lg:gap-space-2xl items-start">
        
        <!-- Left Column: Continuous 3D Animated Video Showcase (7 cols) -->
        <div class="lg:col-span-7 flex flex-col gap-space-md">
          <!-- 3D Video Screen Container -->
          <div class="relative w-full rounded-3xl bg-gradient-to-b from-surface-container-low via-surface-container to-surface-variant p-space-md overflow-hidden shadow-xl flex flex-col items-center justify-center min-h-[560px] lg:min-h-[640px] border border-white/60">
            <!-- Ambient Satin Glow -->
            <div class="absolute -top-24 -left-24 w-80 h-80 bg-primary-container/15 rounded-full blur-3xl pointer-events-none"></div>
            <div class="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/15 rounded-full blur-3xl pointer-events-none"></div>

            <!-- Top Editorial Badges -->
            <div class="absolute top-space-md left-space-md z-10 flex flex-col gap-space-xs pointer-events-none">
              <span class="bg-surface-container-lowest/90 backdrop-blur-md px-space-md py-space-xs rounded-full font-label-sm text-label-sm text-primary font-bold tracking-wider uppercase shadow-md flex items-center gap-1">
                <span class="material-symbols-outlined text-[14px]">verified</span> Best In Clean Beauty 2025
              </span>
              <span class="bg-primary text-on-primary px-space-md py-space-xs rounded-full font-label-sm text-label-sm font-semibold tracking-wider uppercase shadow-md flex items-center gap-1 w-fit">
                <span class="material-symbols-outlined text-[14px]">flare</span> SPF 50+ PA++++
              </span>
            </div>

            <!-- Fullscreen / Wishlist Controls Top Right -->
            <div class="absolute top-space-md right-space-md z-10 flex items-center gap-2">
              <button id="btn-toggle-fullscreen" class="w-10 h-10 rounded-full bg-surface-container-lowest/90 backdrop-blur-md text-on-surface-variant hover:text-primary flex items-center justify-center shadow-md transition-all" title="Toggle Fullscreen" type="button">
                <span class="material-symbols-outlined text-[20px]">fullscreen</span>
              </button>
              <button id="save-wishlist" class="w-10 h-10 rounded-full bg-surface-container-lowest/90 backdrop-blur-md text-on-surface-variant hover:text-primary flex items-center justify-center shadow-md transition-all" type="button" title="Save to Wishlist">
                <span class="material-symbols-outlined text-[20px]">favorite_border</span>
              </button>
            </div>

            <!-- The HTML5 Canvas Rendering 240 Frames in Continuous Loop -->
            <div class="relative w-full h-[460px] lg:h-[520px] flex items-center justify-center cursor-pointer" id="canvas-wrapper" title="Click to Play/Pause 3D Video">
              <canvas id="animation-canvas" class="w-full h-full object-contain drop-shadow-2xl"></canvas>
            </div>

            <!-- Floating Video Dock: Play/Pause, Scrubber, Frame Display -->
            <div class="w-full max-w-[540px] px-4 py-2.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-xl border border-white/80 shadow-lg flex items-center gap-3 z-10 mt-2">
              <button id="btn-play-pause" class="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-sm hover:scale-105 transition-all flex-shrink-0" title="Play / Pause 3D Video">
                <span class="material-symbols-outlined text-[18px]" id="play-icon">pause</span>
              </button>
              <div class="flex items-center gap-1.5 text-xs font-bold text-on-surface min-w-[100px] font-mono flex-shrink-0">
                <span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                <span id="hud-frame-display">001 / 240</span>
              </div>
              <div class="flex-1 flex items-center">
                <input type="range" id="frame-scrubber" min="0" max="239" value="0" step="1" class="w-full h-1.5 bg-primary/20 accent-primary rounded-full cursor-pointer" title="Scrub 3D Animation Angle"/>
              </div>
              <span id="hud-scroll-percent" class="text-xs font-extrabold text-primary min-w-[32px] text-right flex-shrink-0">0%</span>
            </div>

            <!-- Bottom Micro Specifications -->
            <div class="w-full flex items-center justify-between mt-3 px-2 text-on-surface-variant font-label-sm text-label-sm">
              <span class="bg-surface-container-lowest/80 backdrop-blur-md px-3 py-1 rounded-full">Net Wt. 12g / 0.42 oz.</span>
              <span class="bg-surface-container-lowest/80 backdrop-blur-md px-3 py-1 rounded-full text-primary font-bold flex items-center gap-1">
                <span class="material-symbols-outlined text-[14px]">water</span> Water-Resistant (80 Min)
              </span>
            </div>
          </div>

          <!-- Carousel Thumbnails / Feature Previews -->
          <div class="grid grid-cols-4 gap-space-sm">
            <button class="thumb-btn group active rounded-2xl bg-surface-container p-2 transition-all ring-2 ring-primary bg-surface-container-lowest shadow-sm flex flex-col items-center gap-1" onclick="selectThumb(0)" type="button">
              <div class="w-full h-16 rounded-xl overflow-hidden bg-surface-variant flex items-center justify-center">
                <img alt="Thumbnail Atelier View" class="w-full h-full object-cover group-hover:scale-105 transition-transform" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFqQ_y6oREbd4q7wUde6pRPaDzsotzvyk68qDJICuvF7Fd_WOQ-rvzyJp3zPeVGAtKtmYjMdOB48bGpna34U5C-yEZGZDyK9BtD-1AGJOnaD2F8BNyqmiSf310tVj_xoeAVDhZaQC4nTSgJrtZbH7_1os5VFeBASVY5FabTcazOxKSk2sYwZ3yZDhRbMJCL-WXz6fVfAdISVSKupASqpWh18mFmhQAOlEYhTUQMUiIuQ7Y4oSJ0X08Nh2WG09yp8LT-g"/>
              </div>
              <span class="font-label-sm text-label-sm text-on-surface font-semibold">3D Video Loop</span>
            </button>
            <button class="thumb-btn group rounded-2xl bg-surface-container p-2 transition-all hover:bg-surface-container-lowest shadow-sm flex flex-col items-center gap-1" onclick="selectThumb(1)" type="button">
              <div class="w-full h-16 rounded-xl overflow-hidden bg-surface-variant flex items-center justify-center">
                <img class="w-full h-full object-cover group-hover:scale-105 transition-transform" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9I_MCSmE4kghgOCCjc-KeRTdIQ-BJmXjQRp-vOniDcEf92fJEPnDoVEljzYenp5GOVKnDadOgMKYdJI-xk37QqQa3-T9pTThrpmnfBGFhkInNh70_0Wg3l2tXKjif99QSqxKocWIWpoZqQP72GjeJbGl1mLJKM13-UBfozPatmabMBTq1I8eiN_QUyI8Ik_h8kJFAzE8TccL0HBNwUeXUX504OqveNR9rqtnN1zdG4svktw0-3EvR"/>
              </div>
              <span class="font-label-sm text-label-sm text-on-surface-variant group-hover:text-primary transition-colors">Juicy Swatch</span>
            </button>
            <button class="thumb-btn group rounded-2xl bg-surface-container p-2 transition-all hover:bg-surface-container-lowest shadow-sm flex flex-col items-center gap-1" onclick="selectThumb(2)" type="button">
              <div class="w-full h-16 rounded-xl overflow-hidden bg-surface-variant flex items-center justify-center">
                <img class="w-full h-full object-cover group-hover:scale-105 transition-transform" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1oj7P1RejHiQ8pUFl8478HdxV_RT6XU1Yt-u6jDIcnUYZT6f7ASkrfxsrfZeLMdbrP1zjxNoNw5YJWc28OKDF858whdzgwJi-bEJQcAyTpAmnrHqgn2-kAreVEcY1PwwavRXparePT5ju3cV4uEfLbJ1sLhgTVGSSdIFd6qvt0Hze_0fShs3MV7z1Q7gOpKirQh6SZymK9WRlOve6oeQEOAGG6h0-pMhioE_tsI1Uw3sy4qtQ68K1"/>
              </div>
              <span class="font-label-sm text-label-sm text-on-surface-variant group-hover:text-primary transition-colors">On Model</span>
            </button>
            <button class="thumb-btn group rounded-2xl bg-surface-container p-2 transition-all hover:bg-surface-container-lowest shadow-sm flex flex-col items-center gap-1" onclick="selectThumb(3)" type="button">
              <div class="w-full h-16 rounded-xl overflow-hidden bg-surface-variant flex flex-col items-center justify-center text-primary">
                <span class="material-symbols-outlined text-[26px]">wb_sunny</span>
                <span class="font-label-sm text-label-sm font-bold mt-1">UV-Cam</span>
              </div>
              <span class="font-label-sm text-label-sm text-on-surface-variant group-hover:text-primary transition-colors">UV Shield Test</span>
            </button>
          </div>
        </div>

        <!-- Right Column: Editorial Purchasing Suite (5 cols) -->
        ${rightColHtml}

      </div>
    </section>

    <!-- The Remaining Structured E-Commerce Sections (Directly Underneath) -->
    <div id="stitch-content">
      ${remainingSections}
    </div>
  </main>

  <script src="app.js"></script>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, 'index.html'), fullHtml, 'utf8');
console.log('Successfully written index.html! File size:', fullHtml.length, 'bytes');
