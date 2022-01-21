import { HttpMethod } from "@lib/http-method";
import { StatusCodes } from "http-status-codes";
import {
  TEST_BOOK_UUID,
  TEST_BOOK_1_ISBN,
  TEST_BOOK_2_ISBN,
  TEST_COURSE_UUID,
} from "../../support/constants";

describe("test book api", () => {
  beforeEach(() => {
    cy.task("db:setup");
  });

  afterEach(() => {
    cy.task("db:teardown");
  });

  it("should give a 200 when GETting an existing book, it's 4 posts, and it's course", () => {
    cy.request({
      method: HttpMethod.GET,
      url: `/api/book/${TEST_BOOK_1_ISBN}`,
    }).then((response) => {
      expect(response.status).equal(StatusCodes.OK);

      expect(response.body.id).equal(TEST_BOOK_UUID);
      expect(response.body.name).equal("Algorithms");
      expect(response.body.imageUrl).equal("https://localhost:1000/image.jpg");
      expect(response.body.googleBooksId).equal("MTpsAQAAQBAJ");
      expect(response.body.campusStorePrice).equal(4000);
      expect(response.body.isCampusStoreBook).equal(true);

      expect(response.body.courses.length).to.equal(1);
      expect(response.body.courses[0].id).equal(TEST_COURSE_UUID);

      expect(response.body.posts.length).to.equal(4);
      expect(response.body.posts[0].user).equal(undefined);
      expect(response.body.posts[1].user).equal(undefined);
      expect(response.body.posts[2].user).equal(undefined);
      expect(response.body.posts[3].user).equal(undefined);

      expect(
        response.body.googleBook.industryIdentifiers[0].identifier
      ).to.equal(TEST_BOOK_1_ISBN);
    });
  });

  it("should give users of posts when GETting an existing book and it's posts while AuthN", () => {
    cy.login();
    cy.request({
      method: HttpMethod.GET,
      url: `/api/book/${TEST_BOOK_1_ISBN}`,
    }).then((response) => {
      expect(response.status).equal(StatusCodes.OK);

      expect(response.body.posts.length).to.equal(4);
      expect(response.body.posts[0].user.name).to.be.oneOf([
        "Test User",
        "Other",
      ]);
      expect(response.body.posts[1].user.name).to.be.oneOf([
        "Test User",
        "Other",
      ]);
      expect(response.body.posts[2].user.name).to.be.oneOf([
        "Test User",
        "Other",
      ]);
      expect(response.body.posts[3].user.name).to.be.oneOf([
        "Test User",
        "Other",
      ]);
    });
  });

  it("should return null for the google book data of a book that does not exist on google books", () => {
    cy.request({
      method: HttpMethod.GET,
      url: `/api/book/${TEST_BOOK_2_ISBN}`,
    }).then((response) => {
      expect(response.status).equal(StatusCodes.OK);

      expect(response.body.googleBook).to.be.null;
    });
  });

  it("should give a 404 when trying to GET a book with an isbn that does not exist or is invalid", () => {
    cy.request({
      method: HttpMethod.GET,
      url: `/api/book/1234567891234`,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).equal(StatusCodes.NOT_FOUND);
    });
  });

  it("should include the first 3 of 4 posts when GETting a book and it's posts with a length of 3", () => {
    cy.request({
      method: HttpMethod.GET,
      url: `/api/book/${TEST_BOOK_1_ISBN}/?length=3&page=0`,
    }).then((response) => {
      expect(response.status).to.equal(StatusCodes.OK);

      expect(response.body.posts.length).to.equal(3);
    });
  });

  it("should include the last post of 4 when GETting a book and it's posts with a length of 3 and page of 1", () => {
    cy.request({
      method: HttpMethod.GET,
      url: `/api/book/${TEST_BOOK_1_ISBN}/?length=3&page=1`,
    }).then((response) => {
      expect(response.status).to.equal(StatusCodes.OK);

      expect(response.body.posts.length).to.equal(1);
    });
  });

  it("should include zero posts when GETting a book and it's posts with a length of 3 and page of 2", () => {
    cy.request({
      method: HttpMethod.GET,
      url: `/api/book/${TEST_BOOK_1_ISBN}/?length=3&page=2`,
    }).then((response) => {
      expect(response.status).to.equal(StatusCodes.OK);

      expect(response.body.posts.length).to.equal(0);
    });
  });
});
