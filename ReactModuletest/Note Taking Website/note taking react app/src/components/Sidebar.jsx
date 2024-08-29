import { useEffect } from "react";


const Sidebar = ({ notes, setActiveNoteId, setIsModalOpen }) => {
  useEffect(() => {
    const updateButtonPosition = () => {
      const sidebarWidth = document.querySelector('.sidebar')?.offsetWidth || 0;
      const button = document.querySelector('.add-note-button');
      if (button) {
        button.style.left = `${sidebarWidth - 80}px`;
      }
    };

    updateButtonPosition(); // Initial call
    window.addEventListener('resize', updateButtonPosition);

    return () => {
      window.removeEventListener('resize', updateButtonPosition);
    };
  }, []);

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Pocket Notes</h2>
      </div>
      <ul className="notes-list">
        {notes.map(note => (
          <li
            key={note.id}
            className="note-item"
            onClick={() => setActiveNoteId(note.id)}
          >
            <span className="note-icon" style={{ backgroundColor: note.color }}>
              {note.initials}
            </span>
            <span className="note-text">{note.title}</span>
          </li>
        ))}
      </ul>
      <button className="add-note-button" onClick={() => setIsModalOpen(true)}>
        +
      </button>
    </aside>
  );
};

export default Sidebar;