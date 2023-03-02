import React, {useEffect, useContext} from "react";
import ItemService from "../tools/itemsService";
import Select from 'react-select';
import ImageUploading from 'react-images-uploading';

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
  const maxNumber = 20;

  const [imagesBar, setImagesBar] = React.useState([]);
  const [imagesDisplay, setImagesDisplay] = React.useState([]);

  const [categories, setCategories] = React.useState([]);

  useEffect(() => {
    async function fetchCategories() {
      const data = await ItemService.getAllCategories();
      setCategories(data);
    }

    fetchCategories();
  }, []);

  const onChangeImagesBar = (imageList, addUpdateIndex) => {
    console.log("in change image bar");
    const lenBfor = imagesBar.length;
    setImagesBar([...imageList]);
    console.log(imagesBar);

    // delete images that are in the imageDisplay
    if (lenBfor > imageList.length) {
      const newImageDisplay = [];
      for (const id of imagesDisplay) {
        var flag = false;
        for (const ib of imageList) {
          if (id['data_url'] === ib['data_url']) {
            flag = true;
            break;
          }
        }
        if(flag) newImageDisplay.push(id);
      }
      setImagesDisplay(newImageDisplay);
    }
  }

  const onChangeImagesDisplay = (imageList, addUpdateIndex) => {
    const imagesDisplayCopy = [];
    imagesDisplay.forEach(e => imagesDisplayCopy.push(e));
    setImagesDisplay([...imageList]);

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

    item.images = imagesDisplay;
    item.ownerId = authUser.user.user._id;
    await ItemService.postItem(item, authUser.user.user._id).then((res) => {
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
        ownerId: '',
      });
      setImagesBar([]);
      setImagesDisplay([]);
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
              <label htmlFor="category" className="font-bold" style={{color: "#F0D061"}}>Category</label>
              <Select className="mt-1 block basic-multi-select" id="category" defaultValue={[categories[5]]} isMulti name="category" options={categories} classNamePrefix="select" onChange={handleCategory
              }/>
            </div>
          </div>
          <button className="hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-full" style={{backgroundColor: '#F7D65A'}} type="submit" onClick={handleSubmit}>Submit</button>
        </form>
      </div>
      <div className="m-3 text-xl font-bold" style={{color: "#F0D061"}}>
        Upload your images here. (Double click on the preview image to delete it)
      </div>
      <div className="mb-4 h-80">
        <ImageUploading multiple value={imagesDisplay} onChange={onChangeImagesDisplay} acceptType={['jpg', 'gif', 'png']} allowNonImageType={false} dataURLKey="data_url">{
          ({
            imageList,
            onImageUpload,
            onImageRemoveAll,
            onImageUpdate,
            onImageRemove,
            isDragging,
            dragProps,
            errors,
          }) => (!errors ? <div className="grid grid-flow-col auto-cols-max h-80">
            {imageList.map((image, index) => (
                <div key={index}>
                  <div className="m-3 bg-cyan-700 h-80 w-92">
                    <img src={image['data_url']} alt="" className="object-cover" style={{height: '100%', margin: "auto", display: "block"}} onDoubleClick={() => onImageRemove(index)}/>
                  </div>
                </div>
            ))}
            <div className="m-3 bg-slate-400 h-80 w-92 items-center text-center rounded-lg" style={isDragging ? { backgroundColor: '#d99932' } : {cursor: "pointer"}} {...dragProps}>
              <div className="p-3 text-white">Drag pictures from Image Bar to preview!</div>
            </div>
          </div> : 
          errors && 
          <div>
            {errors.acceptType && <span onClick={onImageUpload} style={{cursor: "pointer"}}>Your selected file type is not allow</span>}
            {errors.maxFileSize && <span onClick={onImageUpload} style={{cursor: "pointer"}}>Selected file size exceed maxFileSize</span>}
            {errors.resolution && <span onClick={onImageUpload} style={{cursor: "pointer"}}>Selected file is not match your desired resolution</span>}
          </div>)
        }</ImageUploading>
      </div>
      <div>
      <ImageUploading
        multiple
        value={imagesBar}
        onChange={onChangeImagesBar}
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
          <div>
            <button className="btn btn-primary btn-lg m-3" onClick={onImageUpload} style={{backgroundColor: "#F0D061", border: "none"}}>Click here to upload image</button>
            &nbsp;
            <button className="btn btn-primary btn-lg m-3" onClick={onImageRemoveAll} style={{backgroundColor: "#F0D061", border: "none"}}>Remove all images</button>
            <div className="grid grid-flow-col auto-cols-max h-60" style={imagesBar.length > 0 ? {maxHeight: "32rem", overflowX: "scroll", overflowY: "hidden"} : {display: "None"}}>            
              {imageList.map((image, index) => (
                <div key={index}>
                  <div className="ml-3 bg-cyan-700 h-16 w-56" style={{display: "flex", flexFlow: "row wrap"}}>
                  <img src={image['data_url']} alt="" className="auto" style={{width: '100%', height: '12rem', objectFit: "cover"}}/>
                  <i className="fa-solid fa-trash mt-1 icon-3x" style={{cursor: "pointer"}} onClick={() => onImageRemove(index)}></i>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </ImageUploading>
      </div>
    </div>
  );
};

export default CreateItemPost;