const STORAGE_KEY = "social-messaging-ui.v2";

const state = {
  chats: [],
  filtered: [],
  selectedId: null,
  drafts: {},
};

function uid() {
  return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function initials(name) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatTime(iso) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return "";
  }
}

function lastMessage(chat) {
  if (!chat.messages?.length) return "No messages yet";
  const last = chat.messages[chat.messages.length - 1];
  return typeof last === "string" ? last : last.text;
}

function normalizeChats(raw) {
  return raw.map((chat) => ({
    id: chat.id,
    name: chat.name,
    online: Boolean(chat.online),
    unread: Number(chat.unread || 0),
    messages: (chat.messages || []).map((item, index) => {
      if (typeof item === "string") {
        return {
          id: `${chat.id}_${index}`,
          text: item,
          from: index % 2 === 0 ? "them" : "me",
          at: new Date(Date.now() - (chat.messages.length - index) * 60000).toISOString(),
        };
      }
      return {
        id: item.id || `${chat.id}_${index}`,
        text: item.text,
        from: item.from === "me" ? "me" : "them",
        at: item.at || new Date().toISOString(),
      };
    }),
  }));
}

function loadPersisted() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
  } catch {
    return null;
  }
}

function persist() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      chats: state.chats,
      selectedId: state.selectedId,
      drafts: state.drafts,
    })
  );
}

async function loadSeed() {
  const response = await fetch("data/chats.json");
  if (!response.ok) throw new Error("Unable to load chats.");
  return normalizeChats(await response.json());
}

function selectedChat() {
  return state.chats.find((chat) => chat.id === state.selectedId) || null;
}

function renderContacts() {
  const list = document.getElementById("contactList");
  const template = document.getElementById("contactTemplate");
  list.innerHTML = "";

  state.filtered.forEach((chat) => {
    const fragment = template.content.cloneNode(true);
    const item = fragment.querySelector(".contact-item");
    const avatar = fragment.querySelector(".avatar");
    const name = fragment.querySelector(".contact-name");
    const preview = fragment.querySelector(".contact-preview");
    const badge = fragment.querySelector(".badge");

    avatar.textContent = initials(chat.name);
    name.textContent = chat.name;
    preview.textContent = lastMessage(chat);
    if (chat.id === state.selectedId) item.classList.add("active");
    if (chat.unread > 0) {
      badge.hidden = false;
      badge.textContent = String(chat.unread);
    }
    item.addEventListener("click", () => selectChat(chat.id));
    list.appendChild(fragment);
  });
}

function renderMessages() {
  const title = document.getElementById("chatTitle");
  const status = document.getElementById("chatStatus");
  const messages = document.getElementById("messageList");
  const template = document.getElementById("messageTemplate");
  const input = document.getElementById("messageInput");
  const sendBtn = document.getElementById("sendBtn");
  messages.innerHTML = "";

  const chat = selectedChat();
  if (!chat) {
    title.textContent = "Select a contact";
    status.textContent = "—";
    input.disabled = true;
    sendBtn.disabled = true;
    return;
  }

  title.textContent = chat.name;
  status.textContent = chat.online ? "Online" : "Offline";
  input.disabled = false;
  sendBtn.disabled = false;
  input.value = state.drafts[chat.id] || "";

  chat.messages.forEach((msg) => {
    const fragment = template.content.cloneNode(true);
    const row = fragment.querySelector(".message-row");
    if (msg.from === "me") row.classList.add("mine");
    fragment.querySelector(".message-text").textContent = msg.text;
    fragment.querySelector(".message-time").textContent = formatTime(msg.at);
    messages.appendChild(fragment);
  });
  messages.scrollTop = messages.scrollHeight;
}

function selectChat(id) {
  state.selectedId = id;
  const chat = selectedChat();
  if (chat) chat.unread = 0;
  renderContacts();
  renderMessages();
  persist();
  document.getElementById("messageInput").focus();
}

function applyFilter() {
  const query = document.getElementById("searchInput").value.trim().toLowerCase();
  state.filtered = state.chats.filter((chat) => {
    const haystack = `${chat.name} ${lastMessage(chat)}`.toLowerCase();
    return haystack.includes(query);
  });
  if (!state.filtered.some((chat) => chat.id === state.selectedId)) {
    state.selectedId = state.filtered[0]?.id ?? null;
  }
  renderContacts();
  renderMessages();
}

function sendMessage(text) {
  const chat = selectedChat();
  if (!chat || !text.trim()) return;

  chat.messages.push({
    id: uid(),
    text: text.trim(),
    from: "me",
    at: new Date().toISOString(),
  });
  state.drafts[chat.id] = "";
  renderContacts();
  renderMessages();
  persist();

  // Simulated reply for demo realism
  window.setTimeout(() => {
    if (state.selectedId !== chat.id) chat.unread += 1;
    chat.messages.push({
      id: uid(),
      text: autoReply(text),
      from: "them",
      at: new Date().toISOString(),
    });
    renderContacts();
    renderMessages();
    persist();
  }, 700 + Math.random() * 900);
}

function autoReply(text) {
  const lower = text.toLowerCase();
  if (lower.includes("hello") || lower.includes("hi")) return "Hey! Good to hear from you.";
  if (lower.includes("?")) return "Good question — let me check and get back to you.";
  if (lower.includes("thanks")) return "Anytime!";
  return "Got it. I'll follow up soon.";
}

async function boot() {
  const persisted = loadPersisted();
  if (persisted?.chats?.length) {
    state.chats = normalizeChats(persisted.chats);
    state.selectedId = persisted.selectedId || state.chats[0]?.id || null;
    state.drafts = persisted.drafts || {};
  } else {
    state.chats = await loadSeed();
    state.selectedId = state.chats[0]?.id || null;
  }
  state.filtered = [...state.chats];
  renderContacts();
  renderMessages();

  document.getElementById("searchInput").addEventListener("input", applyFilter);
  document.getElementById("messageInput").addEventListener("input", (event) => {
    const chat = selectedChat();
    if (!chat) return;
    state.drafts[chat.id] = event.target.value;
    persist();
  });
  document.getElementById("composer").addEventListener("submit", (event) => {
    event.preventDefault();
    const input = document.getElementById("messageInput");
    sendMessage(input.value);
    input.value = "";
  });
  document.getElementById("clearChatBtn").addEventListener("click", () => {
    if (!confirm("Reset all chats to seed data?")) return;
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
  });
}

boot().catch((error) => {
  document.getElementById("chatTitle").textContent = error.message;
});

export {
  normalizeChats,
  lastMessage,
  autoReply,
  initials,
};
