import { HttpMethod } from "@lib/http-method";
import { getMagicLink } from "cypress/support/commands";
import { TEST_USER } from "cypress/support/constants";
import { StatusCodes } from "http-status-codes";
import cookie from "cookie";

describe("test send magic link api", () => {
  beforeEach(() => {
    cy.task("db:setup");
  });

  afterEach(() => {
    cy.task("db:teardown");
  });

  it("should be able to send a magic link to a new user", () => {
    cy.request({
      method: HttpMethod.POST,
      url: "/api/auth/magic",
      body: {
        macID: "macid",
      },
    }).then((response) => {
      expect(response.status).equal(StatusCodes.OK);

      cy.readMockData().then((data) => {
        const magicLink = getMagicLink(data);
        expect(magicLink).to.exist;
      });
    });
  });

  it("should be able to send a magic link to an existing user", () => {
    cy.request({
      method: HttpMethod.POST,
      url: "/api/auth/magic",
      body: {
        macID: TEST_USER.id,
      },
    }).then((response) => {
      expect(response.status).equal(StatusCodes.OK);

      cy.readMockData().then((data) => {
        const magicLink = getMagicLink(data);
        expect(magicLink).to.exist;
      });
    });
  });

  it("should be able to logout", () => {
    cy.login();

    cy.request({
      method: HttpMethod.POST,
      url: "/api/auth/logout",
    }).then((response) => {
      expect(response.status).equal(StatusCodes.OK);

      const setCookie = response.headers["set-cookie"];
      expect(setCookie).to.have.length(1);
      const sessionCookie = cookie.parse(response.headers["set-cookie"][0]);
      expect(sessionCookie).to.haveOwnProperty("session-token", "deleted");
    });
  });
});
