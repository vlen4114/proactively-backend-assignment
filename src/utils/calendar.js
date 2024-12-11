const fs = require("fs");
const { google } = require("googleapis");
const path = require("path");

const CREDENTIALS_PATH = path.join(__dirname, "../config/google/credentials.json");
async function addCalendarEvent(oAuth2Client, sessionDetails) {
  const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

  const event = {
    summary: `Session with ${sessionDetails.speakerName}`,
    location: sessionDetails.location || "Online",
    description: sessionDetails.description || "A booked session.",
    start: {
      dateTime: sessionDetails.startTime,
      timeZone: "+05:30", 
    },
    end: {
      dateTime: sessionDetails.endTime,
      timeZone: "+05:30",
    },
    attendees: [
      { email: sessionDetails.userEmail },
      { email: sessionDetails.speakerEmail },
    ],
  };

  try {
    const response = await calendar.events.insert({
      calendarId: "primary", 
      resource: event,
    });
    console.log("Event created:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating calendar event:", error);
    throw new Error("Error creating calendar event.");
  }
}

module.exports = { addCalendarEvent };
if (!fs.existsSync(CREDENTIALS_PATH)) {
  console.error("Credentials file not found.");
  throw new Error("Credentials file does not exist.");
}

let credentials;
try {
  credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, "utf8"));
} catch (error) {
  console.error("Error reading or parsing the credentials file:", error);
  throw new Error("Error reading or parsing the credentials file.");
}

const { client_secret, client_id, redirect_uris } = credentials.web || {};
if (!client_secret || !client_id || !Array.isArray(redirect_uris) || redirect_uris.length === 0) {
  throw new Error("Invalid credentials format. Ensure the 'web' field is present and contains 'client_secret', 'client_id', and 'redirect_uris'.");
}

const redirectUri = redirect_uris[0];

// Create OAuth2 client with the credentials
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirectUri);

module.exports = { oAuth2Client };
