import { HttpMethod } from "@lib/http-method";
import { StatusCodes } from "http-status-codes";
import {
  TEST_BOOK_1_ISBN,
  TEST_BOOK,
  TEST_BOOK_UUID,
  TEST_COURSE_UUID,
} from "../../support/constants";

describe("test book api", () => {
  beforeEach(() => {
    cy.task("db:setup");
  });

  afterEach(() => {
    cy.task("db:teardown");
  });

  it("should give a 200 when GETting an existing book and it's course", () => {
    cy.request({
      method: HttpMethod.GET,
      url: `/api/book/${TEST_BOOK_1_ISBN}`,
    }).then((response) => {
      expect(response.status).equal(StatusCodes.OK);
      expect(response.body.id).equal(TEST_BOOK_UUID);
      expect(response.body.name).equal(TEST_BOOK.name);
      expect(response.body.imageUrl).equal(TEST_BOOK.imageUrl);
      expect(response.body.campusStorePrice).equal(TEST_BOOK.campusStorePrice);
      expect(response.body.isCampusStoreBook).equal(TEST_BOOK.isCampusStoreBook);
      expect(response.body.courses.length).to.equal(1);
      expect(response.body.courses[0].id).equal(TEST_COURSE_UUID);
    });
  });

  it("should give users when GETting posts for an existing book while AuthN", () => {
    cy.login();
    cy.request({
      method: HttpMethod.GET,
      url: `/api/book/${TEST_BOOK_1_ISBN}/posts`,
    }).then((response) => {
      expect(response.status).equal(StatusCodes.OK);

      expect(response.body.length).to.equal(18);
      expect(response.body[0].user.name).to.be.oneOf(["Test User", "Other"]);
      expect(response.body[1].user.name).to.be.oneOf(["Test User", "Other"]);
      expect(response.body[2].user.name).to.be.oneOf(["Test User", "Other"]);
      expect(response.body[17].user.name).to.be.oneOf(["Test User", "Other"]);
    });
  });

  it("should give a 404 when trying to GET a book with an isbn that does not exist", () => {
    cy.request({
      method: HttpMethod.GET,
      url: `/api/book/1234567891234`,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).equal(StatusCodes.NOT_FOUND);
    });
  });

  it("should include the first first 10 of 18 posts when GETting posts for a book with a length of 10", () => {
    cy.request({
      method: HttpMethod.GET,
      url: `/api/book/${TEST_BOOK_1_ISBN}/posts?length=10`,
    }).then((response) => {
      expect(response.status).to.equal(StatusCodes.OK);

      expect(response.body.length).to.equal(10);
    });
  });

  it("should include the last 8 of 18 posts with a length of 10 and page of 1", () => {
    cy.request({
      method: HttpMethod.GET,
      url: `/api/book/${TEST_BOOK_1_ISBN}/posts?length=10&page=1`,
    }).then((response) => {
      expect(response.status).to.equal(StatusCodes.OK);

      expect(response.body.length).to.equal(8);
    });
  });

  it("should include zero posts when GETting posts for a book with a length of 10 and page of 2", () => {
    cy.request({
      method: HttpMethod.GET,
      url: `/api/book/${TEST_BOOK_1_ISBN}/posts?length=10&page=2`,
    }).then((response) => {
      expect(response.status).to.equal(StatusCodes.OK);

      expect(response.body.length).to.equal(0);
    });
  });

  it("should return a default result of 4 posts when GETting posts for a book for an invalid length input", () => {
    cy.request({
      method: HttpMethod.GET,
      url: `/api/book/${TEST_BOOK_1_ISBN}/posts?length=-1&page=0`,
    }).then((response) => {
      expect(response.status).to.equal(StatusCodes.OK);

      expect(response.body.length).to.equal(18);
    });
  });

  it("should return a default result of the first page for an invalid page input", () => {
    cy.request({
      method: HttpMethod.GET,
      url: `/api/book/${TEST_BOOK_1_ISBN}/posts?length=1&page=a`,
    }).then((response) => {
      expect(response.status).to.equal(StatusCodes.OK);

      expect(response.body.length).to.equal(1);
    });
  });

  it("should not give users when GETting posts for an existing book while un-AuthN", () => {
    cy.request({
      method: HttpMethod.GET,
      url: `/api/book/${TEST_BOOK_1_ISBN}/posts`,
    }).then((response) => {
      expect(response.status).equal(StatusCodes.OK);

      expect(response.body.length).to.equal(18);
      expect(response.body[0].user).equal(undefined);
      expect(response.body[1].user).equal(undefined);
      expect(response.body[2].user).equal(undefined);
      expect(response.body[17].user).equal(undefined);
    });
  });

  it("should give a 404 when trying to GET posts for a book with an isbn that does not exist", () => {
    cy.request({
      method: HttpMethod.GET,
      url: `/api/book/1234567891234/posts`,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).equal(StatusCodes.NOT_FOUND);
    });
  });
});
