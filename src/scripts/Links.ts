import vh from 'vh-plugin'
import { $GET } from '@/utils/index'
// 图片懒加载
import vhLzImgInit from "@/scripts/vhLazyImg";

/**
 * Fisher-Yates 洗牌算法 —— 打乱数组顺序（均匀随机）
 * @param array 要打乱顺序的数组
 * @returns 打乱后的新数组（不修改原数组）
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]; // 拷贝一份，不修改原数组
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // 0 <= j <= i
    // 交换 i 和 j 位置的元素
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// 渲染友情链接
const LinksInit = async (data: any) => {
  const linksDOM = document.querySelector('.main-inner-content>.vh-tools-main>main.links-main')
  if (!linksDOM) return;

  try {
    let res = data;
    if (typeof data === 'string') {
      res = await $GET(data);
    }

    // 🔒 使用 Fisher-Yates 算法对友情链接数据进行随机排序
    const shuffledRes = shuffleArray(res);

    // 渲染随机排序后的链接
    linksDOM.innerHTML = shuffledRes.map((i: any) => `
      <a href="${i.link}" target="_blank">
        <img class="avatar" src="${i.avatar}" />
        <section class="link-info">
          <span>${i.name}</span>
          <p class="vh-ellipsis line-2">${i.descr}</p>
        </section>
      </a>
    `).join('');

    // 启用图片懒加载
    vhLzImgInit();
  } catch {
    vh.Toast('获取数据失败')
  }
}

// 友情链接数据源
import LINKS_DATA from "@/page_data/Link";
const { api, data } = LINKS_DATA;
export default () => LinksInit(api || data)
