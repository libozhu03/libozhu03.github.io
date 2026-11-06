# Libo Zhu — academic homepage

个人学术主页：**https://libozhu03.github.io/**

参考 Chiao Fang 主页的双栏学术布局，使用独立编写的 HTML/CSS/JavaScript 实现。个人资料集中存放在 JSON 文件中；无需学习前端框架即可更新。页面采用本地字体和静态 HTML，正文不依赖 JavaScript。

## 本地预览

需要 Node.js 22 或更新版本。

```sh
npm ci
npm run dev
```

打开终端显示的 `http://127.0.0.1:4173`。修改内容后重启预览命令，或在另一个终端执行 `npm run build` 后刷新浏览器。

```sh
npm test          # 内容渲染、链接安全及空栏目检查
npm run build    # 生成 dist/
npm run test:browser # 桌面、手机、无 JS、筛选及资源加载检查
```

浏览器测试在 Windows 本地使用已安装的 Microsoft Edge。其他环境可设置 `CI=1` 并先运行 `npx playwright install chromium`。

## 更新资料

编辑 **`content/site.json`**：

- `profile`：姓名、身份、学校、简介、邮箱、研究兴趣、教育经历。
- `profile.portrait`：头像路径，当前为 `/assets/portrait.jpg`。
- `profile.scholar`：可选；添加真实 Scholar 链接后自动出现入口。
- `profile.cv`：可选；添加可公开的简历到 `public/assets/cv.pdf`，再设为 `/assets/cv.pdf`，会自动出现 CV 链接。
- `publications`：论文条目。
- `projects`：项目条目，按 `categories` 自动生成筛选按钮。

当前论文和项目数组为空，按本人要求稍后补充。空栏目会显示简短说明。原始简历 PDF 不包含在仓库或网站中。

### 添加论文

将以下结构加入 `publications` 数组，替换示例字段与链接。示例仅用于说明格式，不会出现在网站上。

```json
{
  "title": "Paper title",
  "authors": ["Libo Zhu", "Coauthor"],
  "venue": "Conference or journal",
  "year": 2026,
  "description": "A one-sentence description of the contribution.",
  "image": "/assets/paper-thumbnail.jpg",
  "imageAlt": "Description of the paper figure",
  "url": "https://example.org/paper",
  "links": [
    { "label": "Paper", "url": "https://example.org/paper.pdf" },
    { "label": "Code", "url": "https://github.com/libozhu03/REPOSITORY" }
  ]
}
```

图片、说明、项目入口及各资源链接均可省略。需要展示的图片放入 `public/assets/`，不要直接使用本地磁盘路径。

### 添加项目

```json
{
  "title": "Project title",
  "description": "What the project does.",
  "image": "/assets/project-preview.jpg",
  "imageAlt": "Description of the preview",
  "categories": ["Image restoration", "Efficiency"],
  "url": "https://example.org/project",
  "links": [
    { "label": "Code", "url": "https://github.com/libozhu03/REPOSITORY" }
  ]
}
```

没有图片时会使用文字卡片。没有项目时隐藏筛选栏。正文全部按纯文本处理，不能在 JSON 中写 HTML。

## 部署

仓库名为 `libozhu03.github.io`，GitHub Pages 的 Source 设为 **GitHub Actions**。每次推送到 `main` 后，`.github/workflows/deploy.yml` 自动运行测试、构建并部署 `dist/`。

部署内容只来自生成的 HTML 和 `public/`，不会上传 `docs/`、`tests/`、源数据文件或本地简历。使用 `git add` 和推送前应确认只包含需要公开的源代码与资料。

## 文件结构

```text
content/site.json        个人资料、论文和项目
scripts/render.mjs       HTML 渲染
scripts/build.mjs        静态构建
scripts/serve.mjs        本地预览
public/assets/           样式、脚本、照片和字体
tests/                   渲染和浏览器检查
.github/workflows/       GitHub Pages 自动部署
```

字体为 Montserrat 和 Roboto，使用 SIL Open Font License，许可证位于 `docs/licenses/`。页面结构灵感来自 https://www.chiaofang.tw/；未复制其照片、研究内容或项目素材。
