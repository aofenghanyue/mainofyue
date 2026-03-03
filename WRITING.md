# 写作指南 · WRITING.md

> 本站技术栈：纯 HTML/CSS/JS，无需构建工具，任意静态服务器或 VS Code Live Server 均可预览。

---

## 新增一篇文章（两步完成）

### 第一步：复制模板，填写内容

```
articles/
├── _template.html   ← 复制这个文件
└── 你的分类/
    └── 你的文章.html
```

将 `articles/_template.html` 复制到对应分类目录，按文件内的 `①②③...` 注释逐一填写：

| 注释 | 填写内容 |
|------|---------|
| ① | `<title>` 文章标题 |
| ② | 面包屑显示的短标题 |
| ③ | 分类名（词话 / 阅微 / 格物 / 异想）|
| ④ | 分类英文标签（POETRY / READING / TECH / WHIMSY）|
| ⑤ | 文章主标题 `<h1>` |
| ⑥ | 副标题（可选，无则删除该行）|
| ⑦ | 发布日期 |
| ⑧ | 标签（可增减 `<span class="article-tag">` 数量）|

在 `article-content` div 中书写正文，支持所有 HTML 标签。

**注意路径深度**：模板默认 `../../` 指向根目录，适用于两级嵌套（如 `articles/某分类/文章.html`）。若直接放在 `articles/` 根下，改为 `../`。

---

### 第二步：在 articles.json 添加一条记录

打开 `data/articles.json`，在 `articles` 数组中添加：

```json
{
  "id":       "唯一英文ID",
  "title":    "文章标题",
  "subtitle": "副标题（可选，留空字符串则不显示）",
  "category": "whimsy",
  "date":     "2026-03-03",
  "tags":     ["标签一", "标签二"],
  "summary":  "一两句话的简介，不会显示在列表但有助于SEO",
  "path":     "articles/你的分类/你的文章.html"
}
```

**category 可选值**：`poetry`（词话）/ `reading`（阅微）/ `tech`（格物）/ `whimsy`（异想）

完成！刷新 `list.html` 即可看到新文章出现在对应分类下。

---

## 本地预览

- **推荐**：VS Code 安装 [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) 插件，右键 `index.html` → `Open with Live Server`
- **备选**：Python `python -m http.server 8080`，然后访问 `http://localhost:8080`
- **注意**：直接双击 HTML 文件（`file://`协议）会导致 `articles.json` 加载失败，列表页会退回到静态兜底数据，文章链接仍然正常工作

---

## 目录结构一览

```
pageOfyue/
├── index.html          # 主页
├── list.html           # 文章列表（动态读取 articles.json）
├── data/
│   └── articles.json   # 文章元数据库 ← 每次新增文章更新这里
├── articles/
│   ├── _template.html  # 文章模板 ← 每次新增文章复制这个
│   └── 荒诞不羁/
│       └── 数学哲学.html
├── assets/
│   ├── css/
│   │   ├── style.css   # 全局样式
│   │   └── article.css # 文章页样式
│   └── js/
│       ├── script.js   # 全局交互（粒子动画、墨点效果等）
│       └── components.js # 共享组件（如需多页共享 nav）
└── WRITING.md          # 本文件
```

---

## 文章内常用 HTML 片段

```html
<!-- 引用块 -->
<blockquote style="border-left:3px solid var(--ink-mid);padding-left:1.2rem;margin:1.5rem 0;color:var(--ink-mid);font-style:italic;">
  "引用内容"
  <footer style="font-size:0.85rem;margin-top:0.5rem;opacity:0.7;">—— 出处</footer>
</blockquote>

<!-- 小节标题 -->
<h2 style="font-family:var(--font-kai);font-size:1.6rem;margin:2.5rem 0 1rem;letter-spacing:0.1em;">标题</h2>

<!-- 印章标签 -->
<span class="seal">ofyue印</span>

<!-- 水平分割线 -->
<div style="height:1px;background:linear-gradient(90deg,transparent,var(--ink-light),transparent);margin:2.5rem 0;opacity:0.4;"></div>
```
