module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testRegex: ['/__tests__/.*\\.(test.js|test.ts)$', '/test/.*\\.(test.js|test.ts)$'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/'],
};
