
// Han Analytics 统计
import SITE_INFO from "@/config";
import { LoadScript } from "@/utils/index";

export default async () => {
  const { Analytics } = SITE_INFO;
  Analytics.enable && LoadScript(`${Analytics.server}/tracker.min.js`, [{ k: "data-website-id", v: Analytics.siteId }]);
}