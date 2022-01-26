import { HttpMethod } from "@lib/http-method";
import { User } from "@prisma/client";
import { TEST_USER } from "cypress/support/constants";
import { StatusCodes } from "http-status-codes";

describe("User API", () => {
  beforeEach(() => {
    cy.task("db:setup");
  });

  afterEach(() => {
    cy.task("db:teardown");
  });

  it("should be able to get current user", () => {
    cy.login();

    cy.request(HttpMethod.GET, "/api/user").then((response) => {
      expect(response.status).to.equal(StatusCodes.OK);

      expect(Object.keys(response.body)).to.have.members([
        "id",
        "createdAt",
        "updatedAt",
        "email",
        "name",
        "imageUrl",
      ]);
      expect(response.body.id).to.be.a("string");
      expect(response.body.createdAt).to.be.a("string");
      expect(response.body.updatedAt).to.be.a("string");
      expect(response.body.email).to.equal(TEST_USER.email);
      expect(response.body.name).to.equal(TEST_USER.name);
      expect(response.body.imageUrl).to.equal(TEST_USER.imageUrl);
    });
  });

  it("should not be able to get current user if not signed in", () => {
    cy.request({
      method: HttpMethod.GET,
      url: "/api/user",
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.equal(StatusCodes.NO_CONTENT);
      expect(response.body).to.be.empty;
    });
  });

  it("should be able to get other users if logged in", () => {
    const userToGetMacID = "userToGetMacID";
    cy.login(userToGetMacID);

    cy.request(HttpMethod.GET, "/api/user").then((response) => {
      const { id } = response.body;

      cy.login();

      cy.request(HttpMethod.GET, "/api/user/" + id).then((response) => {
        expect(response.status).to.equal(StatusCodes.OK);

        expect(Object.keys(response.body)).to.have.members([
          "id",
          "createdAt",
          "updatedAt",
          "email",
          "name",
          "imageUrl",
          "posts",
        ]);
        expect(response.body.id).to.be.a("string");
        expect(response.body.createdAt).to.be.a("string");
        expect(response.body.updatedAt).to.be.a("string");
        expect(response.body.email).to.include(userToGetMacID + "@mcmaster.ca");
        expect(response.body.name); // can be empty
        expect(response.body.imageUrl); // can be empty
        expect(response.body.posts).to.be.an("array");
      });
    });
  });

  it("should not be able to get a user if not signed in", () => {
    cy.request({
      method: HttpMethod.GET,
      url: "/api/user/" + TEST_USER.id,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.equal(StatusCodes.UNAUTHORIZED);
      expect(response.body).to.be.empty;
    });
  });

  it("should be able to update current user", () => {
    const userToUpdateMacID = "userToUpdateMacID";
    cy.login(userToUpdateMacID);

    cy.request(HttpMethod.GET, "/api/user").then((response) => {
      const originalUser: User = response.body;
      const newName = "random";

      const formData = new FormData();
      formData.append("name", newName);

      cy.request({
        method: HttpMethod.PUT,
        url: `/api/user/` + originalUser.id,
        body: formData,
      }).then((response) => {
        expect(response.status).to.equal(StatusCodes.OK);

        const updatedUser = JSON.parse(
          new TextDecoder("utf-8").decode(response.body)
        );
        expect(updatedUser).to.eql({
          ...originalUser,
          name: newName,
          updatedAt: updatedUser.updatedAt,
        });
      });
    });
  });

  it("should not be able to update a user if not logged in", () => {
    const formData = new FormData();
    formData.append("name", "random");

    cy.request({
      method: HttpMethod.PUT,
      url: `/api/user/` + TEST_USER.id,
      body: formData,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.equal(StatusCodes.UNAUTHORIZED);
      expect(response.body).to.be.empty;
    });

    cy.login();

    cy.request(HttpMethod.GET, "/api/user").then((response) => {
      expect(response.status).to.equal(StatusCodes.OK);

      expect(response.body.email).to.equal(TEST_USER.email);
      expect(response.body.name).to.equal(TEST_USER.name);
      expect(response.body.imageUrl).to.equal(TEST_USER.imageUrl);
    });
  });

  it("should not be able to update a another user's account", () => {
    cy.login("other-user");

    const formData = new FormData();
    formData.append("name", "random");

    cy.request({
      method: HttpMethod.PUT,
      url: `/api/user/` + TEST_USER.id,
      body: formData,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.equal(StatusCodes.FORBIDDEN);
      expect(response.body).to.be.empty;
    });

    cy.login();

    cy.request(HttpMethod.GET, "/api/user").then((response) => {
      expect(response.status).to.equal(StatusCodes.OK);

      expect(response.body.email).to.equal(TEST_USER.email);
      expect(response.body.name).to.equal(TEST_USER.name);
      expect(response.body.imageUrl).to.equal(TEST_USER.imageUrl);
    });
  });

  it("should be able to delete current user", () => {
    cy.login("to-delete");

    cy.request(HttpMethod.GET, "/api/user").then((response) => {
      const { id } = response.body;
      cy.request(HttpMethod.DELETE, "/api/user/" + id).then((response) => {
        expect(response.status).to.equal(StatusCodes.OK);
      });

      cy.login();
      cy.request({
        method: HttpMethod.GET,
        url: `/api/user/` + id,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(StatusCodes.NOT_FOUND);
        expect(response.body).to.be.empty;
      });
    });
  });

  it("should not be able to delete other users", () => {
    cy.login("malicious-user");

    cy.request({
      method: HttpMethod.DELETE,
      url: `/api/user/` + TEST_USER.id,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.equal(StatusCodes.FORBIDDEN);
      expect(response.body).to.be.empty;
    });

    cy.request({
      method: HttpMethod.GET,
      url: `/api/user/` + TEST_USER.id,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.equal(StatusCodes.OK);
    });
  });

  it("should not be able to delete user if not logged in", () => {
    cy.request({
      method: HttpMethod.DELETE,
      url: `/api/user/` + TEST_USER.id,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.equal(StatusCodes.UNAUTHORIZED);
      expect(response.body).to.be.empty;
    });

    cy.login();
    cy.request({
      method: HttpMethod.GET,
      url: `/api/user/` + TEST_USER.id,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.equal(StatusCodes.OK);
    });
  });
});
