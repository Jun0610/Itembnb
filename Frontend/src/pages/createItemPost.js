import React from "react";
import Select from 'react-select';

const Categories = [
  {value: 'ACADEMICS', label: "Academics"},
  {value: 'HOUSEHOLD', label: "Household"},
  {value: 'ENTERTAINMENT', label: "Entertainment"},
  {value: 'OUTDOOR', label: "Outdoor"},
  {value: 'ELECTRONIC', label: "Electronic"},
  {value: 'MISC', label: "Misc"},
];

const CreateItemPost = () => {
  const [item, setItem] = React.useState({
    name: '',
    description: '',
    price: 0,
    revservHist: [],
    unavailList: [],
    review: [],
    category: [],
  });

  const handleItem = (e) => {
    setItem({
      ...item, 
      [e.target.id]: e.target.value, 
    });
  }

  const handleCategory = (o) => {
    var categories = [];
    o.forEach((element) => categories.push(element['value']));
    setItem({
      ...item, 
      category: categories,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(item);
  }

  return (
    <div>
      <div> This is create an item post </div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name</label>
          <input id="name" type="text" value={item.name} onChange={handleItem} name="name"/>
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <input id="description" type="text" value={item.description} onChange={handleItem} name="description"/>
        </div>
        <div>
          <label htmlFor="price">Price</label>
          <input id="price" type="number" value={item.price} onChange={handleItem} name="price"/>
        </div>
        <div>
          <Select id="category" defaultValue={[Categories[5]]} isMulti name="category" options={Categories} className="basic-multi-select" classNamePrefix="select" onChange={handleCategory
          }/>
        </div>
        <button type="submit" onClick={handleSubmit}>Submit</button>
      </form>
    </div>
  );
};

export default CreateItemPost;
