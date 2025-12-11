declare module '*.svg' {
  const src: string;
  export default src;
}

// types/css.d.ts
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}