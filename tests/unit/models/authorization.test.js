import { InternalServerError } from "infra/errors";
import authorization from "models/authorization.js";

describe("models/authorization.js", () => {
  describe(".can()", () => {
    test("Without `user`", () => {
      expect(() => {
        authorization.can();
      }).toThrow(InternalServerError);
    });

    test("Without `user.features`", () => {
      const createdUser = {
        username: "WithoutFeatures",
      }
      expect(() => {
        authorization.can(createdUser);
      }).toThrow(InternalServerError);
    });

    test("Without unknow `features`", () => {
      const createdUser = {
        features: [],
      }
      expect(() => {
        authorization.can(createdUser, "unknow:feature");
      }).toThrow(InternalServerError);
    });

    test("With `valid` user and know `feature`", () => {
      const createdUser = {
        features: ["create:user"],
      }
      expect(authorization.can(createdUser, "create:user")).toBe(true);
    });
  });

  describe(".filterOutput()", () => {
    test("Without `user`", () => {
      expect(() => {
        authorization.filterOutput();
      }).toThrow(InternalServerError);
    });

    test("Without `user.features`", () => {
      const createdUser = {
        username: "WithoutFeatures",
      }
      expect(() => {
        authorization.filterOutput(createdUser);
      }).toThrow(InternalServerError);
    });

    test("Without unknow `features`", () => {
      const createdUser = {
        features: [],
      }
      expect(() => {
        authorization.filterOutput(createdUser, "unknow:feature");
      }).toThrow(InternalServerError);
    });

    test("Without valid user, know `features`, but no `resource`", () => {
      const createdUser = {
        features: ["read:user"],
      }
      expect(() => {
        authorization.filterOutput(createdUser, "read:user");
      }).toThrow(InternalServerError);
    });

    test("With `valid` user, know `feature` and `resource`", () => {
      const createdUser = {
        features: ["read:user"],
      }

      const resource = {
        id: 1,
        username: "resource",
        features: ["read:user"],
        created_at: "2026-0101T00:00:00.000Z",
        updated_at: "2026-0101T00:00:00.000Z",
        email: "resource@email.com",
        password: "resource",
      }

      const result = authorization.filterOutput(createdUser, "read:user", resource)

      expect(result).toEqual({
        id: 1,
        username: "resource",
        features: ["read:user"],
        created_at: "2026-0101T00:00:00.000Z",
        updated_at: "2026-0101T00:00:00.000Z",
      });
    });
  });
});