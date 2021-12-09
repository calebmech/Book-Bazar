// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
import { HttpMethod } from "@lib/http-method";
import "@testing-library/cypress/add-commands";

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Logs in the test user
       *
       * @returns {typeof login}
       * @memberof Chainable
       */
      login: typeof login;
    }
  }
}

export const login = (name: string = "test") => {
  cy.session(name, () => {
    cy.intercept(HttpMethod.POST, "/api/auth/magic").as("sendMagicLink");

    cy.visit("/");

    cy.findByRole("textbox", { name: /macid/i }).type(`${name}{enter}`);

    cy.wait("@sendMagicLink");
    cy.readFile("mocks/msw.local.json").then((data) => {
      const magicLink = JSON.stringify(data.email.content).match(
        /"(https.+magic.+)\\/
      )?.[1];
      if (magicLink) {
        cy.visit(magicLink);
      }
    });
  });
};

Cypress.Commands.add("login", login);
