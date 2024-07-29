exports.handler = async (event, context) => {
  console.log("Received event:", event);
  console.log("Event body:", event.body);

  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing request body" })
    };
  }

  try {
    const data = JSON.parse(event.body);
    console.log("Parsed data:", data);
    // Resto del codice
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid JSON in request body" })
    };
  }
};
