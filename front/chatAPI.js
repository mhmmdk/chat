// chatApi.js
const API_URL = "http://localhost:5000/api/chat";

/**
 * fetchMessages - returns array of messages
 */
export async function fetchMessages() {
  try {
    const res = await fetch(`${API_URL}/messages`);
    if (!res.ok) throw new Error("Server responded with " + res.status);
    return await res.json();
  } catch (err) {
    console.error("Error fetching messages:", err);
    throw err;
  }
}

/**
 * sendMessageToBackend - send text or choice
 * body: { user: "me", text?: "...", choice?: "..." }
 * Returns the server-created object
 */
export async function sendMessageToBackend(payload) {
  try {
    const res = await fetch(`${API_URL}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error("Server responded with " + res.status + " - " + text);
    }
    return await res.json();
  } catch (err) {
    console.error("Error sending message:", err);
    throw err;
  }
}
