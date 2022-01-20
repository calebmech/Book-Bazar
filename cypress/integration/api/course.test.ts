import { HttpMethod } from "@lib/http-method";
import { StatusCodes } from "http-status-codes";
import { v4 } from "uuid";
import {
  TEST_COURSE_UUID
} from "../../support/constants";

describe("test course api", () => {
  beforeEach(() => {
    cy.task("db:setup");
  });

  afterEach(() => {
    cy.task("db:teardown");
  });

  it("should give a 200 when GETting an existing course", () => {
    cy.request({
      method: HttpMethod.GET,
      url: `/api/course/${TEST_COURSE_UUID}`,
    }).then((response) => {
      expect(response.status).to.equal(StatusCodes.OK);
      expect(response.body.name).to.equal("Very Hard Course");
      expect(response.body.code).to.equal("2H03");
      expect(response.body.term).to.equal("Winter");
    });
  });

  
  it("should give a 200 when GETting posts for an existing course", () => {
    cy.request({
      method: HttpMethod.GET,
      url: `/api/course/${TEST_COURSE_UUID}/posts`,
    }).then((response) => {
      expect(response.status).to.equal(StatusCodes.OK);
      expect(response.body.length).to.equal(4);
      expect(response.body[0].user).to.equal(undefined);
      expect(response.body[1].user).to.equal(undefined);
      expect(response.body[2].user).to.equal(undefined);
      expect(response.body[3].user).to.equal(undefined);
    });
  });

  it("should include user with posts when signed in when GETting an existing courses posts while AuthN", () => {
    cy.login();
    cy.request({
      method: HttpMethod.GET,
      url: `/api/course/${TEST_COURSE_UUID}/posts`,
    }).then((response) => {
      expect(response.status).to.equal(StatusCodes.OK);
      expect(response.body.length).to.equal(4);
      expect(response.body[0].user.name).to.be.oneOf(["Test User", "Other"])
      expect(response.body[1].user.name).to.be.oneOf(["Test User", "Other"])
      expect(response.body[2].user.name).to.be.oneOf(["Test User", "Other"])
      expect(response.body[3].user.name).to.be.oneOf(["Test User", "Other"])
    });
  });

  it("should include first 3 of 4 posts when GETting posts for an existing course with a length of 3", () => {
    cy.request({
      method: HttpMethod.GET,
      url: `/api/course/${TEST_COURSE_UUID}/posts?length=3&page=0`,
    }).then((response) => {
      expect(response.status).to.equal(StatusCodes.OK);
      expect(response.body.length).to.equal(3);
    });
  });

  it("should include last post of 4 when GETting posts for an existing course with a length of 3 and page of 1", () => {
    cy.request({
      method: HttpMethod.GET,
      url: `/api/course/${TEST_COURSE_UUID}/posts?length=3&page=1`,
    }).then((response) => {
      expect(response.status).to.equal(StatusCodes.OK);
      expect(response.body.length).to.equal(1);
    });
  });

  it("should include zero posts when GETting posts for an existing course with a length of 3 and page of 2", () => {
    cy.request({
      method: HttpMethod.GET,
      url: `/api/course/${TEST_COURSE_UUID}/posts?length=3&page=2`,
    }).then((response) => {
      expect(response.status).to.equal(StatusCodes.OK);
      expect(response.body.length).to.equal(0);
    });
  });
  
  it("should give a 400 when trying to GET a course with an invalid uuid", () => {
    cy.request({
      method: HttpMethod.GET,
      url: `/api/course/hello`,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.equal(StatusCodes.BAD_REQUEST);
    });
  });

  it("should give a 400 when trying to GET posts for a course with an invalid uuid", () => {
    cy.request({
      method: HttpMethod.GET,
      url: `/api/course/hello/posts`,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.equal(StatusCodes.BAD_REQUEST);
    });
  });

  it("should give a 404 when trying to GET a course that doesn't exist", () => {
    cy.request({
      method: HttpMethod.GET,
      url: `/api/course/${v4()}`,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.equal(StatusCodes.NOT_FOUND);
    });
  });

  it("should give a 404 when trying to GET posts for a course with an invalid uuid", () => {
    cy.request({
      method: HttpMethod.GET,
      url: `/api/course/${v4()}/posts`,
      failOnStatusCode: false,
    }).then((response) => {
      console.log(response.body)
      expect(response.status).to.equal(StatusCodes.NOT_FOUND);
    });
  });
});
