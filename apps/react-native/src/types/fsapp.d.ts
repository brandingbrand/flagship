import '@brandingbrand/fsapp';

declare module '@brandingbrand/fsapp' {
  let env: import('@brandingbrand/code-core').Config<
    import('@brandingbrand/code-app').App
  >;
}
