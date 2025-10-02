import React, { useEffect, useState } from 'react';
import { getItems } from '../api/api';
import { useParams, useNavigate } from 'react-router-dom';
import { getEvent, updateEvent } from '../api/api';
export default function UpdateEventController() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [availableItems, setAvailableItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(true);

  useEffect(() => {
    async function fetchEvent() {
      setLoading(true);
      try {
        const res = await getEvent(id);
        console.log('Fetched event data:', res.data);
        setFormData(res.data.event);
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

  const handleUpdate = async () => {
    setSaving(true);
    try {
      const res = await updateEvent(id, formData);
      if (res.data.success) {
        alert('Event updated successfully!');
        navigate('/my-events');
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

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#d97706' }}>Edit Event</h2>
      <form onSubmit={e => { e.preventDefault(); handleUpdate(); }}>
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
            <div key={idx} style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #eee' }}>
              <label style={labelStyle}>Round Name</label>
              <input type="text" value={round.name || ''} onChange={e => {
                const val = e.target.value;
                setFormData(prev => {
                  const rounds = [...prev.rounds];
                  rounds[idx] = { ...rounds[idx], name: val };
                  return { ...prev, rounds };
                });
              }} style={inputStyle} />
              <label style={labelStyle}>Description</label>
              <textarea value={round.description || ''} onChange={e => {
                const val = e.target.value;
                setFormData(prev => {
                  const rounds = [...prev.rounds];
                  rounds[idx] = { ...rounds[idx], description: val };
                  return { ...prev, rounds };
                });
              }} style={{ ...inputStyle, minHeight: 60 }} />
              <label style={labelStyle}>Rules</label>
              <textarea value={round.rules?.join('\n') || ''} onChange={e => {
                const val = e.target.value.split('\n');
                setFormData(prev => {
                  const rounds = [...prev.rounds];
                  rounds[idx] = { ...rounds[idx], rules: val };
                  return { ...prev, rounds };
                });
              }} style={{ ...inputStyle, minHeight: 60 }} />
            </div>
          ))}
        </div>

        {/* Event Details Section */}
        <div style={cardStyle}>
          <h3 style={{ color: '#b45309', marginBottom: '1rem' }}>Event Details</h3>
          {formData.details && Object.entries(formData.details).map(([role, person]) => (
            role !== '_id' ? (
              <div key={role} style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #eee' }}>
                <strong style={{ color: '#d97706', fontSize: '1.1rem' }}>{role.replace(/_/g, ' ')}</strong>
                {['name','roll_number','mobile','designation'].map(field => (
                  ((field !== 'designation') || (role === 'faculty_advisor') || (role === 'judge')) ? (
                    <div key={field}>
                      <label style={labelStyle}>{field.replace(/_/g, ' ')}:</label>
                      <input
                        type="text"
                        value={person?.[field] || ''}
                        onChange={e => handleDetailsChange(role, field, e.target.value)}
                        style={inputStyle}
                      />
                    </div>
                  ) : null
                ))}
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
            <div key={idx} style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #eee', background: '#f9fafb', borderRadius: 8, position: 'relative' }}>
              <label style={labelStyle}>Item Name</label>
              <select
                value={item._id || ''}
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
              <input type="text" value={formData.form.day || ''} onChange={e => setFormData(prev => ({ ...prev, form: { ...prev.form, day: e.target.value } }))} style={inputStyle} />
              <label style={labelStyle}>Two Days</label>
              <input type="text" value={formData.form.two_days || ''} onChange={e => setFormData(prev => ({ ...prev, form: { ...prev.form, two_days: e.target.value } }))} style={inputStyle} />
              <label style={labelStyle}>Rounds</label>
              <input type="text" value={formData.form.rounds || ''} onChange={e => setFormData(prev => ({ ...prev, form: { ...prev.form, rounds: e.target.value } }))} style={inputStyle} />
              <label style={labelStyle}>Participants</label>
              <input type="text" value={formData.form.participants || ''} onChange={e => setFormData(prev => ({ ...prev, form: { ...prev.form, participants: e.target.value } }))} style={inputStyle} />
              <label style={labelStyle}>Duration</label>
              <input type="text" value={formData.form.duration || ''} onChange={e => setFormData(prev => ({ ...prev, form: { ...prev.form, duration: e.target.value } }))} style={inputStyle} />
              <label style={labelStyle}>Participant Type</label>
              <input type="text" value={formData.form.participant_type || ''} onChange={e => setFormData(prev => ({ ...prev, form: { ...prev.form, participant_type: e.target.value } }))} style={inputStyle} />
              <label style={labelStyle}>Team Min</label>
              <input type="text" value={formData.form.team_min || ''} onChange={e => setFormData(prev => ({ ...prev, form: { ...prev.form, team_min: e.target.value } }))} style={inputStyle} />
              <label style={labelStyle}>Team Max</label>
              <input type="text" value={formData.form.team_max || ''} onChange={e => setFormData(prev => ({ ...prev, form: { ...prev.form, team_max: e.target.value } }))} style={inputStyle} />
              <label style={labelStyle}>Halls Required</label>
              <input type="text" value={formData.form.halls_required || ''} onChange={e => setFormData(prev => ({ ...prev, form: { ...prev.form, halls_required: e.target.value } }))} style={inputStyle} />
              <label style={labelStyle}>Preferred Halls</label>
              <input type="text" value={formData.form.preferred_halls || ''} onChange={e => setFormData(prev => ({ ...prev, form: { ...prev.form, preferred_halls: e.target.value } }))} style={inputStyle} />
              <label style={labelStyle}>Reason for Hall</label>
              <input type="text" value={formData.form.hall_reason || ''} onChange={e => setFormData(prev => ({ ...prev, form: { ...prev.form, hall_reason: e.target.value } }))} style={inputStyle} />
              <label style={labelStyle}>Slot</label>
              <input type="text" value={formData.form.slot || ''} onChange={e => setFormData(prev => ({ ...prev, form: { ...prev.form, slot: e.target.value } }))} style={inputStyle} />
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
    </div>
  );
}

