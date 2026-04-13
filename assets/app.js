const state = {
  chats: [],
  filtered: [],
  selectedId: null,
};

async function loadChats() {
  const response = await fetch("data/chats.json");
  if (!response.ok) {
    throw new Error("Unable to load chats.");
  }
  return response.json();
}

function renderContacts() {
  const list = document.getElementById("contactList");
  const template = document.getElementById("contactTemplate");
  list.innerHTML = "";

  state.filtered.forEach((chat) => {
    const fragment = template.content.cloneNode(true);
    const item = fragment.querySelector(".contact-item");
    item.textContent = chat.name;
    if (chat.id === state.selectedId) {
      item.classList.add("active");
    }
    item.addEventListener("click", () => {
      state.selectedId = chat.id;
      renderContacts();
      renderMessages();
    });
    list.appendChild(fragment);
  });
}

function renderMessages() {
  const title = document.getElementById("chatTitle");
  const messages = document.getElementById("messageList");
  const template = document.getElementById("messageTemplate");
  messages.innerHTML = "";

  const selected = state.chats.find((chat) => chat.id === state.selectedId);
  if (!selected) {
    title.textContent = "Select a contact";
    return;
  }

  title.textContent = selected.name;
  selected.messages.forEach((line) => {
    const fragment = template.content.cloneNode(true);
    fragment.querySelector(".message").textContent = line;
    messages.appendChild(fragment);
  });
}

function applyFilter() {
  const query = document.getElementById("searchInput").value.trim().toLowerCase();
  state.filtered = state.chats.filter((chat) => chat.name.toLowerCase().includes(query));
  if (!state.filtered.some((chat) => chat.id === state.selectedId)) {
    state.selectedId = state.filtered.length ? state.filtered[0].id : null;
  }
  renderContacts();
  renderMessages();
}

async function main() {
  state.chats = await loadChats();
  state.filtered = [...state.chats];
  state.selectedId = state.chats.length ? state.chats[0].id : null;
  renderContacts();
  renderMessages();
  document.getElementById("searchInput").addEventListener("input", applyFilter);
}

main().catch((error) => {
  document.getElementById("chatTitle").textContent = error.message;
});
