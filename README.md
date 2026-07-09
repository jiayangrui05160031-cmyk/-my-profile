# 贾洋瑞｜经济 · 数据 · 一只熊猫 🐼

> 一个关于宏观经济、产业观察、数据分析与 AI 工作流的有趣博客。
> 较真 · 开脑洞 · 不端着。

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-已部署-brightgreen)](https://jiayangrui05160031-cmyk.github.io/-my-profile/)
[![零依赖](https://img.shields.io/badge/依赖-零-blueviolet)](#技术栈)
[![3 主题](https://img.shields.io/badge/主题-3%20套-ff6f4c)](#主题)
[![互动元素](https://img.shields.io/badge/互动-12%20个-orange)](#互动)

---

## 🌟 这个版本新增了什么（v2 · 熊猫版）

### 视觉重塑
- **🐼 熊猫新头像** 取代旧 3D 人物肖像（AI 生成的 3D 风卡通熊猫）
- **5 张项目封面图** 全部用 AI 重做（WTO / 视频 / 宏观 / RFM / 紫色站点）
- **3 套主题**：`牛皮纸 默认` → `暗色 #111723` → `赛博粉紫 ⚡`
- **6 个 chip 浮动** 在熊猫周围（ECON / DATA / AI / PYTHON …）
- **悬浮樱花层** + **滚动彩虹进度条**

### 互动元素（12 个）
| 元素 | 玩法 |
|---|---|
| 打字机副标题 | hero 区 4 句自我介绍循环打字 |
| 表情切换器 | 6 种熊猫 mood，语音气泡跟着变 |
| GitHub 实时数据 | 调 GitHub API，开机数字滚动 |
| 翻牌游戏 | 6 对熊猫图标记忆配对 + 计时 + 彩带 |
| 可玩终端 | 10 个命令（help/about/fact/hire …） |
| 自我吐槽 ↻ | 10 句"较真且开朗"的内心独白 |
| 一言系统 | 11 句严肃箴言 |
| 心情签到 | 5 状态 + localStorage 跨天累计 |
| 阅读计时器 | 点文章 8 分钟倒计时，完成 +10 较真度 |
| 背景音乐 🎵 | WebAudio 合成 C4 + LFO 呼吸声 |
| Konami Code | ↑↑↓↓←→←→BA 弹彩蛋 |
| 浮动工具栏 | 回到顶部 + 暗码按钮 |

### 新增项目（5 个真实仓库）
- [WTO 跨境政策决策支持](https://github.com/jiayangrui05160031-cmyk/chinatrade-decision) — USITC 对接 + 93.3% 准确度
- [多平台视频内容分析 Agent](https://github.com/jiayangrui05160031-cmyk/video-analysis-agent)
- [宏观经济智能分析平台](https://github.com/jiayangrui05160031-cmyk/people-daily-economy-daily) — 24 模块
- [电商 RFM 用户分群](https://github.com/jiayangrui05160031-cmyk/ecommerce-rfm-customer-segmentation)
- 本博客源代码（你正在看的）

## 🛠 技术栈

**零依赖，纯原生**：
- HTML5 + CSS3（含 grid、动画、3 主题切换）
- Vanilla JavaScript（无 jQuery / React / Vue）
- WebAudio API（背景音乐）
- IntersectionObserver（滚动揭示）
- GitHub REST API（实时数据）

| 文件 | 行数 | 说明 |
|---|---:|---|
| `index.html` | ~415 | 完整页面结构 |
| `styles.css` | ~960 | 3 主题 + 25 个新组件 |
| `script.js` | ~700 | 全部交互逻辑 |

## 🚀 本地预览

```bash
git clone https://github.com/jiayangrui05160031-cmyk/-my-profile.git
cd -my-profile
python -m http.server 8000
# 浏览器打开 http://127.0.0.1:8000
```

或直接双击 `index.html` 也能跑（仅 GitHub stats 那块需要 http 协议）。

## 📁 文件结构

```
.
├── index.html              # 首页（已重写为 v2）
├── resume.html             # 简历页（v1 旧版）
├── styles.css              # 样式（3 主题）
├── script.js               # 全部交互逻辑
├── assets/
│   ├── portrait-panda_001.jpg     # 新熊猫头像
│   ├── cover-ppi.webp             # 文章封面 1
│   ├── cover-supply-chain.webp    # 文章封面 2
│   ├── cover-service-trade.webp   # 文章封面 3
│   ├── cover-wto_001.jpg          # WTO 项目封面
│   ├── cover-video-agent_001.jpg  # 视频 Agent 封面
│   ├── cover-macro_001.jpg        # 宏观日报封面
│   ├── cover-rfm_001.jpg          # RFM 项目封面
│   └── portrait-3d.webp           # 旧肖像（备份，未引用）
└── README.md
```

## ✍️ 作者

**贾洋瑞** · 对外经济贸易大学国民经济学硕士在读
📧 jiayangrui05160031@gmail.com
🐙 [@jiayangrui05160031-cmyk](https://github.com/jiayangrui05160031-cmyk)

## 🎮 彩蛋收集

- 🐼 在 hero 区狂点熊猫头像 5 次触发撒彩带
- 🎮 输 Konami Code 解锁彩蛋
- 👋 点 "戳一下熊猫" 按钮
- 🌸 切换主题会撒一波花瓣
- 🎵 点 "来点研究时的背景乐" 启动 WebAudio

> 较真是我的态度，玩耍是我的本能。

---

<sub>本站无任何 cookie 跟踪、无第三方分析、完全离线可运行（GitHub stats 除外）。</sub>
