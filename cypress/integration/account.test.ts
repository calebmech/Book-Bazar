import { HttpMethod } from "@lib/http-method";
import { StatusCodes } from "http-status-codes";

describe("Account page", () => {
  it("should allow a user to delete their account", () => {
    cy.login("to-delete");
    cy.visit("/account");

    cy.intercept(HttpMethod.DELETE, "/api/user/*").as("deleteUser");

    cy.findByRole("button", { name: /delete/i }).click();

    cy.findByRole("alertdialog")
      .findByRole("button", { name: /delete/i })
      .click();

    cy.wait("@deleteUser").then(({ response }) => {
      expect(response?.statusCode).to.eq(StatusCodes.OK);
    });

    cy.location("pathname").should("eq", "/");
  });

  it("should allow a user to change their name", () => {
    cy.login("to-update-name");
    cy.visit("/account");

    cy.intercept(HttpMethod.PUT, "/api/user/*").as("updateUser");

    cy.findByRole("textbox", { name: /name/i }).type(
      "{selectAll}Gandalf{enter}"
    );

    cy.wait("@updateUser").then(({ response }) => {
      expect(response?.statusCode).to.eq(StatusCodes.OK);
    });

    cy.reload();

    cy.findByRole("textbox", { name: /name/i }).should("have.value", "Gandalf");
  });

  it("should allow a user to change their profile picture", () => {
    cy.login("to-update-picture");
    cy.visit("/account");

    cy.intercept(HttpMethod.PUT, "/api/user/*").as("updateUser");

    cy.findByRole("button", { name: /edit image/i }).click();

    cy.fixture("guy.jpg", null).as("image");
    cy.get("input[type=file]").selectFile("@image", { force: true });
    cy.wait(500);
    cy.findByRole("button", { name: /upload/i }).click();

    cy.wait("@updateUser").then(({ response }) => {
      expect(response?.statusCode).to.eq(StatusCodes.OK);

      cy.findByRole("img", { name: /profile picture/i })
        .should("have.attr", "src")
        .should("not.be.empty");
    });
  });
});
