import React from "react";
import Select from 'react-select';
import ItemService from "../tools/itemsService";
import ImageUploading from 'react-images-uploading';

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

  const [images, setImages] = React.useState([]);
  const maxNumber = 20;

  const onChangeImage = (imageList, addUpdateIndex) => {
    console.log(imageList, addUpdateIndex);
    setImages(imageList);
  }

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
    ItemService(item);
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
      <div className="m-3 text-xl font-bold" style={{color: "#F0D061"}}> Create a new Item Post.</div>
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
          <div className="flex gap-6 mb-6">
            <div className="flex-none">
              <label htmlFor="price" className="font-bold" style={{color: "#F0D061"}}>Price</label>
              <input className="mt-1 block border border-slate-300 rounded-md" id="price" type="number" value={item.price} onChange={handleItem} name="price"/>
            </div>
            <div className="flex-auto">
              <label htmlFor="catogory" className="font-bold" style={{color: "#F0D061"}}>Category</label>
              <Select className="mt-1 block basic-multi-select" id="category" defaultValue={[Categories[5]]} isMulti name="category" options={Categories} classNamePrefix="select" onChange={handleCategory
              }/>
            </div>
          </div>
          <button className="hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-full" style={{backgroundColor: '#F7D65A'}} type="submit" onClick={handleSubmit}>Submit</button>
        </form>
      </div>
      <div className="m-3 text-xl font-bold" style={{color: "#F0D061"}}>
        Upload your images here. 
      </div>
      <div>
      <ImageUploading
        multiple
        value={images}
        onChange={onChangeImage}
        maxNumber={maxNumber}
        dataURLKey="data_url"
      >
        {({
          imageList,
          onImageUpload,
          onImageRemoveAll,
          onImageUpdate,
          onImageRemove,
          isDragging,
          dragProps,
        }) => (
          // write your building UI
          <div className="grid grid-rows-2 grid-flow-col gap-4 m-4 h-80">
            <div className="row-span-2 col-span-2">
              {imageList[0] ? <img src={imageList[0]['data_url']} className="mx-auto h-80" img="first image" width="100%" height="100%" style={{objectFit: "cover"}}/> : <div className="bg-secondary h-80"
                style={isDragging ? { backgroundColor: 'red' } : {cursor: "pointer"}}
                onClick={onImageUpload} 
                {...dragProps}
              >
                Click or Drop here
              </div>}
            </div>
            <div className="row-span-1 col-span-1">
              {imageList[1] ? <img src={imageList[1]['data_url']} className="mx-auto h-36" img="first image" width="100%" height="100%" style={{objectFit: "cover"}}/> : <div className="bg-secondary h-36"
                style={isDragging ? { backgroundColor: 'red' } : {cursor: "pointer"}}
                onClick={onImageUpload} 
                {...dragProps}
              >
                Click or Drop here
              </div>}
            </div>
            <div className="bg-secondary row-span-1 col-span-1"
              style={isDragging ? { backgroundColor: 'red' } : {cursor: "pointer"}}
              onClick={onImageUpload} 
              {...dragProps}
            >
              Click or Drop here
            </div>
            <div className="bg-secondary row-span-1 col-span-1"
              style={isDragging ? { backgroundColor: 'red' } : {cursor: "pointer"}}
              onClick={onImageUpload} 
              {...dragProps}
            >
              Click or Drop here
            </div>
            <div className="bg-secondary row-span-1 col-span-1"
              style={isDragging ? { backgroundColor: 'red' } : {cursor: "pointer"}}
              onClick={onImageUpload} 
              {...dragProps}
            >
              Click or Drop here
            </div>
          </div>
        )}
      </ImageUploading>
      </div>
    </div>
  );
};

export default CreateItemPost;
