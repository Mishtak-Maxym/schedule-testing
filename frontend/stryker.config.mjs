const config = {
  testRunner: 'jest',
  packageManager: 'npm',
  jest: {
    configFile: 'jest.config.js',
    projectType: 'custom'
  },
  mutate: [
    'src/helper/*.js'
  ],
  reporters: ['html', 'clear-text', 'progress'],
  htmlReporter: {
    fileName: 'reports/mutation/mutation.html'
  },
  coverageAnalysis: 'perTest',
  thresholds: {
    high: 80,
    low: 60,
    break: 50
  }
};

export default config;
