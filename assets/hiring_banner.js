const _banner_config = {
  enabled: true,
  text: "Graphcore Research is hiring",
  link: "https://grnh.se/26flvuyo2us",
  label: "hiring-2026-02",
  expiry_ms: 604800000,  // 7 days
};

window.addEventListener("DOMContentLoaded", () => {

  const shouldShowBanner = () => {
    if (!_banner_config.enabled) return false;
    const label = _banner_config.label || "hiring-banner";
    const expiryMs = Number(_banner_config.expiry_ms || 0);
    const dismissedLabel = localStorage.getItem("dismiss-hiring-banner");
    const dismissedTime = Number(localStorage.getItem("dismiss-hiring-banner-time") || 0);
    if (label !== dismissedLabel) return true;
    if (!expiryMs) return false;
    return Date.now() > dismissedTime + expiryMs;
  };

  const renderBanner = (config) => {
    const header = document.querySelector(".md-header");
    const headerInner = document.querySelector(".md-header__inner");
    if (!header || !headerInner) return;

    const banner = document.createElement("div");
    banner.className = "hiring-banner";

    const link = document.createElement("a");
    link.href = config.link;
    link.textContent = config.text;
    const arrow = document.createElement("span");
    arrow.className = "hiring-banner-arrow";
    arrow.innerHTML = "&nbsp;<i class=\"fa fa-angle-right\" aria-hidden=\"true\"></i>";
    link.appendChild(arrow);
    banner.appendChild(link);

    // const close = document.createElement("button");
    // close.className = "hiring-banner-close";
    // close.setAttribute("aria-label", "Dismiss hiring banner");
    // close.innerHTML = "<i class=\"fa fa-times\" aria-hidden=\"true\"></i>";
    // close.addEventListener("click", () => {
    //   banner.remove();
    //   localStorage.setItem("dismiss-hiring-banner", config.label);
    //   localStorage.setItem("dismiss-hiring-banner-time", Date.now().toString());
    // });
    // banner.appendChild(close);

    header.prepend(banner);
  };

  if (shouldShowBanner()) {
    renderBanner(_banner_config);
  }
});
