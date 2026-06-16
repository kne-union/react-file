module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest'
  },
  modulePathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/example/', '<rootDir>/build/']
};
