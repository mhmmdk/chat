// main.js
import { fetchMessages, sendMessageToBackend } from "./chatAPI.js";

lucide.createIcons();

const conversationsEl = document.getElementById("conversations");
const messagesEl = document.getElementById("messages");
const input = document.getElementById("msgInput");

// Sample conversations
const sampleConvs = [
  { id: 1, name: "Open Assistant", sub: "You (last: 09:00)", color: "#7c3aed" },
  { id: 2, name: "Design Bot", sub: "Design tips", color: "#06b6d4" },
  { id: 3, name: "Team", sub: "Project chat", color: "#fb7185" },
];

function buildConversations() {
  conversationsEl.innerHTML = "";
  sampleConvs.forEach((c) => {
    const el = document.createElement("div");
    el.className = "conv";
    el.innerHTML = `
      <div class="avatar" style="background:${c.color}">${c.name
      .split(" ")
      .map((s) => s[0])
      .slice(0, 2)
      .join("")}</div>
      <div class="meta">
        <div class="name">${c.name}</div>
        <div class="sub">${c.sub}</div>
      </div>
    `;
    el.onclick = () => openConversation(c);
    conversationsEl.appendChild(el);
  });
}

buildConversations();

function openConversation(c) {
  messagesEl.innerHTML = "";
  appendSystem(`Opened conversation: ${c.name}`);
  loadBackendMessages();
}

// Append helpers
function appendYou(text, time = null) {
  const wrapper = document.createElement("div");
  wrapper.className = "msg you";
  wrapper.innerHTML = `
    <div class="avatar" style="width:36px;height:36px;border-radius:8px;background:linear-gradient(90deg,#7c3aed,#06b6d4); color:white; display:flex; align-items:center; justify-content:center; font-weight:700;">A</div>
    <div>
      <div class="bubble you">${sanitize(text)}</div>
      <div class="meta-right">${time || timeNow()}</div>
    </div>
  `;
  messagesEl.appendChild(wrapper);
  scrollToBottom();
}

function appendMe(text, time = null) {
  const wrapper = document.createElement("div");
  wrapper.className = "msg me";
  wrapper.innerHTML = `
    <div class="avatar" style="width:36px;height:36px;border-radius:8px;background:#e6f7ff;color:#064e63;display:flex;align-items:center;justify-content:center;font-weight:700;">Y</div>
    <div>
      <div class="bubble me">${sanitize(text)}</div>
      <div class="meta-right">${time || timeNow()}</div>
    </div>
  `;
  messagesEl.appendChild(wrapper);
  scrollToBottom();
}

function appendSystem(text) {
  const el = document.createElement("div");
  el.style.textAlign = "center";
  el.style.opacity = "0.8";
  el.style.fontSize = "13px";
  el.style.margin = "6px 0 12px";
  el.textContent = text;
  messagesEl.appendChild(el);
  scrollToBottom();
}

function appendChoices(choices = []) {
  const wrapper = document.createElement("div");
  wrapper.className = "msg choices";
  const buttonsHtml = choices
    .map(
      (c) =>
        `<button class="choice-btn" data-choice="${sanitize(c)}">${sanitize(
          c
        )}</button>`
    )
    .join(" ");
  wrapper.innerHTML = `<div style="display:flex;gap:8px;flex-wrap:wrap;margin:8px 0;">${buttonsHtml}</div>`;
  messagesEl.appendChild(wrapper);

  wrapper.querySelectorAll(".choice-btn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const choice = e.currentTarget.dataset.choice;
      appendMe(`Selected: ${choice}`);
      try {
        await sendMessageToBackend({ user: "me", choice });
        await loadBackendMessages({ onlyLatest: true });
      } catch (err) {
        appendSystem("⚠ Failed to send choice to server");
      }
    });
  });

  scrollToBottom();
}

function sanitize(s) {
  if (s == null) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function timeNow() {
  const d = new Date();
  return (
    String(d.getHours()).padStart(2, "0") +
    ":" +
    String(d.getMinutes()).padStart(2, "0")
  );
}

function scrollToBottom() {
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

// Load backend messages
async function loadBackendMessages(options = {}) {
  try {
    const msgs = await fetchMessages();
    if (!options.onlyLatest) messagesEl.innerHTML = "";

    const toRender = options.onlyLatest ? msgs.slice(-2) : msgs;

    toRender.forEach((m) => {
      if (m.choices && m.choices.length) {
        appendYou(m.text);
        appendChoices(m.choices);
      } else if (m.user === "me") {
        appendMe(m.text);
      } else if (m.user === "bot") {
        appendYou(m.text);
      } else if (m.user === "system") {
        appendSystem(m.text);
      } else {
        appendYou(m.text);
      }
    });
  } catch (err) {
    console.error("Error loading messages:", err);
    appendSystem("⚠ Could not load messages from server.");
  }
}

// ------------------- GLOBAL FUNCTIONS -------------------

// Send message
window.sendMessage = async function () {
  const text = input.value.trim();
  if (!text) return;
  appendMe(text);
  input.value = "";
  try {
    await sendMessageToBackend({ user: "me", text });
    await loadBackendMessages();
  } catch (err) {
    appendSystem("⚠ Failed to send message to server.");
  }
};

// Sidebar toggle
window.toggleSidebar = function () {
  const sidebar = document.querySelector(".sidebar");
  const menuIcon = document.getElementById("menuIcon");
  const closeIcon = document.getElementById("closeIcon");

  const isOpen = sidebar.classList.toggle("show");
  menuIcon.style.display = isOpen ? "none" : "block";
  closeIcon.style.display = isOpen ? "block" : "none";
};

// Theme toggle
let dark = false;
window.toggleTheme = function () {
  dark = !dark;

  const root = document.documentElement;
  const btn = document.getElementById("themeBtn");

  if (dark) {
    // ---------------- Dark Theme ----------------
    // Backgrounds & panels
    root.style.setProperty("--bg", "#0c111e");
    root.style.setProperty("--panel", "#141926");
    root.style.setProperty(
      "--bg-gradient",
      "linear-gradient(180deg, #141926 0%, #0c111e 100%)"
    );
    root.style.setProperty(
      "--chat-bg",
      "linear-gradient(180deg, #141926 0%, #0c111e 100%)"
    );
    root.style.setProperty(
      "--topbar-bg",
      "linear-gradient(90deg, rgba(124,58,237,0.15), rgba(6,182,212,0.1))"
    );
    root.style.setProperty(
      "--input-gradient",
      "linear-gradient(180deg, rgba(20,25,38,0.95), rgba(20,25,38,0.95))"
    );
    root.style.setProperty("--field-bg", "rgba(20,25,38,0.95)");

    // Text & muted
    root.style.setProperty("--text", "#e0e6f3");
    root.style.setProperty("--text-light", "#f3f4f6");
    root.style.setProperty("--text-alt", "#cbd5e1");
    root.style.setProperty("--muted", "#9aa5b1");

    // Message bubbles
    root.style.setProperty("--bubble-me", "#162040");
    root.style.setProperty("--bubble-you", "#1a1f34");

    // Icons & buttons
    root.style.setProperty("--icon", "#e0e6f3");
    root.style.setProperty("--btn-shadow", "rgba(124,58,237,0.35)");

    // Sidebar accent & border
    root.style.setProperty(
      "--accent-light",
      "linear-gradient(180deg, rgba(124,58,237,0.2), rgba(6,182,212,0.1))"
    );
    root.style.setProperty("--border-light", "#222");

    // Theme button icon (sun)
    btn.title = "Switch to Light Mode";
    btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="5" stroke="#f3f4f6" stroke-width="1.4"/>
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
        stroke="#f3f4f6" stroke-width="1.4"/>
    </svg>`;
  } else {
    // ---------------- Light Theme ----------------
    // Backgrounds & panels
    root.style.setProperty("--bg", "#f7f8fb");
    root.style.setProperty("--panel", "#ffffff");
    root.style.setProperty(
      "--bg-gradient",
      "linear-gradient(180deg, #fbf8ff 0%, #f7fbff 100%)"
    );
    root.style.setProperty(
      "--chat-bg",
      "linear-gradient(180deg, #ffffff 0%, #fbfdff 100%)"
    );
    root.style.setProperty(
      "--topbar-bg",
      "linear-gradient(90deg, rgba(124,58,237,0.05), rgba(6,182,212,0.02))"
    );
    root.style.setProperty(
      "--input-gradient",
      "linear-gradient(180deg, rgba(255,255,255,0.95), rgba(249,250,251,0.95))"
    );
    root.style.setProperty("--field-bg", "#ffffff");

    // Text & muted
    root.style.setProperty("--text", "#0f172a");
    root.style.setProperty("--text-light", "#374151");
    root.style.setProperty("--text-alt", "#6b7280");
    root.style.setProperty("--muted", "#9ca3af");

    // Message bubbles
    root.style.setProperty("--bubble-me", "#e6f4ff");
    root.style.setProperty("--bubble-you", "#f3e8ff");

    // Icons & buttons
    root.style.setProperty("--icon", "#374151");
    root.style.setProperty("--btn-shadow", "rgba(124,58,237,0.18)");

    // Sidebar accent & border
    root.style.setProperty(
      "--accent-light",
      "linear-gradient(180deg, rgba(124,58,237,0.06), rgba(6,182,212,0.02))"
    );
    root.style.setProperty("--border-light", "rgba(11,18,48,0.1)");

    // Theme button icon (moon)
    btn.title = "Switch to Dark Mode";
    btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
        stroke="#374151" stroke-width="1.4"/>
    </svg>`;
  }
};

// Placeholder functions for HTML buttons
window.setting = function () {
  alert("Settings not implemented");
};
window.toggleEmoji = function () {
  alert("Emoji picker not implemented");
};
window.newConv = function () {
  alert("New conversation not implemented");
};

// Handle Enter key
input.addEventListener("keydown", async (e) => {
  if (e.key === "Enter") {
    window.sendMessage();
  }
});

// Optionally open first conversation automatically
openConversation(sampleConvs[0]);
