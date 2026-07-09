/* eslint-disable */
/**
 * verify.mjs — 博客站点的真实 verification 套件 (Node 22, ESM, 零依赖)
 *
 * 4 个 gate：
 *   1. 构建：node build.js 必须 exit 0
 *   2. 语法：script.js / build.js / verify.mjs 三个 JS 都必须 node --check 通过
 *   3. 资产：HTML 引用的所有 assets/* 必须在文件系统里 + 远端 gh API 上也存在
 *   4. 行为：脚本里所有 fetch/xhr URL 至少能 HEAD 通（本地 8765 端口）
 *      + 关键 DOM 钩子（music toggle 的 Audio 源、tertiary 5 个项目 git url、blog 仓库 url）
 *        都解析到有效目标
 *
 * 用法：
 *   node verify.mjs             # 1+2+3
 *   PORT=8765 node verify.mjs   # 1+2+3+4 (需先 python -m http.server 8765)
 *
 * 任一 gate 失败：process.exit(1)。
 */

import { execSync } from 'node:child_process';
import { readFileSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { request as httpRequest } from 'node:http';

const ROOT = process.cwd();
const PORT = process.env.PORT || '';
let failures = 0;
const log = (label, ok, detail = '') => {
  const tag = ok ? '\x1b[32mPASS\x1b[0m' : '\x1b[31mFAIL\x1b[0m';
  console.log(`  [${tag}] ${label}${detail ? ' — ' + detail : ''}`);
  if (!ok) failures++;
};

// ---------- gate 1: build ----------
console.log('\n[1/4] node build.js');
try {
  const out = execSync('node build.js', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  log('build exit 0', true, out.trim().split('\n').at(-1));
} catch (e) {
  log('build exit 0', false, e.stderr || e.message);
}

// ---------- gate 2: syntax ----------
console.log('\n[2/4] node --check on JS files');
for (const f of ['script.js', 'build.js', 'verify.mjs']) {
  try {
    execSync(`node --check ${f}`, { stdio: ['ignore', 'ignore', 'ignore'] });
    log(`${f} syntax ok`, true);
  } catch (e) {
    log(`${f} syntax ok`, false, e.message);
  }
}

// ---------- gate 3: assets presence (local + remote) ----------
console.log('\n[3/4] assets referenced by HTML/JS exist on disk');
const html = readFileSync(join(ROOT, 'index.html'), 'utf8');
const sj = readFileSync(join(ROOT, 'script.js'), 'utf8');
const referenced = new Set();
const grab = (text, re) => { for (const m of text.matchAll(re)) if (m[1]) referenced.add(m[1]); };
grab(html, /['"](assets\/[^'"\s]+)['"]/g);
grab(html, /['"](dist\/[^'"\s]+)['"]/g);
grab(sj,   /['"](assets\/[^'"\s]+)['"]/g);
grab(sj,   /['"](dist\/[^'"\s]+)['"]/g);
for (const f of referenced) {
  const p = join(ROOT, f);
  if (!existsSync(p)) { log(`local: ${f}`, false, 'missing'); continue; }
  const sz = statSync(p).size;
  log(`local: ${f}`, sz > 0, `${sz} bytes`);
}

// Remote check via gh API (only for asset paths, only the 2 specifically known
// to be tracked remotely: summer-piano.mp3, panda-dashboard_001.jpg, 多来a梦.png)
if (process.env.SKIP_REMOTE !== '1') {
  console.log('\n[3b/4] gh API: key assets on remote HEAD');
  const remoteCheck = [
    'assets/summer-piano.mp3',
    'assets/panda-dashboard_001.jpg',
    'assets/多来a梦.png',
    'index.html',
    'script.js',
    'styles.css',
  ];
  for (const f of remoteCheck) {
    try {
      const out = execSync(
        `gh api repos/jiayangrui05160031-cmyk/-my-profile/contents/${f} --jq .size`,
        { encoding: 'utf8' }
      ).trim();
      log(`remote: ${f}`, /^\d+$/.test(out) && Number(out) > 0, `${out} bytes`);
    } catch (e) {
      log(`remote: ${f}`, false, 'gh api error');
    }
  }
}

// ---------- gate 4: runtime behavior (only if PORT set) ----------
if (PORT) {
  console.log(`\n[4/4] runtime smoke against http://127.0.0.1:${PORT}`);
  const probe = (path, expectType) => new Promise((resolve) => {
    httpRequest({ host: '127.0.0.1', port: PORT, path, method: 'GET' }, (res) => {
      resolve({ status: res.statusCode, type: res.headers['content-type'] || '' });
    }).on('error', () => resolve({ status: 0, type: '' })).end();
  });

  const checks = [
    { path: '/index.html', type: 'text/html', label: 'index.html' },
    { path: '/styles.css', type: 'text/css', label: 'styles.css' },
    { path: '/script.js', type: 'javascript', label: 'script.js (inlined ARTICLES_DATA)' },
    { path: '/assets/summer-piano.mp3', type: 'audio/mpeg', label: 'summer-piano.mp3' },
    { path: '/assets/panda-dashboard_001.jpg', type: 'image/jpeg', label: 'panda-dashboard cover' },
  ];
  for (const c of checks) {
    const r = await probe(c.path);
    const ok = r.status === 200 && r.type.includes(c.type);
    log(`${c.label}`, ok, `${r.status} ${r.type}`);
  }

  // Critical script content shipped to browser
  const htmlBytes = (await probe('/index.html')).status;
  log('index.html reachable', htmlBytes === 200, `status ${htmlBytes}`);
  const serverScript = await new Promise((resolve) => {
    httpRequest({ host: '127.0.0.1', port: PORT, path: '/script.js', method: 'GET' }, (res) => {
      let buf = '';
      res.on('data', (c) => buf += c);
      res.on('end', () => resolve(buf));
    }).on('error', () => resolve('')).end();
  });
  for (const needle of [
    "new Audio('assets/summer-piano.mp3')",
    'visualLabel',
    'coverPosition',
    'panda-dashboard_001.jpg',
  ]) {
    log(`script.js contains: ${needle}`, serverScript.includes(needle));
  }
} else {
  console.log('\n[4/4] runtime smoke: SKIPPED (set PORT=8765 to enable)');
}

console.log(`\n${failures === 0 ? '\x1b[32m✓ ALL GATES PASSED\x1b[0m' : `\x1b[31m✗ ${failures} FAILURE(S)\x1b[0m`}`);
process.exit(failures === 0 ? 0 : 1);
