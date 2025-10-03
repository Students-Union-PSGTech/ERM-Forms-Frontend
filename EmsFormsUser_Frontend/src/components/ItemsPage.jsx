import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styled from "styled-components";
import { getItems } from '../api/api';
const PageWrapper = styled.div`
  min-height: calc(100vh - 80px);
  padding: 2rem;
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  position: relative; /* for absolute positioning of back button inside */
  
  h2 {
    font-size: 2.25rem;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: var(--text-secondary);
    font-size: 1.1rem;
  }
`;


const TableContainer = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: var(--shadow-medium);
  overflow: hidden;
  position: relative;
  margin-bottom: 2rem;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: var(--gradient-fire);
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  padding: 1.5rem 1rem;
  background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
  color: white;
  font-weight: 600;
  text-align: left;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  position: relative;
  
  &:not(:last-child)::after {
    content: '';
    position: absolute;
    right: 0;
    top: 25%;
    height: 50%;
    width: 1px;
    background: rgba(255, 255, 255, 0.1);
  }
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid var(--border-light);
  vertical-align: middle;
  
  &:last-child {
    text-align: center;
  }
`;

const ItemRow = styled.tr`
  transition: all 0.2s ease;
  
  &:hover {
    background: #f8fafc;
    transform: scale(1.01);
  }
  
  &:last-child td {
    border-bottom: none;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid var(--border-light);
  border-radius: 8px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  background: #fafafa;
  
  &:focus {
    border-color: var(--flame-orange);
    background: white;
    box-shadow: 0 0 0 3px rgba(234, 88, 12, 0.1);
  }
  
  &[type="number"] {
    text-align: right;
  }
`;

const TotalCell = styled.td`
  font-weight: 600;
  font-size: 1.1rem;
  color: var(--flame-deep-red);
  background: linear-gradient(90deg, transparent, rgba(220, 38, 38, 0.05));
`;

const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.85rem;
  transition: all 0.3s ease;
  border: none;
  
  ${props => props.delete ? `
    background: linear-gradient(135deg, #dc2626, #b91c1c);
    color: white;
    
    &:hover {
      background: linear-gradient(135deg, #b91c1c, #991b1b);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(220, 38, 38, 0.4);
    }
  ` : `
    background: var(--gradient-fire);
    color: white;
    
    &:hover {
      background: var(--gradient-ember);
      transform: translateY(-1px);
      box-shadow: var(--shadow-flame);
    }
  `}
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  margin-bottom: 2rem;
`;

const PrimaryButton = styled.button`
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  border: none;
  background: var(--gradient-fire);
  color: white;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    box-shadow: var(--shadow-flame);
    transform: translateY(-2px);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }
  
  &:hover::before {
    left: 100%;
  }
`;

const TotalSummary = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: var(--shadow-medium);
  text-align: center;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: var(--gradient-fire);
  }
  
  h3 {
    font-size: 2rem;
    margin: 0;
    color: var(--flame-deep-red);
  }
  
  p {
    color: var(--text-secondary);
    margin-top: 0.5rem;
    font-size: 1.1rem;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  color: var(--text-secondary);
  
  .icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }
  
  h3 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    color: var(--text-primary);
  }
`;
const BackButton = styled.button`
  position: absolute;   /* key: absolute inside Header */
  top: 1rem;            /* distance from top of white box */
  left: 1rem;           /* distance from left of white box */
  
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: none;
  background: linear-gradient(135deg, #6b7280, #374151);
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, #4b5563, #1f2937);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  }
`;




export default function ItemsPage({ formData: globalFormData, setFormData: setGlobalFormData }) {
  const navigate = useNavigate();
  const [items, setItems] = useState(() => Array.isArray(globalFormData?.items) ? globalFormData.items : []);
  const [availableItems, setAvailableItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(true);

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

  // Load from global on mount (in case of reload)
  useEffect(() => {
    if (Array.isArray(globalFormData?.items)) {
      setItems(globalFormData.items);
    }
  }, [globalFormData]);

  // Auto-sync local edits into global so navbar navigation preserves state
  useEffect(() => {
    setGlobalFormData(prev => ({
      ...prev,
      items: items || []
    }));
  }, [items, setGlobalFormData]);

  const toNumber = v => (v === '' || v === null || v === undefined ? '' : Number(v));

  const handleItemChange = (index, field, value) => {
    setItems(prev => {
      const list = Array.isArray(prev) ? [...prev] : [];
      const current = { ...(list[index] || {}) };
      if (field === 'item_name') {
        const selected = availableItems.find(item => item.item_name === value);
        current.item_name = value || '';
        current.price_per_unit = selected?.price_per_unit || '';
        current.item_id = selected?._id || '';
      }
      if (field === 'quantity') current.quantity = toNumber(value);
      list[index] = current;
      return list;
    });
  };

  const addItem = () => {
    setItems(prev => ([...(prev || []), { item_id: '', item_name: '', price_per_unit: '', quantity: '' }]));
  };

  const deleteItem = (index) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const total = items.reduce((sum, item) => {
    const itemTotal = (item.price_per_unit || 0) * (item.quantity || 0);
    return sum + itemTotal;
  }, 0);

  const onSaveAndContinue = () => {
    // Ensure persisted, then navigate
    setGlobalFormData(prev => ({
      ...prev,
      items: items || []
    }));
    navigate('/create-event/rounds');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setGlobalFormData(prev => ({
      ...prev,
      items: items || []
    }));
    navigate('/create-event/rounds');
  };

  return (
    <PageWrapper>
      
      <Container>
        <Header>
          {/*<BackButton onClick={() => navigate("/home")}>← Back</BackButton>*/}
          <h2>Items Management</h2>
          <p>Add and manage items for your event</p>
        </Header>
        
        <TableContainer>
          <Table>
            <thead>
              <tr>
                <Th>Item Name</Th>
                <Th>Cost per Unit</Th>
                <Th>Quantity</Th>
                <Th>Total</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <ItemRow key={i}>
                  <Td>
                    <Input
                      list={`items-datalist-${i}`}
                      value={item.item_name || ''}
                      onChange={e => handleItemChange(i, 'item_name', e.target.value)}
                      placeholder="Type or select an item..."
                      disabled={loadingItems}
                    />
                    <datalist id={`items-datalist-${i}`}>
                      {availableItems.map(opt => (
                        <option key={opt._id} value={opt.item_name} />
                      ))}
                    </datalist>
                  </Td>
                  <Td>
                    <Input
                      type="number"
                      value={item.price_per_unit || '0'}
                      disabled
                      style={{ background: '#f3f4f6', color: '#6b7280' }}
                    />
                  </Td>
                  <Td>
                    <Input
                      type="number"
                      placeholder="0"
                      min="0"
                      value={item.quantity || ''}
                      onChange={e => handleItemChange(i, 'quantity', e.target.value)}
                    />
                  </Td>
                  <TotalCell>
                    ₹{((item.price_per_unit || 0) * (item.quantity || 0)).toLocaleString()}
                  </TotalCell>
                  <Td>
                    <ActionButton
                      delete
                      onClick={() => deleteItem(i)}
                      disabled={items.length === 1}
                    >
                      Delete
                    </ActionButton>
                  </Td>
                </ItemRow>
              ))}
            </tbody>
          </Table>
        </TableContainer>
        
        <ButtonGroup>
          <PrimaryButton onClick={addItem}>
            Add New Item
          </PrimaryButton>
          <PrimaryButton onClick={handleSubmit}>
            Save & Continue
          </PrimaryButton>
        </ButtonGroup>
        
        <TotalSummary>
          <h3>₹{total.toLocaleString()}</h3>
          <p>Total estimated cost for {items.length} item{items.length !== 1 ? 's' : ''}</p>
        </TotalSummary>
      </Container>
    </PageWrapper>
  );
};
