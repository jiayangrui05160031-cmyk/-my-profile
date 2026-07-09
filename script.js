/* ==========================================================================
   贾洋瑞的博客 v4 - Markdown 驱动
   内容由 content/writing/*.md + content/projects/*.md 通过 build.js 生成
   ========================================================================== */


let articles = {};
let projectsData = [];

/* ====== 自定义数据（不依赖 Markdown） ====== */

const selfQuotes = [
  '"比起聪明，我更想做一个较真的人。资料查到底，模型跑到底，话说到位。"',
  '"数据不讲故事的时候，就让数据多等等。"',
  '"一句话能说清楚的事，绝对不用两句话。"',
  '"我可以承认错误，但绝不接受"差不多先生"的解释。"',
  '"我是那种 —— 开完会把每一条 action item 抄到手账本上的人。"',
  '"玩就痛快玩，做就认真做。最讨厌那种写着玩的代码注释。"',
  '"如果你想做研究，先让自己一周读完 50 万字再说。"',
  '"态度比智商重要 100 倍 —— 这话没有数据支撑，但我觉得对。"',
  '"我其实挺挑剔的，所以选 music 也是 ≤ 3 首歌循环一整天。"',
  '"别叫我博主 —— 我就是个研究做累了写写东西的研究助理。"',
];

const hitokotoList = [
  '「复杂的事情简单做，简单的事情重复做，重复的事情认真做。」',
  '「纸上得来终觉浅，绝知此事要躬行。」',
  '「数据本身不会撒谎，但读数据的人会。保持怀疑是个好习惯。」',
  "Don't panic.",
  '「看清眼前这一步，路会在脚下延伸出来。」',
  '「模型跑出来漂亮 ≠ 业务能用。生产环境才是考场。」',
  '「做研究的乐趣，是从混沌里揪出一条线索的那一秒。」',
  '「较真和固执只有一线之隔 —— 区别是更看哪个反例。」',
  '「比你优秀的人并不可怕，可怕的是比你优秀还比你努力。」',
  '「研究方法论上少争论。回到数据上看。」',
  '「Console.log 是真理。」',
];

const pandaMoods = {
  hello:    { text: '嗨！我是你的博客新门面 🐼', next: 'WORKING' },
  working:  { text: '正在算 PPI 数据 ……别吵', next: 'READING' },
  reading:  { text: '在读 WTO 关税文件，超厚的', next: 'THINKING' },
  thinking: { text: '嗯 …… 第三个问题的答案有点意思', next: 'ANGRY' },
  angry:    { text: '"差不多就行" —— 我较真了', next: 'SLEEPY' },
  sleepy:   { text: '研究 16h 后是这样的状态', next: 'HELLO' },
};

const terminalCmds = {
  help: () => `<span class="term-success">可用命令：</span>
  <span class="term-link" data-term="about">about</span> · 关于我
  <span class="term-link" data-term="github">github</span> · 我的仓库
  <span class="term-link" data-term="wechat">wechat</span> · (真留吗? 嗯就留个邮箱)
  <span class="term-link" data-term="fact">fact</span> · 随机冷知识
  <span class="term-link" data-term="coffee">coffee</span> · ☕
  <span class="term-link" data-term="clear">clear</span> · 清屏
  <span class="term-link" data-term="data">data</span> · 给我看一组随机数据
  <span class="term-link" data-term="hire">hire</span> · 招聘请走邮件
  <span class="term-link" data-term="why">why</span> · 为什么较真？
  <span class="term-link" data-term="konami">konami</span> · 别试了`,
  about: () => `我是 <em>贾洋瑞</em>，对外经贸研一。
我喜欢：<em>⚖️ 较真的数据</em> + <em>🐼 好看的图</em>。
不喜欢的：写得很满但啥也没说的报告。
邮件：<span class="term-link">jiayangrui05160031@gmail.com</span>`,
  github: () => `<em>5</em> 个仓库 · 主战场：
  · <span class="term-link" data-link="https://github.com/jiayangrui05160031-cmyk/chinatrade-decision">chinatrade-decision</span> (WTO 决策 Agent)
  · <span class="term-link" data-link="https://github.com/jiayangrui05160031-cmyk/video-analysis-agent">video-analysis-agent</span>
  · <span class="term-link" data-link="https://github.com/jiayangrui05160031-cmyk/ecommerce-rfm-customer-segmentation">ecommerce-rfm</span>
  · <span class="term-link" data-link="https://github.com/jiayangrui05160031-cmyk/people-daily-economy-daily">macro-daily</span>
  · <span class="term-link" data-link="https://github.com/jiayangrui05160031-cmyk/-my-profile">-my-profile</span> (本博客开源)`,
  wechat: () => `<span class="term-error">微信不留，留邮件谢谢 —— 不刷朋友圈。</span>
如果你一定要加，先发邮件自我介绍 100 字。`,
  fact: () => {
    const facts = [
      'WTO 2024 年收到的全球贸易政策通报达 3,200+ 条，是历史峰值。',
      '中国 RFM 用户运营最常用阈值是「180 天」没买就流失 —— 实际要看品类。',
      '2016-2024 年间，PPI 累计最长负增长是 41 个月，刚结束。',
      '中国制造业出口前三大中间品：电子元件、机械、纺织纱线。',
      '看一份报告 30 秒够不够？够的 —— 一般读完 abstract 就能知道水不水。',
    ];
    return `随机冷知识：<em>${facts[Math.floor(Math.random() * facts.length)]}</em>`;
  },
  coffee: () => `☕ 咖啡是研究助理的最佳燃料。我自己一天 3 杯。
……不骗你。`,
  clear: () => { document.getElementById('termBody').innerHTML = ''; return null; },
  data: () => {
    const lines = [
      '样本里 18% 是夜猫子，9% 是早起型。',
      'PPI 弹性相关系数 = 0.72（保守）。',
      '网购时间中位数 = 22:14。',
      '研究助手日均阅读字数 ≈ 42000 字（统计区间：本人）。',
    ];
    return `今日样本：<em>${lines[Math.floor(Math.random() * lines.length)]}</em>
（数据来源：声明是不公开的）`;
  },
  hire: () => `招聘请走邮件：<span class="term-link">jiayangrui05160031@gmail.com</span>
主题请写"应聘 - XXX 岗位"，正文 3 段：
1. 你是谁
2. 觉得我能为团队带来什么
3. 你的期望薪资区间
（特别认真就回 —— 我较真的）`,
  why: () => `<em>因为差不多先生永远找不到问题的根源。</em>
这是我对自己最坚信的事。`,
  konami: () => `↑↑↓↓←→←→BA？<br>啊你说的是那个彩蛋啊 —— 你得自己输入一个 konami code 才认。`,
  default: () => `<span class="term-error">命令未识别。键入 help 查看可用命令。</span>`,
};

const dicePool = [
  { e: '📚', t: '今天适合读一份学术报告 —— 比如 World Bank 的 Macro Poverty Outlook' },
  { e: '🤖', t: '今天适合和 LLM 较劲 —— 让 Agent 帮你拉一份 2 万字的政策综述' },
  { e: '🛌', t: '今天适合补觉 —— 研究助理也需要休息，研究会等你' },
  { e: '💪', t: '今天适合跑数 —— 把那份拖了 3 天的 PPT 跑出来' },
  { e: '🌧', t: '今天适合摸鱼 —— 所有人都会原谅你，包括你自己' },
  { e: '🐼', t: '今天适合吃竹子 —— 哦不对，吃火锅' },
  { e: '✨', t: '今天适合见朋友 —— 自然科学规律：聊 30 分钟胜过刷 2 小时小红书' },
  { e: '🧘', t: '今天适合发呆 —— 把脑子清空，也许答案自己会来' },
];

/* ==========================================================================
   内容加载 (从 ARTICLES_DATA / PROJECTS_DATA / dist/content.json)
   ========================================================================== */










const ARTICLES_DATA = {
  "ppi": {
    "id": "ppi",
    "number": "01",
    "featured": true,
    "kicker": "宏观周期 · 2026-06 · 8 分钟",
    "title": "PPI 转正之后：这轮工业价格回升，到底有多扎实？",
    "deck": "41 个月负增长终于结束，但转正并不等于新一轮全面上行。把大宗商品、库存、产能与地产四条线放在一起，才能看清这次修复的成色。",
    "image": "assets/cover-ppi.webp",
    "alt": "工业价格与库存周期的 3D 数据意象",
    "body": "<h2>一场很长的负增长</h2>\n<p>本轮 PPI 同比负增长始于 2022 年 10 月，持续时间显著长于过去几轮工业品价格下行周期。它最特别的地方并不是跌得最深，而是拖得足够久：需求不足、房地产调整、产能周期与全球产业链重构同时作用，让价格修复很难靠单一变量解释。</p>\n<p>2026 年 3 月转正，是一个值得标记的时点，却不是周期已经反转的充分证据。判断&quot;成色&quot;，至少要同时看四条线：国际大宗商品、库存、产能利用率与地产需求。</p>\n<h2>价格先动，需求还在路上</h2>\n<p>本轮回升最直接的推力来自原油、铜等国际商品价格。上游采矿和原材料行业先行反弹，涨幅沿产业链向下游逐级衰减，消费品价格仍然偏弱。这与 2016 年供给侧改革带动的上中下游同步修复并不相同。</p>\n<blockquote>\n<p>同比转正回答的是&quot;价格有没有回升&quot;，产业链传导回答的才是&quot;回升能走多远&quot;。</p>\n</blockquote>\n<p>库存数据则给出了第二条线索。规上工业存货与产成品存货从低位回升，企业开始从被动去库切向主动补库。但原材料购进价与出厂价之间的剪刀差仍大，订单改善也不稳定，意味着补库的一部分动力来自涨价预期，而非终端需求的全面扩张。</p>\n<h2>两个约束：产能与地产</h2>\n<p>一季度规模以上工业产能利用率仍处于偏低位置。非金属矿物制品、煤炭等行业的闲置产能，会吸收需求回暖带来的价格弹性。与 2016 年大力度去产能相比，本轮产能出清节奏更平缓，价格上行的斜率自然也更温和。</p>\n<p>更关键的缺席者是房地产。地产链约束建材、黑色金属与耐用消费品价格，也是本轮修复与过去周期最大的不同之一。只有当外部涨价、库存回补逐渐交棒给真实订单与企业资本开支，PPI 回升才会从&quot;读数改善&quot;变成&quot;盈利改善&quot;。</p>\n<h2>我的判断</h2>\n<p>这轮转正是真实的，但暂时更像结构性修复，而不是全面再通胀。接下来最值得观察的不是 PPI 本身，而是新订单、产能利用率、下游利润率与地产链价格能否形成共振。</p>\n",
    "excerpt": "41 个月负增长终于结束，但转正并不等于新一轮全面上行。把大宗商品、库存、产能与地产四条线放在一起，才能看清这次修复的成色。",
    "cover": "assets/cover-ppi.webp",
    "coverAlt": "工业价格与库存周期的 3D 数据意象",
    "coverPosition": "center 48%",
    "visualLabel": "工业价格 / 库存周期",
    "category": "宏观周期",
    "date": "2026-06",
    "dateISO": "2026-06",
    "readingMinutes": 8
  },
  "supply": {
    "id": "supply",
    "number": "02",
    "featured": false,
    "kicker": "国际经贸 · 2026-05 · 9 分钟",
    "title": "中国 + 1：不是离开中国，而是供应链角色的重新分配",
    "deck": "越南、墨西哥与非洲承接了什么？中国又保留了什么？从终端出口到供应链价值输出，故事比\"产业外迁\"复杂得多。",
    "image": "assets/cover-supply-chain.webp",
    "alt": "全球供应链网络的 3D 意象",
    "body": "<h2>从关税规避开始</h2>\n<p>&quot;中国 + 1&quot;最初并不是企业对中国制造能力的否定，而是高关税与原产地规则之下的现实调整。企业把最后组装转移到第三国，以维持目标市场的成本与准入条件；与此同时，中国对这些承接地的中间品、设备与零部件出口反而快速增长。</p>\n<p>因此，看到终端产能迁出，只看到了故事的一半。另一半是：中国从直接向消费市场出口成品，转向向海外工厂输出一整套生产能力。</p>\n<h2>三种承接地，三种分工</h2>\n<p>越南更像&quot;走廊型&quot;节点，承接电子组装与劳动密集环节，背后仍高度依赖中国零部件；墨西哥依靠 USMCA 与近岸优势，承接面向北美的资本密集制造；非洲依托劳动力、资源与关税条件，形成更长周期的产业梯度。</p>\n<blockquote>\n<p>产能分散不等于价值分散。谁掌握组装背后的设备、材料与标准，谁仍然掌握产业链的核心增值环节。</p>\n</blockquote>\n<h2>&quot;双三角&quot;正在形成</h2>\n<p>一条链路是&quot;中国制造—东盟组装—美欧消费&quot;，另一条是&quot;中国制造—墨西哥组装—北美消费&quot;。两条路径方向不同，却都以中国供应链为共同上游。越南与墨西哥作为连接型经济体，正在把原本的双边贸易关系改写为更复杂的三角网络。</p>\n<p>这也解释了一个看似矛盾的现象：终端出口份额可能被第三国替代，中国的中间品出口与对外投资却同步扩张。制造业竞争力的载体，正在从&quot;产品&quot;变成&quot;系统&quot;。</p>\n<h2>真正的风险在哪里</h2>\n<p>这种结构并非没有脆弱点。更严格的原产地追溯、投资审查和本地化要求，可能继续压缩简单转口空间。中国企业需要把优势从成本与供应速度，进一步推进到核心设备、关键材料、技术服务与全球运营能力。</p>\n",
    "excerpt": "越南、墨西哥与非洲承接了什么？中国又保留了什么？从终端出口到供应链价值输出，故事比\"产业外迁\"复杂得多。",
    "cover": "assets/cover-supply-chain.webp",
    "coverAlt": "全球供应链网络的 3D 意象",
    "coverPosition": "center 52%",
    "visualLabel": "供应链网络 / 中国 + 1",
    "category": "国际经贸",
    "date": "2026-05",
    "dateISO": "2026-05",
    "readingMinutes": 9
  },
  "travel": {
    "id": "travel",
    "number": "03",
    "featured": false,
    "kicker": "服务贸易 · 2026-04 · 7 分钟",
    "title": "入境旅行不只是旅游生意，也是一次制度体验",
    "deck": "签证、支付、交通与语言服务共同决定一段旅程。旅行服务出口，恰好是观察制度型开放是否真正落地的一扇窗。",
    "image": "assets/cover-service-trade.webp",
    "alt": "跨境旅行与服务贸易的 3D 意象",
    "body": "<h2>为什么要从&quot;出口&quot;看旅行</h2>\n<p>旅行服务出口是境外游客在中国购买住宿、交通、餐饮、文化体验等服务形成的收入。它不仅能对冲旅行服务逆差，也提供了一种与货物贸易不同的外汇收入来源。更重要的是，它把文化吸引力转化成了可以衡量的跨境消费。</p>\n<h2>每一段旅程，都是一次压力测试</h2>\n<p>国际游客面对的并不只是景点。签证是否便利、国际航线是否充足、境外银行卡和移动支付是否顺畅、交通与语言服务是否友好，共同构成了真实的旅行产品。</p>\n<blockquote>\n<p>自然景观决定一个人想不想来，制度与服务决定他来了之后愿不愿意消费、会不会再来。</p>\n</blockquote>\n<p>过境免签扩容降低了进入门槛，离境退税与支付便利化降低了消费摩擦，空铁联运扩大了入境流量的辐射范围。几项政策只有形成组合，才能把&quot;流量&quot;真正转化为&quot;留量&quot;。</p>\n<h2>软实力需要转化通道</h2>\n<p>文化、城市与生活方式构成一国的吸引力，但吸引力不会自动变成国际收入。旅行服务出口承担的正是转化功能：让国际游客从远距离观看，变成实地体验、消费和交流。</p>\n<p>未来的增量也不会只来自传统观光。文体体验、康养服务、数字导览与沉浸式文化产品，会推动旅行服务向更高附加值移动。对中国而言，这既是外贸结构升级，也是服务业供给质量的一次系统考试。</p>\n<h2>一个简单的判断</h2>\n<p>提升旅行服务出口，不应只计算新增游客数量，还应持续观察人均消费、停留时长、复游率与支付成功率。只有当这些微观体验指标改善，宏观的开放红利才算真正落地。</p>\n",
    "excerpt": "签证、支付、交通与语言服务共同决定一段旅程。旅行服务出口，恰好是观察制度型开放是否真正落地的一扇窗。",
    "cover": "assets/cover-service-trade.webp",
    "coverAlt": "跨境旅行与服务贸易的 3D 意象",
    "coverPosition": "center 45%",
    "visualLabel": "旅行服务 / 制度体验",
    "category": "服务贸易",
    "date": "2026-04",
    "dateISO": "2026-04",
    "readingMinutes": 7
  }
};
const PROJECTS_DATA = [
  {
    "id": "wto",
    "number": "01",
    "title": "WTO 跨境政策决策支持",
    "category": "AI AGENT · USITC · GOV.CN",
    "cat": "ai",
    "url": "https://github.com/jiayangrui05160031-cmyk/chinatrade-decision",
    "cover": "assets/cover-wto_001.jpg",
    "coverAlt": "WTO 跨境政策决策支持",
    "coverPosition": "center 50%",
    "visualLabel": "关税决策 Agent",
    "color": "project-coral",
    "tags": [
      "Python 3.11",
      "MiniMax",
      "FastAPI",
      "USITC"
    ],
    "stars": 1,
    "excerpt": "查 HS 编码 → 算关税 → 拉最新政策 → 出决策卡。114 测试通过，准确度 93.3%。给中国制造业老板的&quot;该不该接这单&quot;小助手。"
  },
  {
    "id": "video",
    "number": "02",
    "title": "多平台视频内容分析 Agent",
    "category": "LLM AGENT · 多平台聚合",
    "cat": "ai",
    "url": "https://github.com/jiayangrui05160031-cmyk/video-analysis-agent",
    "cover": "assets/cover-video-agent_001.jpg",
    "coverAlt": "多平台视频内容分析 Agent",
    "coverPosition": "center 45%",
    "visualLabel": "视频理解 / 多平台",
    "color": "project-blue",
    "tags": [
      "Python",
      "yt-dlp",
      "OpenAI",
      "FastAPI"
    ],
    "stars": 0,
    "excerpt": "给一个 URL，自动告诉你这条视频到底讲了啥 —— 支持 YouTube / B站 / 抖音 / 本地文件。跨视频聚合、弹幕分析、字幕翻译一条龙。"
  },
  {
    "id": "macro",
    "number": "03",
    "title": "宏观经济智能分析平台",
    "category": "PYTHON · 24 模块 · REACT AGENT",
    "cat": "macro",
    "url": "https://github.com/jiayangrui05160031-cmyk/people-daily-economy-daily",
    "cover": "assets/cover-macro_001.jpg",
    "coverAlt": "宏观经济智能分析平台",
    "coverPosition": "center 52%",
    "visualLabel": "宏观日报 / 驾驶舱",
    "color": "project-ink",
    "tags": [
      "Python 3.11",
      "Hamilton",
      "GraphRAG",
      "Docker"
    ],
    "stars": 1,
    "excerpt": "每日抓取人民网 / 中国经济网 → 跑通 24 个分析模块 → 输出 31 节结构化报告 + 现代化驾驶舱 + FastAPI + ReAct Agent。"
  },
  {
    "id": "rfm",
    "number": "04",
    "title": "电商 RFM 用户分群",
    "category": "PYTHON · SCIKIT-LEARN · GRADIO",
    "cat": "data",
    "url": "https://github.com/jiayangrui05160031-cmyk/ecommerce-rfm-customer-segmentation",
    "cover": "assets/cover-rfm_001.jpg",
    "coverAlt": "电商 RFM 用户分群",
    "coverPosition": "center 48%",
    "visualLabel": "用户分群 / CLV",
    "color": "project-yellow",
    "tags": [
      "K-Means",
      "HDBSCAN",
      "LightGBM",
      "FP-Growth"
    ],
    "stars": 1,
    "excerpt": "RFM + 三种聚类 + CLV + 流失预测 + 3 个 AI Agent。端到端流水线，HTML 业务报告 + Gradio Chat-with-Data，零售/捐赠/SaaS 都能跑。"
  },
  {
    "id": "blog",
    "number": "05",
    "title": "这个博客的源代码",
    "category": "个人站点 · Markdown · 交互实验室",
    "cat": "data",
    "url": "https://github.com/jiayangrui05160031-cmyk/-my-profile",
    "cover": "assets/panda-dashboard_001.jpg",
    "coverAlt": "熊猫主题个人博客与数据仪表盘",
    "coverPosition": "center 46%",
    "visualLabel": "博客源代码 / 交互设计",
    "color": "project-violet",
    "tags": [
      "HTML",
      "CSS",
      "Vanilla JS",
      "Markdown"
    ],
    "stars": 1,
    "excerpt": "本站无框架、不打包，所有花里胡哨的动画都是原生 CSS + JS。三主题切换、Konami Code 彩蛋、樱花飘落、GitHub 实时数据 —— 全部开源。 \n  v4 起 : 内容全部由 Markdown 驱动，写新文章只需要新建一个  .md  文件即可。"
  }
];
async function loadMarkdownContent() {
  let content = null;
  if (typeof ARTICLES_DATA !== 'undefined' && Object.keys(ARTICLES_DATA).length > 0) {
    content = { writings: Object.values(ARTICLES_DATA), projects: (typeof PROJECTS_DATA !== 'undefined' ? PROJECTS_DATA : []) };
  } else {
    try {
      const r = await fetch('dist/content.json');
      if (r.ok) content = await r.json();
    } catch (e) {}
  }
  if (!content || !content.writings || !content.writings.length) {
    const c = document.getElementById('writingContainer');
    if (c) c.innerHTML = '<div class="loading-hint">⚠️ 内容加载失败。请在终端跑：<code>node build.js</code></div>';
    return;
  }
  renderWritings(content.writings);
  renderProjects(content.projects || []);
  articles = {};
  content.writings.forEach(w => { if (w.id) articles[w.id] = w; });
}

function escapeAttr(value) {
  return String(value || '').replace(/"/g, '&quot;');
}

function coverStyle(item) {
  const pos = item && item.coverPosition ? escapeAttr(item.coverPosition) : '';
  return pos ? ` style="object-position:${pos}"` : '';
}

function visualLabel(item, fallback) {
  const label = item && (item.visualLabel || item.category || fallback);
  return label ? `<span class="image-subject">${label}</span>` : '';
}

function projectVisualLabel(item, fallback) {
  const label = item && (item.visualLabel || item.category || fallback);
  return label ? `<span class="project-visual-label">${label}</span>` : '';
}

function renderWritings(writings) {
  const container = document.getElementById('writingContainer');
  if (!container || !writings.length) return;
  const featured = writings.find(w => w.featured) || writings[0];
  const others = writings.filter(w => w.id !== featured.id);
  let html = `
    <article class="featured-post reveal" data-article="${featured.id}" tabindex="0">
      <div class="post-image">
        <img src="${featured.cover}" alt="${featured.coverAlt || featured.title}" loading="lazy"${coverStyle(featured)}>
        ${visualLabel(featured, '文章封面')}
        <span class="post-number">${String(featured.number || '').padStart(2, '0')}</span>
        <span class="reading-badge" data-reading="${featured.readingMinutes}">${featured.readingMinutes} 分钟</span>
      </div>
      <div class="post-copy">
        <div class="post-meta">
          <span>${featured.category}</span>
          <time datetime="${featured.dateISO}">${featured.date}</time>
        </div>
        <h3>${featured.title}</h3>
        <p>${featured.excerpt}</p>
        <button class="text-link" type="button">阅读全文 <span>↗</span></button>
      </div>
    </article>
    <div class="post-grid">
  `;
  others.forEach(w => {
    html += `
      <article class="post-card reveal" data-article="${w.id}" tabindex="0">
        <div class="post-card-image">
          <img src="${w.cover}" alt="${w.coverAlt || w.title}" loading="lazy"${coverStyle(w)}>
          ${visualLabel(w, '文章封面')}
        </div>
        <div class="post-meta">
          <span>${w.category}</span>
          <time datetime="${w.dateISO}">${w.date}</time>
        </div>
        <h3>${w.title}</h3>
        <p>${w.excerpt}</p>
        <button class="text-link" type="button">阅读全文 <span>↗</span></button>
      </article>
    `;
  });
  html += '</div>';
  container.innerHTML = html;
}

function renderProjects(projects) {
  const container = document.getElementById('projectsContainer');
  if (!container || !projects.length) return;
  function guessCat(p) {
    // 优先用 frontmatter 显式 cat 字段
    if (p.cat && ['ai', 'data', 'macro'].includes(p.cat)) return p.cat;
    // fallback: 基于关键词
    const text = ((p.title || '') + ' ' + (p.category || '') + ' ' + (p.excerpt || '') + ' ' + (p.url || '')).toLowerCase();
    if (/macro|经济|宏观|report|daily|日报|政治局/.test(text)) return 'macro';
    if (/agent|llm|\bai\b|wt|policy|video|chinatrade/.test(text)) return 'ai';
    return 'data';
  }
  let html = '';
  projects.forEach(p => {
    const cat = guessCat(p);
    const isExternal = p.url && p.url.startsWith('http');
    const tagsHtml = (p.tags || []).map(t => `<span>${t}</span>`).join('');
    const inner = `
      <div class="project-top">
        <span>${String(p.number || '').padStart(2, '0')}</span>
        <span class="project-gh">⭐ ${p.stars || 0}</span>
      </div>
      <div class="project-cover">
        <img src="${p.cover}" alt="${p.coverAlt || p.title}" loading="lazy"${coverStyle(p)}>
        ${projectVisualLabel(p, cat)}
      </div>
      <div>
        <p class="project-type">${p.category}</p>
        <h3>${p.title}</h3>
        <p>${p.excerpt}</p>
        <div class="project-tags">${tagsHtml}</div>
      </div>
      ${isExternal ? `<span class="project-arrow">→</span>` : ''}
    `;
    const wrap = isExternal ? 'a' : 'article';
    const linkAttr = isExternal ? `href="${p.url}" target="_blank" rel="noreferrer"` : '';
    html += `<${wrap} class="project-card ${p.color} reveal" data-cat="${cat}" ${linkAttr}>${inner}</${wrap}>`;
  });
  container.innerHTML = html;

  const counts = { all: projects.length, ai: 0, data: 0, macro: 0 };
  projects.forEach(p => { counts[guessCat(p)]++; });
  document.querySelectorAll('.filter-chip').forEach(chip => {
    const f = chip.dataset.filter;
    if (counts[f] === undefined) return;
    const catNames = { all: '全部', ai: '🤖 LLM Agent', data: '📊 数据分析', macro: '🌐 宏观/经贸' };
    chip.textContent = `${catNames[f]} · ${counts[f]}`;
  });
}

/* ==========================================================================
   初始化
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.reveal').forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i % 3, 2) * 80}ms`;
  });
  document.body.classList.add('reveal-on');
  requestAnimationFrame(() => {
    document.querySelectorAll('.reveal').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight + 100) el.classList.add('visible');
    });
  });
  initTheme();
  initTypewriter();
  initScrollProgress();
  initReveal();
  initImpactSounds();
  loadMarkdownContent().then(() => bindArticleDialog()).catch(e => console.error('[load]', e));
  initPortraits();
  initMood();
  initMemoryGame();
  initTerminal();
  initQuotes();
  initHitokoto();
  initMoodButtons();
  initProjectFilter();
  initHiButton();
  initGHStats();
  initSakura();
  initReadingBadges();
  initMusicToggle();
  initKonamiEaster();
    initBackToTop();
    initDateStamp();
    initArenaRune();
  initVoting();
  initNPS();
  initDice();
  initLiveTime();
  initSparkTrail();
});

/* ====== 主题 ====== */
function initTheme() {
  const themes = ['paper', 'dark', 'cyber'];
  const themes_emoji = { paper: '🎨', dark: '🌙', cyber: '⚡' };
  const root = document.documentElement;
  const btn = document.querySelector('[data-theme-toggle]');
  if (!btn) return;
  const icon = btn.querySelector('.theme-icon');
  const saved = localStorage.getItem('jy-theme') || 'paper';
  root.dataset.theme = saved;
  icon.textContent = themes_emoji[saved] || '🎨';
  btn.addEventListener('click', () => {
    const cur = root.dataset.theme || 'paper';
    const next = themes[(themes.indexOf(cur) + 1) % themes.length];
    root.dataset.theme = next;
    icon.textContent = themes_emoji[next];
    localStorage.setItem('jy-theme', next);
    spawnSakura(8);
  });
}

/* ====== 打字机 ====== */
function initTypewriter() {
  const lines = [
    '我关心宏观周期、产业链与国际经贸。',
    '我也喜欢用数据和 AI 把模糊的问题拆成可以理解的故事。',
    '较真的研究助理 · 偶尔写写小文章 · 在北京。',
    '欢迎你来我的博客。这里有 1 只熊猫 + 5 个项目 + N 段较真。',
  ];
  const target = document.getElementById('typewriter');
  if (!target) return;
  let idx = 0, char = 0, deleting = false;
  function tick() {
    const line = lines[idx];
    if (!deleting) {
      target.textContent = line.slice(0, ++char);
      if (char === line.length) { deleting = true; return setTimeout(tick, 1800); }
    } else {
      target.textContent = line.slice(0, --char);
      if (char === 0) { deleting = false; idx = (idx + 1) % lines.length; }
    }
    setTimeout(tick, deleting ? 25 : 50);
  }
  tick();
}

function initScrollProgress() {
  const bar = document.getElementById('scrollBar');
  const panda = document.getElementById('pandaCursor');
  if (!bar || !panda) return;
  let lastY = 0;
  document.addEventListener('mousemove', (e) => {
    panda.style.left = e.clientX + 'px';
    panda.style.top = e.clientY + 'px';
  });
  window.addEventListener('scroll', () => {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
    const heroBottom = document.querySelector('.hero')?.getBoundingClientRect().bottom ?? 0;
    panda.classList.toggle('active', heroBottom > 0 && lastY < heroBottom);
    lastY = window.scrollY;
  }, { passive: true });
}

function initBackToTop() {
  document.getElementById('backToTop')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.01, rootMargin: '0px 0px 12% 0px' });
  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
  setTimeout(() => {
    document.querySelectorAll('.reveal:not(.visible)').forEach(el => el.classList.add('visible'));
  }, 1500);
}

function bindArticleDialog() {
  const dialog = document.getElementById('article-dialog');
  const articleContent = document.getElementById('article-content');
  if (!dialog || !articleContent) return;

  function openArticle(key) {
    const article = articles[key];
    if (!article) { console.warn('[dialog] no article:', key); return; }
    const kicker = article.kicker || `${article.category || ''} · ${article.date || ''} · ${article.readingMinutes || '?'} 分钟`;
    const title = article.title;
    const deck = article.deck || article.excerpt;
    const image = article.image || article.cover;
    const alt = article.alt || article.coverAlt || title;
    const body = article.body || article.html;
    articleContent.innerHTML = `
      <p class="article-kicker">${kicker}</p>
      <h1>${title}</h1>
      <p class="article-deck">${deck}</p>
      <img src="${image}" alt="${alt}">
      ${body}
      <p class="article-note">本文整理自个人研究项目，内容仅代表作者的阶段性观察。</p>`;
    if (typeof dialog.showModal === 'function') dialog.showModal();
    document.body.classList.add('dialog-open');
    dialog.scrollTop = 0;
  }
  function closeDialog() {
    if (typeof dialog.close === 'function') dialog.close();
    document.body.classList.remove('dialog-open');
  }
  document.body.addEventListener('click', (e) => {
    if (e.target.closest('a[href]')) return;
    const card = e.target.closest('[data-article]');
    if (card) { e.preventDefault(); openArticle(card.dataset.article); }
  });
  document.body.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    const card = event.target.closest && event.target.closest('[data-article]');
    if (card) { event.preventDefault(); openArticle(card.dataset.article); }
  });
  document.querySelector('.dialog-close')?.addEventListener('click', closeDialog);
  dialog.addEventListener('click', (event) => { if (event.target === dialog) closeDialog(); });
  dialog.addEventListener('close', () => document.body.classList.remove('dialog-open'));
}

function initReadingBadges() {
  document.querySelectorAll('.reading-badge').forEach((badge) => {
    const article = badge.closest('[data-article]');
    if (!article) return;
    let timer = null;
    function startCount() {
      const minutes = parseInt(badge.dataset.reading || '5', 10);
      let left = minutes * 60;
      badge.classList.add('reading');
      badge.textContent = `剩 ${minutes} 分钟`;
      clearInterval(timer);
      timer = setInterval(() => {
        left -= 1;
        if (left <= 0) {
          clearInterval(timer);
          badge.classList.remove('reading');
          badge.classList.add('read-done');
          badge.textContent = '✓ 已读';
          const t = articles[article.dataset.article]?.title || '文章';
          showToast(`🎉 完成阅读「${t.slice(0, 12)}…」+10 分较真度`);
        } else if (left % 60 === 0) {
          badge.textContent = `剩 ${left / 60} 分钟`;
        }
      }, 1000);
    }
    article.addEventListener('click', () => {
      if (!badge.classList.contains('reading')) startCount();
    });
  });
}

function showToast(msg) {
  const t = document.getElementById('readToast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => t.classList.remove('show'), 4000);
}

function initPortraits() {
  const card = document.getElementById('pandaCard');
  if (!card) return;
  let clicks = 0;
  card.addEventListener('click', (e) => {
    if (e.target.closest('.mood-switcher')) return;
    clicks++;
    if (clicks === 5) { spawnConfetti(); showToast('🐼 熊猫被戳烦了，开个彩蛋！'); }
  });
}

function initHiButton() {
  document.getElementById('hiPanda')?.addEventListener('click', () => {
    spawnConfetti();
    const phrases = ['👋 你好！欢迎来逛', '🐼 熊猫给你比个心', '✨ 抱歉今天有点忙，先自我介绍'];
    showToast(phrases[Math.floor(Math.random() * phrases.length)]);
  });
}

function initMood() {
  const speech = document.getElementById('speechBubble');
  const status = document.getElementById('pandaStatus');
  const moodLabel = document.querySelector('.panda-mood');
  const btns = document.querySelectorAll('.mood-btn');
  if (!btns.length) return;
  function setMood(k) {
    const data = pandaMoods[k];
    if (!data) return;
    if (speech) speech.textContent = data.text;
    if (status) status.textContent = 'Jia Yangrui · ' + data.next;
    if (moodLabel) { moodLabel.textContent = data.text; moodLabel.classList.add('mood-active'); }
    btns.forEach(b => b.classList.toggle('active', b.dataset.mood === k));
    spawnSakura(3);
  }
  btns.forEach(b => b.addEventListener('click', () => setMood(b.dataset.mood)));
  setMood('hello');
}

function initMemoryGame() {
  const board = document.getElementById('memoryBoard');
  if (!board) return;
  const icons = ['🐼', '📊', '🤖', '🌐', '📚', '🛠'];
  let cards = [...icons, ...icons].sort(() => Math.random() - 0.5);
  let first = null, lock = false, matched = 0, startTime = 0, timer = null;
  function build() {
    board.innerHTML = '';
    cards.forEach((icon, idx) => {
      const c = document.createElement('button');
      c.className = 'mem-card'; c.type = 'button'; c.dataset.icon = icon;
      c.innerHTML = `<span class="mem-back">?</span><span class="mem-front">${icon}</span>`;
      c.addEventListener('click', () => flip(c, idx));
      board.appendChild(c);
    });
    matched = 0;
    document.getElementById('gameMatched').textContent = 0;
    document.getElementById('gameTime').textContent = 0;
    if (timer) clearInterval(timer);
    timer = null;
  }
  function flip(c, idx) {
    if (lock || c.classList.contains('flipped') || c.classList.contains('matched')) return;
    c.classList.add('flipped');
    if (!startTime) {
      startTime = Date.now();
      timer = setInterval(() => {
        document.getElementById('gameTime').textContent = Math.floor((Date.now() - startTime) / 1000);
      }, 250);
    }
    if (!first) { first = { c, idx }; return; }
    if (first.c.dataset.icon === c.dataset.icon && first.idx !== idx) {
      c.classList.add('matched');
      first.c.classList.add('matched');
      matched++;
      document.getElementById('gameMatched').textContent = matched;
      first = null;
      if (matched === icons.length) {
        clearInterval(timer);
        const t = Math.floor((Date.now() - startTime) / 1000);
        showToast(`🎉 配对成功！用时 ${t} 秒。给自己 +5 分较真度`);
        spawnConfetti();
      }
    } else {
      lock = true;
      const a = first.c, b = c;
      setTimeout(() => {
        a.classList.remove('flipped');
        b.classList.remove('flipped');
        first = null;
        lock = false;
      }, 700);
    }
  }
  document.getElementById('resetGame')?.addEventListener('click', build);
  build();
}

function initTerminal() {
  const term = document.getElementById('terminalCard');
  const body = document.getElementById('termBody');
  const input = document.getElementById('termInput');
  if (!term || !input) return;
  function writeLine(html) {
    if (html === null) return;
    const p = document.createElement('p');
    p.className = 'term-line';
    p.innerHTML = html;
    body.appendChild(p);
    body.scrollTop = body.scrollHeight;
  }
  function run(cmd) {
    writeLine(`<span style="color:#aeb6c3">visitor@jyr-lab</span> $ ${cmd}`);
    const handler = terminalCmds[cmd.toLowerCase()] || terminalCmds.default;
    const out = handler();
    if (Array.isArray(out)) out.forEach(writeLine);
    else if (typeof out === 'string') writeLine(out);
  }
  function exec(e) {
    if (e.key !== 'Enter') return;
    const v = input.value.trim();
    if (!v) return;
    run(v);
    input.value = '';
  }
  input.addEventListener('keydown', exec);
  body.addEventListener('click', (e) => {
    const t = e.target;
    if (t.classList.contains('term-link')) {
      const link = t.dataset.link || t.dataset.term;
      if (link) link.startsWith('http') ? window.open(link, '_blank', 'noreferrer') : run(link);
    }
  });
  term.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') return;
    input.focus();
  });
}

function initQuotes() {
  const quote = document.getElementById('selfQuote');
  const count = document.getElementById('quoteCount');
  const btn = document.getElementById('nextQuote');
  if (!quote || !btn) return;
  let idx = 0;
  count.textContent = `共 ${selfQuotes.length} 句`;
  quote.style.transition = 'opacity .2s';
  btn.addEventListener('click', () => {
    idx = (idx + 1) % selfQuotes.length;
    quote.style.opacity = 0;
    setTimeout(() => { quote.textContent = selfQuotes[idx]; quote.style.opacity = 1; }, 200);
  });
}

function initHitokoto() {
  const q = document.getElementById('hitokoto');
  const btn = document.getElementById('nextHitokoto');
  if (!q || !btn) return;
  q.style.transition = 'opacity .2s';
  btn.addEventListener('click', () => {
    const next = hitokotoList[Math.floor(Math.random() * hitokotoList.length)];
    q.style.opacity = 0;
    setTimeout(() => { q.textContent = next; q.style.opacity = 1; }, 200);
  });
}

function initMoodButtons() {
  const wrap = document.getElementById('moodButtons');
  const out = document.getElementById('moodResult');
  const cEl = document.getElementById('moodCount');
  if (!wrap) return;
  function todayKey() { return 'jy-mood-' + new Date().toISOString().slice(0, 10); }
  function load() { try { return JSON.parse(localStorage.getItem(todayKey()) || '[]'); } catch { return []; } }
  function save(arr) { localStorage.setItem(todayKey(), JSON.stringify(arr)); }
  function renderCount() { cEl.textContent = load().length; }
  renderCount();
  wrap.addEventListener('click', (e) => {
    const b = e.target.closest('button[data-mood-tag]');
    if (!b) return;
    const arr = load();
    arr.push({ tag: b.dataset.moodTag, t: Date.now() });
    save(arr);
    renderCount();
    if (out) out.innerHTML = `已记录。累计今天已经有 <strong>${arr.length}</strong> 个人点过了。同类：${b.dataset.moodTag}`;
    b.style.transform = 'scale(1.2)';
    setTimeout(() => b.style.transform = '', 200);
  });
}

function initProjectFilter() {
  const chips = document.querySelectorAll('.filter-chip');
  const cards = document.querySelectorAll('.project-card[data-cat]');
  chips.forEach(chip => chip.addEventListener('click', () => {
    chips.forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    const f = chip.dataset.filter;
    cards.forEach(c => { c.classList.toggle('hidden', !(f === 'all' || c.dataset.cat === f)); });
  }));
}

async function initGHStats() {
  const sR = document.getElementById('statRepos');
  const sS = document.getElementById('statStars');
  if (!sR) return;
  sR.classList.add('loading-pulse'); sS.classList.add('loading-pulse');
  try {
    const r = await fetch('https://api.github.com/users/jiayangrui05160031-cmyk/repos?per_page=100');
    if (!r.ok) throw 0;
    const repos = await r.json();
    const mine = repos.filter(x => !x.fork);
    const stars = mine.reduce((s, x) => s + (x.stargazers_count || 0), 0);
    animateNum(sR, mine.length, 600);
    animateNum(sS, stars, 800);
  } catch {
    sR.textContent = 5; sS.textContent = 4;
  }
  sR.classList.remove('loading-pulse'); sS.classList.remove('loading-pulse');
}

function animateNum(el, target, duration) {
  const start = 0; const startTime = performance.now();
  function step(now) {
    const t = Math.min((now - startTime) / duration, 1);
    const v = Math.floor(start + (target - start) * t);
    el.textContent = v;
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function initSakura() { spawnSakura(20); setInterval(() => spawnSakura(2), 6000); }
function spawnSakura(n = 1) {
  const layer = document.getElementById('sakuraLayer');
  if (!layer) return;
  const flowers = ['🌸', '🌼', '✿', '🦋'];
  for (let i = 0; i < n; i++) {
    const s = document.createElement('span');
    s.className = 'sakura';
    s.textContent = flowers[Math.floor(Math.random() * flowers.length)];
    s.style.left = Math.random() * 100 + 'vw';
    s.style.fontSize = 14 + Math.random() * 16 + 'px';
    s.style.animationDuration = 8 + Math.random() * 8 + 's';
    layer.appendChild(s);
    setTimeout(() => s.remove(), 18000);
  }
}

function spawnConfetti() {
  const layer = document.getElementById('sakuraLayer');
  if (!layer) return;
  const emojis = ['🎉', '🎊', '✨', '🎈', '⭐', '🌟', '💫'];
  for (let i = 0; i < 28; i++) {
    const e = document.createElement('span');
    e.className = 'sakura';
    e.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    e.style.left = Math.random() * 100 + 'vw';
    e.style.fontSize = 20 + Math.random() * 22 + 'px';
    e.style.animationDuration = 2 + Math.random() * 3 + 's';
    e.style.opacity = 1;
    layer.appendChild(e);
    setTimeout(() => e.remove(), 6000);
  }
}

function initMusicToggle() {
  const btn = document.getElementById('musicToggle');
  if (!btn) return;
  let ctx = null, osc = null, gain = null, playing = false;
  btn.addEventListener('click', () => {
    if (playing) {
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);
      setTimeout(() => { osc?.stop(); playing = false; btn.classList.remove('playing'); }, 700);
      return;
    }
    try {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      osc = ctx.createOscillator();
      const lfo = ctx.createOscillator(); const lfoGain = ctx.createGain();
      gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = 261.63;
      lfo.frequency.value = 0.18;
      lfoGain.gain.value = 200;
      lfo.connect(lfoGain).connect(osc.frequency);
      osc.connect(gain).connect(ctx.destination);
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 1.5);
      osc.start(); lfo.start();
      playing = true;
      btn.classList.add('playing');
    } catch (e) {
      showToast('🔇 浏览器屏蔽了音频 ～');
    }
  });
}

function initKonamiEaster() {
  let seq = [];
  const target = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  document.addEventListener('keydown', (e) => {
    seq.push(e.key);
    if (seq.length > target.length) seq.shift();
    if (seq.join(',') === target.join(',')) { showEaster('konami'); seq = []; }
  });
  document.getElementById('konamiEaster')?.addEventListener('click', () => showEaster('konami'));
}

function showEaster(kind) {
  const modal = document.getElementById('easterModal');
  const content = document.getElementById('easterContent');
  if (!modal || !content) return;
  content.innerHTML = `
    <div class="easter-emoji">🐼✨</div>
    <h2>你居然解锁了 Konami Code</h2>
    <p>致敬 1986 年的魂斗罗。<br>解锁成就：<code>真·玩家</code></p>
    <p>作为奖励 —— 你可以向 <code>jiayangrui05160031@gmail.com</code><br>提一个和经济学 / Python / 数据 / 熊猫有关的问题，<br>我会在 48 小时内回。</p>
  `;
  modal.classList.add('show');
  spawnConfetti();
}

document.addEventListener('DOMContentLoaded', () => {
  const m = document.getElementById('easterModal');
  const c = document.getElementById('easterClose');
  if (m && c) {
    c.addEventListener('click', () => m.classList.remove('show'));
    m.addEventListener('click', (e) => { if (e.target === m) m.classList.remove('show'); });
  }
});

function initDateStamp() {
  const el = document.getElementById('nowDate');
  if (!el) return;
  const d = new Date();
  el.textContent = `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

/* ====== v3 新增互动 ====== */

function initVoting() {
  const KEY = 'jy-votes-';
  document.querySelectorAll('.vote-actions button').forEach(btn => {
    btn.addEventListener('click', () => {
      const q = btn.dataset.vote;
      const choice = btn.dataset.choice;
      const bar = document.getElementById('vote-' + q);
      const countEl = document.getElementById('vote' + q + '-count');
      const totalEl = document.getElementById('vote' + q + '-total');
      if (localStorage.getItem(KEY + q)) { playTone(220, 0.1); showToast('你今天已经投过这个题了，明天再来'); return; }
      localStorage.setItem(KEY + q, choice);
      btn.closest('.vote-actions').querySelectorAll('button').forEach(b => b.classList.remove('voted'));
      btn.classList.add('voted');
      const curPct = parseInt(countEl.textContent, 10);
      const curTot = parseInt(totalEl.textContent, 10);
      const newTot = curTot + 1;
      const newPct = choice === 'yes' ? curPct + (100 - curPct) / newTot : curPct - curPct / newTot;
      const final = Math.max(0, Math.min(100, Math.round(newPct)));
      countEl.textContent = final;
      totalEl.textContent = newTot;
      bar.style.width = final + '%';
      playTone(880, 0.08);
      spawnSparkles(window.innerWidth / 2, window.innerHeight / 2, '✨');
      showToast(choice === 'yes' ? '👍 看好！记下来了' : '👎 看空！尊重你的判断');
    });
  });
}

function initNPS() {
  const wrap = document.getElementById('npsButtons');
  if (!wrap) return;
  for (let i = 0; i <= 10; i++) {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = i;
    b.dataset.score = i;
    b.setAttribute('aria-label', `评 ${i} 分`);
    wrap.appendChild(b);
  }
  const KEY = 'jy-nps';
  const stored = localStorage.getItem(KEY);
  if (stored !== null) {
    const btn = wrap.querySelector(`button[data-score="${stored}"]`);
    if (btn) btn.classList.add('selected');
    updateNpsResult(parseInt(stored, 10));
  }
  wrap.addEventListener('click', e => {
    const b = e.target.closest('button[data-score]');
    if (!b) return;
    wrap.querySelectorAll('button').forEach(x => x.classList.remove('selected'));
    b.classList.add('selected');
    const score = parseInt(b.dataset.score, 10);
    localStorage.setItem(KEY, score);
    updateNpsResult(score);
    const messages = { 0:'0 分……这是投诉级别 😭 我改', 1:'1 分比 0 分好一点但也好不了多少', 3:'3 分意思意思收到，我会做更好', 5:'5 分不功不过，加油加油', 7:'7 分！谢谢！有被鼓励到', 9:'9 分！给得这么高，是真的吗', 10:'10 分？！那我也给你 10 分熊猫抱抱 🐼' };
    playTone(440 + score * 50, 0.1);
    showToast(messages[score] || `${score} 分，记下了，谢谢！`);
  });
}

function updateNpsResult(myScore) {
  const el = document.getElementById('npsResult');
  if (el && myScore >= 0) el.innerHTML = `你给了 <strong>${myScore}</strong> 分 · 您的反馈只保存在您浏览器本地 ❤️`;
}

function initDice() {
  const btn = document.getElementById('rollDice');
  const display = document.getElementById('diceDisplay');
  const text = document.getElementById('diceText');
  if (!btn) return;
  btn.addEventListener('click', () => {
    display.classList.remove('rolling');
    void display.offsetWidth;
    display.classList.add('rolling');
    const pick = dicePool[Math.floor(Math.random() * dicePool.length)];
    setTimeout(() => {
      display.textContent = pick.e;
      text.textContent = pick.t;
      playTone(523, 0.06); setTimeout(() => playTone(659, 0.06), 80); setTimeout(() => playTone(784, 0.12), 160);
      spawnSparkles(window.innerWidth - 200, window.innerHeight - 300, pick.e);
    }, 480);
  });
}

function initLiveTime() {
  const h = document.getElementById('liveHour');
  const w = document.getElementById('liveWeekday');
  const v = document.getElementById('liveVisits');
  const t = document.getElementById('visitTimes');
  if (!h) return;
  const KEY = 'jy-visits';
  const visits = parseInt(localStorage.getItem(KEY) || '0', 10) + 1;
  localStorage.setItem(KEY, visits);
  if (v) v.textContent = visits;
  if (t) t.textContent = visits;
  const wd = ['日', '一', '二', '三', '四', '五', '六'];
  function tick() {
    const d = new Date();
    h.textContent = d.toLocaleTimeString('zh-CN', { hour12: false });
    w.textContent = '星期' + wd[d.getDay()];
  }
  tick(); setInterval(tick, 1000);
}

function initSparkTrail() {
  let last = 0;
  const emojis = ['✨', '🐼', '⭐', '✦'];
  document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - last < 280) return;
    last = now;
    if (Math.random() > 0.4) return;
    const el = document.createElement('span');
    el.className = 'spark-trail';
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.left = e.clientX + 'px';
    el.style.top = e.clientY + 'px';
    const dx = (Math.random() - .5) * 80;
    const dy = (Math.random() - .5) * 80 - 20;
    el.style.setProperty('--dx', dx + 'px');
    el.style.setProperty('--dy', dy + 'px');
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1000);
  });
}

function spawnSparkles(x, y, emoji = '✨') {
  for (let i = 0; i < 8; i++) {
    const el = document.createElement('span');
    el.className = 'spark-trail';
    el.textContent = emoji;
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    const dx = (Math.random() - .5) * 200;
    const dy = (Math.random() - .5) * 200;
    el.style.setProperty('--dx', dx + 'px');
    el.style.setProperty('--dy', dy + 'px');
    el.style.fontSize = '24px';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1000);
  }
}

let audioCtx = null;
function getCtx() {
  if (audioCtx) return audioCtx;
  try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); return audioCtx; }
  catch { return null; }
}

function playTone(freq = 440, dur = 0.08, type = 'sine', volume = 0.12) {
  const ctx = getCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  osc.connect(gain).connect(ctx.destination);
  gain.gain.setValueAtTime(volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
  osc.start(); osc.stop(ctx.currentTime + dur);
}

function initImpactSounds() {
  document.body.addEventListener('click', (e) => {
    const t = e.target.closest('button, a.project-card, .mem-card, .mood-btn, .mood-buttons button, .filter-chip, .nps-buttons button, .vote-actions button, .mode-switcher, .play-card');
    if (!t) return;
    playTone(880, 0.04, 'triangle', 0.06);
  }, true);
}

/* ====== 海克斯大乱斗 · 摇符文 ====== */
const arenaRunes = [
  { name: '致命节奏', icon: '⚡', desc: '攻速 +18% / 持续 6 秒', color: '#ff6f4c' },
  { name: '幽灵步伐', icon: '👻', desc: '移动无视单位碰撞 + 移速加成', color: '#4dd0e1' },
  { name: '征服者', icon: '👑', desc: '对英雄伤害转化为自适应之力', color: '#ffd966' },
  { name: '电刑', icon: '⚡', desc: '3 秒内 3 次独立攻击 → 爆发伤害', color: '#9d4edd' },
  { name: '不灭之握', icon: '🛡️', desc: '每 4 秒 +5 永久生命', color: '#6ab04c' },
  { name: '彗星', icon: '☄️', desc: '技能命中 → 法术伤害', color: '#3b82f6' },
  { name: '余震', icon: '💥', desc: '定身后 → 爆发双抗', color: '#ff4444' },
  { name: '奥术彗星', icon: '✨', desc: 'Poke 流必带 —— 远距离骚扰', color: '#a78bfa' },
  { name: '黑暗收割', icon: '🌑', desc: '低血量目标 +伤害', color: '#171717' },
  { name: '冰川增幅', icon: '🧊', desc: '主动道具减速 + 减速带', color: '#06b6d4' },
  { name: '守护者', icon: '🌟', desc: '辅助/坦克: 给自己和队友护盾', color: '#fbbf24' },
  { name: '启封的秘籍', icon: '📖', desc: '召唤师技能冷却 -20%', color: '#ec4899' },
];

function initArenaRune() {
  const btn = document.getElementById('arenaRoll');
  if (!btn) return;
  btn.addEventListener('click', () => {
    btn.style.transform = 'scale(0.95) rotate(-3deg)';
    setTimeout(() => { btn.style.transform = ''; }, 150);
    const rune = arenaRunes[Math.floor(Math.random() * arenaRunes.length)];
    // 三段递增音 (海克斯风的电子感)
    playTone(523, 0.08);
    setTimeout(() => playTone(659, 0.08), 80);
    setTimeout(() => playTone(880, 0.16), 160);
    spawnSparkles(window.innerWidth / 2, 200, rune.icon);
    showToast(`${rune.icon} 海克斯符文：${rune.name} — ${rune.desc}`);
  });
}