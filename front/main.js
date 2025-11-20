lucide.createIcons();

const conversationsEl = document.getElementById("conversations");
const messagesEl = document.getElementById("messages");
const input = document.getElementById("msgInput");

// Sample convs
const sampleConvs = [
  {
    id: 1,
    name: "Open Assistant",
    sub: "You (last: 09:00)",
    color: "#7c3aed",
  },
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

// open conv (simple placeholder)
function openConversation(c) {
  // Clear messages and add welcome
  messagesEl.innerHTML = "";
  appendSystem(`Opened conversation: ${c.name}`);
  appendYou("Hello! Welcome to " + c.name);
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

// Append system message
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

// Safe escape function
function sanitize(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
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

function toggleSidebar() {
  const sidebar = document.querySelector(".sidebar");
  const menuIcon = document.getElementById("menuIcon");
  const closeIcon = document.getElementById("closeIcon");

  // Toggle sidebar visibility
  const isOpen = sidebar.classList.toggle("show");

  // Update menu button icons
  menuIcon.style.display = isOpen ? "none" : "block";
  closeIcon.style.display = isOpen ? "block" : "none";
}

let dark = false;

function toggleTheme() {
  dark = !dark;

  const root = document.documentElement;

  if (dark) {
    // Backgrounds & panels
    root.style.setProperty("--bg", "#0b1220");
    root.style.setProperty("--panel", "#071127");
    root.style.setProperty(
      "--bg-gradient",
      "linear-gradient(180deg, #071127 0%, #071427 100%)"
    );
    root.style.setProperty(
      "--chat-bg",
      "linear-gradient(180deg, #071127 0%, #0b1220 100%)"
    );
    root.style.setProperty(
      "--topbar-bg",
      "linear-gradient(90deg, rgba(124,58,237,0.2), rgba(6,182,212,0.1))"
    );
    root.style.setProperty(
      "--input-gradient",
      "linear-gradient(180deg, rgba(11,18,48,0.9), rgba(11,18,48,0.9))"
    );
    root.style.setProperty("--field-bg", "rgba(11,18,48,0.9)");

    // Text & muted
    root.style.setProperty("--text", "#d1d5db");
    root.style.setProperty("--text-light", "#e5e7eb");
    root.style.setProperty("--text-alt", "#cbd5e1");
    root.style.setProperty("--muted", "#9aa5b1");

    // Bubbles
    root.style.setProperty("--bubble-me", "#0b1830");
    root.style.setProperty("--bubble-you", "#101124");

    // Icons
    root.style.setProperty("--icon", "#d1d5db");

    // Button shadow
    root.style.setProperty("--btn-shadow", "rgba(124,58,237,0.35)");

    // Sidebar accent
    root.style.setProperty(
      "--accent-light",
      "linear-gradient(180deg, rgba(124,58,237,0.2), rgba(6,182,212,0.1))"
    );
    root.style.setProperty("--border-light", "#222");

    // Theme button icon
    const btn = document.getElementById("themeBtn");
    btn.title = "Theme (dark)";
    btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none">
  <circle cx="12" cy="12" r="5"
    stroke="#374151" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
    stroke="#374151" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`; // sun icon for dark mode
  } else {
    // Reset to light
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
      "linear-gradient(90deg, rgba(124,58,237,0.02), rgba(6,182,212,0.01))"
    );
    root.style.setProperty(
      "--input-gradient",
      "linear-gradient(180deg, rgba(249,250,251,0.9), rgba(255,255,255,0.9))"
    );
    root.style.setProperty("--field-bg", "#ffffff");

    root.style.setProperty("--text", "#0f172a");
    root.style.setProperty("--text-light", "#2b254a");
    root.style.setProperty("--text-alt", "#0b3b5b");
    root.style.setProperty("--muted", "#6b7280");

    root.style.setProperty("--bubble-me", "#e9f5ff");
    root.style.setProperty("--bubble-you", "#f3e8ff");
    root.style.setProperty("--border-light", "rgba(11, 18, 48, 0.1)");

    root.style.setProperty("--icon", "#374151");
    root.style.setProperty("--btn-shadow", "rgba(124,58,237,0.18)");
    root.style.setProperty(
      "--accent-light",
      "linear-gradient(180deg, rgba(124,58,237,0.06), rgba(6,182,212,0.02))"
    );

    const btn = document.getElementById("themeBtn");
    btn.title = "Theme (light)";
    btn.innerHTML = `                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                    stroke="#374151"
                    stroke-width="1.4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>`; // moon icon for light mode
  }
}
