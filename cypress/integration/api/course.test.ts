import { HttpMethod } from "@lib/http-method";
import { StatusCodes } from "http-status-codes";
import {
  TEST_COURSE,
  TEST_DEPARTMENT,
} from "../../support/constants";

const TEST_COURSE_QUERY = TEST_DEPARTMENT.abbreviation + "-" + TEST_COURSE.code;

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
      url: `/api/course/${TEST_COURSE_QUERY}`,
    }).then((response) => {
      expect(response.status).to.equal(StatusCodes.OK);
      expect(response.body.name).to.equal(TEST_COURSE.name);
      expect(response.body.code).to.equal(TEST_COURSE.code);
      expect(response.body.term).to.equal(TEST_COURSE.term);
    });
  });

  it("should give a 200 when GETting posts for an existing course", () => {
    cy.request({
      method: HttpMethod.GET,
      url: `/api/course/${TEST_COURSE_QUERY}/posts`,
    }).then((response) => {
      expect(response.status).to.equal(StatusCodes.OK);
      expect(response.body.length).to.equal(18);
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
      url: `/api/course/${TEST_COURSE_QUERY}/posts`,
    }).then((response) => {
      expect(response.status).to.equal(StatusCodes.OK);
      expect(response.body.length).to.equal(18);
      expect(response.body[0].user.name).to.be.oneOf(["Test User", "Other"]);
      expect(response.body[1].user.name).to.be.oneOf(["Test User", "Other"]);
      expect(response.body[2].user.name).to.be.oneOf(["Test User", "Other"]);
      expect(response.body[17].user.name).to.be.oneOf(["Test User", "Other"]);
    });
  });

  it("should include first 10 of 18 posts when GETting posts for an existing course with a length of 10", () => {
    cy.request({
      method: HttpMethod.GET,
      url: `/api/course/${TEST_COURSE_QUERY}/posts?length=10`,
    }).then((response) => {
      expect(response.status).to.equal(StatusCodes.OK);
      expect(response.body.length).to.equal(10);
    });
  });

  it("should include last 8 of 18 posts when GETting posts for an existing course with a length of 3 and page of 1", () => {
    cy.request({
      method: HttpMethod.GET,
      url: `/api/course/${TEST_COURSE_QUERY}/posts?length=10&page=1`,
    }).then((response) => {
      expect(response.status).to.equal(StatusCodes.OK);
      expect(response.body.length).to.equal(8);
    });
  });

  it("should include zero posts when GETting posts for an existing course with a length of 3 and page of 2", () => {
    cy.request({
      method: HttpMethod.GET,
      url: `/api/course/${TEST_COURSE_QUERY}/posts?length=10&page=2`,
    }).then((response) => {
      expect(response.status).to.equal(StatusCodes.OK);
      expect(response.body.length).to.equal(0);
    });
  });

  it("should give a 400 when trying to GET a course with an invalid code", () => {
    cy.request({
      method: HttpMethod.GET,
      url: `/api/course/hello`,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.equal(StatusCodes.BAD_REQUEST);
    });
  });

  it("should give a 400 when trying to GET posts for a course with an invalid code", () => {
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
      url: `/api/course/swagger-3S03`,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.equal(StatusCodes.NOT_FOUND);
    });
  });

  it("should give a 404 when trying to GET posts for a course with an invalid uuid", () => {
    cy.request({
      method: HttpMethod.GET,
      url: `/api/course/swagger-3S03/posts`,
      failOnStatusCode: false,
    }).then((response) => {
      console.log(response.body);
      expect(response.status).to.equal(StatusCodes.NOT_FOUND);
    });
  });
});
