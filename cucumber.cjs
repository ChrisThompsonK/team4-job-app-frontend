module.exports = {
  default: {
    require: ["tests/bdd/steps/**/*.ts"],
    requireModule: ["tsx"],
    format: ["progress-bar", "html:tests/bdd/reports/cucumber-report.html"],
    formatOptions: {
      snippetInterface: "async-await",
    },
  },
};
