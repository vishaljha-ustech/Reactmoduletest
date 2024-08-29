import { useState, useRef, useEffect } from "react";

const NotesContent = ({ activeNote, updateNote, handleBack }) => {
  const [newNote, setNewNote] = useState("");
  const [editingNoteId, setEditingNoteId] = useState(null);
  const media = window.matchMedia("(max-width:500px)");

  const handleSendNote = () => {
    if (newNote.trim()) {
      const updatedNoteList = editingNoteId
        ? activeNote.noteList.map((note) =>
            note.id === editingNoteId
              ? { ...note, content: newNote, lastUpdated: Date.now() }
              : note
          )
        : [
            ...activeNote.noteList,
            {
              id: crypto.randomUUID(),
              content: newNote,
              createdAt: Date.now(),
            },
          ];

      updateNote(activeNote.id, updatedNoteList);
      setNewNote("");
      setEditingNoteId(null);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        event.key === "Enter" &&
        newNote.trim() &&
        document.activeElement === document.querySelector("textarea")
      ) {
        event.preventDefault();
        handleSendNote();
      }
    };

    // Attach event listener
    document.addEventListener("keydown", handleKeyDown);

    // Clean up event listener on unmount
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [newNote]);

  const handleEditNote = (noteId, content) => {
    setNewNote(content); // Populate the input field with the content of the note being edited
    setEditingNoteId(noteId); // Set the editing note ID
  };

  const handleDeleteNote = (noteId) => {
    const updatedNoteList = activeNote.noteList.filter(
      (note) => note.id !== noteId
    );
    updateNote(activeNote.id, updatedNoteList);
  };

  return (
    <div className="notes-content">
      <header>
        {media.matches && (
          <span className="back">
            <img
              src="back.svg"
              alt="go back"
              onClick={() => {
                handleBack();
              }}
            />
          </span>
        )}
        <span
          className="note-icon"
          style={{ backgroundColor: activeNote.color }}
        >
          {activeNote.initials}
        </span>
        <span className="note-text">{activeNote.title}</span>
      </header>
      <main>
        <div className="notes">
          {activeNote.noteList.map((note) => (
            <NoteItem
              key={note.id}
              note={note}
              onEdit={handleEditNote}
              onDelete={handleDeleteNote}
            />
          ))}
        </div>
      </main>
      <footer>
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Enter Your Text Here...."
        />
        <svg
          className={`send-icon ${newNote.trim() ? "active" : ""}`}
          onClick={handleSendNote}
          width="21"
          height="18"
          viewBox="0 0 21 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 17.6842V11.0526L8.8421 8.84211L0 6.63158V0L21 8.84211L0 17.6842Z"
            fill="currentColor"
          />
        </svg>
      </footer>
    </div>
  );
};

const NoteItem = ({ note, onEdit, onDelete }) => {
  const [optionModalOpen, setOptionModalOpen] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setOptionModalOpen(false);
      }
    };

    if (optionModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [optionModalOpen]);

  return (
    <div className="note">
      <p>{note.content}</p>
      <p>
        Created:{" "}
        {new Date(note.createdAt).toLocaleString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}{" "}
        at{" "}
        {new Date(note.createdAt).toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })}
        {note.lastUpdated
          ? ` | Last Updated: ${new Date(note.lastUpdated).toLocaleString(
              "en-GB",
              {
                day: "numeric",
                month: "long",
                year: "numeric",
              }
            )} at ${new Date(note.createdAt).toLocaleTimeString("en-GB", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}`
          : ""}
      </p>
      <div
        className="note-options"
        onClick={() => setOptionModalOpen(!optionModalOpen)}
      >
        <div
          style={{ width: "15px", display: "flex", justifyContent: "center" }}
        >
          <svg
            className="three-dot-icon"
            width="4"
            height="18"
            viewBox="0 0 4 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 4C2.55228 4 3 3.55228 3 3C3 2.44772 2.55228 2 2 2C1.44772 2 1 2.44772 1 3C1 3.55228 1.44772 4 2 4ZM2 10C2.55228 10 3 9.55228 3 9C3 8.44772 2.55228 8 2 8C1.44772 8 1 8.44772 1 9C1 9.55228 1.44772 10 2 10ZM3 15C3 15.5523 2.55228 16 2 16C1.44772 16 1 15.5523 1 15C1 14.4477 1.44772 14 2 14C2.55228 14 3 14.4477 3 15Z"
              fill="currentColor"
            />
          </svg>
        </div>
        <div
          className="note-options-menu"
          ref={modalRef}
          style={{ display: optionModalOpen ? "block" : "none" }}
        >
          <button
            className="edit-note"
            onClick={() => onEdit(note.id, note.content)}
          >
            Edit
          </button>
          <button className="delete-note" onClick={() => onDelete(note.id)}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotesContent;
