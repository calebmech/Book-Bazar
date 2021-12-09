import { HttpMethod } from "@lib/http-method";
import { User } from "@prisma/client";
import { TEST_USER } from "cypress/support/constants";
import { StatusCodes } from "http-status-codes";

describe("User API", () => {
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

  it("should be able to get other users if logged in", () => {
    const userToGetMacID = "userToGetMacID";
    cy.login(userToGetMacID);

    cy.request(HttpMethod.GET, "/api/user").then((response) => {
      const { id } = response.body;

      cy.login();

      cy.request(HttpMethod.GET, "/api/user/" + id).then((response) => {
        expect(response.status).to.equal(StatusCodes.OK);

        console.log(response.body);

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

  it("should be able to update a user", () => {
    const userToUpdateMacID = "userToUpdateMacID";
    cy.login(userToUpdateMacID);

    cy.request(HttpMethod.GET, "/api/user").then((response) => {
      const originalUser: User = response.body;
      const newName = crypto.randomUUID!();
      cy.request(HttpMethod.PUT, "/api/user/" + originalUser.id, {
        name: newName,
      }).then((response) => {
        expect(response.status).to.equal(StatusCodes.OK);

        const updatedUser = response.body;
        expect(updatedUser).to.eql({
          ...originalUser,
          name: newName,
          updatedAt: updatedUser.updatedAt,
        });
      });
    });
  });

  it("should be able to delete user", () => {
    // Need to create a new user each time for development mode because
    // sessions are cached between runs but user is deleted each run
    cy.login("to-delete" + crypto.randomUUID!());

    cy.request(HttpMethod.GET, "/api/user").then((response) => {
      const { id } = response.body;
      cy.request(HttpMethod.DELETE, "/api/user/" + id).then((response) => {
        expect(response.status).to.equal(StatusCodes.OK);
      });
    });
  });
});
