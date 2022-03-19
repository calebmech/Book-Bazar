import { HttpMethod } from "@lib/http-method";
import { TEST_BOOK, TEST_COURSE_CODE } from "cypress/support/constants";
import { MAX_NUM_POSTS } from "@lib/helpers/constants";

describe("Course page", () => {
  beforeEach(() => {
    cy.task("db:setup");
  });

  afterEach(() => {
    cy.task("db:teardown");
  });

  it("should display course code and name", () => {
    cy.visit("/course/" + TEST_COURSE_CODE);
    cy.get('[test-id="CourseCode"]').should("have.text", "COMPSCI 3AC3");
    cy.get('[test-id="CourseHeading"]').should(
      "have.text",
      "Algorithms and Complexity"
    );
  });

  it("should allow a user to navigate to a book page", () => {
    cy.visit("/course/" + TEST_COURSE_CODE);
    const firstBook = cy.get('[test-id="BookCard"]').first();
    firstBook.should("contain", TEST_BOOK.name);
    firstBook.click();
    cy.location("pathname").should("eq", "/book/" + TEST_BOOK.isbn);
  });

  it("should allow a user to navigate to a post page", () => {
    cy.visit("/course/" + TEST_COURSE_CODE);
    const postCards = cy.get('[test-id="PostCard"]');
    postCards.should("have.length", MAX_NUM_POSTS);
    postCards.first().should("contain", TEST_BOOK.name);
    postCards.first().click();
    cy.location("pathname").should("contain", "/post/");
  });

  it("should allow a user to navigate to the next page of posts", () => {
    cy.visit("/course/" + TEST_COURSE_CODE);
    cy.intercept(
      HttpMethod.GET,
      "/api/course/" + TEST_COURSE_CODE + "/posts?length=" + MAX_NUM_POSTS
    ).as("findPosts");
    cy.wait("@findPosts");
    cy.findByRole("button", { name: "Next page" }).click();
    cy.location("search").should("eq", "?page=1");
    cy.get('[test-id="PostCard"]').first().should("be.visible");
  });

  it("should allow a user to navigate to the previous page of posts", () => {
    cy.visit("/course/" + TEST_COURSE_CODE + "?page=1");
    cy.intercept(
      HttpMethod.GET,
      "/api/course/" + TEST_COURSE_CODE + "/posts?length=" + MAX_NUM_POSTS
    ).as("findPosts");
    cy.wait("@findPosts");
    cy.findByRole("button", { name: "Previous page" }).click();
    cy.location("search").should("eq", "?page=0");
    cy.get('[test-id="PostCard"]').first().should("be.visible");
  });
});
