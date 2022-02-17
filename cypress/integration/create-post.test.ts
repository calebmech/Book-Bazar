import { HttpMethod } from "@lib/http-method";

export {};

describe("create post flow", () => {
  beforeEach(() => {
    cy.task("db:setup");
  });

  afterEach(() => {
    cy.task("db:teardown");
  });

  it("should allow a user to create a post", () => {
    cy.login();
    cy.visit("/");
    cy.findByRole("link", { name: /sell book/i }).click();

    cy.intercept(HttpMethod.GET, "/api/book/9780321573513").as(
      "findAlgorithmsTextbook"
    );
    cy.findByRole("textbox", { name: /isbn/i }).type(
      "{selectAll}9780321573513"
    );
    cy.wait("@findAlgorithmsTextbook");

    cy.findByRole("button", { name: /find book/i }).click();

    cy.findByRole("button", { name: /yes/i }).click();

    cy.fixture("guy.jpg", null).as("image");
    cy.get("input[type=file]").selectFile("@image", { force: true });
    cy.findByRole("button", { name: /upload/i }).click();

    cy.findByRole("textbox", { name: /description/i }).type(
      "{selectAll}There are sticky notes in it"
    );
    cy.findByRole("spinbutton", { name: /asking price/i }).type("{selectAll}240");
    cy.findByRole("button", { name: /create/i }).click();

    cy.findByText("There are sticky notes in it").should("exist");
    cy.findByText(/algorithms/i).should("exist");
    cy.findByText("$240.00").should("exist");
  });
});
