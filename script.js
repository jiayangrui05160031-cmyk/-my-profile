(() => {
  const root = document.body;
  const scrollProgress = document.getElementById('scrollProgress');
  const themeButton = document.getElementById('themeButton');
  const commandButton = document.getElementById('commandButton');
  const commandDialog = document.getElementById('commandDialog');
  const closeCommand = document.getElementById('closeCommand');
  const toast = document.getElementById('toast');
  const heroText = document.querySelector('.hero-text');
  const portraitMood = document.getElementById('portraitMood');
  const launchHero = document.getElementById('launchHero');
  const launchReticle = document.getElementById('launchReticle');
  const notesGrid = document.getElementById('notesGrid');
  const pandaCursor = document.getElementById('pandaCursor');
  const petalLayer = document.getElementById('petalLayer');
  const sparkLayer = document.getElementById('sparkLayer');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const oracle = {
    index: document.getElementById('oracleIndex'),
    emoji: document.getElementById('oracleEmoji'),
    title: document.getElementById('oracleTitle'),
    text: document.getElementById('oracleText'),
    card: document.getElementById('oracleCard'),
  };
  let toastTimer;
  let noteIndex = new Map();
  let arcadeTimer;

  const heroLines = [
    '这里是 <strong>views</strong>。放一点研究、一点代码、一点正在绕弯路的想法；不负责把世界解释完，只负责把看见的东西做得更清楚、更好玩。',
    '这里不卖“人设升级包”。<strong>views</strong> 只想把值得留下的东西做成网页、工具，或者一段可以继续讨论的记录。',
    '有的页面是作品集；这里更像一张不断加东西的桌子。<strong>views</strong> 会把研究、数据和不务正业都摊在上面。',
    '如果事情很复杂，先把它拆成几个可移动的小块。<strong>views</strong> 喜欢从这里开始，而不是从一个漂亮结论开始。',
  ];

  const moods = [
    'curious by default',
    'tabs: too many',
    'probably reading docs',
    'in a side quest',
    'making one more small fix',
    'tea > urgency',
  ];

  const oracleCards = [
    { emoji: '✦', title: '今天适合先别卷。', text: '把浏览器的一个标签页关掉，给真正要做的事让一点位置。' },
    { emoji: '◌', title: '去找一个反例。', text: '如果一个判断看起来太顺，不妨先看看它在哪些地方不成立。' },
    { emoji: '↗', title: '把它做成可点开的。', text: '哪怕只是一个小 demo。能被打开、被试一下的东西，往往比一句概念更有说服力。' },
    { emoji: '☕', title: '暂停也是工作的一部分。', text: '离开五分钟，再回来；有些错误在放松之后才显形。' },
    { emoji: '🎲', title: '今天可以绕一点路。', text: '去看一段没计划看的内容。它不一定没用，只是暂时还不知道会在哪里连起来。' },
    { emoji: '⚔', title: '把大任务砍成一小格。', text: '先赢下下一步，不用一次把整张地图打开。' },
  ];

  function showToast(message) {
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add('show');
    toastTimer = window.setTimeout(() => toast.classList.remove('show'), 2300);
  }

  function setTheme(nextTheme, shouldAnnounce = true) {
    if (nextTheme) {
      root.dataset.theme = nextTheme;
    } else {
      delete root.dataset.theme;
    }
    const label = nextTheme === 'day' ? '日间纸页' : nextTheme === 'violet' ? '紫夜模式' : '深色工作台';
    try { localStorage.setItem('views-theme', nextTheme || 'dark'); } catch (_) { /* local preference is optional */ }
    if (shouldAnnounce) bloomPetals(9);
    if (shouldAnnounce) showToast(`已切到：${label}`);
  }

  function cycleTheme() {
    const current = root.dataset.theme || 'dark';
    const next = current === 'dark' ? 'day' : current === 'day' ? 'violet' : 'dark';
    setTheme(next === 'dark' ? '' : next);
  }

  function restorePreferences() {
    try {
      const savedTheme = localStorage.getItem('views-theme');
      if (savedTheme === 'day' || savedTheme === 'violet') setTheme(savedTheme, false);
      if (localStorage.getItem('views-scanlines') === 'off') root.classList.add('hide-scanlines');
    } catch (_) { /* nothing to restore */ }
  }

  function allowsMotion() {
    return !reducedMotion.matches;
  }

  function usesFinePointer() {
    return finePointer.matches;
  }

  function choose(values) {
    return values[Math.floor(Math.random() * values.length)];
  }

  function spawnSparks(x, y, count = 1, spread = 16) {
    if (!allowsMotion() || !sparkLayer) return;
    const symbols = ['✦', '·', '✷', '✧'];
    const colors = ['var(--accent)', 'var(--accent-2)', 'var(--accent-warm)'];
    for (let index = 0; index < count; index += 1) {
      const spark = document.createElement('span');
      spark.className = 'spark';
      spark.textContent = choose(symbols);
      spark.style.left = `${x}px`;
      spark.style.top = `${y}px`;
      spark.style.setProperty('--spark-x', `${(Math.random() - .5) * spread}px`);
      spark.style.setProperty('--spark-y', `${-8 - Math.random() * spread}px`);
      spark.style.setProperty('--spark-rotate', `${(Math.random() - .5) * 220}deg`);
      spark.style.setProperty('--spark-size', `${10 + Math.random() * 10}px`);
      spark.style.setProperty('--spark-color', choose(colors));
      spark.style.setProperty('--spark-duration', `${.44 + Math.random() * .38}s`);
      spark.addEventListener('animationend', () => spark.remove(), { once: true });
      sparkLayer.append(spark);
    }
  }

  function releasePetal(isBurst = false) {
    if (!allowsMotion() || !petalLayer) return;
    const petal = document.createElement('span');
    const colors = ['var(--accent-warm)', 'var(--accent)', 'var(--accent-2)'];
    petal.className = 'petal';
    petal.textContent = choose(['✿', '❀', '✦', '✾']);
    petal.style.left = `${isBurst ? 32 + Math.random() * 36 : Math.random() * 100}vw`;
    petal.style.setProperty('--petal-size', `${13 + Math.random() * 14}px`);
    petal.style.setProperty('--petal-color', choose(colors));
    petal.style.setProperty('--petal-drift', `${(Math.random() - .5) * (isBurst ? 520 : 240)}px`);
    petal.style.setProperty('--petal-duration', `${isBurst ? 2.8 + Math.random() * 1.8 : 8 + Math.random() * 6}s`);
    petal.style.setProperty('--petal-delay', `${isBurst ? Math.random() * .4 : Math.random() * 1.5}s`);
    petal.addEventListener('animationend', () => {
      petal.remove();
      if (!isBurst) window.setTimeout(() => releasePetal(), 650 + Math.random() * 1500);
    }, { once: true });
    petalLayer.append(petal);
  }

  function bloomPetals(count = 12) {
    for (let index = 0; index < count; index += 1) releasePetal(true);
  }

  function initPetalRain() {
    if (!allowsMotion()) return;
    const count = window.innerWidth < 720 ? 7 : 15;
    for (let index = 0; index < count; index += 1) {
      window.setTimeout(() => releasePetal(), index * 230 + Math.random() * 700);
    }
  }

  function initPointerCompanion() {
    if (!allowsMotion() || !usesFinePointer() || !pandaCursor) return;
    let previousX = window.innerWidth / 2;
    let previousY = window.innerHeight / 2;
    let lastTrailAt = 0;
    document.addEventListener('pointermove', event => {
      if (event.pointerType === 'touch') return;
      const deltaX = Math.max(-4, Math.min(4, (event.clientX - previousX) / 14));
      const deltaY = Math.max(-4, Math.min(4, (event.clientY - previousY) / 14));
      previousX = event.clientX;
      previousY = event.clientY;
      pandaCursor.style.setProperty('--cursor-x', `${event.clientX}px`);
      pandaCursor.style.setProperty('--cursor-y', `${event.clientY}px`);
      pandaCursor.style.setProperty('--look-x', `${deltaX}px`);
      pandaCursor.style.setProperty('--look-y', `${deltaY}px`);
      pandaCursor.classList.add('is-visible');
      const now = performance.now();
      if (now - lastTrailAt > 90) {
        lastTrailAt = now;
        spawnSparks(event.clientX, event.clientY, Math.random() > .56 ? 2 : 1, 18);
      }
    }, { passive: true });
    document.documentElement.addEventListener('mouseleave', () => pandaCursor.classList.remove('is-visible'));
    window.addEventListener('blur', () => pandaCursor.classList.remove('is-visible'));
  }

  function initLaunchHero() {
    if (!launchHero) return;
    if (allowsMotion() && usesFinePointer() && launchReticle) {
      launchHero.addEventListener('pointerenter', event => {
        if (event.pointerType !== 'touch') launchHero.classList.add('is-tracking');
      });
      launchHero.addEventListener('pointermove', event => {
        if (event.pointerType === 'touch') return;
        const bounds = launchHero.getBoundingClientRect();
        const x = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
        const y = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height));
        launchHero.style.setProperty('--launch-x', `${x * 100}%`);
        launchHero.style.setProperty('--launch-y', `${y * 100}%`);
        launchHero.style.setProperty('--art-x', `${(x - .5) * -9}px`);
        launchHero.style.setProperty('--art-y', `${(y - .5) * -7}px`);
        launchReticle.style.transform = `translate3d(${event.clientX - bounds.left}px, ${event.clientY - bounds.top}px, 0) translate(-50%, -50%)`;
      });
      launchHero.addEventListener('pointerleave', () => {
        launchHero.classList.remove('is-tracking');
        launchHero.style.setProperty('--art-x', '0px');
        launchHero.style.setProperty('--art-y', '0px');
      });
    }
    launchHero.addEventListener('click', event => {
      if (event.target.closest('a, button')) return;
      spawnSparks(event.clientX, event.clientY, 10, 110);
      launchHero.animate([{ filter: 'brightness(1)' }, { filter: 'brightness(1.08)' }, { filter: 'brightness(1)' }], { duration: 420, easing: 'ease-out' });
      showToast('这颗星已经留在观察台上。');
    });
  }

  function initCardTilt(scope = document) {
    if (!allowsMotion() || !usesFinePointer()) return;
    const selector = '.project-card, .mosaic-card, .note-card';
    const cards = scope.matches?.(selector) ? [scope, ...scope.querySelectorAll(selector)] : [...scope.querySelectorAll(selector)];
    cards.forEach(card => {
      if (card.dataset.tiltReady === 'true') return;
      card.dataset.tiltReady = 'true';
      card.addEventListener('pointermove', event => {
        if (event.pointerType === 'touch') return;
        const bounds = card.getBoundingClientRect();
        const x = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
        const y = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height));
        const rotateX = (0.5 - y) * 5.5;
        const rotateY = (x - 0.5) * 6.5;
        card.classList.add('is-tilting');
        card.style.setProperty('--tilt-x', `${x * 100}%`);
        card.style.setProperty('--tilt-y', `${y * 100}%`);
        card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-7px)`;
      });
      card.addEventListener('pointerleave', () => {
        card.classList.remove('is-tilting');
        card.style.removeProperty('transform');
      });
    });
  }

  function initSecretSequence() {
    const code = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let position = 0;
    window.addEventListener('keydown', event => {
      const target = event.target;
      const typing = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target?.isContentEditable;
      if (typing || event.ctrlKey || event.metaKey || event.altKey || commandDialog.open || noteDialog.open) return;
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      position = key === code[position] ? position + 1 : key === code[0] ? 1 : 0;
      if (position !== code.length) return;
      position = 0;
      clearTimeout(arcadeTimer);
      root.classList.add('arcade-mode');
      bloomPetals(24);
      spawnSparks(window.innerWidth / 2, window.innerHeight * .38, 22, 260);
      showToast('side quest 已开启：工作台获得一点街机能量。');
      arcadeTimer = window.setTimeout(() => root.classList.remove('arcade-mode'), 12000);
    });
  }

  function rollOracle() {
    const currentTitle = oracle.title.textContent;
    const options = oracleCards.filter(card => card.title !== currentTitle);
    const next = options[Math.floor(Math.random() * options.length)] || oracleCards[0];
    const index = String(oracleCards.indexOf(next) + 1).padStart(2, '0');
    oracle.card.animate([
      { transform: 'translateY(0) rotate(0deg)' },
      { transform: 'translateY(-4px) rotate(-.45deg)' },
      { transform: 'translateY(0) rotate(0deg)' },
    ], { duration: 420, easing: 'cubic-bezier(.2,.8,.2,1)' });
    oracle.index.textContent = index;
    oracle.emoji.textContent = next.emoji;
    oracle.title.textContent = next.title;
    oracle.text.textContent = next.text;
    const bounds = oracle.card.getBoundingClientRect();
    spawnSparks(bounds.right - 52, bounds.top + 58, 8, 88);
  }

  function openCommand() {
    if (!commandDialog.open) {
      commandDialog.showModal();
      root.classList.add('dialog-open');
      window.setTimeout(() => commandDialog.querySelector('a, button')?.focus(), 0);
    }
  }

  function closeCommandDialog() {
    if (commandDialog.open) commandDialog.close();
    root.classList.remove('dialog-open');
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>'"]/g, char => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;'
    }[char]));
  }

  function stripHtml(value) {
    return String(value || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function buildFallbackNotes() {
    return [
      {
        id: 'ppi',
        category: 'MACRO NOTE',
        date: '2026-06',
        title: '价格修复之后，真正该盯住的是什么？',
        excerpt: '不只看一个转正读数，而是把库存、订单、产能和传导放到同一张桌子上。',
        cover: 'assets/cover-ppi.webp',
      },
      {
        id: 'supply',
        category: 'TRADE NOTE',
        date: '2026-05',
        title: '供应链不是搬走，而是重新分工。',
        excerpt: '把终端出口和价值链位置拆开看，故事会比“外迁”复杂得多。',
        cover: 'assets/cover-supply-chain.webp',
      },
      {
        id: 'service',
        category: 'FIELD NOTE',
        date: '2026-04',
        title: '服务贸易里，那些很难被价格写清楚的部分。',
        excerpt: '体验、制度和路径依赖，常常才是决定一段旅程是否顺滑的东西。',
        cover: 'assets/cover-service-trade.webp',
      },
    ];
  }

  function renderNotes(notes) {
    noteIndex = new Map(notes.map(note => [String(note.id), note]));
    notesGrid.innerHTML = notes.slice(0, 3).map(note => {
      const id = escapeHtml(note.id);
      const meta = `${escapeHtml(note.category || 'FIELD NOTE')} · ${escapeHtml(note.date || '')}`.replace(/ · $/, '');
      const title = escapeHtml(note.title || '未命名便签');
      const excerpt = escapeHtml(stripHtml(note.excerpt || note.deck || note.html || '这张便签还没有写完。'));
      const cover = escapeHtml(note.cover || 'assets/cover-ppi.webp');
      const alt = escapeHtml(note.coverAlt || note.title || '研究便签封面');
      return `<article class="note-card">
        <img src="${cover}" alt="${alt}" loading="lazy">
        <div class="note-card-body">
          <p class="note-meta">${meta}</p>
          <h3>${title}</h3>
          <p>${excerpt}</p>
          <button class="note-open" data-note-id="${id}" type="button">展开这张便签</button>
        </div>
      </article>`;
    }).join('');
    notesGrid.querySelectorAll('[data-note-id]').forEach(button => {
      button.addEventListener('click', () => openNote(noteIndex.get(button.dataset.noteId)));
    });
    initCardTilt(notesGrid);
  }

  function createNoteDialog() {
    const dialog = document.createElement('dialog');
    dialog.className = 'note-dialog';
    dialog.innerHTML = `<div class="note-dialog-inner">
      <button class="icon-button note-dialog-close" type="button" aria-label="关闭便签">×</button>
      <p class="note-dialog-meta"></p>
      <h2></h2>
      <article></article>
    </div>`;
    document.body.append(dialog);
    dialog.querySelector('.note-dialog-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('close', () => root.classList.remove('dialog-open'));
    dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
    return dialog;
  }

  const noteDialog = createNoteDialog();

  function openNote(note) {
    if (!note) return;
    noteDialog.querySelector('.note-dialog-meta').textContent = `${note.category || 'FIELD NOTE'} · ${note.date || 'NOW'}`;
    noteDialog.querySelector('h2').textContent = note.title || '未命名便签';
    const body = note.html || `<p>${escapeHtml(note.excerpt || note.deck || '这张便签暂时还没有更多内容。')}</p>`;
    noteDialog.querySelector('article').innerHTML = body;
    noteDialog.showModal();
    root.classList.add('dialog-open');
  }

  async function loadNotes() {
    notesGrid.innerHTML = '<p class="loading-note">正在展开工作台上的便签…</p>';
    try {
      const response = await fetch('dist/content.json', { cache: 'no-cache' });
      if (!response.ok) throw new Error('content unavailable');
      const content = await response.json();
      const notes = Array.isArray(content.writings) && content.writings.length ? content.writings : buildFallbackNotes();
      renderNotes(notes);
    } catch (_) {
      renderNotes(buildFallbackNotes());
    }
  }

  function initProjectFilters() {
    const cards = [...document.querySelectorAll('.project-card')];
    const filters = [...document.querySelectorAll('.filter')];
    filters.forEach(filter => {
      filter.addEventListener('click', () => {
        const kind = filter.dataset.filter;
        filters.forEach(item => item.classList.toggle('active', item === filter));
        cards.forEach(card => card.classList.toggle('is-hidden', kind !== 'all' && card.dataset.kind !== kind));
      });
    });
  }

  function initInteractions() {
    initPetalRain();
    initPointerCompanion();
    initLaunchHero();
    initCardTilt();
    initSecretSequence();
    window.addEventListener('scroll', () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress.style.width = `${max > 0 ? Math.min(100, Math.max(0, window.scrollY / max * 100)) : 0}%`;
    }, { passive: true });

    themeButton.addEventListener('click', cycleTheme);
    document.getElementById('shuffleIntro').addEventListener('click', () => {
      const next = heroLines.filter(line => line !== heroText.innerHTML)[Math.floor(Math.random() * (heroLines.length - 1))] || heroLines[0];
      heroText.animate([{ opacity: .25, transform: 'translateY(4px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 280, easing: 'ease-out' });
      heroText.innerHTML = next;
    });
    document.getElementById('portraitTap').addEventListener('click', () => {
      const current = portraitMood.textContent;
      const options = moods.filter(mood => mood !== current);
      const next = choose(options.length ? options : moods);
      portraitMood.textContent = next;
      const portraitFrame = document.getElementById('portraitFrame');
      const isLaunchPulse = portraitFrame.classList.contains('launch-panda-pulse');
      portraitFrame.animate(isLaunchPulse
        ? [{ transform: 'translate(-50%, -50%) scale(1)' }, { transform: 'translate(-50%, -50%) scale(1.24) rotate(-12deg)' }, { transform: 'translate(-50%, -50%) scale(1)' }]
        : [{ transform: 'rotate(2.5deg) scale(1)' }, { transform: 'rotate(-2.5deg) scale(1.035)' }, { transform: 'rotate(2.5deg) scale(1)' }],
      { duration: 420, easing: 'ease-out' });
      const bounds = portraitFrame.getBoundingClientRect();
      bloomPetals(13);
      spawnSparks(bounds.left + bounds.width * .5, bounds.top + bounds.height * .5, 16, 120);
      showToast(`熊猫观察员：${next}`);
    });
    document.getElementById('rollOracle').addEventListener('click', rollOracle);
    commandButton.addEventListener('click', openCommand);
    closeCommand.addEventListener('click', closeCommandDialog);
    commandDialog.addEventListener('close', () => root.classList.remove('dialog-open'));
    commandDialog.querySelectorAll('[data-close-dialog]').forEach(link => link.addEventListener('click', closeCommandDialog));
    document.getElementById('commandTheme').addEventListener('click', () => { cycleTheme(); });
    document.getElementById('commandOracle').addEventListener('click', () => { rollOracle(); closeCommandDialog(); document.getElementById('playbox').scrollIntoView({ behavior: 'smooth', block: 'center' }); });
    document.getElementById('reloadNotes').addEventListener('click', () => { loadNotes(); showToast('已把便签重新摊开。'); });

    window.addEventListener('keydown', event => {
      const target = event.target;
      const typing = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target?.isContentEditable;
      if (typing) return;
      if (event.key === '/' && !commandDialog.open && !noteDialog.open) {
        event.preventDefault();
        openCommand();
      }
      if (event.key.toLowerCase() === 'v' && !commandDialog.open && !noteDialog.open) {
        root.classList.toggle('hide-scanlines');
        try { localStorage.setItem('views-scanlines', root.classList.contains('hide-scanlines') ? 'off' : 'on'); } catch (_) { /* optional local preference */ }
        showToast(root.classList.contains('hide-scanlines') ? '扫描线已关闭。' : '扫描线已开启。');
      }
      if (event.key === 'ArrowUp' && event.ctrlKey) {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  restorePreferences();
  initProjectFilters();
  initInteractions();
  loadNotes();
})();
