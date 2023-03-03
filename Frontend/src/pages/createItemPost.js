import React, {useEffect, useContext} from "react";
import ItemService from "../tools/itemsService";
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import userContext from '../contexts/userContext';

const CreateItemPost = () => {
  const authUser = useContext(userContext);

  const [item, setItem] = React.useState({
    name: '',
    description: '',
    price: 0,
    revservHist: [],
    unavailList: [],
    review: [],
    category: [],
    images: [],
    ownerId: '',
  });

  const [imagesBar, setImagesBar] = React.useState([]);
  const [imagesBarFile, setImagesBarFile] = React.useState([]);
  const [imagesDisplay, setImagesDisplay] = React.useState([]);
  const [imagesDisplayFile, setImagesDisplayFile] = React.useState([]);
  const [currentImgIdx, setCurrentImgIdx] = React.useState(null);
  const [categories, setCategories] = React.useState([]);

  const nav = useNavigate();

  useEffect(() => {
    async function fetchCategories() {
      const data = await ItemService.getAllCategories();
      setCategories(data);
    }

    fetchCategories();
  }, []);

  // handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    }

  const handleEndDrag = (e) => {
    setImagesDisplay([...imagesDisplay, imagesBar[currentImgIdx]]);

    let reader = new FileReader();
    reader.readAsDataURL(imagesBarFile[currentImgIdx]);
    reader.onload = () => {
        setImagesDisplayFile([...imagesDisplayFile, reader.result]);
    }
    setCurrentImgIdx(null);
  }

  const handleItem = (e) => {
    setItem({
      ...item, 
      [e.target.id]: e.target.value, 
    });
  }

  const handleCategory = (o) => {
    if (o.length > 3) {
      alert("Please only choose at most 3 categories!");
      o.pop();
      return;
    }
    var categories = [];
    o.forEach((element) => categories.push(element['value']));
    setItem({
      ...item, 
      category: categories,
    })
  }

  const handleRemoveImageDisplay = (key) => {
    const newImageDisplay = [];
    const newImagesDisplayFile = [];
    for (let i = 0; i < imagesDisplay.length; i++) {
      if (i === key) {
        continue;
      } else {
        newImageDisplay.push(imagesDisplay[i]);
        newImagesDisplayFile.push(imagesDisplayFile[i]);
      }
    }
    setImagesDisplay(newImageDisplay);
    setImagesDisplayFile(newImagesDisplayFile);
    setCurrentImgIdx(null);
  }

  const handleRemoveImageBar = (key) => {
    const newImageBar = [];
    const newImagesBarFile = [];
    const removedImage = imagesBar[key];
    for (let i = 0; i < imagesBar.length; i++) {
      if (i === key) {
        continue;
      } else {
        newImageBar.push(imagesBar[i]);
        newImagesBarFile.push(imagesBarFile[i]);
      }
    }
    setImagesBar(newImageBar);
    setImagesBarFile(newImagesBarFile);

    // find if the image exist in imagesDisplay
    const newImageDisplay = [];
    const newImagesDisplayFile = [];
    for (let i = 0; i < imagesDisplay.length; i++) {
      if (imagesDisplay[i] === removedImage) {
        continue;
      } else {
        newImageDisplay.push(imagesDisplay[i]);
        newImagesDisplayFile.push(imagesDisplayFile[i]);
      }
    }
    setImagesDisplay(newImageDisplay);
    setImagesDisplayFile(newImagesDisplayFile);
    setCurrentImgIdx(null);
  }

  const handleImageInsert = (e) => {
    const cib = [];
    const cibf = [];
    if (e.target.files) {
      for (var file of e.target.files) {
        let img = file;
        cib.push(URL.createObjectURL(img));
        
        cibf.push(img);
      }
      setImagesBar([...imagesBar, ...cib]);
      setImagesBarFile([...imagesBarFile, ...cibf]);
    }
  }

  const handleBeforeInsert = (key) => {
    let reader = new FileReader();
    reader.readAsDataURL(imagesBarFile[currentImgIdx]);
    reader.onload = () => {
      const newImagesFile = [];
      for (var i = 0; i < imagesDisplayFile.length; i++) {
        if (i === key) {
          newImagesFile.push(reader.result);
        }
        newImagesFile.push(imagesDisplayFile[i]);
      }
      setImagesDisplayFile(newImagesFile);
    }

    const newImages = [];
    for (var i = 0; i < imagesDisplay.length; i++) {
      if (i === key) {
        newImages.push(imagesBar[currentImgIdx]);
      }
      newImages.push(imagesDisplay[i]);
    }
    setImagesDisplay(newImages);
    setCurrentImgIdx(null);
  }

  const handleRemoveAllImage = () => {
    setImagesBar([]);
    setImagesBarFile([]);
    setImagesDisplay([]);
    setCurrentImgIdx(null);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (item.category.length > 3 ) {
      alert("Please only select at most 3 categories!");
      return;
    } else if (item.category.length === 0) {
      alert("Please at least select one category!");
      return;
    }
    if (imagesBar.length === 0) {
      alert("Please upload/choose at least one image!");
      return;
    }
    item.images = imagesDisplayFile;
    item.ownerId = authUser.user.user._id;
    await ItemService.postItem(item, authUser.user.user._id).then((res) => {
      alert("Item Successfully posted!");
      nav('/');
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
              <input className="mt-1 block border border-slate-300 rounded-md" id="price" type="number" value={item.price} min="1" onChange={handleItem} name="price"/>
            </div>
            <div className="flex-auto">
              <label htmlFor="category" className="font-bold" style={{color: "#F0D061"}}>Category</label>
              <Select className="mt-1 block basic-multi-select" id="category" defaultValue={[categories[5]]} isMulti name="category" options={categories} classNamePrefix="select" onChange={handleCategory}/>
            </div>
          </div>
          <button className="hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-full" style={{backgroundColor: '#F7D65A'}} type="submit" onClick={handleSubmit}>Submit</button>
        </form>
      </div>
      <div className="m-3 text-xl font-bold" style={{color: "#F0D061"}}>
        Image Preview Section (Double click on the preview image to delete it)
      </div>
      <div className="mb-4 h-80 cardcontainer">
        <div className="grid grid-flow-col auto-cols-max h-80">
            {imagesDisplay.map((e, i) => (
              <div key={i} className="grid grid-flow-col">   
                <div className="h-80 w-2" onDragOver={handleDrag} onDrop={(e) => handleBeforeInsert(i)}></div>
                <div className="ml-3 bg-cyan-700 h-80">
                  <img className="object-cover" style={{height: '100%', margin: "auto", display: "block"}} key={i} src={e} onDoubleClick={() => handleRemoveImageDisplay(i)}/>
                </div>
            </div>))}
          <div id="form-file-upload" className="ml-3 grid grid-flow-col auto-cols-max h-80">
            <label id="label-file-upload" htmlFor="input-file-upload" className="rounded-lg p-3 bg-slate-300" onDragOver={handleDrag} onDrop={handleEndDrag}>
              <div className="text-white">Drag and drop an image from the Image Bar!</div> 
            </label>
          </div>
        </div>
      </div>
      <div>
        <div className="m-3 text-xl font-bold" style={{color: "#F0D061"}}>Image Bar (Upload your images here!)</div>
        <input id="photos" type="file" multiple className="btn btn-primary btn-lg m-3  rounded-lg" onChange={handleImageInsert} style={{backgroundColor: "#F0D061", border: "none"}} name="Click here to upload image"></input>
         &nbsp;
        <button className="btn btn-primary btn-lg m-3" onClick={handleRemoveAllImage} style={{backgroundColor: "#F0D061", border: "none"}}>Remove all images</button>
        <div className="grid grid-flow-col auto-cols-max h-60" style={imagesBar.length > 0 ? undefined : {display: "none"}}>
          {imagesBar.map((imagesrc, i) => (<div className="ml-3 bg-cyan-700 h-16 w-56" style={{display: "flex", flexFlow: "row wrap"}}>
            <img key={i} src={imagesrc} className="auto" style={{width: '100%', height: '12rem', objectFit: "cover"}} onDragStart={() => setCurrentImgIdx(i)} draggable="true"/>
            <i className="fa-solid fa-trash mt-1 icon-3x" style={{cursor: "pointer"}} onClick={() => handleRemoveImageBar(i)}></i>
          </div>))}
        </div>
      </div>
    </div>
  );
};

export default CreateItemPost;