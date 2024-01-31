/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "@repo/jest-config/src/test-environment.ts",
  setupFilesAfterEnv: ["@repo/jest-config/src/setup-files-after-env.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "./src/$1",
  },
};
