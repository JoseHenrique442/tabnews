import orchestrator from "tests/orchestrator.js";
import { version as uuidVersion } from "uuid";
import user from "models/user.js"
import password from "models/password.js";


beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("PATCH /api/v1/users/[username]", () => {
  describe("Anonymous User", () => {
    test("With non existent 'username'", async () => {
      const response2 = await fetch(
        "http://localhost:3000/api/v1/users/UsuarioInexistente", {
        method: "PATCH"
      }
      );
      expect(response2.status).toBe(404);

      const response2Body = await response2.json();

      expect(response2Body).toEqual({
        name: "NotFoundError",
        message: "O Username informado não foi encontrado no sistema.",
        action: "Verifique se o Username está digitado corretamente",
        status_code: 404,
      });
    });

    test("With duplicated 'username'", async () => {
      const user1Response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "user1",
          email: "user@name1.com",
          password: "senha123",
        }),
      });
      expect(user1Response.status).toBe(201);

      const user2Response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "user2",
          email: "user@name2.com",
          password: "senha123",
        }),
      });
      expect(user2Response.status).toBe(201);

      const response = await fetch("http://localhost:3000/api/v1/users/user2", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "user1",
        }),
      });
      expect(response.status).toBe(400);


      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "Username informado já está sendo utilizado.",
        action: "Utilize outro Username para esta operação.",
        status_code: 400,
      });
    });

    test("With duplicated 'email'", async () => {
      const user1Response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "email1",
          email: "email1@name.com",
          password: "senha123",
        }),
      });
      expect(user1Response.status).toBe(201);

      const user2Response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "email2",
          email: "email2@name.com",
          password: "senha123",
        }),
      });
      expect(user2Response.status).toBe(201);

      const response = await fetch("http://localhost:3000/api/v1/users/email2", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "email1@name.com",
        }),
      });
      expect(response.status).toBe(400);


      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "E-mail informado já está sendo utilizado.",
        action: "Utilize outro e-mail para realizar esta operação.",
        status_code: 400,
      });
    });

    test("With unique 'username'", async () => {
      const user1Response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "uniqueUser",
          email: "uniqueser@email.com",
          password: "senha123",
        }),
      });
      expect(user1Response.status).toBe(201);

      const response = await fetch("http://localhost:3000/api/v1/users/uniqueUser", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "uniqueUser2",
        }),
      });
      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "uniqueUser2",
        email: "uniqueser@email.com",
        password: responseBody.password,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });
      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
      expect(responseBody.updated_at > responseBody.created_at).toBe(true);
    });

    test("With unique 'email'", async () => {
      const user1Response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "uniqueEmail",
          email: "uniqueemail1@email.com",
          password: "senha123",
        }),
      });
      expect(user1Response.status).toBe(201);

      const response = await fetch("http://localhost:3000/api/v1/users/uniqueEmail", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "uniqueemail2@email.com",
        }),
      });
      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "uniqueEmail",
        email: "uniqueemail2@email.com",
        password: responseBody.password,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });
      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
      expect(responseBody.updated_at > responseBody.created_at).toBe(true);
    });

    test("With new 'password'", async () => {
      const user1Response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "newPassword",
          email: "newPassword@email.com",
          password: "newPassword",
        }),
      });
      expect(user1Response.status).toBe(201);

      const response = await fetch("http://localhost:3000/api/v1/users/newPassword", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: "newPassword2",
        }),
      });
      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "newPassword",
        email: "newPassword@email.com",
        password: responseBody.password,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });
      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
      expect(responseBody.updated_at > responseBody.created_at).toBe(true);
      const userInDatabase = await user.findOneByUsername('newPassword');
      const correctPasswordMatch = await password.compare("newPassword2", userInDatabase.password)
      const incorrectPasswordMatch = await password.compare("newPassword", userInDatabase.password)
      expect(correctPasswordMatch).toBe(true);
      expect(incorrectPasswordMatch).toBe(false);
    });
  });
});
