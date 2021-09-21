/* eslint-disable strict */
module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    'index.js',
    '!.eslintrc.js',
    '!tests/**',
    '!dist/**',
    '!coverage/**',
    '!**/node_modules/**',
  ],
  expand: true,
  moduleFileExtensions: [
    'js',
    'json',
  ],
  notify: false,
  testMatch: ['<rootDir>/tests/*.js'],
}
