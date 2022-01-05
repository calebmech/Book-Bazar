import { HttpMethod } from "@lib/http-method";
import { StatusCodes } from "http-status-codes";

describe("test send magic link api", () => {
  it("should give a 200 for a valid request", () => {
    cy.request({
      method: HttpMethod.POST,
      url: "/api/auth/magic",
      body: {
        macID: "macid",
      },
    }).then((response) => {
      expect(response.status).equal(StatusCodes.OK);
    });
  });
});
