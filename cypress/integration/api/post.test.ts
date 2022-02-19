import { HttpMethod } from "@lib/http-method";
import { Post } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { v4 } from "uuid";
import {
  TEST_BOOK_UUID,
  TEST_OTHER_PERSON_POST_UUID,
  TEST_POST_UUID,
} from "../../support/constants";

const SESSION_TOKEN_COOKIE = "session-token";

describe("test post api", () => {
  // GET

  beforeEach(() => {
    cy.task("db:setup");
  });

  afterEach(() => {
    cy.task("db:teardown");
  });

  it("should give a 200 when GETting an existing post", () => {
    cy.request({
      method: HttpMethod.GET,
      url: `/api/post/${TEST_POST_UUID}`,
    }).then((response) => {
      expect(response.status).equal(StatusCodes.OK);
      expect(response.body.price).equal(42);
      expect(response.body.user).equal(undefined);
      expect(response.body.book.name).equal("Algorithms");
      expect(response.body.book.campusStorePrice).equal(4000);
    });
  });

  it("should have user when GETting an existing post while AuthN", () => {
    cy.login();
    cy.request({
          method: HttpMethod.GET,
          url: `/api/post/${TEST_POST_UUID}`,
        })
      .then((response) => {
        expect(response.status).equal(StatusCodes.OK);
        expect(response.body.user.name).equal("Test User");
      });
  });

  it("should give a 400 when trying to GET a post with an invalid uuid", () => {
    cy.request({
      method: HttpMethod.GET,
      url: `/api/post/hello`,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).equal(StatusCodes.BAD_REQUEST);
    });
  });

  it("should give a 404 when trying to GET a post that doesn't exist", () => {
    cy.request({
      method: HttpMethod.GET,
      url: `/api/post/${v4()}`,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).equal(StatusCodes.NOT_FOUND);
    });
  });

  // PUT

  it("should give a 401 when trying to PUT when unauthenticated", () => {
    cy.request({
      method: HttpMethod.PUT,
      url: `/api/post/${TEST_POST_UUID}`,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).equal(StatusCodes.UNAUTHORIZED);
    });
  });

  it("should give a 404 when PUTting to a post that doesn't exist (while AuthN)", () => {
    const formData = new FormData();
    formData.append("description", "hi, mom!");

    cy.login();
    cy.request({
          method: HttpMethod.PUT,
          url: `/api/post/${v4()}`,
          body: formData,
          failOnStatusCode: false,
        })
      .then((response) => {
        expect(response.status).equal(StatusCodes.NOT_FOUND);
      });
  });

  it("should give a 400 when trying to set the price to a negative number using PUT while AuthN", () => {
    const formData = new FormData();
    formData.append("price", "-100");

    cy.login();
    cy.request({
          method: HttpMethod.PUT,
          url: `/api/post/${TEST_POST_UUID}`,
          body: formData,
          failOnStatusCode: false,
        })
      .then((response) => {
        expect(response.status).equal(StatusCodes.BAD_REQUEST);
      });
  });

  it("should give a 400 when trying to set the price to a non-number value using PUT while AuthN", () => {
    const formData = new FormData();
    formData.append("price", "salami");

    cy.login();
    cy.request({
          method: HttpMethod.PUT,
          url: `/api/post/${TEST_POST_UUID}`,
          body: formData,
          failOnStatusCode: false,
        })
      .then((response) => {
        expect(response.status).equal(StatusCodes.BAD_REQUEST);
      });
  });

  it("should give a 200 when PUTting while AuthN with correct syntax", () => {
    const formData = new FormData();
    formData.append("description", "hi, mom!");

    cy.login();
    cy.request({
      method: HttpMethod.PUT,
      url: `/api/post/${TEST_POST_UUID}`,
      body: formData,
    })
      .then((response) => {
        expect(response.status).equal(StatusCodes.OK);
        return cy.request({
          method: HttpMethod.GET,
          url: `/api/post/${TEST_POST_UUID}`,
        });
      })
      .then((response) => {
        expect(response.status).equal(StatusCodes.OK);
        expect(response.body.description).equal("hi, mom!");
      });
  });

  // DELETE

  it("should give a 401 when trying to DELETE when unauthenticated", () => {
    cy.request({
      method: HttpMethod.DELETE,
      url: `/api/post/${TEST_POST_UUID}`,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).equal(StatusCodes.UNAUTHORIZED);
    });
  });

  it("should give a 404 when trying to DELETE a post that does not exist", () => {
    cy.request({
      method: HttpMethod.DELETE,
      url: `/api/post/${v4()}`,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).equal(StatusCodes.NOT_FOUND);
    });
  });

  it("should give a 403 when trying to DELETE someone else's post", () => {
    cy.login();
    cy.request({
      method: HttpMethod.DELETE,
      url: `/api/post/${TEST_OTHER_PERSON_POST_UUID}`,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).equal(StatusCodes.FORBIDDEN);
    });
  });

  it("should give a 200 when DELETEing when authenticated", () => {
    cy.login();
    cy.request({
      method: HttpMethod.DELETE,
      url: `/api/post/${TEST_POST_UUID}`,
    })
      .then((response) => {
        expect(response.status).equal(StatusCodes.OK);
        return cy.request({
          method: HttpMethod.GET,
          url: `/api/post/${TEST_POST_UUID}`,
          failOnStatusCode: false,
        });
      })
      .then((response) => {
        expect(response.status).equal(StatusCodes.NOT_FOUND);
      });
  });

  // Post

  it("should give 401 when attempting to create a post while not AuthN", () => {
    const formData = new FormData();
    formData.append("description", "this is my book, please buy");
    formData.append("price", "salami");
    formData.append("bookId", TEST_BOOK_UUID);

    cy.request({
      method: HttpMethod.POST,
      url: `/api/post`,
      body: formData,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).equal(StatusCodes.UNAUTHORIZED);
    });
  });

  it("should give 200 when creating a post while AuthN", () => {
    const formData = new FormData();
    formData.append("description", "this is my book, please buy");
    formData.append("bookId", TEST_BOOK_UUID);
    formData.append("price", "42");

    cy.login();
    cy.request({
      method: HttpMethod.POST,
      url: `/api/post`,
      body: formData,
    }).then((response) => {
      expect(response.status).equal(StatusCodes.OK);
      const createdPost: Post = JSON.parse(
        new TextDecoder("utf-8").decode(response.body)
      )
      expect(createdPost.bookId).to.equal(TEST_BOOK_UUID);
      expect(createdPost.description).to.equal("this is my book, please buy");
      expect(createdPost.price).to.equal(42);
    });
  });

  it("should give 400 when attempting to create a post with bookId missing while AuthN", () => {
    const formData = new FormData();
    formData.append("description", "this is my book, please buy");
    formData.append("price", "42");

    cy.login();
    cy.request({
      method: HttpMethod.POST,
      url: `/api/post`,
      body: formData,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).equal(StatusCodes.BAD_REQUEST);
    });
  });

  it("should give 400 when attempting to create a post with price NaN while AuthN", () => {
    const formData = new FormData();
    formData.append("description", "this is my book, please buy");
    formData.append("price", "salami");
    formData.append("bookId", TEST_BOOK_UUID);

    cy.login();
    cy.request({
      method: HttpMethod.POST,
      url: `/api/post`,
      body: formData,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).equal(StatusCodes.BAD_REQUEST);
    });
  });

  it("should give 400 when attempting to create a post with negative price while AuthN", () => {
    const formData = new FormData();
    formData.append("description", "this is my book, please buy");
    formData.append("price", "-42");
    formData.append("bookId", TEST_BOOK_UUID);

    cy.login();
    cy.request({
      method: HttpMethod.POST,
      url: `/api/post`,
      body: formData,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).equal(StatusCodes.BAD_REQUEST);
    });
  });

  it("should give 400 when attempting to create a post with missing book while AuthN", () => {
    const formData = new FormData();
    formData.append("description", "this is my book, please buy");
    formData.append("price", "salami");
    formData.append("bookId", v4());

    cy.login();
    cy.request({
      method: HttpMethod.POST,
      url: `/api/post`,
      body: formData,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).equal(StatusCodes.BAD_REQUEST);
    });
  });
});
