import { SESSION_TOKEN_COOKIE } from "@lib/helpers/backend/session-cookie";
import { HttpMethod } from "@lib/http-method";

describe("test send magic link api", () => {
  it("should give a 200 for a valid request", () => {
    cy.intercept(HttpMethod.POST, "/api/auth/magic").as("sendMagicLink");

    cy.visit("/");

    cy.findByRole("textbox", { name: /macid/i }).type("mechc2{enter}");

    cy.wait("@sendMagicLink");
    cy.readFile("mocks/msw.local.json").then((data) => {
      const magicLink = JSON.stringify(data.email.content).match(
        /"(https.+magic.+)\\/
      )?.[1];
      if (magicLink) {
        cy.visit(magicLink);
      }
    });

    cy.getCookie(SESSION_TOKEN_COOKIE).should("exist");

    cy.findByRole("button", { name: /sign out/i }).click();

    // cy.getCookie(SESSION_TOKEN_COOKIE).should("not.exist");
  });
});
