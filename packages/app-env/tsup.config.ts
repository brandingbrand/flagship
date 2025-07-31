import {defineConfig} from 'tsup';

export default defineConfig({
  entry: {
    babel: 'src/babel/index.ts',
    metro: 'src/metro/index.ts',
  },
  outDir: 'dist',
  format: 'cjs',
  dts: true,
  clean: true,
});
