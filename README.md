# Libo Zhu — academic homepage

公开主页：**https://libozhu03.github.io/**。本地预览：**http://127.0.0.1:4173/**。

按本人 2026-11-10 的要求恢复公开发布。GitHub Pages 通过手动触发工作流部署；本地修改或推送不会自动更新线上页面。

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

论文已整理为十条。`authors` 可使用姓名字符串，或 `{ "name": "Libo Zhu", "equal": true, "corresponding": false }`；主页自动加粗本人姓名，并统一标注共同一作和通讯作者。论文配图位于 `public/assets/publications/`。

`latest: true` 将论文置于 Latest 区域（当前为 TRACE），其后显示分割线。其余条目先按 `acceptedConference` 区分已接收论文与预印本，再按 `sortDate` 倒序排列；日期相同时按 `firstPublished` 倒序。已接收论文的 `sortDate` 使用会议时间，预印本使用首次公开时间。

本次整理依据（2026-11-06）：PassionSR 为 [CVPR 2025 正式论文](https://openaccess.thecvf.com/content/CVPR2025/html/Zhu_PassionSR_Post-Training_Quantization_with_Adaptive_Scale_in_One-Step_Diffusion_based_CVPR_2025_paper.html)；RIFLE 按[作者仓库](https://github.com/libozhu03/RIFLE)标注 NeurIPS 2026，作者名单采用 [arXiv 公开版](https://arxiv.org/abs/2509.24644)（七人，本地稿件另有 Zhiyi Zhou，待作者确认）。QArtSR 与 CLEAR 使用公开 arXiv 题目、作者顺序和年份，未将本地投稿模板当作录用信息。TRACE 使用本地 `overleaf/TRACE/arxiv.tex`，暂标为 Manuscript 2026，公开链接待补充。论文中的共同一作、通讯作者标记依据对应本地具名稿件。当前页面内容仍仅用于本地预览。

编辑 **`content/site.json`**：

- `profile`：姓名、身份、学校、简介、邮箱、研究兴趣、教育经历。
- `profile.portrait`：头像路径，当前为 `/assets/portrait.jpg`。
- `profile.scholar`：可选；添加真实 Scholar 链接后自动出现入口。
- `profile.cv`：可选；添加可公开的简历到 `public/assets/cv.pdf`，再设为 `/assets/cv.pdf`，会自动出现 CV 链接。
- `publications`：论文条目。
- `news`、`honors`、`internships`、`collaborations`：动态、奖项、实习与合作项目；每条可填写 `title`、`date`、`organization`、`role`、`description`、`url`、`links`。
- `contentOutline`：本地页面上的中文内容清单。设 `enabled: false` 可统一隐藏清单；没有正式内容的新栏目也会隐藏。

本地栏目清单参考 https://xyliu339.github.io/ 的信息组织，仅提取栏目和字段，不采用其个人经历。Education 保留在介绍区；项目仅保留 Collaborative Projects，不展示独立 Projects 栏目。

当前已有十篇论文、三个合作项目；News 包含五篇论文合并后的四条录用消息与七项获奖记录。Zhiyuan Honors Scholarship 仅保留在 Honors and Awards 最后一项。News 的 `type` 用于选择小图标：`paper` 为 🎉，`award` 为 🏅，`competition` 为 🏆；单篇录用消息使用 `paper`、`conference` 和 `url`，同一会议及年份的论文合并为一条，使用 `papers: [{name, url}]` 保留各篇链接，其他消息使用 `title`。原始简历 PDF 不包含在仓库或网站中。

News 时间依据：RIFLE、BRACE 使用作者仓库的录用公告；Freqformer 使用共同作者 [Xiaoyang Liu 的主页](https://xyliu339.github.io/)公告；QuantVSR 的月份按 [AAAI 2026 官方录用通知时间](https://aaai.org/conference/aaai/aaai-26/)归档。PassionSR 按本人确认标为 2025.02。获奖月份来自本人简历，Zhiyuan Honors Scholarship 的 2021–2024 年份范围按本人补充信息填写。

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

### 添加合作项目

将以下结构加入 `collaborations` 数组：

```json
{
  "title": "Project title",
  "description": "What the project does.",
  "organization": "Partner organization",
  "role": "Your role",
  "date": "2026",
  "url": "https://example.org/project",
  "links": [
    { "label": "Code", "url": "https://github.com/libozhu03/REPOSITORY" }
  ]
}
```

正文全部按纯文本处理，不能在 JSON 中写 HTML。

## 部署

仓库名为 `libozhu03.github.io`，使用公开仓库和 GitHub Actions 模式的 Pages。推送准备好的版本后，手动运行 `.github/workflows/deploy.yml`，测试并部署 `dist/`：`gh workflow run deploy.yml --ref main`。

Pages 站点只发布生成的 HTML 和 `public/` 资源。公开源码仓库包含 `docs/`、`tests/` 和 `content/site.json`，不包含原始简历。使用 `git add` 和推送前应确认只包含需要公开的源代码与资料。

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
