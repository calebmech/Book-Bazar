import {
  ALGOLIA_RESPONSE_5_RESULTS,
  ALGOLIA_RESPONSE_3_RESULTS,
  ALGOLIA_RESPONSE_0_RESULTS,
} from "../support/constants";

describe("Home page", () => {
  it("should allow a user to search and find 5 auto-complete results", () => {
    cy.visit("/");

    cy.intercept("**/**algolia.net/**/queries**", {
      body: ALGOLIA_RESPONSE_5_RESULTS,
    }).as("algoliaSearch");

    cy.findByRole("searchbox", { name: /find a book or course/i }).type("test");

    cy.findByRole("listbox").findAllByRole("option").should("have.length", 5);
  });

  it("should allow a user to search and find 3 auto-complete results", () => {
    cy.visit("/");

    cy.intercept("**/**algolia.net/**/queries**", {
      body: ALGOLIA_RESPONSE_3_RESULTS,
    }).as("algoliaSearch");

    cy.findByRole("searchbox", { name: /find a book or course/i }).type("test");

    cy.findByRole("listbox").findAllByRole("option").should("have.length", 3);
  });

  it("should allow a user to search and find 0 auto-complete results", () => {
    cy.visit("/");

    cy.intercept("**/**algolia.net/**/queries**", {
      body: ALGOLIA_RESPONSE_0_RESULTS,
    }).as("algoliaSearch");

    cy.findByRole("searchbox", { name: /find a book or course/i }).type("test");

    cy.wait("@algoliaSearch");

    cy.findByRole("listbox").should("not.exist");
  });

  it("should allow a user to view the content of a course auto-complete suggestion with an abbreviation, code, and name", () => {
    cy.visit("/");

    cy.intercept("**/**algolia.net/**/queries**", {
      body: ALGOLIA_RESPONSE_5_RESULTS,
    }).as("algoliaSearch");

    const hits = ALGOLIA_RESPONSE_5_RESULTS.results[0].hits;

    cy.findByRole("searchbox", { name: /find a book or course/i }).type("test");

    const option = cy.findByRole("listbox").findAllByRole("option").eq(0);

    option.should(
      "contain",
      `${hits[0].entry.dept?.abbreviation} ${hits[0].entry.code}`
    );

    option.should("contain", hits[0].entry.name);
  });

  it("should allow a user to view the content of a course auto-complete suggestion with an abbreviation and code only", () => {
    cy.visit("/");

    cy.intercept("**/**algolia.net/**/queries**", {
      body: ALGOLIA_RESPONSE_5_RESULTS,
    }).as("algoliaSearch");

    const hits = ALGOLIA_RESPONSE_5_RESULTS.results[0].hits;

    cy.findByRole("searchbox", { name: /find a book or course/i }).type("test");

    cy.findByRole("listbox")
      .findAllByRole("option")
      .eq(1)
      .invoke("text")
      .should(
        "equal",
        `${hits[1].entry.dept?.abbreviation} ${hits[1].entry.code}`
      );
  });

  it("should allow a user to a book auto-complete suggestion that has google books data", () => {
    cy.visit("/");

    cy.intercept("**/**algolia.net/**/queries**", {
      body: ALGOLIA_RESPONSE_5_RESULTS,
    }).as("algoliaSearch");
    const hits = ALGOLIA_RESPONSE_5_RESULTS.results[0].hits;

    cy.findByRole("searchbox", { name: /find a book or course/i }).type("test");

    const option = cy.findByRole("listbox").findAllByRole("option").eq(2);
    option.should("contain", `${hits[2].entry.googleBook?.title}`);
    option.should("contain", hits[2].entry.googleBook?.authors[0]);

    const optionCourses = hits[2].entry.courses || [];
    option.should(
      "contain",
      `${optionCourses[0].dept?.abbreviation} ${optionCourses[0].code}`
    );

    option
      .findByRole("img", { name: /book image/i })
      .should("have.attr", "src")
      .should("not.be.empty");
  });

  it("should allow a user to view the content of a book auto-complete suggestion with 4 relevant courses and 3 google book authors", () => {
    cy.visit("/");

    cy.intercept("**/**algolia.net/**/queries**", {
      body: ALGOLIA_RESPONSE_5_RESULTS,
    }).as("algoliaSearch");
    const hits = ALGOLIA_RESPONSE_5_RESULTS.results[0].hits;

    cy.findByRole("searchbox", { name: /find a book or course/i }).type("test");

    const option = cy.findByRole("listbox").findAllByRole("option").eq(3);

    option.should("contain", `${hits[3].entry.googleBook?.title}`);

    const optionAuthors: string[] = hits[3].entry.googleBook?.authors || [];
    const authors = `${optionAuthors[0]}, ${optionAuthors[1]}, ${optionAuthors[2]}`;
    option.should("contain", authors);

    const optionCourses = hits[3].entry.courses || [];
    option.should(
      "contain",
      `${optionCourses[0].dept?.abbreviation} ${optionCourses[0].code}`
    );
    option.should(
      "contain",
      `${optionCourses[1].dept?.abbreviation} ${optionCourses[1].code}`
    );
    option.should(
      "contain",
      `${optionCourses[2].dept?.abbreviation} ${optionCourses[2].code}`
    );
    option.should(
      "not.contain",
      `${optionCourses[3].dept?.abbreviation} ${optionCourses[3].code}`
    );

    option
      .findByRole("img", { name: /book image/i })
      .should("have.attr", "src")
      .should("not.be.empty");
  });

  it("should allow a user to view the content of a book with no google books data", () => {
    cy.visit("/");

    cy.intercept("**/**algolia.net/**/queries**", {
      body: ALGOLIA_RESPONSE_5_RESULTS,
    }).as("algoliaSearch");

    const hits = ALGOLIA_RESPONSE_5_RESULTS.results[0].hits;

    cy.findByRole("searchbox", { name: /find a book or course/i }).type("test");

    const option = cy.findByRole("listbox").findAllByRole("option").eq(4);

    option.should("contain", `${hits[4].entry.name}`);

    const optionCourses = hits[4].entry.courses || [];
    option.should(
      "contain",
      `${optionCourses[0].dept?.abbreviation} ${optionCourses[0].code}`
    );

    option
      .findByRole("img", { name: /book image/i })
      .should("have.attr", "src")
      .should("not.be.empty");
  });

  it("should allow a user to search, click on search button, and navigate to search page", () => {
    cy.visit("/");

    cy.intercept("**/**algolia.net/**/queries**", {
      body: ALGOLIA_RESPONSE_5_RESULTS,
    }).as("algoliaSearch");

    cy.intercept("**/**algolia.net/**/query**", {
      body: ALGOLIA_RESPONSE_5_RESULTS.results[0],
    }).as("algoliaSearch");

    cy.findByRole("searchbox", { name: /find a book or course/i }).type("test");

    cy.findByRole("button", { name: /search/i }).click({ force: true });

    cy.url().should("contain", `https://${Cypress.env("BASE_URL")}/search?q=`);
  });

  it("should allow a user to search, press enter, and navigate to search page", () => {
    cy.visit("/");

    cy.intercept("**/**algolia.net/**/queries**", {
      body: ALGOLIA_RESPONSE_5_RESULTS,
    }).as("algoliaSearch");

    cy.intercept("**/**algolia.net/**/query**", {
      body: ALGOLIA_RESPONSE_5_RESULTS.results[0],
    }).as("algoliaSearch");

    cy.findByRole("searchbox", { name: /find a book or course/i }).type(
      "test{enter}"
    );

    cy.url().should("contain", `https://${Cypress.env("BASE_URL")}/search?q=`);
  });

  it("should allow a user to select a course and navigate to course page", () => {
    cy.visit("/");

    cy.intercept("**/**algolia.net/**/queries**", {
      body: ALGOLIA_RESPONSE_5_RESULTS,
    }).as("algoliaSearch");

    const hits = ALGOLIA_RESPONSE_5_RESULTS.results[0].hits;

    cy.findByRole("searchbox", { name: /find a book or course/i }).type("test");

    cy.findByRole("listbox").findAllByRole("option").eq(0).click();

    cy.url().should(
      "equal",
      `https://${Cypress.env("BASE_URL")}/course/${
        hits[0].entry.dept?.abbreviation
      }-${hits[0].entry.code}`
    );
  });

  it("should allow a user to click on a book auto-complete suggestion and navigate to book page", () => {
    cy.visit("/");

    cy.intercept("**/**algolia.net/**/queries**", {
      body: ALGOLIA_RESPONSE_5_RESULTS,
    }).as("algoliaSearch");

    const hits = ALGOLIA_RESPONSE_5_RESULTS.results[0].hits;

    cy.findByRole("searchbox", { name: /find a book or course/i }).type("test");

    cy.findByRole("listbox").findAllByRole("option").eq(2).click();

    cy.url().should(
      "equal",
      `https://${Cypress.env("BASE_URL")}/book/${hits[2].entry?.isbn}`
    );
  });

  it("should allow a user to move down using arrow, select first option, and navigate to course page", () => {
    cy.visit("/");

    cy.intercept("**/**algolia.net/**/queries**", {
      body: ALGOLIA_RESPONSE_5_RESULTS,
    }).as("algoliaSearch");

    cy.intercept("**/**algolia.net/**/query**", {
      body: ALGOLIA_RESPONSE_5_RESULTS.results[0],
    }).as("algoliaSearch");

    const hits = ALGOLIA_RESPONSE_5_RESULTS.results[0].hits;

    cy.findByRole("searchbox", { name: /find a book or course/i }).type("test");

    cy.findByRole("listbox");

    cy.findByRole("searchbox", { name: /find a book or course/i }).type(
      "{downArrow}{enter}"
    );

    cy.url().should(
      "equal",
      `https://${Cypress.env("BASE_URL")}/course/${
        hits[0].entry.dept?.abbreviation
      }-${hits[0].entry.code}`
    );
  });

  it("should allow a user to move down using arrow, select fifth option, and navigate to book page", () => {
    cy.visit("/");

    cy.intercept("**/**algolia.net/**/queries**", {
      body: ALGOLIA_RESPONSE_5_RESULTS,
    }).as("algoliaSearch");

    cy.intercept("**/**algolia.net/**/query**", {
      body: ALGOLIA_RESPONSE_5_RESULTS.results[0],
    }).as("algoliaSearch");

    const hits = ALGOLIA_RESPONSE_5_RESULTS.results[0].hits;

    cy.findByRole("searchbox", { name: /find a book or course/i }).type("test");

    cy.findByRole("listbox");

    cy.findByRole("searchbox", { name: /find a book or course/i }).type(
      "{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{enter}"
    );

    cy.url().should(
      "equal",
      `https://${Cypress.env("BASE_URL")}/book/${hits[4].entry?.isbn}`
    );
  });

  it("should allow a user to move down to third option, up to second, select it, and navigate to course page", () => {
    cy.visit("/");

    cy.intercept("**/**algolia.net/**/queries**", {
      body: ALGOLIA_RESPONSE_5_RESULTS,
    }).as("algoliaSearch");

    cy.intercept("**/**algolia.net/**/query**", {
      body: ALGOLIA_RESPONSE_5_RESULTS.results[0],
    }).as("algoliaSearch");

    const hits = ALGOLIA_RESPONSE_5_RESULTS.results[0].hits;

    cy.findByRole("searchbox", { name: /find a book or course/i }).type("test");

    cy.findByRole("listbox");

    cy.findByRole("searchbox", { name: /find a book or course/i }).type(
      "{downArrow}{downArrow}{downArrow}{upArrow}{enter}"
    );

    cy.url().should(
      "equal",
      `https://${Cypress.env("BASE_URL")}/course/${
        hits[1].entry.dept?.abbreviation
      }-${hits[1].entry.code}`
    );
  });

  it("should display sell books button on home page and navigate to login modal upon clicking when user is not logged in", () => {
    cy.visit("/");

    cy.findByRole("link", { name: /sell your used textbooks!/i }).click();

    cy.findByRole("dialog").findByRole("button", { name: /login/i });
  });

  it("should display sell books button on home page and navigate to create a post if logged in", () => {
    cy.visit("/");

    cy.login();

    cy.findByRole("link", { name: /sell your used textbooks!/i }).click();

    cy.url().should("equal", `https://${Cypress.env("BASE_URL")}/create-post`);
  });
});
