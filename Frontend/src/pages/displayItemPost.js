import React, {useEffect, useContext} from 'react';
import Select from 'react-select';
import ImageUploading from 'react-images-uploading';
import ItemService from '../tools/itemsService';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; 
import userContext from '../contexts/userContext';
import {faAppleAlt} from '@fortawesome/free-solid-svg-icons';

const DisplayItemPost = ({ itemProp }) => {
  const [item, setItem] = React.useState(itemProp);
  const [isEditing, setIsEditing] = React.useState(false);
  const [images, setImages] = React.useState([]);
  const [categories, setCategories] = React.useState([]);
  const maxNumber = 20;

  const currentC = [];

  const authUser = React.useContext(userContext);
  

  useEffect(() => {
    // call API to fetch the item data
    async function fetchCategories() {
        const data = await ItemService.getAllCategories();
        setCategories(data);
        return data;
    }

    async function fetchItem() {
        await ItemService.getItem(authUser.user.user._id, itemProp._id).then((data) => {
            console.log(data);
            setItem(data);
            setImages(data.images);
            return data.category;
        });
        /*
        await ItemService.getItemE().then((data) => {
            console.log(data);
            setItem(data)
            setImages(data.images);
            return data.category;
        });*/
    }

      fetchCategories().then((categories) => {
        fetchItem().then((cats) => {
            console.log("data category: ", cats);
            for (const c of cats) {
                categories.forEach((e) => {
                    console.log(e['value'], ": ", c['value'])
                    if (e['value'] === c['value']) currentC.push(e);
                });
            }
            console.log("current c: ", currentC);
          });
        } 
      );
  }, []);

  const onItemChange = (e) => {
    setItem({
        ...item,
        [e.target.id]: e.target.value
    });
  }

  const onChangeImage = (imageList, addUpdateIndex) => {
    console.log(imageList, addUpdateIndex);
    setImages(imageList);
    item.images = imageList;
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
                onClick: () => ItemService.deleteItem(item, authUser.user.user._id)
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
        <div style={isEditing ? undefined : {pointerEvents: 'none'}}>
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
                {imageList[0] ? <img src={imageList[0]['data_url']} className="mx-auto h-80" alt="first" width="100%" height="100%" style={{objectFit: "cover"}} onClick={onImageUpdate} onDoubleClick={() => onImageRemove(0)}/> : 
                <div className="bg-slate-300 font-semibold text-slate-600 h-80 rounded-l-lg flex justify-center items-center"
                    style={isDragging ? { backgroundColor: '#d99932' } : {cursor: "pointer"}}
                    onClick={onImageUpload}
                    {...dragProps}
                >
                    Click or Drop here
                </div>}
                </div>
                <div className="row-span-1 col-span-1">
                {imageList[1] ? <img src={imageList[1]['data_url']} className="mx-auto h-36" alt="first" width="100%" height="100%" style={{objectFit: "cover"}} onClick={onImageUpdate} onDoubleClick={() => onImageRemove(1)}/> : <div className="bg-slate-300 font-semibold text-slate-600 h-36 flex justify-center items-center"
                    style={isDragging ? { backgroundColor: '#d99932' } : {cursor: "pointer"}}
                    onClick={onImageUpload} onDoubleClick={onImageRemove}
                    {...dragProps}
                >
                    Click or Drop here
                </div>}
                </div>
                <div className="row-span-1 col-span-1">
                {imageList[2] ? <img src={imageList[2]['data_url']} className="mx-auto h-36" alt="first" width="100%" height="100%" style={{objectFit: "cover"}} onClick={onImageUpdate} onDoubleClick={() => onImageRemove(2)}/> : <div className="bg-slate-300 font-semibold text-slate-600 h-36 flex justify-center items-center"
                    style={isDragging ? { backgroundColor: '#d99932' } : {cursor: "pointer"}}
                    onClick={onImageUpload} onDoubleClick={onImageRemove}
                    {...dragProps}
                >
                    Click or Drop here
                </div>}
                </div>
                <div className="row-span-1 col-span-1">
                {imageList[3] ? <img src={imageList[3]['data_url']} className="mx-auto h-36" alt="first" width="100%" height="100%" style={{objectFit: "cover"}} onClick={onImageUpdate} onDoubleClick={() => onImageRemove(3)}/> : <div className="bg-slate-300 font-semibold text-slate-600 h-36 flex justify-center items-center rounded-tr-lg"
                    style={isDragging ? { backgroundColor: '#d99932' } : {cursor: "pointer"}}
                    onClick={onImageUpload} onDoubleClick={onImageRemove}
                    {...dragProps}
                >
                    Click or Drop here
                </div>}
                </div>
                <div className="row-span-1 col-span-1">
                {imageList[4] ? <img src={imageList[4]['data_url']} className="mx-auto h-36" alt="first" width="100%" height="100%" style={{objectFit: "cover"}} onClick={onImageUpdate} onDoubleClick={() => onImageRemove(4)}/> : <div className="bg-slate-300 font-semibold text-slate-600 h-36 flex justify-center items-center rounded-br-lg"
                    style={isDragging ? { backgroundColor: '#d99932' } : {cursor: "pointer"}}
                    onClick={onImageUpload} onDoubleClick={onImageRemove}
                    {...dragProps}
                >
                    Click or Drop here
                </div>}
                </div>
            </div>
            )}
            </ImageUploading>
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
                    <Select isDisabled={!isEditing} className="mt-1 block basic-multi-select" id="category" defaultValue={[categories[5]]} isMulti name="category" options={categories} classNamePrefix="select" onChange={handleCategory}/>
                </div>
            </div>
        </div>
    </div>
  )
}

export default DisplayItemPost;