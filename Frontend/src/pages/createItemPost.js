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
    alert("Item Successfully posted!");
    setItem({
      name: '',
      description: '',
      price: 0,
      revservHist: [],
      unavailList: [],
      review: [],
      category: [],
    });
  }

  return (
    <div>
      <div class="m-3 text-xl font-bold" style={{color: "#F0D061"}}> Create a new Item Post.</div>
      <div class="m-3">
        <form onSubmit={handleSubmit}>
          <div class="flex gap-6 mb-6">
            <div class="flex-none">
              <label htmlFor="name">Name</label>
              <input class="mt-1 block px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400" id="name" type="text" value={item.name} onChange={handleItem} name="name"/>
            </div>
            <div class="flex-auto">
              <label htmlFor="description">Description</label>
              <textarea class="border border-slate-300 rounded-md w-full text-sm shadow-sm placeholder-slate-400 block px-3 py-2 bg-white" id="description" rol={10} value={item.description} onChange={handleItem} name="description"/>
            </div>
          </div>
          <div class="flex gap-6 mb-6">
            <div class="flex-none">
              <label htmlFor="price">Price</label>
              <input class="mt-1 block border border-slate-300 rounded-md" id="price" type="number" value={item.price} onChange={handleItem} name="price"/>
            </div>
            <div class="flex-auto">
              <label htmlFor="catogory">Category</label>
              <Select class="mt-1 block" id="category" defaultValue={[Categories[5]]} isMulti name="category" options={Categories} className="basic-multi-select" classNamePrefix="select" onChange={handleCategory
              }/>
            </div>
          </div>
          <button class="hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-full" style={{backgroundColor: '#F7D65A'}} type="submit" onClick={handleSubmit}>Submit</button>
        </form>
      </div>
    </div>
  );
};

export default CreateItemPost;
