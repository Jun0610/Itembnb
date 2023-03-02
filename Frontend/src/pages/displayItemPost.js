import React, {useEffect, useContext} from 'react';
import Select from 'react-select';
import ImageUploading from 'react-images-uploading';
import ItemService from '../tools/itemsService';
import { confirmAlert } from 'react-confirm-alert';
import {useParams, useNavigate} from "react-router-dom";
import 'react-confirm-alert/src/react-confirm-alert.css'; 
import userContext from '../contexts/userContext';

const DisplayItemPost = () => {
  const {id} = useParams();
  const [item, setItem] = React.useState({});
  const [isEditing, setIsEditing] = React.useState(false);
  const [categories, setCategories] = React.useState([]);

  const [imagesBar, setImagesBar] = React.useState([]);
  const [imagesDisplay, setImagesDisplay] = React.useState([]);
  const maxNumber = 20;

  const authUser = React.useContext(userContext);
  const nav = useNavigate();

  const onChangeImagesBar = (imageList, addUpdateIndex) => {
    const lenBfor = imagesBar.length;
    setImagesBar([...imageList]);

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

  useEffect(() => {
    // call API to fetch the item data
    async function fetchCategories() {
        const data = await ItemService.getAllCategories();
        setCategories(data);
        return data;
    }

    async function fetchItem() {
        console.log("fetch item");
        await ItemService.getItem(id).then((data) => {
            console.log('data:', data.data);
            setItem(data.data);
            setImagesBar(data.data.images);
            setImagesDisplay(data.data.images);
            console.log("data category: ", data.data.category);
        });
    }

      fetchCategories().then(fetchItem());
  }, []);

  const onItemChange = (e) => {
    setItem({
        ...item,
        [e.target.id]: e.target.value
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

  const handleDeleteItem = () => {
    confirmAlert({
        title: 'Confirm to delete',
        message: "Are you sure you want to delete this item?",
        buttons: [
            {
                label: 'Yes',
                onClick: async () => {await ItemService.deleteItem(item, authUser.user.user._id).then(() => alert("Successfully deleted!")); nav(`/user/${authUser.user.user._id}`)}

            }, 
            {
                label: 'No',
                onClick: () => {},
            }
        ],
    });
  }

  const handleSaveItem = () => {
    async function editItem() {
        await ItemService.editItem(item, authUser.user.user._id).then(alert("Edit item successfully!"));
    }
    //handle validation
    if (!item.description && !item.name && !item.price && !item.category) {
        alert("Please make sure all of these fields are filled!");
        return;
    } 
    if (!item.images && item.images.length === 0) {
        alert("Make sure there is at least one image!");
        return;
    }
    editItem();
  }

  return (
    <div>
        <div className="m-3 font-bold" style={{color: "#F0D061"}}>Your Item Post</div>
        <div>
            <button className="hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-full m-2" style={{backgroundColor: '#F7D65A'}} onClick={() => { isEditing ? handleSaveItem() : setIsEditing(!isEditing)}}>{isEditing ? 'Save' : 'Edit'}</button>
            <button className="hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-full m-2" style={{backgroundColor: '#F7D65A'}} onClick={() => handleDeleteItem()}>Delete</button>
        </div>
        <div className='m-3'>
            <div className="flex gap-6 mb-6">
                <div className="flex-none">
                    <label htmlFor='name' className="font-bold" style={{color: "#F0D061"}}>Name</label>
                    <input className="mt-1 block px-3 rounded-md" id="name" type="text" value={item.name} name="name" readOnly={isEditing ? false : true} style={isEditing ? {background: "white", color: "black"} : {background: "#F1F1F1", color: "#545454"}} onChange={onItemChange}/>
                </div>
                <div className="flex-auto">
                    <label htmlFor='name' className="font-bold" style={{color: "#F0D061"}}>Description</label>
                    <textarea className="mt-1 border rounded-md w-full text-sm block px-3 py-2" id="description" type="text" value={item.description} readOnly={isEditing ? false : true} rol={10} style={isEditing ? {background: "white", color: "black"} : {background: "#F1F1F1", color: "#545454"}} onChange={onItemChange}/>
                </div>
            </div>
            <div className="flex gap-6 mb-6">        
                <div className="flex-none">
                    <label htmlFor='name' className="font-bold" style={{color: "#F0D061"}}>Price</label>
                    <input id="price" className="mt-1 block px-3 rounded-md" type="number" value={item.price} readOnly={isEditing ? false: true} style={isEditing ? {background: "white", color: "black"} : {background: "#F1F1F1", color: "#545454"}} onChange={onItemChange}/>
                </div>
                <div className="flex-auto">
                    <label htmlFor='name' className="font-bold" style={{color: "#F0D061"}}>Category tags</label>
                    {item.category ? item.category.map((e, i) => (<div key={i}>{e}</div>)) : undefined}
                    <Select isDisabled={!isEditing} className="mt-1 block basic-multi-select" id="category" isMulti name="category" options={categories} classNamePrefix="select" onChange={handleCategory}/>
                </div>
            </div>
        </div>
        <div style={isEditing ? undefined : {pointerEvents: 'none'}}>
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
    </div>
  )
}

export default DisplayItemPost;