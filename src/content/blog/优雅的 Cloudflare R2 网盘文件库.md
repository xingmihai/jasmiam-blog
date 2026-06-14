---
title: 优雅的 Cloudflare R2 网盘文件库
categories: 开源
tags:
  - 开源
  - Cloudflare
  - Workers
id: 202606130923
cover: https://save.xmhai.cn/assets/homescreen.png
date: 2026-06-13 09:23:00
recommend: false
comment: true
---

## FlareDrive-R2 Worker 部署指南

### 🌟 项目简介
:::note
 📌 本项目修改自 [Cloudflare-R2](https://github.com/willow-god/FlareDrive-R2/)，因为Cloudflare pages 优选太麻烦，所以有了此项目
:::

## 前置要求

- Cloudflare 账号
- 已开通 Cloudflare R2 服务

## 部署步骤

### 1. 配置 R2 存储桶

1. 前往 Cloudflare R2 控制台
2. 创建新的存储桶（建议名称全小写，如 `my-drive-bucket`）
3. 记录存储桶名称

### 2. 配置公开访问（用于 /raw/ 路径）

1. 在 R2 控制台中，找到你的存储桶
2. 进入 **Settings** 标签页
3. 配置 **Public URLs**，启用公开访问
4. 记录公开访问 URL（如 `https://pub-xxx.r2.dev`）

### 3. Cloudflare Workers 自动部署

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/xingmihai/FlareDrive-R2-Workers)

### 4. 配置 wrangler.toml

编辑 `wrangler.toml` 文件，填入你的配置信息：

```toml
name = "flaredrive-r2-workers"                    # Worker 名称
main = "src/index.js"
compatibility_date = "2026-06-13"

[[r2_buckets]]
binding = "BUCKET"
bucket_name = "your-bucket-name"          # 替换为你的 R2 桶名

[assets]
directory = "./public"

[vars]
PUBURL = "https://your-puburl.r2.dev"              # 替换为你的 R2 公开访问 URL
# GUEST = ""                                        # 访客权限，* 表示允许写入所有路径(可选)
"admin:123456" = "*"
# 管理员账号密码
```

### 5. 访问你的网盘

部署完成后，Wrangler 会输出你的 Worker URL（如 `https://flaredrive-r2.your-account.workers.dev`），打开即可使用。

## 权限配置

### 访客写入 (可选)

在 `wrangler.toml` 的 `[vars]` 中设置 `GUEST`：

- `GUEST = "*"` - 允许访客写入所有路径
- `GUEST = "public,shared"` - 仅允许写入 `public` 和 `shared` 目录

### 管理员账号密码

在 `wrangler.toml` 的 `[vars]` 中设置 `admin:123456`：
然后在访问时，浏览器会弹出 Basic 认证框，输入用户名和密码即可。

## 自定义域名（可选）

1. 在 Cloudflare 控制台中，进入你的 Worker
2. 点击 **Triggers** -> **Custom Domains**
3. 添加你的自定义域名

## 注意事项

1. 首次部署后，R2桶是空的网盘就是是空的，需要通过上传功能添加文件
2. 大文件上传使用分片上传，支持断点续传
3. `/raw/` 路径用于文件直链访问，需要配置 `PUBURL`

## 项目结构

```
flaredrive-worker/
├── src/
│   └── index.js          # Worker 入口（API路由 + 静态文件服务）
├── public/               # 静态文件目录
│   ├── index.html        # 前端入口
│   ├── favicon.ico
│   └── assets/           # Vue组件、CSS、JS等前端资源
│       ├── App.vue
│       ├── *.vue
│       ├── main.css
│       ├── main.mjs
│       └── ...
├── wrangler.toml         # Cloudflare Worker 配置
├── package.json
└── README.md             # 本文件
```
