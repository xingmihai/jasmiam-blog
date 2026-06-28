import LazyLoad from "vanilla-lazyload";

let lazyLoadStatus: any = null;

export default () => {
  const imgs = document.querySelectorAll(".main-inner>.main-inner-content img:not(.view-image-container):not([data-vh-lz-src])");
  if (imgs.length > 0) {
    const placeholder = '/assets/images/lazy-loading.webp';
    requestAnimationFrame(() => {
      imgs.forEach((img: any) => {
        const src = img.getAttribute("src");
        if (src && src !== placeholder) {
          img.setAttribute("data-vh-lz-src", src);
          img.setAttribute("src", placeholder);
        }
      });
    });
  }
  if (lazyLoadStatus) return lazyLoadStatus.update();
  lazyLoadStatus = new LazyLoad({
    elements_selector: "img:not(.view-image-container)",
    threshold: 0,
    data_src: "vh-lz-src",
    use_native: true
  });
}