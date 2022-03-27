import { HttpMethod } from "@lib/http-method";
import { StatusCodes } from "http-status-codes";
import { TEST_POST_2_UUID } from "../support/constants";

describe("Delete post", () => {
  beforeEach(() => {
    cy.task("db:setup");
  });

  afterEach(() => {
    cy.task("db:teardown");
  });

  it("should allow a user to delete a post from the account page", () => {
    cy.login();

    cy.visit("/account");

    cy.intercept(HttpMethod.DELETE, "/api/post/*").as("deletePost");

    cy.findByRole("main").should("contain", "Delete post");

    cy.findByRole("main")
      .findAllByRole("button", { name: /delete post/i })
      .should("have.length", 17);

    cy.findByRole("main").should("contain", "TEST POST 14");

    // Check if deleting the post works
    cy.findAllByRole("button", { name: /delete post/i })
      .eq(0)
      .click();

    cy.findByRole("alertdialog")
      .findByRole("button", { name: /delete/i })
      .click();

    cy.wait("@deletePost").then(({ response }) => {
      expect(response?.statusCode).to.eq(StatusCodes.OK);
    });

    // Check out that content of posts is correct after deletion
    cy.findByRole("main")
      .findAllByRole("button", { name: /delete post/i })
      .should("have.length", 16);

    cy.findByRole("main").should("not.contain", "TEST POST 14");
  });

  it("should allow a delete a post from the post page", () => {
    cy.login();

    cy.visit(`/post/${TEST_POST_2_UUID}`);

    cy.intercept(HttpMethod.DELETE, "/api/post/*").as("deletePost");
    cy.intercept(HttpMethod.GET, `/api/post/${TEST_POST_2_UUID}`).as("getPost");

    // Check if deleting post works
    cy.findByRole("button", { name: /delete post/i }).click();

    cy.findByRole("alertdialog")
      .findByRole("button", { name: /delete/i })
      .click();

    cy.wait("@deletePost").then(({ response }) => {
      expect(response?.statusCode).to.eq(StatusCodes.OK);
    });

    // See if you are forwarded to homepage after deletion
    cy.url().should("equal", `https://${Cypress.env("BASE_URL")}/`);

    // Check out what happens if you try to access the post page
    cy.visit(`/post/${TEST_POST_2_UUID}`);

    cy.findByRole("heading", { name: /404/i });
    cy.findByRole("heading", { name: /This page could not be found./i });
  });
});
