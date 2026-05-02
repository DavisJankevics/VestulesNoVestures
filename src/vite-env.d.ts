/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />
declare module '*.svg' {
  const src: string;
  export default src;
}

declare module '*.svg?react' {
  import type { FunctionComponent, SVGProps } from 'react';

  export const ReactComponent: FunctionComponent<SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}
