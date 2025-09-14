---
title: 用 Cloudflare Workers + R2 搭建免费的 Serverless 云存储系统
categories: Cloudflare
tags:
  - Cloudflare
  - 自建云盘
id: 20250914074700
date: 2025-09-14 07:47:00
recommend: true
---

## ☁️ Cloudflare Workers 云存储文件管理器

一个基于 **Cloudflare Workers + R2 对象存储** 的轻量级、无服务器、支持登录验证的在线文件管理工具。

无需购买服务器，无需数据库，全球 CDN 加速，即开即用！

---

graph TD
  A[注册 Cloudflare 账号] --> B[开通 Workers 和 R2]
  B --> C[创建 R2 存储桶<br/>如：my-files]
  C --> D[创建 Cloudflare Worker]
  D --> E[配置环境变量<br/>ACCESS_PASSWORD=xxx]
  E --> F[绑定 R2 Bucket<br/>命名为 MY_BUCKET]
  F --> G[保存并部署]
  G --> H[访问 Worker URL，登录使用]

### ✨ 功能特性

- 🔐 **密码登录保护**：通过环境变量设置访问密码，保障文件安全
- 📤 **多文件上传**：支持一次选择多个文件并上传
- 📥 **文件下载**：点击文件名即可下载，支持中文等特殊字符
- 🗑️ **删除文件**：支持单个删除和批量删除（带确认）
- 🔍 **搜索与排序**：按文件名搜索，支持按文件大小、修改时间排序
- 📱 **响应式 UI**：支持 PC / 平板 / 手机，自适应布局
- 🌓 **亮色/暗色主题**：支持一键切换，本地记忆
- 🌍 **全球加速**：依托 Cloudflare CDN，访问飞快

---

### 🛠️ 技术栈

| 技术 | 说明 |
|------|------|
| **Cloudflare Workers** | 无服务器运行时，处理文件上传、下载、删除等逻辑 |
| **Cloudflare R2** | 对象存储服务，用于存储用户上传的文件（类似 AWS S3） |
| **前端** | 原生 HTML + CSS + JavaScript，单页应用，无框架依赖 |
| **环境变量** | `ACCESS_PASSWORD`：用于登录验证；`MY_BUCKET`：绑定的 R2 存储桶 |

---

### 🚀 快速开始（部署教程）

#### 1. 前提条件

- 拥有 [Cloudflare 账号](https://dash.cloudflare.com/)
- 已开通 **Cloudflare Workers** 和 **R2 存储服务**

#### 2. 创建 R2 存储桶

1. 进入 [R2 控制台](https://dash.cloudflare.com/?to=/:account/r2/buckets)
2. 创建一个新的 Bucket（例如：`my-files`）

#### 3. 创建 Worker

1. 进入 [Workers & Pages](https://dash.cloudflare.com/?to=/:account/workers)
2. 点击 **Create Application > Worker**
3. 将本项目代码（见下方或仓库代码）复制到 Worker 编辑器中

#### 4. 配置环境变量 & 绑定 R2

- **环境变量**
  - 添加 `ACCESS_PASSWORD`，值为你的登录密码（如：`mypassword123`）
- **Bindings**
  - 添加一个 **R2 Bucket**，命名为 `MY_BUCKET`，选择你刚创建的存储桶

#### 5. 部署

- 点击 **Save and Deploy**
- 访问 Worker 默认域名（如：`https://file-manager.yourname.workers.dev/`）
- 输入密码，即可进入文件管理界面

---

### 📁 使用指南

- 打开网页后，首先进入登录页，输入密码登录
- 登录后：
  - 📤 点击「选择文件」上传文件
  - 📥 点击文件名或「下载」按钮下载文件
  - 🗑️ 点击「删除」按钮删除文件（有确认提示）
  - 🔍 使用搜索框查找文件
  - ⬆️⬇️ 选择排序方式（按名称、大小、时间排序）
  - ✅ 支持批量勾选和批量删除

---

### 🛡️ 安全建议

- 一定要设置 `ACCESS_PASSWORD`，否则可能造成未授权访问！
- 不要将密码硬编码在前端，也不要泄露环境变量
- 可根据需要进一步扩展权限控制、日志记录等功能

---

### 🧩 可扩展功能（TODO / Ideas）

- [ ] 文件预览（图片、PDF、视频等）
- [ ] 支持文件夹 / 目录结构
- [ ] 上传进度条
- [ ] 多用户 / 权限管理
- [ ] 文件分享链接（带密码或过期时间）
- [ ] 操作日志记录
- [ ] 更多主题 / UI 定制

---

### 📄 项目结构

- `worker.js`：主入口，包含路由、身份验证、文件操作逻辑
- 前端界面：内置 HTML / CSS / JS，单页应用，无外部依赖
- 托管于 Cloudflare Worker，无需额外服务器或前端部署

---

### 🤝 贡献

欢迎提交 Issue、PR，一起改进这个项目！

如果你觉得这个工具对你有帮助，欢迎：

- ✨ Star 本项目
- 📤 分享给朋友或团队
- 🛠️ 提出改进建议或新功能需求

---

### 🔗 相关技术

- [Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [Cloudflare R2](https://developers.cloudflare.com/r2/)
- [Serverless 架构](https://en.wikipedia.org/wiki/Serverless_computing)
- [R2 SDK (Cloudflare Workers Bindings)](https://developers.cloudflare.com/workers/runtime-apis/r2/)

---

### ✨ License

MIT License — 可自由使用、修改和分发

---

📸 **界面预览：**

:::picture
![Astro主题-vhAstro-Theme](https://img.jasmiam.top/v2/CnJtItN.jpeg)
![Astro主题-vhAstro-Theme](https://img.jasmiam.top/v2/uP1am9E.jpeg)
![Astro主题-vhAstro-Theme](https://img.jasmiam.top/v2/zJbJWxM.jpeg)
:::

::btn[👉 源码已上传至 GitHub]{link="https://github.com/1498934815/cloudflare-file-manager" type="error"}