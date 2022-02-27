import {
  TEST_BOOK,
  TEST_COURSE,
  TEST_COURSE_CODE,
  TEST_DEPARTMENT,
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

  it("should allow a user to navigate to the corresponding course page", () => {
    cy.visit("/book/" + TEST_BOOK.isbn);
    const re = new RegExp(
      TEST_DEPARTMENT.abbreviation + " " + TEST_COURSE.code
    );
    // not sure why force is necessary but it wasn't working without it
    cy.findByRole("button", { name: re }).click({ force: true });

    cy.location("pathname").should("eq", "/course/" + TEST_COURSE_CODE);
  });

  it("should have a link to the google books page", () => {
    cy.visit("/book/" + TEST_BOOK.isbn);
    cy.get(
      `a[href="http://books.google.ca/books?id=${TEST_BOOK.googleBooksId}&dq=isbn:${TEST_BOOK.isbn}&hl=&source=gbs_api"]`
    ).should("have.attr", "target", "_blank");
  });

  it("should allow a user to navigate to the next page of posts", () => {
    cy.intercept(
      HttpMethod.GET,
      "/api/book/" + TEST_BOOK.isbn + "/posts?length=" + MAX_NUM_POSTS
    ).as("findPosts");
    cy.visit("/book/" + TEST_BOOK.isbn);
    cy.wait("@findPosts");
    cy.findByRole("button", { name: "next-page" }).click();
    cy.location("search").should("eq", "?page=1");
  });

  it("should allow a user to navigate to the previous page of posts", () => {
    cy.intercept(
      HttpMethod.GET,
      "/api/book/" + TEST_BOOK.isbn + "/posts?length=" + MAX_NUM_POSTS
    ).as("findPosts");
    cy.visit("/book/" + TEST_BOOK.isbn + "?page=1");
    cy.wait("@findPosts");
    cy.findByRole("button", { name: "previous-page" }).click();
    cy.location("search").should("eq", "?page=0");
  });
});
