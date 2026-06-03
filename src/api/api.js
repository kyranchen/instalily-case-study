// Frontend → backend bridge.
//
// Maintains a session_id in sessionStorage so multi-turn conversations stick
// to the same backend Session (entity memory, history). The id is generated
// once per browser tab and discarded on tab close — which matches the
// "in-memory only" SessionStore on the backend.

const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

const SESSION_KEY = "partselect_session_id";

function getSessionId() {
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `s-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export const getAIMessage = async (userQuery) => {
  try {
    const res = await fetch(`${BACKEND_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: userQuery,
        session_id: getSessionId(),
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      return {
        role: "assistant",
        content: `Sorry — the assistant hit a server error (${res.status}). ${body.slice(0, 200)}`,
        parts: [],
      };
    }

    const data = await res.json();
    return {
      role: "assistant",
      content: data.response || "(empty response)",
      parts: data.parts || [],
    };
  } catch (err) {
    return {
      role: "assistant",
      content:
        "Sorry — I can't reach the assistant right now. Is the backend running on " +
        BACKEND_URL +
        "?",
      parts: [],
    };
  }
};
