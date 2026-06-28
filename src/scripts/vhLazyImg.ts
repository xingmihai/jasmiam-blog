import LazyLoad from "vanilla-lazyload";

let lazyLoadStatus: any = null;

export const resetLazyLoad = () => {
  if (lazyLoadStatus) {
    lazyLoadStatus.destroy();
    lazyLoadStatus = null;
  }
};

export default () => {
  if (lazyLoadStatus) {
    lazyLoadStatus.update();
    return;
  }
  const placeholder = '/assets/images/lazy-loading.webp';
  document.querySelectorAll(".main-inner>.main-inner-content img:not(.view-image-container):not([data-vh-lz-src]):not(.loaded):not(.no-lazy)").forEach((img: any) => {
    const src = img.getAttribute("src");
    if (src && src !== placeholder) {
      img.setAttribute("data-vh-lz-src", src);
      img.setAttribute("src", placeholder);
    }
  });
  lazyLoadStatus = new LazyLoad({
    elements_selector: "img[data-vh-lz-src]",
    threshold: 0,
    data_src: "vh-lz-src"
  });
}