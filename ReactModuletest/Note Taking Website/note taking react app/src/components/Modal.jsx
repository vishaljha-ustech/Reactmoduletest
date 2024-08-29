import { useState, useRef, useEffect } from 'react';

const Modal = ({ isOpen, onClose, addNote }) => {
  const [groupName, setGroupName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#007bff');
  const modalRef = useRef(null);

  const colorOptions = [
    '#9d4edd', '#ec4899', '#14b8a6', '#22d3ee', '#3b82f6', '#1e40af'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (groupName.trim()) {
      const newNote = {
        id: crypto.randomUUID(),
        title: groupName,
        initials: groupName.split(' ').map(word => word[0]?.toUpperCase() || '').join(''),
        color: selectedColor,
        noteList: [],
      };
      addNote(newNote);
      setGroupName('');
      setSelectedColor('#007bff');
      onClose();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" ref={modalRef}>
        <button className="close-button" onClick={onClose}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="icon"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h2 className="modal-title">Create New Group</h2>

        <form onSubmit={handleSubmit}>
          <label htmlFor="group-name" className="form-label">Group Name</label>
          <input
            id="group-name"
            type="text"
            className="form-input"
            placeholder="Enter group name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />

          <div className="color-picker">
            <label className="color-picker-label">Choose Colour</label>
            <div className="color-options">
              {colorOptions.map(color => (
                <div
                  key={color}
                  className={`color-option ${selectedColor === color ? 'selected' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-button">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
