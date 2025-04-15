import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/index.umd.js',
    format: 'umd',
    name: 'dashboardKit',
    globals: {
      echarts: 'echarts',
    },
  },
  external: ['echarts', '@tanstack/table-core'],
  plugins: [resolve(), commonjs(), terser()],
};
