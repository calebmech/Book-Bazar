import { StatusCodes } from "http-status-codes";

describe("test magic api", () => {
  it("should give a 405 when trying to GET", () => {
    cy.request({
      method: "GET",
      url: "/api/auth/magic",
      failOnStatusCode: false,
    }) //
      .then((response) => {
        expect(response.status).equal(StatusCodes.METHOD_NOT_ALLOWED);
      });
  });
});
