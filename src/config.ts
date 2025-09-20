export default {
  // 网站标题
  Title: '静谧幻想家的博客',
  // 网站地址
  Site: 'https://jasmiam.top',
  // 网站副标题
  Subtitle: '一起慢慢进步.',
  // 网站描述
  Description: '静谧幻想家博客 专注于相关技术的实战分享。同时，博客也分享作者的生活、音乐和旅行的热爱。',
  // 网站作者
  Author: '𝑱𝑨𝑺𝑴𝑰𝑨𝑴',
  // 作者头像
  Avatar: 'https://q1.qlogo.cn/g?b=qq&nk=1498934815&s=640',
  // 网站座右铭
  Motto: '除了死亡，一切失败都只存在于心理层面.',
  // Cover 网站缩略图
  Cover: '/assets/images/banner/072c12ec85d2d3b5.webp',
  // 网站侧边栏公告 (不填写即不开启)
  Tips: '<p>欢迎光临我的博客 🎉</p><p>这里会分享我的日常和学习中的收集、整理及总结，希望能对你有所帮助:) 💖</p><p><img src=/assets/images/tips.gif style=width:100%></p>',
  // 首页打字机文案列表
  TypeWriteList: [
    '一起慢慢进步.',
    "Make progress together.",
  ],
  // 网站创建时间
  CreateTime: '2025-09-10',
  // 顶部 Banner 配置
  HomeBanner: {
    enable: true,
    // 首页高度
    HomeHeight: '38.88rem',
    // 其他页面高度
    PageHeight: '28.88rem',
    // 背景
    background: "url('/assets/images/home-banner.webp') no-repeat center 60%/cover",
  },
  // 博客主题配置
  Theme: {
    // 颜色请用 16 进制颜色码
    // 主题颜色
    "--vh-main-color": "#01C4B6",
    // 字体颜色
    "--vh-font-color": "#34495e",
    // 侧边栏宽度
    "--vh-aside-width": "318px",
    // 全局圆角
    "--vh-main-radius": "0.88rem",
    // 主体内容宽度
    "--vh-main-max-width": "1458px",
  },
  // 导航栏 (新窗口打开 newWindow: true)
  Navs: [
    // 仅支持 SVG 且 SVG 需放在 public/assets/images/svg/ 目录下，填入文件名即可 <不需要文件后缀名>（封装了 SVG 组件 为了极致压缩 SVG）
    // 建议使用 https://tabler.io/icons 直接下载 SVG
    { text: '朋友', link: '/links', icon: 'Nav_friends' },
    { text: '动态', link: '/talking', icon: 'Nav_talking' },
    { text: '昔日', link: '/archives', icon: 'Nav_archives' },
    { text: '留言', link: '/message', icon: 'Nav_message' },
    { text: '关于', link: '/about', icon: 'Nav_about' },
  ],
  // 侧边栏个人网站
  WebSites: [
    // 仅支持 SVG 且 SVG 需放在 public/assets/images/svg/ 目录下，填入文件名即可 <不需要文件后缀名>（封装了 SVG 组件 为了极致压缩 SVG）
    // 建议使用 https://tabler.io/icons 直接下载 SVG
    { text: 'Github', link: 'https://github.com/jasm1am', icon: 'WebSite_github' },
    { text: '骤雨重山图床', link: 'https://img.jasmiam.top', icon: 'WebSite_img' },
    { text: 'Analytics', link: 'https://analytics.jasmiam.top', icon: 'WebSite_analytics' },
    { text: 'MT论坛', link: 'https://bbs.binmt.cc/home.php?mod=space&uid=147108&do=profile', icon: 'WebSite_mt' },
    { text: '微信', link: 'https://img.jasmiam.top/v2/ROIwNPT.png', icon: 'WebSite_wechat' },
    { text: 'QQ', link: 'mqqopensdkapi://bizAgent/qm/qr?url=https%3A%2F%2Fqm.qq.com%2Fcgi-bin%2Fqm%2Fqr%3Fk%3DtYrhpSkPVMGRrU_u6RBUcYwsXQAxh_b_%26jump_from%3D%26auth%3D%26app_name%3D%26authSig%3D%26source_id%3D3_40001', icon: 'WebSite_qq' },
    { text: 'Email', link: 'mailto:hr@jasmiam.top', icon: 'WebSite_email' },
    { text: 'bilibili', link: 'https://b23.tv/EscDwn5', icon: 'WebStie_bilibili' },
    { text: 'QQ群', link: 'mqqapi://card/show_pslcard?src_type=internal&version=1&uin=1054810204&card_type=group&source=qrcode', icon: 'WebStie_group' },  ],
  // 侧边栏展示
  AsideShow: {
    // 是否展示个人网站
    WebSitesShow: true,
    // 是否展示分类
    CategoriesShow: true,
    // 是否展示标签
    TagsShow: true,
    // 是否展示推荐文章
    recommendArticleShow: true
  },
  // DNS预解析地址
  DNSOptimization: [
    'https://i0.wp.com',
    'https://cn.cravatar.com',
    'https://analytics.jasmiam.top',
    'https://pagead2.googlesyndication.com'
  ],
  // 博客音乐组件解析接口
  vhMusicApi: 'https://vh-api.4ce.cn/blog/meting',
  // 评论组件（只允许同时开启一个）
  Comment: {
    // Twikoo 评论
    Twikoo: {
      enable: false,
      envId: ''
//https://jasmiam.netlify.app
    },
    // Waline 评论
    Waline: {
      enable: true,
      serverURL: 'https://waline2.jasmiam.top'

//https://jasmiamwaline.netlify.app/.netlify/functions/comment
//https://waline.jasmiam.top/.netlify/functions/comment
//https://waline2.jasmiam.top
    }
  },
  // Han Analytics 统计（https://github.com/uxiaohan/HanAnalytics）
  Analytics: { enable: true, server: 'https://analytics.jasmiam.top', siteId: 'blog' },
  // Google 广告
  GoogleAds: {
    ad_Client: 'ca-pub-1811874893901855', //ca-pub-xxxxxx
    // 侧边栏广告(不填不开启)
    asideAD_Slot: `<ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-1811874893901855" data-ad-slot="1811874893901855" data-ad-format="auto" data-full-width-responsive="true"></ins>`,
    // 文章页广告(不填不开启)
    articleAD_Slot: `<ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub1811874893901855" data-ad-slot="1811874893901855" data-ad-format="auto" data-full-width-responsive="true"></ins>`
  },
  // 文章内赞赏码
  Reward: {
    // 支付宝收款码
    AliPay: '/assets/images/alipay.webp',
    // 微信收款码
    WeChat: '/assets/images/wechat.webp'
  },
  // 访问网页 自动推送到搜索引擎
  SeoPush: {
    enable: false,
    serverApi: '',
    paramsName: 'url'
  },
  // 页面阻尼滚动速度
  ScrollSpeed: 666
}