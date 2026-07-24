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

  const sidequestRecords = {
    moba: {
      category: 'SIDE QUEST', date: 'TEAM FIGHT', title: '先看局势，再决定往哪走。',
      html: `<p>我喜欢团队游戏里那种信息总是不完整的时刻：你知道一部分位置、一部分资源、一部分冷却，但没人能替你把下一步算完。真正有意思的不是反应有多快，而是能不能在几秒里判断“这波该打、该撤，还是先把视野补上”。</p><p>这和做项目时的感受有点像。不是把所有变量都求清楚才开始，而是知道此刻最该确认哪一个变量，哪一条信息足以改变选择。</p><blockquote>很多好决定，不是更勇敢，而是更早看见了局势已经变了。</blockquote>`,
    },
    civ: {
      category: 'SIDE QUEST', date: '4X / ONE MORE TURN', title: '再玩一回合，然后再想一个系统问题。',
      html: `<p>城市、科技、外交、地形、时间——4X 游戏把很多互相牵扯的系统摆在同一张桌子上。最迷人的地方是：每一步都不是孤立的，它会在十几个回合之后以一种意料之外的方式回来找你。</p><p>我喜欢它提醒人的一件事：指标好看不等于系统健康。把某一项拉满很容易，真正难的是让资源、节奏和选择权能一起往前走。</p><blockquote>“再一回合”有时不是贪心，只是想看看一项选择到底会长成什么样。</blockquote>`,
    },
    fps: {
      category: 'SIDE QUEST', date: 'FPS', title: '手感最好的那局，通常在准备下线之前。',
      html: `<p>FPS 的反馈很诚实：你按下去、听见声音、看见偏差，然后立刻知道自己哪里慢了半拍。它没有太多时间让人用解释掩盖问题，也因此很适合当作一种短暂的注意力训练。</p><p>我并不追求每一局都赢。更喜欢的是那种突然进入节奏的几分钟——判断不再卡顿，动作也不再抢着证明什么，只是在做下一件合适的事。</p><blockquote>手感不是玄学，它是无数次微小反馈终于对齐的那一下。</blockquote>`,
    },
    unserious: {
      category: 'SIDE QUEST', date: 'UNSERIOUS MODE', title: '认真工作，也认真走神。',
      html: `<p>不务正业不是从工作里逃走，而是给脑子留一个不必立刻产出的角落。动画、小说、城市建造、三国，甚至一段看似无用的随机视频，都会把注意力从惯性里挪开一点。</p><p>很多想法不是在“我要解决问题”的时候出现，而是在没有任务条、没有倒计时的地方慢慢接上。这个栏目想给这种时刻留一个正经的位置。</p><blockquote>走神不是空白，它是思路换一条小路回来。</blockquote>`,
    },
    reset: {
      category: 'SIDE QUEST', date: 'RESET', title: '把脑子调回有弹性的状态。',
      html: `<p>有些内容的价值，不是提供新知识，而是把人从过度用力里拉出来。熟悉的画面、荒唐的笑点、一个不用解释的角色，都能让思绪暂时不必维持“专业”的表情。</p><p>我把这种时刻当成系统里的弹性件：它不直接推动进度，却避免整个装置因为过度绷紧而失去回弹。</p><blockquote>真正有效的休息，不一定安静；它只是让你重新有能力感受一点东西。</blockquote>`,
    },
  };

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
        html: `<p>看到一个价格指标抬头，最容易犯的错是立刻把它当成“需求回来了”的证据。更有用的做法，是把它放回一条更长的链里：是谁先涨、涨的是出厂端还是终端、库存有没有同步变化、企业是在补库还是只是在修正报价。</p>
          <p>所以这张便签不想回答“有没有转正”，而是先把需要一起看的几件事摊开。价格只是表面，真正决定修复能不能持续的，是订单能不能接上、产能有没有被真正使用、上游变化能不能走到下游。</p>
          <h3>先把四个观察点排在一起</h3>
          <ul><li><strong>库存：</strong>是在主动去化，还是因为发货变慢而被动堆积？</li><li><strong>订单：</strong>新增订单和在手订单是否同时改善，还是只出现了一个短周期反弹？</li><li><strong>产能：</strong>价格上行来自真实利用率提高，还是局部供给收缩？</li><li><strong>传导：</strong>上游的变化是否已经抵达中下游，而不是停在某一个环节。</li></ul>
          <blockquote>一个“好看的数字”值得记录；一组能彼此解释的数字，才更接近一段趋势。</blockquote>
          <p>后续如果再看同类数据，我会优先补上行业拆分和时间错位，而不是急着写一句结论。它们会让判断慢一点，但也更不容易被单月波动带着走。</p>`,
      },
      {
        id: 'supply',
        category: 'TRADE NOTE',
        date: '2026-05',
        title: '供应链不是搬走，而是重新分工。',
        excerpt: '把终端出口和价值链位置拆开看，故事会比“外迁”复杂得多。',
        cover: 'assets/cover-supply-chain.webp',
        html: `<p>“搬走”是一个很省力的词，但它通常把几件不同的事揉成了一件：终端组装的位置变了、零部件的来源变了、订单的归属变了、还是最关键的设计和控制环节真的换了主人？这些问题的答案不一定相同。</p>
          <p>更接近现实的画面往往是重新分工：有的环节离市场更近，有的环节为了规避波动而多放一层，有的供应商在新的节点建立了备份，但原有网络仍然提供关键部件、标准和经验。</p>
          <h3>看一条链时，先分开这三层</h3>
          <ul><li><strong>货从哪里出：</strong>它告诉我们终端出口的地理变化。</li><li><strong>价值在哪里形成：</strong>它比出货地更接近谁在做关键工作。</li><li><strong>谁还握着接口：</strong>标准、认证、软件、核心零件与客户关系，常常决定了真正的议价位置。</li></ul>
          <blockquote>供应链变动不是地图上箭头的移动，而是一组关系被重新写了一遍。</blockquote>
          <p>因此，下一次再讨论“迁移”，我更想先问它替换了什么、保留了什么，以及这条新链在压力测试下能否继续运转。</p>`,
      },
      {
        id: 'service',
        category: 'FIELD NOTE',
        date: '2026-04',
        title: '服务贸易里，那些很难被价格写清楚的部分。',
        excerpt: '体验、制度和路径依赖，常常才是决定一段旅程是否顺滑的东西。',
        cover: 'assets/cover-service-trade.webp',
        html: `<p>服务很难只用一张价目表说明白。一次旅程是否顺滑，往往取决于很多看上去很小的东西：信息能不能被找到、规则是否讲得明白、支付有没有摩擦、出问题时有没有人接住。这些感受很难直接变成一个价格，却会决定人们是否愿意再来一次。</p>
          <p>这也是我对服务贸易感兴趣的原因。它把制度、语言、基础设施和人的判断都放进同一段体验里；货物过关也许只是一刻，服务的信任却要在很多触点里慢慢累积。</p>
          <h3>把“体验”拆成可观察的部分</h3>
          <ul><li><strong>可见性：</strong>用户能否在需要时找到正确的信息。</li><li><strong>可预期性：</strong>规则、价格和时间是否能被提前理解。</li><li><strong>可恢复性：</strong>出现偏差时，系统有没有给人回到正轨的路径。</li></ul>
          <blockquote>价格是一张入口券；决定是否留下来的，通常是之后每一步的感受。</blockquote>
          <p>把这些拆开之后，服务就不再只是“软性因素”。它们可以被记录、被比较，也可以成为下一轮设计时真正要修的地方。</p>`,
      },
    ];
  }

  function enrichNotes(notes) {
    const fallbackById = new Map(buildFallbackNotes().map(note => [String(note.id), note]));
    return notes.map(note => {
      const fallback = fallbackById.get(String(note.id));
      return fallback && !note.html ? { ...fallback, ...note, html: fallback.html } : note;
    });
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
          <button class="note-open" data-note-id="${id}" type="button">展开全文</button>
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
      renderNotes(enrichNotes(notes));
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

  function initSidequestRecords() {
    document.querySelectorAll('[data-sidequest-open]').forEach(button => {
      button.addEventListener('click', () => {
        const card = button.closest('[data-sidequest]');
        const record = sidequestRecords[card?.dataset.sidequest];
        if (record) openNote(record);
      });
    });
  }

  function initInteractions() {
    initPetalRain();
    initPointerCompanion();
    initLaunchHero();
    initCardTilt();
    initSecretSequence();
    initSidequestRecords();
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
