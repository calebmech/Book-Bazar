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

    // Check if editing the post works
    cy.findAllByRole("button", { name: /edit post/i })
      .eq(0)
      .click();

    cy.findByRole("dialog")
      .findByRole("textbox", { name: /description/i })
      .click()
      .type("EDITING THE DESCRIPTION");

    cy.findByRole("dialog")
      .findByRole("spinbutton", { name: /price/i })
      .click()
      .type("{selectall}{backspace}13");

    cy.findByRole("dialog")
      .findByRole("button", { name: /edit image/i })
      .click();

    cy.fixture("guy.jpg", null).as("image");
    cy.get("input[type=file]").selectFile("@image", { force: true });
    cy.findByRole("slider").type("{leftArrow}");
    cy.findByRole("button", { name: /upload/i }).click();

    cy.findByRole("dialog").should("contain", "Sold new for $40");

    cy.findByRole("dialog")
      .findByRole("button", { name: /save changes/i })
      .click();

    cy.wait("@editPost").then(({ response }) => {
      expect(response?.statusCode).to.eq(StatusCodes.OK);
    });

    // Ensure that the description update was completed and displayed in the page
    cy.findByRole("main").should("contain", "EDITING THE DESCRIPTION");

    const latestPost = cy.findByRole("main").children().children().eq(0);

    latestPost.should("contain", "EDITING THE DESCRIPTION");
    latestPost.should("contain", "$13");
    latestPost
      .findByRole("img", { name: /book-image/i })
      .should("have.attr", "src")
      .should("not.be.empty");

    // Check if closing the modal works
    cy.findAllByRole("button", { name: /edit post/i })
      .eq(0)
      .click();

    cy.findByRole("dialog")
      .findByRole("button", { name: /cancel/i })
      .click();

    cy.findByRole("dialog", { timeout: 500 }).should("not.exist");
  });

  it("should allow a user edit a post from the post page", () => {
    cy.login();
    cy.visit(`/post/${TEST_POST_2_UUID}`);

    cy.intercept(HttpMethod.PUT, "/api/post/*").as("editPost");

    // Check if editing the post works
    cy.findByRole("button", { name: /edit post/i }).click();

    cy.findByRole("dialog")
      .findByRole("textbox", { name: /description/i })
      .click()
      .type("EDITING THE DESCRIPTION");

    cy.findByRole("dialog")
      .findByRole("spinbutton", { name: /price/i })
      .click()
      .type("{selectall}{backspace}13");

    cy.findByRole("dialog")
      .findByRole("button", { name: /edit image/i })
      .click();

    cy.fixture("guy.jpg", null).as("image");
    cy.get("input[type=file]").selectFile("@image", { force: true });
    cy.findByRole("slider").type("{leftArrow}");
    cy.findByRole("button", { name: /upload/i }).click();

    cy.findByRole("dialog")
      .findByRole("button", { name: /save changes/i })
      .click();

    cy.wait("@editPost").then(({ response }) => {
      expect(response?.statusCode).to.eq(StatusCodes.OK);
    });

    cy.findByRole("banner").should("contain", "EDITING THE DESCRIPTION");
    cy.findByRole("heading", { name: /algorithms/i }).should("contain", "$13");
    cy.findByRole("banner")
      .findByRole("img", { name: /post-image/i })
      .should("have.attr", "src")
      .should("not.be.empty");

    // Check if close button works
    cy.findByRole("button", { name: /edit post/i }).click();

    cy.findByRole("dialog")
      .findByRole("button", { name: /cancel/i })
      .click();

    cy.findByRole("dialog", { timeout: 500 }).should("not.exist");
  });
});
