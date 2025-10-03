import React, { useEffect, useState } from 'react';
import { getItems } from '../api/api';
import { useParams, useNavigate } from 'react-router-dom';
import { getEvent, updateEvent } from '../api/api';

const departments = [
  "BE AUTOMOBILE", "BE BIOMED", "BE CIVIL", "BE CSE", "BE CSE - AI & ML",
  "BE EEE", "BE ECE", "BE I&CE", "BE MECH", "BE METLY", "BE PROD", "BE RAE",
  "B.TECH BIOTECH", "B.TECH FASHION TECH", "B.TECH IT", "B.TECH TEXTILE TECH",
  "BE EEE (SW)", "BE MECH (SW)", "BE PROD (SW)", "B.Sc APPLIED SCIENCE",
  "B.Sc CSD", "M.Sc DATA SCIENCE", "M.Sc APPLIED MATHEMATICS", "M.Sc CYBER SECURITY",
  "M.Sc FDM", "M.Sc Software Systems", "M.Sc TCS", "MCA"
];

export default function UpdateEventController() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [availableItems, setAvailableItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    async function fetchEvent() {
      setLoading(true);
      try {
        const res = await getEvent(id);

        setFormData(res.data.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load event data');
        setLoading(false);
      }
    }
    fetchEvent();
  }, [id]);

  // Fetch available items from backend
  useEffect(() => {
    async function fetchItems() {
      setLoadingItems(true);
      try {
        const res = await getItems();
        setAvailableItems(res.data.data || []);
      } catch (err) {
        setAvailableItems([]);
      }
      setLoadingItems(false);
    }
    fetchItems();
  }, []);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDetailsChange = (role, field, value) => {
    setFormData(prev => ({
      ...prev,
      details: {
        ...prev.details,
        [role]: {
          ...prev.details?.[role],
          [field]: value
        }
      }
    }));
  };

  const handleRoundChange = (index, field, value, isTieBreaker = false) => {
    setFormData(prev => {
      const rounds = [...prev.rounds];
      if (!isTieBreaker) {
        rounds[index] = { ...rounds[index], [field]: value };
      } else {
        rounds[index].tieBreaker = { ...rounds[index].tieBreaker, [field]: value };
      }
      return { ...prev, rounds };
    });
  };

  const addRound = () => {
    setFormData(prev => ({
      ...prev,
      rounds: [
        ...(prev.rounds || []),
        {
          name: `Round ${prev.rounds.length + 1}`,
          description: "",
          rules: [],
          participants: 1,
          hasTieBreaker: false,
          tieBreaker: {
            name: `Tie-Breaker for Round ${prev.rounds.length + 1}`,
            description: "",
            rules: [],
            participants: 1,
          }
        }
      ]
    }));
  };

  const deleteRound = (index) => {
    setFormData(prev => ({
      ...prev,
      rounds: prev.rounds.filter((_, i) => i !== index)
    }));
  };

  const handleUpdate = async () => {
    setSaving(true);
    try {
      const res = await updateEvent(id, formData);
      if (res.data.success) {
        alert('Event updated successfully!');
        navigate('/edit');
      } else {
        alert('Failed to update event.');
      }
    } catch (err) {
      alert('Error updating event.');
    }
    setSaving(false);
  };

  if (loading) return <div>Loading event...</div>;
  if (error) return <div>{error}</div>;
  if (!formData) return null;

  // UI Section Styles
  const cardStyle = {
    background: 'white',
    borderRadius: 16,
    boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
    padding: '2rem',
    marginBottom: '2rem',
    position: 'relative',
  };
  const labelStyle = {
    fontWeight: 600,
    marginBottom: 4,
    display: 'block',
    color: '#d97706',
  };
  const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    borderRadius: 8,
    border: '1px solid #e5e7eb',
    marginBottom: '1rem',
    fontSize: '1rem',
  };
  const confirmOverlayStyle = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(17,24,39,0.75)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1.5rem',
    zIndex: 1000,
  };

  const confirmCardStyle = {
    background: 'white',
    borderRadius: 20,
    boxShadow: '0 25px 60px -15px rgba(17, 24, 39, 0.35)',
    padding: '2.5rem 2rem',
    maxWidth: 520,
    width: '100%',
    textAlign: 'center',
  };

  const confirmButtonRowStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    marginTop: '2rem',
  };

  const confirmPrimaryButtonStyle = {
    padding: '0.9rem 1.25rem',
    borderRadius: 12,
    border: 'none',
    fontWeight: 600,
    background: 'linear-gradient(135deg, #f97316 0%, #f59e0b 100%)',
    color: 'white',
    cursor: 'pointer',
    fontSize: '1rem',
  };

  const confirmSecondaryButtonStyle = {
    padding: '0.85rem 1.25rem',
    borderRadius: 12,
    border: '1px solid #d1d5db',
    fontWeight: 600,
    background: 'white',
    color: '#374151',
    cursor: 'pointer',
    fontSize: '0.95rem',
  };

  const radioGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    marginBottom: '1.25rem',
  };

  const radioGroupInlineStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
    marginBottom: '1.25rem',
  };

  const radioOptionStyle = (selected) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.85rem 1rem',
    borderRadius: 10,
    border: selected ? '2px solid #f97316' : '1px solid #e5e7eb',
    background: selected ? 'rgba(249, 115, 22, 0.08)' : '#f9fafb',
    color: selected ? '#b45309' : '#374151',
    fontWeight: selected ? 600 : 500,
    transition: 'all 0.2s ease',
  });

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#d97706' }}>Edit Event</h2>
      <form
        onSubmit={e => {
          e.preventDefault();
          if (saving) return;
          setShowConfirm(true);
        }}
      >
        {/* Event Data Section */}
        <div style={cardStyle}>
          <h3 style={{ color: '#b45309', marginBottom: '1rem' }}>Event Information</h3>
          <label style={labelStyle}>Event Name</label>
          <input type="text" value={formData.name || ''} onChange={e => handleChange('name', e.target.value)} style={inputStyle} />
          <label style={labelStyle}>Tagline</label>
          <input type="text" value={formData.tagline || ''} onChange={e => handleChange('tagline', e.target.value)} style={inputStyle} />
          <label style={labelStyle}>About</label>
          <textarea value={formData.about || ''} onChange={e => handleChange('about', e.target.value)} style={{ ...inputStyle, minHeight: 80 }} />
          <label style={labelStyle}>Round Count</label>
          <input type="number" value={formData.round_count || ''} onChange={e => handleChange('round_count', e.target.value)} style={inputStyle} />
        </div>

        {/* Rounds Section */}
        <div style={cardStyle}>
          <h3 style={{ color: '#b45309', marginBottom: '1rem' }}>Rounds</h3>
          {formData.rounds && formData.rounds.map((round, idx) => (
            <div key={idx} style={{ marginBottom: '1.5rem', padding: '1.5rem', border: '1px solid #eee', borderRadius: '12px', background: '#fdfdfd', position: 'relative' }}>
              <h4 style={{ marginTop: 0, color: '#d97706' }}>{round.name || `Round ${idx + 1}`}</h4>
              <label style={labelStyle}>Round Name</label>
              <input type="text" value={round.name || ''} onChange={e => handleRoundChange(idx, 'name', e.target.value)} style={inputStyle} />
              
              <label style={labelStyle}>Description</label>
              <textarea value={round.description || ''} onChange={e => handleRoundChange(idx, 'description', e.target.value)} style={{ ...inputStyle, minHeight: 60 }} />
              
              <label style={labelStyle}>Rules (one per line)</label>
              <textarea value={round.rules?.join('\n') || ''} onChange={e => handleRoundChange(idx, 'rules', e.target.value.split('\n'))} style={{ ...inputStyle, minHeight: 60 }} />

              <label style={labelStyle}>Participants</label>
              <input type="number" value={round.participants || ''} onChange={e => handleRoundChange(idx, 'participants', Number(e.target.value))} style={inputStyle} />

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '1rem 0' }}>
                <input
                  type="checkbox"
                  id={`tie-check-${idx}`}
                  checked={round.hasTieBreaker || false}
                  onChange={e => handleRoundChange(idx, 'hasTieBreaker', e.target.checked)}
                  style={{ width: 18, height: 18, accentColor: '#f97316' }}
                />
                <label htmlFor={`tie-check-${idx}`} style={{ fontWeight: 500, color: '#374151' }}>Has Tie-Breaker</label>
              </div>

              {round.hasTieBreaker && (
                <div style={{ marginTop: '1.5rem', padding: '1rem', border: '1px solid #fbbf24', borderRadius: '8px', background: '#fffbeb' }}>
                  <h5 style={{ marginTop: 0, color: '#b45309' }}>Tie-Breaker Details</h5>
                  <label style={labelStyle}>Tie-Breaker Name</label>
                  <input type="text" value={round.tieBreaker?.name || ''} onChange={e => handleRoundChange(idx, 'name', e.target.value, true)} style={inputStyle} />
                  
                  <label style={labelStyle}>Description</label>
                  <textarea value={round.tieBreaker?.description || ''} onChange={e => handleRoundChange(idx, 'description', e.target.value, true)} style={{ ...inputStyle, minHeight: 60 }} />
                  
                  <label style={labelStyle}>Rules (one per line)</label>
                  <textarea value={round.tieBreaker?.rules?.join('\n') || ''} onChange={e => handleRoundChange(idx, 'rules', e.target.value.split('\n'), true)} style={{ ...inputStyle, minHeight: 60 }} />

                  <label style={labelStyle}>Participants</label>
                  <input type="number" value={round.tieBreaker?.participants || ''} onChange={e => handleRoundChange(idx, 'participants', Number(e.target.value), true)} style={inputStyle} />
                </div>
              )}

              <button
                type="button"
                onClick={() => deleteRound(idx)}
                style={{ position: 'absolute', top: 12, right: 12, padding: '0.5rem 1rem', borderRadius: 8, background: '#ef4444', color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer' }}
                disabled={formData.rounds.length <= 1}
              >
                Delete Round
              </button>
            </div>
          ))}
          <button type="button" onClick={addRound} style={{ marginTop: '1rem', padding: '0.75rem 1.5rem', borderRadius: 8, background: '#16a34a', color: 'white', border: 'none', fontWeight: 600 }}>Add Round</button>
        </div>

        {/* Event Details Section */}
        <div style={cardStyle}>
          <h3 style={{ color: '#b45309', marginBottom: '1rem' }}>Event Details</h3>
          {formData.details && Object.entries(formData.details).map(([role, person]) => (
            role !== '_id' ? (
              <div key={role} style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #eee' }}>
                <strong style={{ color: '#d97706', fontSize: '1.1rem' }}>{role.replace(/_/g, ' ')}</strong>
                {['name','roll_number','mobile','department','designation'].map(field => {
                  const isDesignationField = field === 'designation';
                  const allowDesignation = role === 'faculty_advisor' || role === 'judge';
                  const isStudentField = ['roll_number', 'department'].includes(field);
                  const isStudentRole = ['secretary1', 'secretary2', 'convenor1', 'convenor2', 'volunteer1', 'volunteer2'].includes(role);

                  if (isDesignationField && !allowDesignation) return null;
                  if (isStudentField && !isStudentRole) return null;

                  if (field === 'department') {
                    return (
                      <div key={field}>
                        <label style={labelStyle}>{field.replace(/_/g, ' ')}:</label>
                        <select
                          value={person?.[field] || ''}
                          onChange={e => handleDetailsChange(role, field, e.target.value)}
                          style={inputStyle}
                        >
                          <option value="">Select department...</option>
                          {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                        </select>
                      </div>
                    );
                  }

                  return (
                    <div key={field}>
                      <label style={labelStyle}>{field.replace(/_/g, ' ')}:</label>
                      <input
                        type="text"
                        value={person?.[field] || ''}
                        onChange={e => handleDetailsChange(role, field, e.target.value)}
                        style={inputStyle}
                      />
                    </div>
                  );
                })}
              </div>
            ) : null
          ))}
        </div>

        {/* Items Section */}
        <div style={cardStyle}>
          <h3 style={{ color: '#b45309', marginBottom: '1rem' }}>Items</h3>
          {formData.items && formData.items.length === 0 && (
            <div style={{ color: '#b91c1c', marginBottom: '1rem' }}>No items added yet.</div>
          )}
          {formData.items && formData.items.map((item, idx) => (
            <div key={idx} style={{ marginBottom: '1.5rem', padding: '1.5rem', border: '1px solid #eee', borderRadius: '12px', background: '#fdfdfd', position: 'relative' }}>
              <label style={labelStyle}>Item Name</label>
              <select
                value={item.item_id || item._id || ''}
                onChange={e => {
                  const selected = availableItems.find(opt => opt._id === e.target.value);
                  setFormData(prev => {
                    const items = [...prev.items];
                    items[idx] = {
                      ...items[idx],
                      _id: selected?._id || '',
                      item_name: selected?.item_name || '',
                      price_per_unit: selected?.price_per_unit || '',
                      total_price: (selected?.price_per_unit || 0) * (items[idx].quantity || 0)
                    };
                    return { ...prev, items };
                  });
                }}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 8, border: '1px solid #e5e7eb', background: '#fafafa', fontSize: '1rem', marginBottom: '1rem' }}
                disabled={loadingItems}
              >
                      {!item._id && <option value="">Select item...</option>}
      {/* If item is selected, show it as the first option */}
      {item._id && (
        <option value={item._id}>
          {item.item_name ||
            (availableItems.find(opt => opt._id === item._id)?.item_name) ||
            'Selected item'}
        </option>
      )}
                {availableItems.map(opt => (
                  <option key={opt._id} value={opt._id}>{opt.item_name}</option>
                ))}
              </select>
              <label style={labelStyle}>Quantity</label>
              <input type="number" value={item.quantity || ''} onChange={e => {
                const val = Number(e.target.value);
                setFormData(prev => {
                  const items = [...prev.items];
                  items[idx] = {
                    ...items[idx],
                    quantity: val,
                    total_price: (items[idx].price_per_unit || 0) * val
                  };
                  return { ...prev, items };
                });
              }} style={inputStyle} />
              <div style={{ display: 'flex', gap: '2rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Price per Unit</label>
                  <input type="number" value={item.price_per_unit || ''} disabled style={{ ...inputStyle, background: '#f3f4f6', color: '#6b7280' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Total Price</label>
                  <input type="number" value={item.total_price || ''} disabled style={{ ...inputStyle, background: '#f3f4f6', color: '#6b7280' }} />
                </div>
              </div>
              <button
                type="button"
                onClick={() => setFormData(prev => ({
                  ...prev,
                  items: prev.items.filter((_, i) => i !== idx)
                }))}
                style={{ position: 'absolute', top: 12, right: 12, padding: '0.5rem 1rem', borderRadius: 8, background: '#dc2626', color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer' }}
                disabled={formData.items.length === 1}
              >
                Delete
              </button>
            </div>
          ))}
          <button type="button" onClick={() => setFormData(prev => ({ ...prev, items: [ ...(prev.items || []), { item_id: '', item_name: '', price_per_unit: '', quantity: '', total_price: '' } ] }))} style={{ marginTop: '1rem', padding: '0.75rem 1.5rem', borderRadius: 8, background: '#d97706', color: 'white', border: 'none', fontWeight: 600 }}>Add Item</button>
        </div>

        {/* Event Form Section */}
        <div style={cardStyle}>
          <h3 style={{ color: '#b45309', marginBottom: '1rem' }}>Event Logistics</h3>
          {formData.form && (
            <>
              <label style={labelStyle}>Day</label>
              <div style={{ display: 'flex', gap: '2rem', marginBottom: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="radio"
                    name="day"
                    value="day1"
                    checked={formData.form.day === 'day1'}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        form: { ...prev.form, day: e.target.value }
                      }))
                    }
                  />
                  Day 1
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="radio"
                    name="day"
                    value="day2"
                    checked={formData.form.day === 'day2'}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        form: { ...prev.form, day: e.target.value }
                      }))
                    }
                  />
                  Day 2
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="radio"
                    name="day"
                    value="twoDays"
                    checked={formData.form.day === 'twoDays'}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        form: { ...prev.form, day: e.target.value }
                      }))
                    }
                  />
                  Two Days
                </label>
              </div>
              <label style={labelStyle}>Rounds</label>
              <input type="number" value={formData.form.rounds || ''} onChange={e => setFormData(prev => ({ ...prev, form: { ...prev.form, rounds: e.target.value } }))} style={inputStyle} />
              <label style={labelStyle}>Participants</label>
              <input type="number" value={formData.form.participants || ''} onChange={e => setFormData(prev => ({ ...prev, form: { ...prev.form, participants: e.target.value } }))} style={inputStyle} />
              <label style={labelStyle}>Duration</label>
              <input type="text" value={formData.form.duration || ''} onChange={e => setFormData(prev => ({ ...prev, form: { ...prev.form, duration: e.target.value } }))} style={inputStyle} />
              <label style={labelStyle}>Participant Type</label>
              <div style={radioGroupInlineStyle}>
                {[
                  { value: 'individual', label: 'Individual' },
                  { value: 'team', label: 'Team' },
                ].map(({ value, label }) => {
                  const selected = formData.form.participant_type === value;
                  return (
                    <label key={value} style={radioOptionStyle(selected)}>
                      <input
                        type="radio"
                        name="participant_type"
                        value={value}
                        checked={selected}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            form: { ...prev.form, participant_type: e.target.value },
                          }))
                        }
                        style={{ accentColor: '#f97316' }}
                      />
                      {label}
                    </label>
                  );
                })}
              </div>

              {formData.form.participant_type === 'team' && (
                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                  <div style={{ flex: '1 1 200px' }}>
                    <label style={labelStyle}>Team Min</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.form.team_min || ''}
                      onChange={e =>
                        setFormData(prev => ({
                          ...prev,
                          form: { ...prev.form, team_min: e.target.value },
                        }))
                      }
                      style={inputStyle}
                    />
                  </div>
                  <div style={{ flex: '1 1 200px' }}>
                    <label style={labelStyle}>Team Max</label>
                    <input
                      type="number"
                      min={formData.form.team_min || 1}
                      value={formData.form.team_max || ''}
                      onChange={e =>
                        setFormData(prev => ({
                          ...prev,
                          form: { ...prev.form, team_max: e.target.value },
                        }))
                      }
                      style={inputStyle}
                    />
                  </div>
                </div>
              )}
              <label style={labelStyle}>Halls Required</label>
              <input type="text" value={formData.form.halls_required || ''} onChange={e => setFormData(prev => ({ ...prev, form: { ...prev.form, halls_required: e.target.value } }))} style={inputStyle} />
              <label style={labelStyle}>Preferred Halls</label>
              <input type="text" value={formData.form.preferred_halls || ''} onChange={e => setFormData(prev => ({ ...prev, form: { ...prev.form, preferred_halls: e.target.value } }))} style={inputStyle} />
              <label style={labelStyle}>Reason for Hall</label>
              <input type="text" value={formData.form.hall_reason || ''} onChange={e => setFormData(prev => ({ ...prev, form: { ...prev.form, hall_reason: e.target.value } }))} style={inputStyle} />
              <label style={labelStyle}>Slot</label>
              <div style={radioGroupStyle}>
                {[
                  { value: 'slot1', label: 'Slot 1 (9:30 AM - 12:30 PM)' },
                  { value: 'slot2', label: 'Slot 2 (1:30 PM - 4:30 PM)' },
                  { value: 'fullDay', label: 'Full Day' },
                ].map(({ value, label }) => {
                  const selected = formData.form.slot === value;
                  return (
                    <label key={value} style={radioOptionStyle(selected)}>
                      <input
                        type="radio"
                        name="slot"
                        value={value}
                        checked={selected}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            form: { ...prev.form, slot: e.target.value },
                          }))
                        }
                        style={{ accentColor: '#f97316' }}
                      />
                      {label}
                    </label>
                  );
                })}
              </div>
              <label style={labelStyle}>Extension Boxes</label>
              <input type="text" value={formData.form.extension_boxes || ''} onChange={e => setFormData(prev => ({ ...prev, form: { ...prev.form, extension_boxes: e.target.value } }))} style={inputStyle} />
              <label style={labelStyle}>Reason for Extension</label>
              <input type="text" value={formData.form.extension_reason || ''} onChange={e => setFormData(prev => ({ ...prev, form: { ...prev.form, extension_reason: e.target.value } }))} style={inputStyle} />
            </>
          )}
        </div>

        <button type="submit" disabled={saving} style={{ marginTop: '2rem', padding: '1rem 2rem', fontWeight: 600, borderRadius: 8, background: 'orange', color: 'white', border: 'none' }}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>

      {showConfirm && (
        <div style={confirmOverlayStyle}>
          <div style={confirmCardStyle}>
            <div style={{ marginBottom: '1.5rem', color: '#b45309', fontWeight: 700, fontSize: '1.15rem' }}>
              Final Confirmation
            </div>
            <p style={{ color: '#374151', lineHeight: 1.6, fontSize: '1rem', marginBottom: '0.5rem' }}>
              Check all the changes and submit.
            </p>
            <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>
              If you need to edit again, you'll need to wait until the ERM team approves your access.
            </p>

            <div style={confirmButtonRowStyle}>
              <button
                type="button"
                onClick={() => {
                  setShowConfirm(false);
                  handleUpdate();
                }}
                style={{
                  ...confirmPrimaryButtonStyle,
                  opacity: saving ? 0.7 : 1,
                  cursor: saving ? 'not-allowed' : 'pointer',
                }}
                disabled={saving}
              >
                {saving ? 'Submitting...' : 'Confirm & Submit'}
              </button>
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                style={confirmSecondaryButtonStyle}
                disabled={saving}
              >
                Review Again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

