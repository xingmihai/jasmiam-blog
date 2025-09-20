import vh from 'vh-plugin'
import { $GET } from '@/utils/index'
import vhLzImgInit from "@/scripts/vhLazyImg";
import LINKS_DATA from "@/page_data/Link";

// Fisher-Yates 随机排序算法
const shuffleArray = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// 友情链接初始化
export default async () => {
  const { api, data } = LINKS_DATA;
  const linksDOM = document.querySelector('.main-inner-content>.vh-tools-main>main.links-main');
  
  if (!linksDOM) return;
  
  try {
    // 获取数据源（优先使用API）
    const res = typeof data === 'string' ? await $GET(data) : data;
    
    // 随机排序
    const shuffledRes = shuffleArray(res);
    
    // 渲染HTML
    linksDOM.innerHTML = shuffledRes.map((item: any) => `
      <a href="${item.link}" target="_blank">
        <!-- 确保 avatar 字段存在且路径正确 -->
        
        <section class="link-info">
          <span>${item.name}</span>
          <p class="vh-ellipsis line-2">${item.descr}</p>
        </section>
      </a>
    `).join('');
    
    // 初始化懒加载
    vhLzImgInit();

  } catch (error) {
    vh.Toast('获取数据失败');
    console.error('友情链接加载失败:', error);
  }
};
