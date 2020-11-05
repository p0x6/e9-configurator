module.exports = {
  "extends": ["react-app"],
  "rules": {
  },
  "overrides": [
    {
      "files": ["**/*.js?(x)"],
      "rules": {
        "no-unused-expressions": "off",
        "no-restricted-globals": "off",
      }
    }
  ]
}
