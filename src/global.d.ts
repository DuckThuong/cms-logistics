declare module "*.scss";
declare module "*.css";

declare module "*.svg" {
  const src: string;
  export default src;
}

declare module "*.png";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.gif";
declare module "*.webp";

declare module "*.html?raw" {
  const content: string;
  export default content;
}
