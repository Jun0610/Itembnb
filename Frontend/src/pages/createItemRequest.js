import React, {useEffect} from "react";
import Select from 'react-select';
import ItemService from "../tools/itemsService";
import ImageUploading from 'react-images-uploading';

const CreateItemRequest = () => {
  const [request, setRequest] = React.useState({
    name: '',
    description: '',
  });

  const handleItem = (e) => {
    setItem({
      ...item, 
      [e.target.id]: e.target.value, 
    });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(item);
    ItemService(item);
    alert("Item Successfully posted!");
    setItem({
      name: '',
      description: '',
      price: 0,
      revservHist: [],
      unavailList: [],
      review: [],
      category: [],
      images: [],
    });
  }

  return (
    <div>
      <div className="m-3 text-xl font-bold" style={{color: "#F0D061"}}>Request an Item</div>
      <div className="m-3">
        <form onSubmit={handleSubmit}>
          <div className="flex gap-6 mb-6">
            <div className="flex-none">
              <label htmlFor="name" className="font-bold" style={{color: "#F0D061"}}>Name</label>
              <input className="mt-1 block px-3 border border-slate-300 py-2 rounded-md text-sm shadow-sm placeholder-slate-400 bg-white" id="name" type="text" value={item.name} onChange={handleItem} name="name"/>
            </div>
            <div className="flex-auto">
              <label htmlFor="description" className="font-bold" style={{color: "#F0D061"}}>Description</label>
              <textarea className="mt-1 border border-slate-300 rounded-md w-full text-sm shadow-sm placeholder-slate-400 block px-3 py-2 bg-white" id="description" rol={10} value={item.description} onChange={handleItem} name="description"/>
            </div>
          </div>
          <button className="hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-full" style={{backgroundColor: '#F7D65A'}} type="submit" onClick={handleSubmit}>Submit</button>
        </form>
      </div>
    </div>
  );
};

export default CreateItemRequest;
