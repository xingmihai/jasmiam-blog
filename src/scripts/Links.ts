import vh from 'vh-plugin'
import { $GET } from '@/utils/index'
import vhLzImgInit from "@/scripts/vhLazyImg";

// ✅ Fisher-Yates 洗牌算法
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// 渲染函数
const LinksInit = async (data: any) => {
  const linksDOM = document.querySelector('.main-inner-content>.vh-tools-main>main.links-main')
  if (!linksDOM) {
    console.error('❌ 未找到友链容器');
    return;
  }

  try {
    let res = data;

    // 如果传入的是字符串，说明是 API 地址，尝试请求
    if (typeof data === 'string') {
      console.log('🔁 尝试通过 API 获取数据:', data);
      res = await $GET(data);
    }

    // 打印查看数据是否正常
    console.log('📦 原始友链数据：', res);

    // ✅ 关键：使用 Fisher-Yates 洗牌算法打乱数组
    const shuffledRes = shuffleArray(res);

    // 渲染
    linksDOM.innerHTML = shuffledRes.map((i: any) => `
      <a href="${i.link}" target="_blank">
        <img class="avatar" src="${i.avatar}" />
        <section class="link-info">
          <span>${i.name}</span>
          <p class="vh-ellipsis line-2">${i.descr}</p>
        </section>
      </a>
    `).join('');

    vhLzImgInit();

  } catch (error) {
    console.error('❌ LinksInit 渲染失败：', error);
    vh.Toast('获取数据失败');
  }
}
