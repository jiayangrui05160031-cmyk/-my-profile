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
  const notesGrid = document.getElementById('notesGrid');
  const oracle = {
    index: document.getElementById('oracleIndex'),
    emoji: document.getElementById('oracleEmoji'),
    title: document.getElementById('oracleTitle'),
    text: document.getElementById('oracleText'),
    card: document.getElementById('oracleCard'),
  };
  let toastTimer;
  let noteIndex = new Map();

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
      const next = moods.find(mood => mood !== current) || moods[0];
      portraitMood.textContent = next;
      document.getElementById('portraitFrame').animate([{ transform: 'rotate(2.5deg) scale(1)' }, { transform: 'rotate(-2.5deg) scale(1.035)' }, { transform: 'rotate(2.5deg) scale(1)' }], { duration: 420, easing: 'ease-out' });
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
