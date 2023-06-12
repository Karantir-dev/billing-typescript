const path = require('path')

module.exports = {
  webpack: {
    alias: {
      '@images': path.resolve(__dirname, 'src/images'),
      '@redux': path.resolve(__dirname, 'src/Redux'),
      '@components': path.resolve(__dirname, 'src/Components'),
      '@pages': path.resolve(__dirname, 'src/Pages'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@src': path.resolve(__dirname, 'src'),
      '@config': path.resolve(__dirname, 'src/config'),
    },
  },
  eslint: {
    enable: true,
    mode: 'extends' || 'file',
    configure: {},

    pluginOptions: {},
  },

  jest: {
    moduleNameMapper: {
      '@src/(.+)': '<rootDir>/src/$1',
      '@images/(.+)': '<rootDir>/src/images/$1',
      '@components/(.+)': '<rootDir>/src/Components/$1',
      '@redux/(.+)': '<rootDir>/src/Redux/$1',
      '@pages/(.+)': '<rootDir>/src/Pages/$1',
      '@config/(.+)': '<rootDir>/src/config/$1',
      '@utils': '<rootDir>/src/utils/$1',
    },
  },
}
