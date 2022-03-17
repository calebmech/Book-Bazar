import {
  ALGOLIA_RESPONSE_5_RESULTS,
  ALGOLIA_RESPONSE_0_RESULTS,
} from "../support/constants";

describe("Search", () => {
  it("should allow a user to view 2 course and 3 book search page results", () => {
    cy.intercept("**/**algolia.net/**/query**", {
      body: ALGOLIA_RESPONSE_5_RESULTS.results[0],
    }).as("algoliaSearch");

    cy.visit("/search?q=test");

    const hits = ALGOLIA_RESPONSE_5_RESULTS.results[0].hits;

    cy.findByRole("heading", { name: /Results for “test”/i }).should(
      "have.text",
      "Results for “test”"
    );

    cy.findByRole("main").children().as("mainChildren");

    cy.get("@mainChildren").eq(0).should("contain", "Courses");
    cy.get("@mainChildren").eq(0).should("contain", "(2 matching)");

    cy.findByRole("main")
      .findByRole("list")
      .should(
        "contain",
        `${hits[0].entry.dept?.abbreviation} ${hits[0].entry.code}`
      );

    cy.findByRole("main")
      .findByRole("list")
      .should(
        "contain",
        `${hits[1].entry.dept?.abbreviation} ${hits[1].entry.code}`
      );

    cy.findByRole("main")
      .findByRole("list")
      .should("contain", `${hits[0].entry.name?.substring(0, 40).trim()}...`);

    cy.get("@mainChildren").eq(2).should("contain", "Books");
    cy.get("@mainChildren").eq(2).should("contain", "(3 matching)");

    cy.get("@mainChildren")
      .eq(3)
      .should("contain", hits[2].entry.googleBook?.title);

    cy.get("@mainChildren")
      .eq(3)
      .should("contain", hits[2].entry.googleBook?.authors[0]);

    cy.get("@mainChildren")
      .eq(3)
      .should("contain", hits[3].entry.googleBook?.title);

    const optionAuthors: string[] = hits[3].entry.googleBook?.authors || [];
    const authors = `${optionAuthors[0]}, ${optionAuthors[1]}, ${optionAuthors[2]}`;
    cy.get("@mainChildren").eq(3).should("contain", authors);
    cy.get("@mainChildren").eq(3).should("contain", hits[4].entry.name);
  });

  it("should allow a user to see 0 course and 0 book search page results", () => {
    cy.intercept("**/**algolia.net/**/query**", {
      body: ALGOLIA_RESPONSE_0_RESULTS,
    }).as("algoliaSearch");

    cy.visit("/search?q=test");

    cy.findByRole("main").should("contain", "No courses or books found.");
  });

  it("should give user no search page results if they search with an empty string", () => {
    cy.intercept("**/**algolia.net/**/query**", {
      body: ALGOLIA_RESPONSE_0_RESULTS,
    }).as("algoliaSearch");

    cy.visit("/search?q=test");

    cy.findByRole("main").should("contain", "No courses or books found.");
  });

  it("should allow a user to click on search page course and visit course page", () => {
    cy.visit("/search?q=test");

    cy.intercept("**/**algolia.net/**/query**", {
      body: ALGOLIA_RESPONSE_5_RESULTS.results[0],
    }).as("algoliaSearch");

    const hits = ALGOLIA_RESPONSE_5_RESULTS.results[0].hits;

    cy.findByRole("heading", { name: /Results for “test”/i }).should(
      "have.text",
      "Results for “test”"
    );

    cy.findByRole("main")
      .findByRole("list")
      .findByText(`${hits[0].entry.dept?.abbreviation} ${hits[0].entry.code}`)
      .click();

    cy.url().should(
      "equal",
      `https://${Cypress.env("BASE_URL")}/course/${
        hits[0].entry.dept?.abbreviation
      }-${hits[0].entry.code}`
    );
  });

  it("should allow a user to click on search page book and visit book page", () => {
    cy.visit("/search?q=test");

    cy.intercept("**/**algolia.net/**/query**", {
      body: ALGOLIA_RESPONSE_5_RESULTS.results[0],
    }).as("algoliaSearch");

    const hits = ALGOLIA_RESPONSE_5_RESULTS.results[0].hits;

    // Testing this helps ensure that the page has loaded before finding role main
    cy.findByRole("heading", { name: /Results for “test”/i }).should(
      "have.text",
      "Results for “test”"
    );

    cy.findByRole("main")
      .children()
      .eq(3)
      .findByText(hits[2].entry.googleBook?.title || "UNIDENTIFIED TEXT")
      .click();

    cy.url().should(
      "equal",
      `https://${Cypress.env("BASE_URL")}/book/${hits[2].entry?.isbn}`
    );
  });
});
