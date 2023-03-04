import React, { useEffect } from 'react';
import Select from 'react-select';
import ItemService from '../tools/itemsService';
import { confirmAlert } from 'react-confirm-alert';
import { useParams, useNavigate } from "react-router-dom";
import 'react-confirm-alert/src/react-confirm-alert.css';
import userContext from '../contexts/userContext';

const DisplayItemPost = () => {
    const { id } = useParams();
    const [item, setItem] = React.useState({});
    const [isEditing, setIsEditing] = React.useState(false);
    const [categories, setCategories] = React.useState([]);

    const [imagesBar, setImagesBar] = React.useState([]);
    const [imagesBarFile, setImagesBarFile] = React.useState([]);
    const [imagesDisplay, setImagesDisplay] = React.useState([]);
    const [imagesDisplayFile, setImagesDisplayFile] = React.useState([]);
    const [currentImgIdx, setCurrentImgIdx] = React.useState(null);

    const authUser = React.useContext(userContext);
    const nav = useNavigate();

    useEffect(() => {
        // call API to fetch the item data
        async function fetchCategories() {
            const data = await ItemService.getAllCategories();
            setCategories(data);
            return data;
        }

        async function fetchItem() {
            await ItemService.getItem(id).then((data) => {
                setItem(data.data);
                setImagesBar(data.data.images);
                setImagesBarFile(data.data.images);
                setImagesDisplay(data.data.images);
                setImagesDisplayFile(data.data.images);
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
        if (o.length > 3) {
            alert("Please only select at most 3 categories!");
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

    const handleImageInsert = (e) => {
        const cib = [];
        const cibf = [];
        if (e.target.files) {
            for (var file of e.target.files) {
                if (file.type !== "image/png" && file.type !== "image/jpeg") {
                    alert("File type is wrong! Please only upload png or jpeg files.");
                    return;
                }
                let img = file;
                cib.push(URL.createObjectURL(img));

                cibf.push(img);
            }
            setImagesBar([...imagesBar, ...cib]);
            setImagesBarFile([...imagesBarFile, ...cibf]);
        }
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

    const handleRemoveAllImage = (key) => {
        setImagesBar([]);
        setImagesBarFile([]);
        setImagesDisplay([]);
        setImagesDisplayFile([]);
    }

    const handleDeleteItem = () => {
        confirmAlert({
            title: 'Confirm to delete',
            message: "Are you sure you want to delete this item?",
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => { await ItemService.deleteItem(item, authUser.user.user._id).then(() => alert("Successfully deleted!")); nav(`/user/${authUser.user.user._id}`) }

                },
                {
                    label: 'No',
                    onClick: () => { },
                }
            ],
        });
    }

    const handleSaveItem = () => {
        item.images = imagesDisplayFile;
        async function editItem() {
            await ItemService.editItem(item, authUser.user.user._id).then(alert("Edit item successfully!"));
            setIsEditing(!isEditing);
        }
        //handle validation

        if (item.description === '' || item.name === '') {
            alert("Please make sure all of these fields are filled!");
            return;
        }
        if (!item.images && item.images.length === 0) {
            alert("Make sure there is at least one image!");
            return;
        }
        if (item.category.length > 3) {
            alert("Please make sure to select at most 3 categories!");
        }
        editItem();

    }

    return (
        <div>
            <div className="m-3 font-bold" style={{ color: "#F0D061" }}>Your Item Post</div>
            <div>
                <button className="hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-full m-2" style={{ backgroundColor: '#F7D65A' }} onClick={() => { isEditing ? handleSaveItem() : setIsEditing(!isEditing) }}>{isEditing ? 'Save' : 'Edit'}</button>
                <button className="hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-full m-2" style={{ backgroundColor: '#F7D65A' }} onClick={() => handleDeleteItem()}>Delete</button>
            </div>
            <div className='m-3'>
                <div className="flex gap-6 mb-6">
                    <div className="flex-none">
                        <label htmlFor='name' className="font-bold" style={{ color: "#F0D061" }}>Name</label>
                        <input className="mt-1 block px-3 rounded-md border border-slate-300 py-2 rounded-md" id="name" type="text" value={item.name} name="name" readOnly={isEditing ? false : true} style={isEditing ? { background: "white", color: "black" } : { background: "#F1F1F1", color: "#545454" }} onChange={onItemChange} />
                    </div>
                    <div className="flex-auto">
                        <label htmlFor='name' className="font-bold" style={{ color: "#F0D061" }}>Description</label>
                        <textarea className="mt-1 border rounded-md w-full text-sm block px-3 py-2" id="description" type="text" value={item.description} readOnly={isEditing ? false : true} rol={10} style={isEditing ? { background: "white", color: "black" } : { background: "#F1F1F1", color: "#545454" }} onChange={onItemChange} />
                    </div>
                </div>
                <div className="flex gap-6 mb-6">
                    <div className="flex-none">
                        <label htmlFor='name' className="font-bold" style={{ color: "#F0D061" }}>Price</label>
                        <input id="price" className="mt-1 block border border-slate-300 py-2 rounded-md" type="number" value={item.price} min="1" readOnly={isEditing ? false : true} style={isEditing ? { background: "white", color: "black" } : { background: "#F1F1F1", color: "#545454" }} onChange={onItemChange} />
                    </div>
                    <div className="flex-auto">
                        <label htmlFor='name' className="font-bold" style={{ color: "#F0D061" }}>Category tags</label>
                        <div className='grid grid-flow-col auto-cols-max'>{item.category ? item.category.map((e, i) => (<div key={i} className="mr-4">{e}</div>)) : undefined}</div>
                        <Select isDisabled={!isEditing} className="mt-1 block basic-multi-select" id="category" isMulti name="category" options={categories} classNamePrefix="select" onChange={handleCategory} />
                    </div>
                </div>
            </div>
            <div style={isEditing ? undefined : { pointerEvents: 'none' }}>
                <div className="m-3 text-xl font-bold" style={{ color: "#F0D061" }}>Images Preview Section (Double click on the preview image to delete it)</div>
                <div className="mb-4 h-80 cardcontainer">
                    <div className="grid grid-flow-col auto-cols-max h-80">
                        {imagesDisplay.map((e, i) => (
                            <div key={i} className="grid grid-flow-col">
                                <div className="h-80 w-2" onDragOver={handleDrag} onDrop={(e) => handleBeforeInsert(i)}></div>
                                <div className="ml-3 bg-cyan-700 h-80">
                                    <img className="object-cover" style={{ height: '100%', margin: "auto", display: "block" }} key={i} src={e} onDoubleClick={() => handleRemoveImageDisplay(i)} />
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
                    <div className="m-3 text-xl font-bold" style={{ color: "#F0D061" }}> Image Bar (Upload your images here!)</div>
                    <input id="photos" type="file" multiple className="btn btn-primary btn-lg m-3  rounded-lg" onChange={handleImageInsert} style={{ backgroundColor: "#F0D061", border: "none" }} name="Click here to upload image"></input>
                    &nbsp;
                    <button className="btn btn-primary btn-lg m-3" onClick={handleRemoveAllImage} style={{ backgroundColor: "#F0D061", border: "none" }}>Remove all images</button>
                    <div className="grid grid-flow-col auto-cols-max h-60" style={imagesBar.length > 0 ? undefined : { display: "none" }}>
                        {imagesBar.map((imagesrc, i) => (
                            <div className="ml-3 bg-cyan-700 h-16 w-56" style={{ display: "flex", flexFlow: "row wrap" }}>
                                <img key={i} src={imagesrc} className="auto" style={{ width: '100%', height: '12rem', objectFit: "cover" }} onDragStart={() => setCurrentImgIdx(i)} draggable="true" />
                                <i className="fa-solid fa-trash mt-1 icon-3x" style={{ cursor: "pointer" }} onClick={() => handleRemoveImageBar(i)}></i>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                </div>
            </div>
        </div>
    )
}

export default DisplayItemPost;