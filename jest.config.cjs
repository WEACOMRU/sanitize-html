/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '~/(.*)': '<rootDir>/src/$1',
    'testing-utils': '<rootDir>/testing-utils'
  }
}
