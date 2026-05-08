test("GET to /api/v1/status deve retornar 200 OK", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status")
  expect(response.status).toBe(200);

  const responseBody = await response.json();

  const parseUpdatedAt = new Date(responseBody.updated_at).toISOString();
  expect(responseBody.updated_at).toEqual(parseUpdatedAt)

  expect(responseBody.depencencies.database.version).toEqual("16.13");
  expect(responseBody.depencencies.database.max_connections).toEqual(100);
  expect(responseBody.depencencies.database.opened_connections).toEqual(1);
})