import db_setup from "./db_setup";
import db_teardown from "./db_teardown";

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
export default (on, config) => {
  config.env = process.env;
  on("task", {
    "db:setup": () => {
      return db_setup();
    },
    "db:teardown": () => {
      return db_teardown();
    },
  });
  return config;
};
