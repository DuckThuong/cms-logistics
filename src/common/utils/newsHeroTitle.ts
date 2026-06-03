/** Tách tiêu đề hero như FE NewHub (2 từ đầu + phần highlight). */
export const splitNewsHeroTitle = (heroTitle: string) => {
  const words = heroTitle.trim().split(/\s+/).filter(Boolean);
  return {
    leading: words.slice(0, 2).join(" "),
    highlight: words.slice(2).join(" "),
  };
};
