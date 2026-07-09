#!/usr/bin/env node
/**
 * build.js - Markdown → static site generator for 贾洋瑞的博客 v4
 *
 * 用法:
 *   node build.js                  # 构建博客
 *   node build.js --watch          # 监听变化自动构建
 *
 * 输入:
 *   content/writing/*.md             # 文章 (按文件名排序)
 *   content/projects/*.md            # 项目
 *
 * 输出:
 *   - dist/content.json              # 浏览器可 fetch
 *   - script.js 顶部插入 ARTICLES_DATA / PROJECTS_DATA (file:// 协议下也能用)
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');

const ROOT = __dirname;
const CONTENT_DIR = path.join(ROOT, 'content');
const WRITING_DIR = path.join(CONTENT_DIR, 'writing');
const PROJECTS_DIR = path.join(CONTENT_DIR, 'projects');
const DIST_DIR = path.join(ROOT, 'dist');
const SCRIPT_JS = path.join(ROOT, 'script.js');
const MARKER = '/* __BUILD_INJECT_HERE__ */';

const ARG = process.argv[2];
const WATCH = ARG === '--watch' || ARG === '-w';

// 配置 marked
marked.setOptions({ gfm: true, breaks: false, headerIds: true, mangle: false });

// ===== 工具 =====
function readMd(file) {
  const raw = fs.readFileSync(file, 'utf8');
  const { data, content } = matter(raw);
  const html = marked.parse(content);
  return { ...data, html };
}

function loadDir(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.md'))
    .sort()
    .map(f => readMd(path.join(dir, f)));
}

function writeJson(name, data) {
  fs.mkdirSync(DIST_DIR, { recursive: true });
  fs.writeFileSync(path.join(DIST_DIR, name), JSON.stringify(data, null, 2), 'utf8');
}

// ===== 1. 加载内容 =====
const writings = loadDir(WRITING_DIR);
const projects = loadDir(PROJECTS_DIR);
console.log(`✓ Loaded ${writings.length} writings, ${projects.length} projects`);

// ===== 2. 写出 dist/content.json =====
writeJson('content.json', { writings, projects });
console.log('✓ Wrote dist/content.json');

// ===== 3. 转换为 articles 结构 (dialog 用) =====
const articles = {};
writings.forEach(w => {
  articles[w.id] = {
    id: w.id,
    number: w.number,
    featured: w.featured,
    kicker: `${w.category || ''} · ${w.date || ''} · ${w.readingMinutes || '?'} 分钟`,
    title: w.title,
    deck: w.excerpt,
    image: w.cover,
    alt: w.coverAlt || w.title,
    body: w.html,
    excerpt: w.excerpt,
    cover: w.cover,
    coverAlt: w.coverAlt,
    category: w.category,
    date: w.date,
    dateISO: w.dateISO,
    readingMinutes: w.readingMinutes,
  };
});

const projectsJS = projects.map(p => ({
  id: p.id,
  number: p.number,
  title: p.title,
  category: p.category,
  url: p.url,
  cover: p.cover,
  coverAlt: p.coverAlt || p.title,
  color: p.color,
  tags: p.tags || [],
  stars: p.stars || 0,
  excerpt: (p.html || '').replace(/<[^>]+>/g, ' ').trim().slice(0, 240),
}));

// ===== 4. 内联到 script.js (替换 MARKER) =====
// 关键: 替换前先把 script.js 中可能残留的旧 ARTICLES_DATA / PROJECTS_DATA 块清掉,
// 否则 build 多次会重复注入
let js = fs.readFileSync(SCRIPT_JS, 'utf8');

// 先剥除任何已存在的 ARTICLES_DATA / PROJECTS_DATA 块 (上次 build 残留)
js = js.replace(/const ARTICLES_DATA = \{[\s\S]*?^\};\s*\nconst PROJECTS_DATA = \[[\s\S]*?^\];/m, '');

// 再剥除可能游离的 PROJECTS_DATA
js = js.replace(/const PROJECTS_DATA = \[[\s\S]*?^\];/m, '');

const inlineBlock = `const ARTICLES_DATA = ${JSON.stringify(articles, null, 2)};
const PROJECTS_DATA = ${JSON.stringify(projectsJS, null, 2)};
`;

if (js.includes(MARKER)) {
  js = js.replace(MARKER, inlineBlock.trim());
} else {
  // 兜底: 注入到 loadMarkdownContent 函数前
  const fnIdx = js.indexOf('async function loadMarkdownContent');
  if (fnIdx > 0) {
    js = js.slice(0, fnIdx) + inlineBlock + js.slice(fnIdx);
  } else {
    console.warn('[build] could not find __BUILD_INJECT_HERE__ marker, skipping inline');
  }
}

const before = js.length;
fs.writeFileSync(SCRIPT_JS, js, 'utf8');
console.log(`✓ Inlined content into script.js (${js.length - before >= 0 ? '+' : ''}${js.length - before} bytes)`);

// ===== 5. 监听模式 =====
if (WATCH) {
  console.log('\n👀 Watching content/ for changes... (Ctrl+C to stop)');
  let timer = null;
  const onChange = (file) => {
    console.log(`  → changed: ${file}`);
    clearTimeout(timer);
    timer = setTimeout(() => {
      console.log('  rebuilding...');
      require('child_process').execSync(`node "${__filename}"`, { stdio: 'inherit' });
    }, 200);
  };
  fs.watch(CONTENT_DIR, { recursive: true }, (event, filename) => {
    if (filename && filename.endsWith('.md')) onChange(filename);
  });
} else {
  console.log('\n✅ Build complete!');
  console.log(`   • dist/content.json (${fs.statSync(path.join(DIST_DIR, 'content.json')).size} bytes)`);
  console.log(`   • script.js (inlined, ${js.length} bytes)`);
  console.log('\nNext:');
  console.log('   python -m http.server 8000');
  console.log('   open http://127.0.0.1:8000\n');
}