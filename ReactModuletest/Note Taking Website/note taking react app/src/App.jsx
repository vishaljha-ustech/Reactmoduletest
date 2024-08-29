import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Intro from "./components/Intro";
import NotesContent from "./components/NotesContent";
import Modal from "./components/Modal";

const App = () => {
  const [notes, setNotes] = useState([]);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSidebar , setShowSidebar] = useState(true)

  useEffect(() => {
    const defaultNotes = [
      {
        id: crypto.randomUUID(),
        title: "My Notes",
        initials: "MN",
        color: "#007bff",
        noteList: [
          {
            id: crypto.randomUUID(),
            content: "Hello World",
            createdAt: Date.now(),
          },
        ],
      },
    ];
    const storedNotes =
      JSON.parse(localStorage.getItem("notes")) || defaultNotes;
    setNotes(storedNotes);
    if (!localStorage.getItem("notes")) {
      localStorage.setItem("notes", JSON.stringify(defaultNotes));
    }
  }, []);

  const addNote = (newNote) => {
    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
  };

  const updateNote = (noteId, updatedNoteList) => {
    const updatedNotes = notes.map((note) =>
      note.id === noteId ? { ...note, noteList: updatedNoteList } : note
    );
    setNotes(updatedNotes);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
  };

  useEffect(() => {
     if(window.innerWidth <= 500 && activeNoteId){
      setShowSidebar(false)
     }
  } , [activeNoteId])

  const handleBack = () =>{
    setShowSidebar(true)
    setActiveNoteId(null)
  }

  return (
    <div className="container">
     {showSidebar && <Sidebar
        notes={notes}
        setActiveNoteId={setActiveNoteId}
        setIsModalOpen={setIsModalOpen}
      />}
      {activeNoteId ? (
        <NotesContent
          activeNote={notes.find((note) => note.id === activeNoteId)}
          updateNote={updateNote}
          handleBack={handleBack}
        />
      ) : (
        <Intro />
      )}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        addNote={addNote}
      />
    </div>
  );
};

export default App;
