# views / field station

一个不急着把自己说完的个人网站。

这里放研究、数据工具、代码实验和一些不务正业的 side quests。页面上的公开名字统一为 **views**；不放简历式自我介绍，也不把兴趣和“正经项目”硬分成两页。

## 现在能逛什么

| 路线 | 在做什么 |
| --- | --- |
| [Trade Intelligence](https://github.com/jiayangrui05160031-cmyk/chinatrade-decision) | 把 HS 编码、关税、政策与一笔跨境订单放到同一张决策卡里。 |
| [Video Atlas](https://github.com/jiayangrui05160031-cmyk/video-analysis-agent) | 从一条视频链接出发，做字幕、翻译、聚合和内容追问。 |
| [Macro Cockpit](https://github.com/jiayangrui05160031-cmyk/people-daily-economy-daily) | 把每日宏观新闻落到可追溯的报告和驾驶舱。 |
| [Customer Orbit](https://github.com/jiayangrui05160031-cmyk/ecommerce-rfm-customer-segmentation) | RFM、CLV、流失信号和 next-best action 的端到端客户分析。 |
| [RGame](https://github.com/jiayangrui05160031-cmyk/RGame) | 一个带自动攻击、武器循环、关卡与存档的跨平台肉鸽实验。 |

## 页面里的小东西

- 三种配色：深色工作台、日间纸页、紫夜模式
- 项目路线筛选、可展开的研究便签、随机提示卡
- 桌面端有熊猫鼠标伴随、星屑轨迹、卡片轻微倾斜与常驻的飘落花瓣
- 点熊猫或切换配色会有小型花瓣爆发；输入 `↑ ↑ ↓ ↓ ← → ← → B A` 可以打开隐藏模式
- `V` 开关扫描线，`/` 打开小菜单，`Ctrl + ↑` 回到开头
- 内容优先从 `dist/content.json` 读取；本地直接打开时会自动使用页面内置的便签兜底

## 本地预览

这是一个静态站点，可以直接打开 `index.html`，也可以用任意静态服务器预览。首次运行 `npm run build` 会根据 `content/` 里的 Markdown 刷新 `dist/content.json`。

## 设计原则

> 先把事情看清楚，再决定怎么说；认真工作，也认真走神。

页面不使用第三方分析脚本，也不收集访客输入。
