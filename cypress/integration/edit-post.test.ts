import { HttpMethod } from "@lib/http-method";
import { StatusCodes } from "http-status-codes";
import { TEST_POST_2_UUID } from "../support/constants";

describe("Edit post", () => {
  beforeEach(() => {
    cy.task("db:setup");
  });

  afterEach(() => {
    cy.task("db:teardown");
  });

  it("should allow a user edit a post from the account page", () => {
    cy.login();
    cy.visit("/account");

    cy.intercept(HttpMethod.PUT, "/api/post/*").as("editPost");
    cy.intercept(HttpMethod.GET, "/api/user/*").as("getUserPosts");

    cy.findAllByRole("button", { name: /edit post/i })
      .eq(0)
      .click();

    cy.get('[id="description"]').click().type("EDITING THE DESCRIPTION");

    cy.get('[id="price"]')
      .click()
      .type("{backspace}{backspace}{backspace}{backspace}13");

    cy.findAllByRole("button", { name: /save changes/i }).click();

    cy.wait("@editPost").then(({ response }) => {
      expect(response?.statusCode).to.eq(StatusCodes.OK);
    });

    cy.wait("@getUserPosts").then(({ response }) => {
      expect(response?.statusCode).to.eq(StatusCodes.OK);
    });

    const latestPost = cy.findByRole("main").children().eq(0).children().eq(0);

    latestPost.should("contain", "EDITING THE DESCRIPTION");
    latestPost.should("contain", "$13");
    latestPost
      .findByRole("img", { name: /book-image/i })
      .should("have.attr", "src")
      .should("not.be.empty");
  });

  it("should allow a user edit a post from the post page", () => {
    cy.login();
    cy.visit(`/post/${TEST_POST_2_UUID}`);

    cy.intercept(HttpMethod.PUT, "/api/post/*").as("editPost");

    cy.findAllByRole("button", { name: /edit post/i })
      .eq(0)
      .click();

    cy.get('[id="description"]').click().type("EDITING THE DESCRIPTION");

    cy.get('[id="price"]')
      .click()
      .type("{backspace}{backspace}{backspace}{backspace}13");

    cy.findAllByRole("button", { name: /save changes/i }).click();

    cy.wait("@editPost").then(({ response }) => {
      expect(response?.statusCode).to.eq(StatusCodes.OK);
    });

    cy.findByRole("banner").should("contain", "EDITING THE DESCRIPTION");
    cy.findByRole("heading", { name: /algorithms/i }).should("contain", "$13");
    cy.findByRole("banner")
      .findAllByRole("img", { name: /post-image/i })
      .should("have.attr", "src")
      .should("not.be.empty");
  });
});
