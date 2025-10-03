import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEvent, updateEventAnnexures } from '../api/api';
import { GlobalStyles } from '../GlobalStyles';

const MAX_FILES = 5;
const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const generateId = () =>
  (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : Math.random().toString(36).slice(2);

const UpdateAnnexureController = () => {
  const { id: eventId } = useParams();
  const navigate = useNavigate();

  const [originalAnnexures, setOriginalAnnexures] = useState([]);
  // Use URL for uniqueness
  const [removedAnnexureUrls, setRemovedAnnexureUrls] = useState(new Set());

  // newFiles: [{ id, file }]
  const [newFiles, setNewFiles] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [eventName, setEventName] = useState('');

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setIsLoading(true);
        const res = await getEvent(eventId);
        const eventData = res.data.data || {};
        setEventName(eventData.name || 'Event');
        setOriginalAnnexures(eventData.annexure || []);
      } catch (err) {
        setError('Failed to load event data.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEventData();
  }, [eventId]);

  const displayedExistingAnnexures = originalAnnexures.filter(
    a => !removedAnnexureUrls.has(a.url)
  );

  const handleFileChange = (e) => {
    setError('');
    const selectedFiles = Array.from(e.target.files);

    const totalFiles =
      displayedExistingAnnexures.length +
      newFiles.length +
      selectedFiles.length;

    if (totalFiles > MAX_FILES) {
      setError(`You can only have a maximum of ${MAX_FILES} annexures.`);
      return;
    }

    const validFiles = [];
    for (const file of selectedFiles) {
      if (file.type !== 'application/pdf') {
        setError(`File "${file.name}" is not a PDF. Only PDF files are allowed.`);
        return;
      }
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setError(`File "${file.name}" exceeds the ${MAX_FILE_SIZE_MB}MB size limit.`);
        return;
      }
      validFiles.push({ id: generateId(), file });
    }

    setNewFiles(prev => [...prev, ...validFiles]);
    e.target.value = '';
  };

  const handleRemoveExisting = (url) => {
    setRemovedAnnexureUrls(prev => {
      const next = new Set(prev);
      next.add(url);
      return next;
    });
  };

  const handleUndoRemoveExisting = (url) => {
    // Prevent restoring if it would exceed the MAX_FILES limit
    const activeExisting = originalAnnexures.length - removedAnnexureUrls.size; // currently visible existing
    const totalIfRestored = activeExisting + 1 + newFiles.length;
    if (totalIfRestored > MAX_FILES) {
      setError(`Cannot restore this file. It would exceed the limit of ${MAX_FILES} annexures (current total if restored: ${totalIfRestored}). Remove a new file first.`);
      return;
    }
    setRemovedAnnexureUrls(prev => {
      const next = new Set(prev);
      next.delete(url);
      return next;
    });
  };

  const handleRemoveNew = (id) => {
    setNewFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleViewPdf = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Final safeguard against over-limit submission
    const finalTotal =
      (originalAnnexures.length - removedAnnexureUrls.size) + newFiles.length;
    if (finalTotal > MAX_FILES) {
      setError(`You have ${finalTotal} annexures selected. Maximum allowed is ${MAX_FILES}. Remove some before submitting.`);
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    newFiles.forEach(({ file }) => {
      formData.append('annexure', file);
    });
    formData.append('filesToRemove', JSON.stringify(Array.from(removedAnnexureUrls)));
    try {
      await updateEventAnnexures(eventId, formData);
      alert('Annexures updated successfully!');
      navigate(`/edit`);
    } catch (err) {
      setError('Failed to update annexures. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const currentFileCount = displayedExistingAnnexures.length + newFiles.length;

  return (
    <div style={styles.container}>
      <GlobalStyles />
      <h2 style={styles.header}>Update Annexures for {eventName}</h2>
      {error && <p style={styles.error}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div style={styles.section}>
          <h3 style={styles.subHeader}>Existing Annexures ({displayedExistingAnnexures.length})</h3>
          {isLoading ? (
            <p>Loading...</p>
          ) : originalAnnexures.length === 0 ? (
            <p>No existing annexures.</p>
          ) : (
            <ul style={styles.fileList}>
              {originalAnnexures.map(annexure => {
                const removed = removedAnnexureUrls.has(annexure.url);
                return (
                  <li
                    key={annexure.url}
                    style={{
                      ...styles.fileItem,
                      opacity: removed ? 0.5 : 1,
                      background: removed ? '#fff6f6' : 'white'
                    }}
                  >
                    <span>
                      {annexure.original_name}
                      {removed && ' (Marked for removal)'}
                    </span>
                    <div>
                      {!removed && (
                        <button
                          type="button"
                          onClick={() => handleViewPdf(annexure.url)}
                          style={styles.button}
                        >
                          View
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() =>
                          removed
                            ? handleUndoRemoveExisting(annexure.url)
                            : handleRemoveExisting(annexure.url)
                        }
                        style={{
                          ...styles.button,
                          ...(removed ? styles.undoButton : styles.removeButton)
                        }}
                      >
                        {removed ? 'Undo' : 'Remove'}
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div style={styles.section}>
          <h3 style={styles.subHeader}>Add New Annexures ({newFiles.length})</h3>
          {currentFileCount < MAX_FILES && (
            <div>
              <label htmlFor="file-upload" style={styles.uploadLabel}>
                Add PDF(s)...
              </label>
              <input
                id="file-upload"
                type="file"
                multiple
                accept=".pdf"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <p style={styles.helpText}>
                Max {MAX_FILE_SIZE_MB}MB per file. Up to {MAX_FILES - currentFileCount} more file(s).
              </p>
            </div>
          )}
          {newFiles.length > 0 && (
            <ul style={styles.fileList}>
              {newFiles.map(({ id, file }) => (
                <li key={id} style={styles.fileItem}>
                  <span>
                    {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveNew(id)}
                    style={{ ...styles.button, ...styles.removeButton }}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          type="submit"
          disabled={
            isLoading ||
            (newFiles.length === 0 && removedAnnexureUrls.size === 0)
          }
          style={styles.submitButton}
        >
          {isLoading ? 'Updating...' : 'Update Annexures'}
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '800px',
    margin: '0 auto',
    fontFamily: 'sans-serif',
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  subHeader: {
    borderBottom: '1px solid #ccc',
    paddingBottom: '0.5rem',
    marginBottom: '1rem',
  },
  section: {
    marginBottom: '2rem',
  },
  fileList: {
    listStyle: 'none',
    padding: 0,
  },
  fileItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.5rem',
    border: '1px solid #eee',
    borderRadius: '4px',
    marginBottom: '0.5rem',
  },
  button: {
    padding: '0.3rem 0.7rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
    cursor: 'pointer',
    marginLeft: '0.5rem',
    backgroundColor: '#f5f5f5'
  },
  removeButton: {
    backgroundColor: '#f44336',
    color: 'white',
    borderColor: '#f44336',
  },
  undoButton: {
    backgroundColor: '#ffc107',
    color: '#222',
    borderColor: '#ffc107',
  },
  uploadLabel: {
    display: 'inline-block',
    padding: '0.5rem 1rem',
    backgroundColor: '#007bff',
    color: 'white',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  helpText: {
    fontSize: '0.9rem',
    color: '#666',
    marginTop: '0.5rem',
  },
  submitButton: {
    display: 'block',
    width: '100%',
    padding: '0.8rem',
    fontSize: '1rem',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    backgroundColor: '#ffebee',
    padding: '1rem',
    borderRadius: '4px',
    textAlign: 'center',
    marginBottom: '1rem',
  },
};

export default UpdateAnnexureController;