import { HttpMethod } from "@lib/http-method";
import {
  TEST_BOOK,
  TEST_COURSE,
  TEST_DEPARTMENT,
} from "cypress/support/constants";
import { MAX_NUM_POSTS } from "@lib/helpers/constants";


describe("Course page", () => {
  const COURSE_CODE = TEST_DEPARTMENT.abbreviation + "-" + TEST_COURSE.code;

  beforeEach(() => {
    cy.task("db:setup");
  });

  afterEach(() => {
    cy.task("db:teardown");
  });

  it("should allow a user to navigate to a book page", () => {
    cy.visit(
      "/course/" + TEST_DEPARTMENT.abbreviation + "-" + TEST_COURSE.code
    );
    cy.get('div[href*="book/"]').first().click()
    cy.location("pathname").should("eq", "/book/" + TEST_BOOK.isbn);
  });

  it("should allow a user to navigate to a post page", () => {
    cy.visit("/course/" + COURSE_CODE);
    cy.get('div[href*="post/"]').first().click()
    cy.location("pathname").should("contain", "/post/");
  });

  it("should allow a user to navigate to the next page of posts", () => {
    cy.visit("/course/" + COURSE_CODE);
    cy.intercept(
      HttpMethod.GET,
      "/api/course/" + COURSE_CODE + "/posts?length=" + MAX_NUM_POSTS
    ).as("findPosts");
    cy.wait("@findPosts");
    cy.findByRole("button", { name: "next-page" }).click();
    cy.location("search").should("eq", "?page=1");
  });

  it("should allow a user to navigate to the previous page of posts", () => {
    cy.visit("/course/" + COURSE_CODE + "?page=1");
    cy.intercept(
      HttpMethod.GET,
      "/api/course/" + COURSE_CODE + "/posts?length=" + MAX_NUM_POSTS
    ).as("findPosts");
    cy.wait("@findPosts");
    cy.findByRole("button", { name: "previous-page" }).click();
    cy.location("search").should("eq", "?page=0");
  });
});
