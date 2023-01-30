import '@brandingbrand/fsapp';

declare module '@brandingbrand/fsapp' {
  let env: import('@brandingbrand/kernel-core').Config<
    import('@brandingbrand/kernel-app').App
  >;
}
