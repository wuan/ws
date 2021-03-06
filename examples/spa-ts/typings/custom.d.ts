declare function require(module: string): any;
declare const process: any;

// workaround for @types/react-addons-test-utils
// see https://github.com/DefinitelyTyped/DefinitelyTyped/issues/10162
declare module 'react-addons-test-utils' {
  const ReactTestUtils: any;
  export default ReactTestUtils;
}

declare module 'selenium-webdriver' {
  export const Builder: any;
  export const By: any;
  export const until: any;
}
