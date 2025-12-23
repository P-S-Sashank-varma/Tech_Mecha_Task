import React, { useState, useEffect } from 'react';
import api from '../apiClient';
import './NotesPage.css';

function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'other',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const token = localStorage.getItem('token');
  const apiConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/notes', apiConfig);
      setNotes(response.data.notes);
      setError('');
    } catch (err) {
      setError('Failed to fetch notes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (editingId) {
        await api.put(`/api/notes/${editingId}`, formData, apiConfig);
        setEditingId(null);
      } else {
        await api.post('/api/notes', formData, apiConfig);
      }

      setFormData({ title: '', content: '', category: 'other' });
      await fetchNotes();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save note');
    }
  };

  const handleEdit = (note) => {
    setFormData({
      title: note.title,
      content: note.content,
      category: note.category,
    });
    setEditingId(note._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await api.delete(`/api/notes/${id}`, apiConfig);
        await fetchNotes();
      } catch (err) {
        setError('Failed to delete note');
      }
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ title: '', content: '', category: 'other' });
  };

  return (
    <div className="notes-container">
      <div className="notes-content">
        <div className="notes-form-section">
          <h2>{editingId ? 'Edit Note' : 'Create New Note'}</h2>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit} className="notes-form">
            <div className="form-group">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Note Title"
                required
              />
            </div>
            <div className="form-group">
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Note Content"
                rows="6"
                required
              />
            </div>
            <div className="form-group">
              <select name="category" value={formData.category} onChange={handleChange}>
                <option value="personal">Personal</option>
                <option value="work">Work</option>
                <option value="ideas">Ideas</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-buttons">
              <button type="submit" className="submit-btn">
                {editingId ? 'Update Note' : 'Create Note'}
              </button>
              {editingId && (
                <button type="button" className="cancel-btn" onClick={handleCancel}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="notes-list-section">
          <h2>My Notes ({notes.length})</h2>
          {loading ? (
            <p className="loading">Loading notes...</p>
          ) : notes.length === 0 ? (
            <p className="no-notes">No notes yet. Create your first note!</p>
          ) : (
            <div className="notes-grid">
              {notes.map((note) => (
                <div key={note._id} className="note-card">
                  <h3>{note.title}</h3>
                  <p className="note-content">{note.content}</p>
                  <div className="note-footer">
                    <span className="note-category">{note.category}</span>
                    <div className="note-actions">
                      <button className="edit-btn" onClick={() => handleEdit(note)}>
                        Edit
                      </button>
                      <button className="delete-btn" onClick={() => handleDelete(note._id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NotesPage;
