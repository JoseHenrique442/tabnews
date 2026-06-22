import email from "infra/email.js";
import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.deleteAllEmails();
});

describe("infra/email.js", () => {
  test("send()", async () => {

    await email.send({
      from: "Tabnews <josealves809.1@gmail.com>",
      to: "contato@curso.dev",
      subject: "Teste",
      text: "SMTP na unha!",
      // html: "",
    });

    await email.send({
      from: "Tabnews <josealves809.1@gmail.com>",
      to: "contato@curso.dev",
      subject: "Teste 2",
      text: "SMTP na unha 2.",
      // html: "",
    });

    const lastEmail = await orchestrator.getLastEmail();

    expect(lastEmail.sender).toBe("<josealves809.1@gmail.com>");
    expect(lastEmail.recipients[0]).toBe("<contato@curso.dev>");
    expect(lastEmail.subject).toBe("Teste 2");
    expect(lastEmail.text).toBe("SMTP na unha 2.\n");
  });
});
