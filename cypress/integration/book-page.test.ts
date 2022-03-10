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

  it("should display info about the book", () => {
    cy.visit("/book/" + TEST_BOOK.isbn);
    cy.get('[test-id="Publisher"]').should("contain", "Addison-Wesley Professional");
    cy.get('[test-id="PublishedDate"]').should("contain", "2011");
    cy.get('[test-id="ISBN"]').should("contain", TEST_BOOK.isbn);
    cy.get('[test-id="PageCount"]').should("contain", "955");
  });

  it("should allow a user to navigate to the corresponding course page", () => {
    cy.visit("/book/" + TEST_BOOK.isbn);
    const button = cy.get('[test-id="CourseButton"]').first();
    button.should(
      "contain",
      TEST_DEPARTMENT.abbreviation + " " + TEST_COURSE.code
    );
    button.click({force: true})
    cy.location("pathname").should("eq", "/course/" + TEST_COURSE_CODE);
  });

  it("should have a link to the google books page", () => {
    cy.visit("/book/" + TEST_BOOK.isbn);
    cy.get('[test-id="GoogleBookButton"]').should(
      "have.attr",
      "href",
      "http://books.google.com/books?id=MTpsAQAAQBAJ&dq=isbn:9780321573513&hl=&source=gbs_api"
    );
  });

  it("should have a link to the book on the campus store", () => {
    cy.visit("/book/" + TEST_BOOK.isbn);
    cy.get('[test-id="CampusStoreButton"]').should(
      "have.attr",
      "href",
      "https://campusstore.mcmaster.ca/cgi-mcm/ws/txsub.pl?wsDEPTG1=SFWRENG&wsCOURSEG1=2C03"
    );
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
    cy.intercept(
      HttpMethod.GET,
      "/api/book/" + TEST_BOOK.isbn + "/posts?length=" + MAX_NUM_POSTS
    ).as("findPosts");
    cy.visit("/book/" + TEST_BOOK.isbn);
    cy.wait("@findPosts");
    cy.findByRole("button", { name: "Next page" }).click();
    cy.location("search").should("eq", "?page=1");
    cy.get('[test-id="PostCard"]').first().should("be.visible");
  });

  it("should allow a user to navigate to the previous page of posts", () => {
    cy.intercept(
      HttpMethod.GET,
      "/api/book/" + TEST_BOOK.isbn + "/posts?length=" + MAX_NUM_POSTS
    ).as("findPosts");
    cy.visit("/book/" + TEST_BOOK.isbn + "?page=1");
    cy.wait("@findPosts");
    cy.findByRole("button", { name: "Previous page" }).click();
    cy.location("search").should("eq", "?page=0");
    cy.get('[test-id="PostCard"]').first().should("be.visible");
  });
});
