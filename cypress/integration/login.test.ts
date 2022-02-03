import { getMagicLink } from "cypress/support/commands";

describe("Login flow", () => {
  it("should allow a user to login", () => {
    cy.visit("/");

    cy.findByRole("button", { name: /login/i }).click();
    cy.get("form").findByRole("textbox", { name: /macID/i }).type("mechc2");
    cy.get("form").findByRole("button", { name: /login/i }).click();
    cy.get("form")
      .findByText(/login link has been sent/i)
      .should("exist");

    cy.readMockData().then((data) => {
      const magicLink = getMagicLink(data);
      expect(magicLink).to.exist;
      if (!magicLink) return;

      cy.visit(magicLink);

      cy.findByRole("button", { name: /account menu/i }).click();
      cy.findByRole("menuitem", { name: /logout/i }).should("exist");
    });
  });

  it("should allow a user to logout", () => {
    cy.login();
    cy.visit("/");

    cy.findByRole("button", { name: /account menu/i }).click();
    cy.findByRole("menuitem", { name: /logout/i }).click();

    cy.findByRole("button", { name: /login/i }).should("exist");
  });
});
