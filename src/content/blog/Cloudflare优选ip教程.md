---
title: Cloudflare优选ip教程
categories: 教程
tags:
  - Cloudflare
  - 教程
id: 202510240404
date: 2025-10-24 04:04:00
cover: "https://dash.cloudflare.com/favicon-196x196.png"
recommend: true
---
:::note{type="error"}
用我的两个域名来演示

主力域名: xmhai.cn  辅助域名: jasmiam.top

我的两个域名都托管在Cloudflare

主力域名用来访问，辅助域名用来优选

优选域我用的是 cloudflare.182682.xyz

本站是部署在netlify上的
:::

### 🚀 快速开始

#### 前提条件
- 拥有 [Cloudflare 账号](https://dash.cloudflare.com/)
- Cloudflare 账号已绑定支付方式
- 拥有两个域名
- 辅助域名必须托管在Cloudflare上

#### 辅助域名dns配置
| 类型 | 名称 | 目标 | 代理状态 |
| :--: | :--: | :--: | :--: |
| cname | cdn | cloudflare.182682.xyz | 关 |
| cname或A | @ | 网址或ip | 开 |

:::picture
![Screenshot_2025-10-24-04-50-31-809_mark.via.png](https://img.xmhai.cn/v2/iaBzi9V.png)
![Screenshot_2025-10-24-04-51-11-410_mark.via.png](https://img.xmhai.cn/v2/EVNlWSs.png)
:::

#### 辅助域名自定义主机名
:::note{type="error"}
添加一个默认回退源，我填的是jasmiam.top，因为我的辅助域名的dns记录是@

添加自定义主机名**xmhai.cn**，自定义源服务器选**默认源服务器**
:::

:::picture
![Screenshot_2025-10-24-04-56-16-885_mark.via.png](https://img.xmhai.cn/v2/l5MfHvx.png)
![Screenshot_2025-10-24-04-55-12-042_mark.via.png](https://img.xmhai.cn/v2/xgyeaYu.png)
:::

#### 主域名dns配置
| 类型 | 名称 | 目标 | 代理状态 |
| :--: | :--: | :--: | :--: |
| cname | @ | cdn.jasmiam.top | 关 |

![Screenshot_2025-10-24-05-15-18-220_mark.via.png](https://img.xmhai.cn/v2/e8cQr9R.png)

> 然后访问**xmhai.cn**就可以了

### 如何配置多个站点？
- 假如我要用**page.xmhai.cn**来访问

#### 辅助域名dns配置

| 类型 | 名称 | 目标 | 代理状态 |
| :--: | :--: | :--: | :--: |
| cname或A | page | 网址或ip | 开 |

![Screenshot_2025-10-24-05-02-25-332_mark.via.png](https://img.xmhai.cn/v2/lbQQsz0.png)

#### 辅助域名自定义主机名

:::note{type="error"}
自定义主机名填page.xmhai.cn，自定义源服务器选**自定义源服务器**填写page.jasmiam.top
:::

![Screenshot_2025-10-24-05-04-27-128_mark.via.png](https://img.xmhai.cn/v2/yJhkvUy.png)

#### 主域名dns配置

| 类型 | 名称 | 目标 | 代理状态 |
| :--: | :--: | :--: | :--: |
| cname | page | cdn.jasmiam.top | 关 |

![Screenshot_2025-10-24-05-14-03-648_mark.via.png](https://img.xmhai.cn/v2/TuMnQiY.png)

> 然后访问**page.xmhai.cn**就行了