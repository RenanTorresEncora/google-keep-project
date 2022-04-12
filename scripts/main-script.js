import NoteList from "./note-list.js";
import NoteItem from "./note-item.js";
import buildNoteCard from "./note-card-dom-element.js";

const notesDiv = document.querySelector("#notes-area");
const APP_NAME = "Keep-Notes";
const notesList = new NoteList();

// Search Notes functionality:
const searchIconBtn = document.querySelector("#search-icon-btn");
const searchPanel = document.querySelector("#search-panel");
const searchInput = document.querySelector("#search-input");
const cancelSearchBtn = document.querySelector("#search-cancel-btn");
searchIconBtn.addEventListener("click", () => {
  toggleVisibility(searchPanel);
  searchInput.focus();
});
cancelSearchBtn.addEventListener("click", (event) => {
  searchInput.value = "";
  Array.from(notesDiv.children).forEach((note) => {
    note.classList.remove("hide");
  });
  toggleVisibility(searchPanel);
});
searchInput.addEventListener("input", (event) => {
  Array.from(notesDiv.children).forEach((note) => {
    note.classList.toggle(
      "hide",
      !note.innerText.toLowerCase().includes(event.target.value.toLowerCase())
    );
  });
});

document.addEventListener("readystatechange", (event) => {
  if (event.target.readyState === "complete") {
    initializeApp();
  }
});

const initializeApp = () => {
  loadNotesFromLocalStorage();
  reloadNotes();
};

const updateNotesOnLocalStorage = () => {
  localStorage.setItem(APP_NAME, JSON.stringify(notesList));
  reloadNotes();
};

const loadNotesFromLocalStorage = () => {
  const storedList = localStorage.getItem(APP_NAME);
  if (typeof storedList !== "string") return;
  const parsedList = JSON.parse(storedList);
  parsedList._list.forEach((note) => {
    createNewNote(note);
  });
};

function reloadNotes() {
  deleteContents(notesDiv);
  renderNotes();
}

const takeNewNoteBtn = document.querySelector("#new-note-button");
takeNewNoteBtn.addEventListener("click", () => {
  function calculateNextId() {
    const list = notesList.getList().sort((a,b) => a.getId() - b.getId());
    let nextId = 1;
    if (list.length > 0) {
      nextId = list[list.length - 1].getId() + 1;
      console.log(list);
    }
    return nextId;
  }
  createNewNote({
    _id: calculateNextId(),
    noteTime: Date.now(),
  });
  updateNotesOnLocalStorage();
  notesDiv.querySelector(".note-card-title").firstChild.click();
  notesDiv.querySelector(".note-card-desc").firstChild.click();
  document.querySelector("#new-note-div").style.display = "none";
});

function createNewNote(noteInfo) {
  const newNote = new NoteItem(noteInfo);
  notesList.addNoteToList(newNote);
}

export function deleteNote(id) {
  notesList.removeNoteFromList(id);
  updateNotesOnLocalStorage();
}
export function pinNote(id) {
  const noteToPin = notesList.getNoteById(id);
  noteToPin.isPinned = noteToPin.isPinned ? false : true;
  updateNotesOnLocalStorage();
}
export function updateNote(noteInfo) {
  notesList.removeNoteFromList(noteInfo._id);
  createNewNote(noteInfo);
  updateNotesOnLocalStorage();
}

// Helper functions
const renderNotes = () => {
  document.querySelector("#new-note-div").style.display = "";
  const sortedList = notesList.getList();
  if (sortedList.length >= 0) {
    document
      .querySelector(".no-notes-found")
      .classList.toggle("hide",sortedList.length);
    sortedList
      .sort((a, b) => b.getTime() - a.getTime())
      .sort((a, b) => Number(b.isPinned) - Number(a.isPinned))
      .forEach((item) => buildNoteCard(item, notesDiv));
  }
};
export function toggleVisibility(domElement) {
  if (domElement.style.display == "none") {
    domElement.style.display = "";
    return;
  }
  domElement.style.display = "none";
}
const deleteContents = (parentElement) => {
  let child = parentElement.lastElementChild;
  while (child) {
    parentElement.removeChild(child);
    child = parentElement.lastElementChild;
  }
};
