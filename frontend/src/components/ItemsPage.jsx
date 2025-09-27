import React, { useState } from "react";
import styled from "styled-components";

const Container = styled.div`padding:2rem;`;
const Table = styled.table`width:100%; border-collapse: collapse; background:white; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.1);`;
const Th = styled.th`padding:1rem; background:#2563eb; color:white;`;
const Td = styled.td`padding:0.5rem 1rem; border-bottom:1px solid #ddd;`;
const Input = styled.input`width:100%; padding:0.25rem;`;
const Button = styled.button`
  margin-top:1rem; margin-right:0.5rem;
  padding:0.5rem 1rem; border:none; border-radius:6px;
  background-color:${props=>props.delete?"#dc2626":"#2563eb"};
  color:white;
  &:hover{background-color:${props=>props.delete?"#b91c1c":"#1d4ed8"};}
`;

const ItemsPage = () => {
  const [items,setItems] = useState([{name:"",cost:0,count:0}]);

  const handleChange = (index,key,value)=>{
    const newItems = [...items];
    newItems[index][key] = key==="name"? value: Number(value);
    setItems(newItems);
  };

  const addItem=()=> setItems([...items,{name:"",cost:0,count:0}]);
  const deleteItem = (index)=> setItems(items.filter((_,i)=>i!==index));
  const total = items.reduce((sum,item)=>sum+item.cost*item.count,0);

  const handleSubmit = ()=>{
    console.log("Items submitted:",items);
    alert("Items submitted! Check console.");
  };

  return (
    <Container>
      <h2>Items Details</h2>
      <Table>
        <thead>
          <tr><Th>Name</Th><Th>Cost</Th><Th>Count</Th><Th>Total</Th><Th>Actions</Th></tr>
        </thead>
        <tbody>
          {items.map((item,i)=>(
            <tr key={i}>
              <Td><Input value={item.name} onChange={e=>handleChange(i,"name",e.target.value)}/></Td>
              <Td><Input type="number" value={item.cost} onChange={e=>handleChange(i,"cost",e.target.value)}/></Td>
              <Td><Input type="number" value={item.count} onChange={e=>handleChange(i,"count",e.target.value)}/></Td>
              <Td>₹{item.cost*item.count}</Td>
              <Td><Button delete onClick={()=>deleteItem(i)}>Delete</Button></Td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button onClick={addItem}>Add Item</Button>
      <Button onClick={handleSubmit}>Submit Items</Button>
      <h3>Total: ₹{total}</h3>
    </Container>
  );
};

export default ItemsPage;
