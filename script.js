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
  const launchRippleLayer = document.getElementById('launchRippleLayer');
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
  let pandaMoveTimer;

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

  const makeImageNote = (asset, title, caption, first, second, quote) => ({
    category: 'FIELD IMAGE',
    date: 'LOOK AGAIN',
    title,
    html: `<figure><img src="${asset}" alt=""><figcaption>${caption}</figcaption></figure><p>${first}</p><p>${second}</p><blockquote>${quote}</blockquote>`,
  });

  const assetNotes = {
    cs2: makeImageNote('assets/cs2.png', '门口的两秒钟', '狭窄门洞、前压的人和还没跟上的队友。', '图里的人已经侧身进到门边，枪口朝前，后面的人还留在阴影里。它抓住了对局里最有张力的一小段：信息不完整，但时间不等人。', '我喜欢它把“先手”拍得这么具体。不是热血地冲出去，而是拿一点风险换一小段空间，再看这一小段空间到底值不值得继续押。', '先拿到位置，再决定要不要把整个人交出去。'),
    'arena-panda': makeImageNote('assets/hobby-arena_001.jpg', '把胜负做成玩具', '紫色格斗场里，小熊猫把两只手举起来。', '霓虹、格子、漂浮的图标都在提醒你：这里有规则、有对抗、有输赢；可中间那只熊猫的姿势又把气氛拽回了“先玩一下”。', '这张图让我觉得，系统可以设计得很认真，表达却不必一直板着脸。好玩的界面不是降低复杂度，而是给复杂度留一个亲近的入口。', '规则越多，越需要一个让人愿意靠近它的表情。'),
    'golden-walk': makeImageNote('assets/hobby-book_001.jpg', '朝着亮处走的三个人', '金色原野、远山，以及三个没有回头的背影。', '它几乎没有剧情：人很小，草地很大，远处的光比人物更先占据画面。也正因为这样，画面里没有“马上要抵达”的压力。', '我想把这种节奏留在页面里。不是每一次阅读、每一个项目都要立刻产出一句结论；有时先沿着地形走一段，才会知道问题原来在哪里。', '不急着翻到最后一页，也是一种前进。'),
    'civ-panda': makeImageNote('assets/hobby-civ6_001.jpg', '系统也可以穿一件红袍', '小熊猫穿着红色礼服，身后是宫殿、山水和一条很长的路。', '这张画面把“文明”“制度”这种很容易变得硬邦邦的词，放回了一个有角色、有仪式感的世界里。它不是地图上的色块，而是一个人站在选择之前。', '我做数据或规则类东西时常提醒自己：再抽象的系统，最后也会落到具体的人怎样行动、怎样等待、怎样彼此理解。', '系统不是冷的；它只是需要被讲成有人愿意走进去的故事。'),
    'sniper-panda': makeImageNote('assets/hobby-cs2_001.jpg', '开镜等于删掉噪音', '蓝绿光里，一只熊猫端着狙击枪，只留下一个方向。', '这个画面最有意思的地方不是“瞄准”，而是背景被压成了模糊的色块。开镜之后，世界没有变简单，只是眼前暂时只剩一个需要确认的变量。', '这很像做研究时真正有用的收束：不是把所有信息都抓住，而是知道这一轮先把哪个问题看清。', '注意力不是加法，它更像一次有意识的删减。'),
    'controller-panda': makeImageNote('assets/hobby-lol_001.jpg', '按下开始，不必有产出', '手柄、彩色宝石和一张很高兴的熊猫脸。', '这张图没有给“玩”找理由。它只是把手柄放在画面正中，周围是像奖励一样的彩色碎片，表情也没有任何要证明自己的意思。', '我很想保留这种不带任务条的时刻。不是所有活动都要被包装成“恢复效率”；有些快乐只要自己成立，就已经够了。', '玩不是为了回来更能工作，玩本身就可以是目的。'),
    'sunset-cavalry': makeImageNote('assets/hobby-sanguo_001.jpg', '太阳落下以后，队伍还在走', '橙红色的天、很小的骑兵和被风拉长的旗。', '人被压到很小，旌旗和地平线反而占了更多位置。这个构图会让人立刻感到：每个人都在一个比自己大得多的局面里移动。', '历史和策略游戏迷人的地方都在这里——不是谁更像主角，而是谁在看不全地图的时候，仍然愿意对下一步负责。', '局势比人更大，但下一步永远还是要有人来走。'),
    'arena-cover': makeImageNote('assets/real-arena.png', '留白里的开局', '水墨、人物、武器和一大片没有被填满的白。', '很多游戏海报会把元素堆满，这张却把人物放在大片留白里。看起来像在等一个动作，也像在给观众留出自己补全故事的空间。', '我喜欢这种克制。做页面也一样，不需要把每一处都解释到尽头；适当的空白会让真正重要的关系更清楚。', '留白不是没做完，它是在把视线交回来。'),
    'caocao-portrait': makeImageNote('assets/real-caocao.png', '不把人物拍成答案', '深色壁画前，一张没有急着表态的古代人物肖像。', '人物没有摆出胜利姿势，也没有把目光直接交给镜头。脸上的皱纹和暗色背景让它更像一个正在盘算的人，而不是某个已经写好的结论。', '我喜欢这样看历史人物：先别急着替他贴标签，先看看他当时掌握了什么、误判了什么、又在害怕失去什么。', '把人当成问题来读，比把人当成答案更有意思。'),
    'strategy-map': makeImageNote('assets/real-lol.png', '把欧洲塞进一张操作台', '地图、国家颜色、部队图标和一整排面板同时亮着。', '这类界面一开始看着很吵：地形、国界、数字、资源、部队，全在争同一块注意力。但玩久了会发现，它其实是在训练人把不同尺度的事放到一起看。', '短期的战线、长期的工业、眼前的缺口和以后会爆出来的代价，没法只靠一个“最优解”处理。这个画面就是系统思维最直接的草稿纸。', '指标好看不等于局面健康，地图会在下一回合提醒你。'),
    'trophy-team': makeImageNote('assets/real-lpl.png', '奖杯不是一个人举起来的', '几个人在镜头前一起抬起奖杯，手势比奖杯本身更显眼。', '真正打动我的不是奖杯，而是几个人把手放到同一个重量上。庆祝当然属于聚光灯，但那个动作提醒人：最后能被看见的结果，通常由很多不在画面中央的配合托着。', '这也是团队项目里我最在意的部分。把成果说清楚很重要，但别把协作压缩成一个人的叙事。', '漂亮的结果，往往是很多人把同一件事抬稳。'),
    'city-overview': makeImageNote('assets/城市天极限.png', '从上面看，城市会暴露逻辑', '道路、水面、住宅和高楼被拉到同一个俯视平面。', '从高处看城市，最先出现的不是建筑有多漂亮，而是路怎么接、水怎么绕、密度在哪里突然断掉。城市会把那些平时被遮住的规则全摊开。', '我喜欢城市建造类游戏，也因为它让我反复练习一件事：局部看起来合理，不代表系统整体能顺滑地呼吸。', '一座城市不是一堆楼，是很多流动关系暂时达成了平衡。'),
    doraemon: makeImageNote('assets/多来a梦.png', '一张不需要解释的合照', '哆啦A梦和伙伴们挤在浅蓝、明黄的画面里。', '它的颜色很轻，人物又都很熟悉，所以不需要先理解设定，也不需要把情绪整理好。看到的一瞬间，脑子会自动放下一点防御。', '我把这种画面当成一块没有任务的缓冲区。它不负责启发、也不负责教会什么，只负责让人从太紧的状态里退半步。', '有些熟悉感，不需要被翻译成生产力。'),
    'hex-aram': makeImageNote('assets/海克斯大乱斗.png', '随机性也有节奏', '冰桥、技能光效、多人混战，以及不断变形的战局。', '画面看上去全是随机：技能飞来飞去，角色挤在一条窄路上，下一秒可能什么都变了。但玩过就会知道，随机不是没有规律，它会逼人快速找新的配合方式。', '这很适合提醒自己别把“不可控”误读成“无法判断”。有时你不能决定抽到什么牌，但可以决定怎样把手里的牌排成一条路。', '变化不是噪音，它也可以提供新的节奏。'),
    'sima-portrait': makeImageNote('assets/司马懿.png', '同一张脸，另一种等待', '近景肖像把目光、皱纹和停顿都留了下来。', '这张和前面的古代人物肖像形成了一次有意的回看：同样是深色底、同样是克制的表情，换一个名字，读法就会跟着变。', '我喜欢把同一类画面放在一起，因为它能提醒人不要被标签牵着走。很多“果断”与“隐忍”的差别，往往只是在叙事里被重新命名了。', '等待不是空白；它也是在为下一步积累条件。'),
    'civ-map': makeImageNote('assets/文明6-1.png', '一座城市密到开始有性格', '建筑、道路、资源和图标把整片地图织得很满。', '这张图不再像一座“漂亮的城”，而像一个已经有了习惯的系统：哪里密，哪里空，哪里一直在供给别处，哪里只是表面热闹。', '复杂系统真正有趣的时刻，是元素多到不再能靠单条因果解释，但你仍然能慢慢看出它的性格和偏好。', '当结构足够丰富，地图也会长出自己的脾气。'),
    'arena-reframe': makeImageNote('assets/英雄联盟.png', '同一场景，换一个观察点', '同一张水墨竞技画面，被当作第二次观看而不是第二次展示。', '这里故意把同一幅画再次留下。不是为了重复，而是想试试把它从“封面”变成“构图”：第一次看人物和气势，第二次看留白、视线和各个角色之间的距离。', '很多图、很多数据也是这样。换一次问题再看，原来被当作背景的东西，可能才是线索。', '第二次看，不是重复；是让第一眼没来得及出现的东西出来。'),
    'team-reframe': makeImageNote('assets/英雄联盟1.png', '庆祝的镜头会放大团队', '同一支队伍、同一座奖杯，镜头再次把手和眼神收进来。', '奖杯画面被多看一次，反而更容易注意到每个人的姿势不同：有人抬，有人扶，有人看向队友。所谓“共同”，并不是大家做同一个动作。', '做项目也一样。协调不是把每个人变得一样，而是让不同的位置能在关键时刻把力量合到同一个方向。', '真正的配合，是差异没有被抹掉，却能一起发力。'),
    'champion-night': makeImageNote('assets/英雄联盟3.png', '冠军时刻之后的静默', '黑夜、金色碎屑、奖杯和几张抬起来的脸。', '比起白天的领奖照，这张更像一个故事收束时的镜头。灯光把奖杯照得很亮，周围却仍然留着大片暗处，像是在提醒胜利也只是一段很长过程里的一个停顿。', '我喜欢这种不完全喧闹的庆祝：结果值得高兴，但不必把它写成“从此一切都解决了”。下一局、下一个项目，总会再把人带回具体的问题里。', '把一刻举高，然后继续回到桌前。'),
    workspace: makeImageNote('assets/workspace_001.jpg', '资料要有地方回找', '工作台上的物件并不整齐，却各自有可以回去的位置。', '我喜欢工作台不是因为它看起来“专业”，而是因为它让信息暂时有了物理感：一张纸、一支笔、一块屏幕，都在提醒人事情还可以被重新排开。', '做复杂项目时，先把桌子收拾成能回溯的样子，往往比立刻想出一句漂亮的话更有用。', '先让东西找得到，再让判断发生。'),
    'panda-team': makeImageNote('assets/panda-team_001.jpg', '熊猫观察员：看，不吃竹', '一群熊猫围在同一张工作台旁边。', '我把熊猫放在这里，不是为了做一个可爱吉祥物。它更像一种提醒：认真看、慢一点看，也不妨保持一点笨拙和好奇。', '很多页面把“聪明”做得太紧，反而让人不敢点。这个小角色更想把门打开——可以研究，也可以开玩笑，可以认真，也可以绕路。', '保持观察，不必一直绷着。'),
    dashboard: makeImageNote('assets/panda-dashboard_001.jpg', '把信号排成能读懂的顺序', '熊猫、面板和一组还没有被解释完的信号。', '看板的价值不在于把数字变多，而在于给人一个能来回确认的顺序：先看什么，再看什么，看到异常之后回到哪里找原因。', '这张图放在关于页，是因为它很像这个站点的底色——不是替人把世界判断完，而是把值得继续看的东西排到一张桌上。', '好看板不是答案墙，它是一条回去找问题的路。'),
    'signature-bilingual': makeImageNote('assets/sig-bilingual_001.jpg', 'keep looking around', '一句双语签名，像给页面留下的轻声注脚。', '签名很小，信息也不多，但它把这里的语气定下来了：不急着宣告什么，只是继续往四周看。', '我喜欢这种不把自己写得太满的结尾。网站可以有项目、有结果，也可以只留一句让人愿意多逛一会儿的话。', '看得更远一点，也看得更松一点。'),
    'signature-jia': makeImageNote('assets/sig-jia_001.jpg', '留下一个小记号', '很轻的一笔手写签名，几乎像画面里的一次停顿。', '这个小签名的力量恰好来自它没有抢画面。它只是告诉你：这里被谁看过、也被谁留意过。', '我不想把 views 做成一张过度完成的名片。留一点不规整的小记号，反而更像一张会继续修改的工作台。', '别把一切收得太死，给下一次改动留个入口。'),
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
        launchHero.style.setProperty('--art-x', `${(x - .5) * -32}px`);
        launchHero.style.setProperty('--art-y', `${(y - .5) * -21}px`);
        launchHero.style.setProperty('--art-rx', `${(y - .5) * -3.2}deg`);
        launchHero.style.setProperty('--art-ry', `${(x - .5) * 3.4}deg`);
        launchReticle.style.transform = `translate3d(${event.clientX - bounds.left}px, ${event.clientY - bounds.top}px, 0) translate(-50%, -50%)`;
      });
      launchHero.addEventListener('pointerleave', () => {
        launchHero.classList.remove('is-tracking');
        launchHero.style.setProperty('--art-x', '0px');
        launchHero.style.setProperty('--art-y', '0px');
        launchHero.style.setProperty('--art-rx', '0deg');
        launchHero.style.setProperty('--art-ry', '0deg');
      });
    }
    launchHero.addEventListener('click', event => {
      if (event.target.closest('a, button')) return;
      spawnSparks(event.clientX, event.clientY, 10, 110);
      spawnLaunchRipple(event.clientX, event.clientY);
      launchHero.animate([{ filter: 'brightness(1) saturate(1)' }, { filter: 'brightness(1.13) saturate(1.22)' }, { filter: 'brightness(1) saturate(1)' }], { duration: 520, easing: 'ease-out' });
      showToast('这颗星已经留在观察台上。');
    });
  }

  function spawnLaunchRipple(clientX, clientY) {
    if (!allowsMotion() || !launchHero || !launchRippleLayer) return;
    const bounds = launchHero.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'launch-ripple';
    ripple.style.left = `${clientX - bounds.left}px`;
    ripple.style.top = `${clientY - bounds.top}px`;
    ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
    launchRippleLayer.append(ripple);
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

  function initAssetShelf() {
    const shuffleShelf = document.getElementById('shuffleShelf');
    const tiles = [...document.querySelectorAll('.asset-tile')];
    const noteTargets = [...document.querySelectorAll('[data-asset-note]')];
    if (!tiles.length) return;
    let featureTimer;
    const openAssetNote = target => {
      const note = assetNotes[target.dataset.assetNote];
      if (!note) return;
      openNote(note);
      const bounds = target.getBoundingClientRect();
      spawnSparks(bounds.left + bounds.width * .5, bounds.top + bounds.height * .44, 9, 92);
      showToast(`打开：${note.title}`);
    };
    noteTargets.forEach(target => {
      target.addEventListener('click', () => openAssetNote(target));
      target.addEventListener('keydown', event => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        openAssetNote(target);
      });
    });
    if (!shuffleShelf) return;
    shuffleShelf.addEventListener('click', () => {
      const current = tiles.find(tile => tile.classList.contains('is-featured'));
      const next = choose(tiles.filter(tile => tile !== current));
      tiles.forEach(tile => tile.classList.remove('is-featured'));
      next.classList.add('is-featured');
      const title = next.querySelector('figcaption b')?.textContent || '一张收藏画面';
      next.scrollIntoView({ behavior: allowsMotion() ? 'smooth' : 'auto', block: 'nearest', inline: 'nearest' });
      window.setTimeout(() => {
        const bounds = next.getBoundingClientRect();
        spawnSparks(bounds.left + bounds.width * .52, bounds.top + bounds.height * .48, 13, 115);
        bloomPetals(7);
      }, allowsMotion() ? 260 : 0);
      clearTimeout(featureTimer);
      featureTimer = window.setTimeout(() => next.classList.remove('is-featured'), 2300);
      showToast(`翻到：${title}`);
    });
  }

  function initAmbientTrack() {
    const audio = document.getElementById('ambientAudio');
    const musicToggle = document.getElementById('musicToggle');
    const musicStatus = document.getElementById('musicStatus');
    const musicDock = document.getElementById('musicDock');
    const musicDockText = document.getElementById('musicDockText');
    if (!audio || !musicToggle || !musicStatus || !musicDock) return;
    audio.volume = .36;
    const setMusicState = playing => {
      musicToggle.classList.toggle('is-playing', playing);
      musicToggle.setAttribute('aria-pressed', String(playing));
      musicToggle.setAttribute('aria-label', playing ? '暂停夏日钢琴' : '播放夏日钢琴');
      musicStatus.textContent = playing ? '正在播放 · 点一下暂停' : '点一下，听一段夏日钢琴';
      musicDock.classList.toggle('is-visible', playing);
      musicDock.setAttribute('aria-label', playing ? '暂停夏日钢琴' : '播放夏日钢琴');
      if (musicDockText) musicDockText.textContent = playing ? '夏日钢琴正在播放' : '播放夏日钢琴';
      launchHero?.classList.toggle('is-listening', playing);
    };
    const toggleTrack = async () => {
      if (!audio.paused) {
        audio.pause();
        return;
      }
      try {
        await audio.play();
      } catch (_) {
        setMusicState(false);
        showToast('这段音乐还没能开始，点一下再试试。');
      }
    };
    musicToggle.addEventListener('click', toggleTrack);
    musicDock.addEventListener('click', toggleTrack);
    audio.addEventListener('play', () => {
      setMusicState(true);
      bloomPetals(6);
      showToast('夏日钢琴开始了。');
    });
    audio.addEventListener('pause', () => {
      setMusicState(false);
      showToast('音乐暂停，工作台安静下来。');
    });
    audio.addEventListener('error', () => {
      setMusicState(false);
      showToast('这段音乐暂时没有加载出来。');
    });
  }

  function initInteractions() {
    initPetalRain();
    initPointerCompanion();
    initLaunchHero();
    initCardTilt();
    initSecretSequence();
    initSidequestRecords();
    initAssetShelf();
    initAmbientTrack();
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
      if (!portraitFrame) return;
      const isLaunchPulse = portraitFrame.classList.contains('launch-panda-pulse');
      portraitFrame.animate(isLaunchPulse
        ? [{ transform: 'translate(-50%, -50%) scale(1)' }, { transform: 'translate(-50%, -50%) scale(1.24) rotate(-12deg)' }, { transform: 'translate(-50%, -50%) scale(1)' }]
        : [{ transform: 'rotate(2.5deg) scale(1)' }, { transform: 'rotate(-2.5deg) scale(1.035)' }, { transform: 'rotate(2.5deg) scale(1)' }],
      { duration: 420, easing: 'ease-out' });
      const bounds = portraitFrame.getBoundingClientRect();
      if (launchHero) {
        clearTimeout(pandaMoveTimer);
        launchHero.classList.remove('is-panda-moving');
        void launchHero.offsetWidth;
        launchHero.classList.add('is-panda-moving');
        pandaMoveTimer = window.setTimeout(() => launchHero.classList.remove('is-panda-moving'), 1600);
      }
      bloomPetals(13);
      spawnSparks(bounds.left + bounds.width * .5, bounds.top + bounds.height * .5, 16, 120);
      spawnLaunchRipple(bounds.left + bounds.width * .5, bounds.top + bounds.height * .5);
      showToast(`大熊猫：${next}`);
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
