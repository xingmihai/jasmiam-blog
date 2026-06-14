---
title: 十年之约
categories: 十年之约
tags:
  - 十年之约
id: 20260614
date: 2026-06-14 00:00:00
cover: "assets/images/footer/ten_year_promise.svg"
recommend: true
top: true
---

## 十年之约

### 效果可以看公告

:::note{type="error"}
2026.06.14 — 2036.06.14
[履约证书](https://www.blogsclub.org/certificate/10000218)
:::

![ten_year_promise](/assets/images/footer/ten_year_promise.svg)

---

### 关于

这是一个记录十年时光流逝的动态进度卡片。从 **2026年6月14日** 开始，到 **2036年6月14日** 结束，整整十年的约定。

---

### 技术说明

- **格式**：SVG（可缩放矢量图形）
- **尺寸**：250 × 250（正方形）
- **动态更新**：使用 JavaScript 读取系统时间，每秒自动刷新进度
- **进度显示**：圆形进度环，红橙渐变

---

### 使用方法

#### 1. 直接嵌入 HTML

```html
<object data="ten_year_promise.svg" type="image/svg+xml" width="300" height="300"></object>
```

或

```html
<iframe src="ten_year_promise.svg" width="250" height="250" frameborder="0"></iframe>
```

#### 2. 作为图片引用（静态显示）

```html
<img src="ten_year_promise.svg" alt="十年之约" width="250>
```

:::note
注意：使用 `<img>` 标签时，SVG 内的 JavaScript 不会执行，进度不会动态更新。
:::

#### 3. 内联 SVG

直接将 SVG 代码复制到 HTML 文件中，JavaScript 会自动运行。

---

### 设计特点

| 项目 | 说明 |
|------|------|
| 背景 | 半透灰 `rgba(200, 200, 210, 0.45)`，带阴影 |
| 边框 | 白色半透明边框，双层设计 |
| 进度环 | 红橙渐变，圆角线帽 |
| 统计 | 已过去天数 / 剩余天数 |
| 时间戳 | 底部实时显示当前系统时间 |

---

### 当前进度

:::note
进度会随系统时间自动更新，每秒刷新一次。
:::

---

### 自定义修改

如需修改时间范围，编辑 SVG 文件中的以下部分：

```javascript
var startDate = new Date("2026-06-14T00:00:00+08:00");
var endDate = new Date("2036-06-14T00:00:00+08:00");
```

修改日期即可适配其他时间跨度。

---

*愿十年之后，回首无悔。*
