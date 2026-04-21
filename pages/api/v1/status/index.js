import database from "infra/database.js"

async function Status(request, response) {
  const result = await database.query('SELECT 1 + 1');
  console.log(result.rows);
  response.status(200).json({
    response: "All systems operational"
  });
}

export default Status;