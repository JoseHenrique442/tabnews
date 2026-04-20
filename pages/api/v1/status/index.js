function Status(request, response) {
  response.status(200).json({
    response: "All systems operational"
  });
}

export default Status;