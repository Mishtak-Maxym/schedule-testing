module.exports = {
  testEnvironment: 'node',
  collectCoverage: true,
  collectCoverageFrom: ['src/helper/*.js'],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html']
};
