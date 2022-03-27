import {
  TEST_BOOK,
  TEST_OTHER_PERSON_POST_UUID,
  TEST_POST_UUID,
  TEST_USER,
} from "cypress/support/constants";
import { MAX_NUM_POSTS } from "@lib/helpers/constants";
import { HttpMethod } from "@lib/http-method";

describe("Course page", () => {
  beforeEach(() => {
    cy.task("db:setup");
  });

  afterEach(() => {
    cy.task("db:teardown");
  });

  it("should display info about the post", () => {
    cy.visit("/post/" + TEST_POST_UUID);
    cy.get('[test-id="BookTitle"]').should(
      "contain",
      "Algorithms"
    );
    cy.get('[test-id="PostPrice"]').should(
      "contain",
      "42"
    );
    cy.get('[test-id="PostDescription"]').should(
      "contain",
      "This is my book, please buy :D"
    );
  });

  it("should allow a user to navigate to the corresponding book page", () => {
    cy.visit("/post/" + TEST_POST_UUID);
    const button = cy.get('[test-id="BookButton"]').first();
    button.click({ force: true });
    cy.location("pathname").should("eq", "/book/" + TEST_BOOK.isbn);
  });

  it("should show safety tips when contacting another user", () => {
    cy.login();
    cy.visit("/post/" + TEST_OTHER_PERSON_POST_UUID);
    cy.get('[test-id="UserText"]').should(
      "contain",
      "Other"
    );
    cy.get('[test-id="TeamsButton"]').click();
    cy.get('[test-id="SafetyText"]').should('be.visible');
  });

  it("should prompt user to log in when contacting another user while logged out", () => {
    cy.visit("/post/" + TEST_POST_UUID);
    cy.get('[test-id="UserText"]').should(
      "not.contain",
      TEST_USER.name
    );
    cy.get('[test-id="TeamsButton"]').click();
    cy.get('[test-id="LoginModal"]').should('be.visible');
  });

  it("should show edit and delete button when the post is owned by the user", () => {
    cy.login();
    cy.visit("/post/" + TEST_POST_UUID);
    cy.get('[test-id="DeletePostButton"]').should("be.visible");
    cy.get('[test-id="EditPostButton"]').should("be.visible");
  });

  it("should allow a user to navigate to another post page", () => {
    cy.visit("/post/" + TEST_POST_UUID);
    const postCards = cy.get('[test-id="PostCard"]');
    postCards.should("have.length", MAX_NUM_POSTS);
    postCards.first().should("contain", TEST_BOOK.name);
    postCards.first().click();
    cy.location("pathname").should("contain", "/post/");
  });

  it("should allow a user to navigate to the next page of posts", () => {
    cy.intercept(
      HttpMethod.GET,
      "/api/book/" + TEST_BOOK.isbn + "/posts?length=" + MAX_NUM_POSTS
    ).as("findPosts");
    cy.visit("/post/" + TEST_POST_UUID);
    cy.wait("@findPosts");
    cy.findByRole("button", { name: "Next page" }).click();
    cy.location("search").should("eq", "?page=1");
    cy.get('[test-id="PostCard"]').first().should("be.visible");
  });

  it("should allow a user to navigate to the previous page of posts", () => {
    cy.intercept(
      HttpMethod.GET,
      "/api/book/" + TEST_BOOK.isbn + "/posts?page=1&length=" + MAX_NUM_POSTS
    ).as("findPosts");
    cy.visit("/post/" + TEST_POST_UUID + "?page=1");
    cy.wait("@findPosts");
    cy.findByRole("button", { name: "Previous page" }).click();
    cy.location("search").should("eq", "?page=0");
    cy.get('[test-id="PostCard"]').first().should("be.visible");
  });
});
