module.exports = {
  testEnvironment: "jsdom",  // required for React
  transformIgnorePatterns: [
    "node_modules/(?!(axios)/)" // ✅ allow axios to be transformed
  ]
};
