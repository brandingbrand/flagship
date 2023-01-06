import { fsk, path } from "@brandingbrand/kernel-core";

const ios = async (options: any) => {
  const env = options?.env ?? 'dev';
  const modulePath = path.project.resolve(
    "node_modules",
    "@brandingbrand/kernel-component-env",
    "ios",
    "Env.m"
  );

  fsk.update(
    modulePath,
    /(NSString \*initialEnvName =).*/,
    `$1 @"${env}";`
  )
};

const android = async (options: any) => {
  const env = options?.env ?? 'dev';
  const modulePath = path.project.resolve(
    "node_modules",
    "@brandingbrand/kernel-component-env",
    "android/src/main/java/com/env",
    "EnvModule.java"
  );

  fsk.update(
    modulePath,
    /(final String initialEnvName =).*/,
    `$1 "${env}";`
  )
};

export { ios, android };
