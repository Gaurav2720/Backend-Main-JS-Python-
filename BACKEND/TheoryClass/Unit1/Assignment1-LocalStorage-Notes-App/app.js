// =============================================================================
// app.js — Client-Side LocalStorage Notes Engine
// =============================================================================
// Course: Backend Development — Theory Assignment 1
// Topic: Browser LocalStorage, JSON Serialization, and Persistent State Management
// =============================================================================

const STORAGE_KEY = "upes_backend_notes_v1";

// Application State
let notes = [];
let activeFilter = "ALL";
let searchQuery = "";

// DOM Elements
const noteForm = document.getElementById("noteForm");
const formTitle = document.getElementById("formTitle");
const editNoteId = document.getElementById("editNoteId");
const noteTitle = document.getElementById("noteTitle");
const noteCategory = document.getElementById("noteCategory");
const noteContent = document.getElementById("noteContent");
const notePinned = document.getElementById("notePinned");
const saveBtn = document.getElementById("saveBtn");
const cancelBtn = document.getElementById("cancelBtn");
const searchInput = document.getElementById("searchInput");
const filterCategory = document.getElementById("filterCategory");
const notesGrid = document.getElementById("notesGrid");
const emptyState = document.getElementById("emptyState");
const totalNotesCount = document.getElementById("totalNotesCount");
const pinnedNotesCount = document.getElementById("pinnedNotesCount");
const activeCategoryCount = document.getElementById("activeCategoryCount");
const storageUsed = document.getElementById("storageUsed");
const progressFill = document.getElementById("progressFill");
const clearAllBtn = document.getElementById("clearAllBtn");

// =============================================================================
// 1. LocalStorage Engine (Serialization & Deserialization)
// =============================================================================

/**
 * Load notes from LocalStorage.
 * Demonstrates: window.localStorage.getItem() and JSON.parse()
 */
function loadNotesFromStorage() {
  try {
    const rawData = localStorage.getItem(STORAGE_KEY);
    if (rawData) {
      notes = JSON.parse(rawData);
      if (!Array.isArray(notes)) {
        notes = [];
      }
    } else {
      // Seed initial sample note if storage is fresh
      notes = [
        {
          id: "seed-1",
          title: "Welcome to LocalStorage Notes!",
          category: "Study",
          content: "This application stores your data directly in your browser's persistent LocalStorage using JSON.stringify(). Refresh the page to test persistence!",
          pinned: true,
          updatedAt: new Date().toLocaleDateString(),
        },
      ];
      saveNotesToStorage();
    }
  } catch (err) {
    console.error("Critical: Failed to parse LocalStorage JSON payload:", err);
    notes = [];
  }
}

/**
 * Save notes to LocalStorage.
 * Demonstrates: JSON.stringify() and window.localStorage.setItem()
 */
function saveNotesToStorage() {
  try {
    const serializedPayload = JSON.stringify(notes);
    localStorage.setItem(STORAGE_KEY, serializedPayload);
    updateStorageDiagnostic(serializedPayload);
  } catch (err) {
    console.error("QuotaExceededError or Storage Failure:", err);
    alert("Warning: LocalStorage quota exceeded or storage disabled!");
  }
}

/**
 * Calculates storage memory consumption
 */
function updateStorageDiagnostic(payload) {
  const bytes = new Blob([payload || localStorage.getItem(STORAGE_KEY) || ""]).size;
  const kb = (bytes / 1024).toFixed(2);
  storageUsed.textContent = `${kb} KB`;
  // Approximate standard 5MB browser quota percentage
  const percentage = Math.min((bytes / (5 * 1024 * 1024)) * 100, 100).toFixed(1);
  progressFill.style.width = `${Math.max(percentage, 2)}%`;
}

// =============================================================================
// 2. Note CRUD Operations
// =============================================================================

function generateUUID() {
  return "note_" + Date.now().toString(36) + "_" + Math.random().toString(36).substr(2, 5);
}

/**
 * Handle form submission: Create or Update Note
 */
noteForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = noteTitle.value.trim();
  const category = noteCategory.value;
  const content = noteContent.value.trim();
  const pinned = notePinned.checked;
  const idToEdit = editNoteId.value;

  if (!title || !content) return;

  if (idToEdit) {
    // Update existing note
    const index = notes.findIndex((n) => n.id === idToEdit);
    if (index !== -1) {
      notes[index].title = title;
      notes[index].category = category;
      notes[index].content = content;
      notes[index].pinned = pinned;
      notes[index].updatedAt = new Date().toLocaleDateString();
    }
  } else {
    // Create new note
    const newNote = {
      id: generateUUID(),
      title,
      category,
      content,
      pinned,
      createdAt: new Date().toLocaleDateString(),
      updatedAt: new Date().toLocaleDateString(),
    };
    notes.unshift(newNote);
  }

  saveNotesToStorage();
  resetForm();
  renderNotes();
});

/**
 * Edit Note: Populate form fields
 */
function editNote(id) {
  const note = notes.find((n) => n.id === id);
  if (!note) return;

  editNoteId.value = note.id;
  noteTitle.value = note.title;
  noteCategory.value = note.category;
  noteContent.value = note.content;
  notePinned.checked = !!note.pinned;

  formTitle.textContent = "Edit Note";
  saveBtn.textContent = "Update Note";
  cancelBtn.style.display = "inline-block";

  // Scroll to editor on mobile
  noteTitle.focus();
}

/**
 * Delete Note
 */
function deleteNote(id) {
  if (confirm("Are you sure you want to delete this note?")) {
    notes = notes.filter((n) => n.id !== id);
    saveNotesToStorage();
    renderNotes();
  }
}

/**
 * Toggle Pin Status
 */
function togglePin(id) {
  const note = notes.find((n) => n.id === id);
  if (note) {
    note.pinned = !note.pinned;
    saveNotesToStorage();
    renderNotes();
  }
}

/**
 * Reset Note Form to default creation mode
 */
function resetForm() {
  editNoteId.value = "";
  noteTitle.value = "";
  noteContent.value = "";
  noteCategory.value = "Study";
  notePinned.checked = false;

  formTitle.textContent = "Create New Note";
  saveBtn.textContent = "Save Note";
  cancelBtn.style.display = "none";
}

cancelBtn.addEventListener("click", resetForm);

// =============================================================================
// 3. Rendering & Filtering
// =============================================================================

function renderNotes() {
  notesGrid.innerHTML = "";

  // 1. Apply category filter
  let filtered = activeFilter === "ALL" 
    ? [...notes] 
    : notes.filter((n) => n.category === activeFilter);

  // 2. Apply search query
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (n) => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)
    );
  }

  // 3. Sort: Pinned notes always first, then by latest updated
  filtered.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  // Update statistics
  totalNotesCount.textContent = notes.length;
  pinnedNotesCount.textContent = notes.filter((n) => n.pinned).length;
  activeCategoryCount.textContent = activeFilter;

  if (filtered.length === 0) {
    emptyState.style.display = "block";
    return;
  }
  emptyState.style.display = "none";

  filtered.forEach((note) => {
    const card = document.createElement("div");
    card.className = `note-card ${note.pinned ? "is-pinned" : ""}`;

    const catClass = `badge-${note.category.toLowerCase()}`;

    card.innerHTML = `
      <div class="note-header">
        <h4 class="note-card-title">${escapeHTML(note.title)}</h4>
        ${note.pinned ? '<span class="pin-icon" title="Pinned Note">📌</span>' : ""}
      </div>
      <p class="note-body">${escapeHTML(note.content)}</p>
      <div class="note-footer">
        <span class="note-badge ${catClass}">${note.category}</span>
        <div class="note-card-actions">
          <button class="action-btn" title="Toggle Pin" onclick="togglePin('${note.id}')">📌</button>
          <button class="action-btn" title="Edit" onclick="editNote('${note.id}')">✏️</button>
          <button class="action-btn btn-del" title="Delete" onclick="deleteNote('${note.id}')">🗑️</button>
        </div>
      </div>
    `;

    notesGrid.appendChild(card);
  });
}

function escapeHTML(str) {
  const p = document.createElement("p");
  p.appendChild(document.createTextNode(str));
  return p.innerHTML;
}

// Search and filter listeners
searchInput.addEventListener("input", (e) => {
  searchQuery = e.target.value.trim();
  renderNotes();
});

filterCategory.addEventListener("change", (e) => {
  activeFilter = e.target.value;
  renderNotes();
});

clearAllBtn.addEventListener("click", () => {
  if (confirm("Are you sure? This will delete all notes from browser LocalStorage!")) {
    notes = [];
    localStorage.removeItem(STORAGE_KEY);
    updateStorageDiagnostic("");
    renderNotes();
  }
});

// Initialization
loadNotesFromStorage();
renderNotes();
updateStorageDiagnostic();
