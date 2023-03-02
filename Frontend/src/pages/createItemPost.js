import React, {useEffect, useContext} from "react";
import ItemService from "../tools/itemsService";
import Select from 'react-select';
import ImageUploading from 'react-images-uploading';
import userContext from "../contexts/userContext";

const CreateItemPost = () => {

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

  const [images, setImages] = React.useState([null * 5]);
  const [image1, setImage1] = React.useState([]);
  const [image2, setImage2] = React.useState([]);
  const [image3, setImage3] = React.useState([]);
  const [image4, setImage4] = React.useState([]);
  const [image5, setImage5] = React.useState([]);
  const maxNumber = 20;

  const [imagesDisplay, setImagesDisplay] = React.useState([]);

  const [categories, setCategories] = React.useState([]);

  const authUser = React.useContext(userContext);
  console.log(authUser.user.user._id);

  useEffect(() => {
    async function fetchCategories() {
      const data = await ItemService.getAllCategories();
      setCategories(data);
    }

    fetchCategories();
  }, []);

  const onChangeImage1 = (imageList, addUpdateIndex) => {
    setImage1(imageList);
    // handle delete
    if ((!imageList || imageList.length === 0) && (images[0] != null)) {
      images[0] = null;

      return;
    }

    // handle insert
    images[0] = imageList[0];
    var flag = false;
    for (const element in imagesDisplay) {
      if (element['data_url'] === imageList[0]['data_url']) {
        flag = true;
        break;
      }
    }
    if (!flag || imagesDisplay.length === 0) setImagesDisplay([...imagesDisplay, imageList[0]]);
  }

  const onChangeImage2 = (imageList, addUpdateIndex) => {
    setImage2(imageList);
    // handle delete
    if ((!imageList || imageList.length === 0) && (images[1] != null)) {
      images[1] = null;
      return;
    }

    // handle insert
    images[1] = imageList[0];
    var flag = false;
    for (const element in imagesDisplay) {
      if (element['data_url'] === imageList[0]['data_url']) {
        flag = true;
        break;
      }
    }
    if (!flag || imagesDisplay.length === 0) setImagesDisplay([...imagesDisplay, imageList[0]]);
  }

  const onChangeImage3 = (imageList, addUpdateIndex) => {
    setImage3(imageList);
    // handle delete
    if ((!imageList || imageList.length === 0) && (images[2] != null)) {
      images[2] = null;
      return;
    }

    // handle insert
    images[2] = imageList[0];
    var flag = false;
    for (const element in imagesDisplay) {
      if (element['data_url'] === imageList[0]['data_url']) {
        flag = true;
        break;
      }
    }
    if (!flag || imagesDisplay.length === 0) setImagesDisplay([...imagesDisplay, imageList[0]]);
  }

  const onChangeImage4 = (imageList, addUpdateIndex) => {
    setImage4(imageList);
    // handle delete
    if ((!imageList || imageList.length === 0) && (images[3] != null)) {
      images[3] = null;
      return;
    }

    // handle insert
    images[3] = imageList[0];
    var flag = false;
    for (const element in imagesDisplay) {
      if (element['data_url'] === imageList[0]['data_url']) {
        flag = true;
        break;
      }
    }
    if (!flag || imagesDisplay.length === 0) setImagesDisplay([...imagesDisplay, imageList[0]]);
  }

  const onChangeImage5 = (imageList, addUpdateIndex) => {
    setImage5(imageList);
    // handle delete
    if ((!imageList || imageList.length === 0) && (images[4] != null)) {
      images[4] = null;
      return;
    }

    // handle insert
    images[4] = imageList[0];
    var flag = false;
    for (const element in imagesDisplay) {
      if (element['data_url'] === imageList[0]['data_url']) {
        flag = true;
        break;
      }
    }
    if (!flag || imagesDisplay.length === 0) setImagesDisplay([...imagesDisplay, imageList[0]]);
  }

  const deleteAllImages = () => {
    setImage1([]);
    setImage2([]);
    setImage3([]);
    setImage4([]);
    setImage5([]);
  }

  const onChangeImageDisplay = (imageList, addUpdateIndex) => {
    const lenBefore = imagesDisplay.length;
    setImagesDisplay(imageList);

    //handle insert
    if (lenBefore < imageList.length) return;

    //handle delete
    if (imageList.length === 0) {
      deleteAllImages();
      return;
    }
    const IMAGE_LIST = [image1[0], image2[0], image3[0], image4[0], image5[0]];
    for (var i = 0; i < 5; i++) {
      var flag = false;
      // for each plot, check if the data_url still exists
      for (const element of imageList) {
        if (IMAGE_LIST[i] && element['data_url'] === IMAGE_LIST[i]['data_url']) {
          flag = true;
          break;
        }
      }

      if (!flag) {
        images[i] = null;
        switch (i) {
          case 0:
            setImage1([]);
            break;
          case 1:
            setImage2([]);
            break;
          case 2:
            setImage3([]);
            break;
          case 3:
            setImage4([]);
            break;
          case 4:
            setImage5([]);
            break;
          default:
            break;
        }
      }
    }
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
    if (imagesDisplay.length === 0) {
      alert("Please upload/choose at least one image!");
      return;
    }
    // check if images are adjacent
    var adjFlag = true;
    console.log(images);
    for (var i = 0; i < images.length; i++) {
      if (images[i] && !adjFlag) {
        alert("Please make sure no empty slots between images!");
        return;
      }
      if (!images[i]) adjFlag = false;
    }
    
    item.ownerId = authUser.user.user._id;
    item.images = imagesDisplay;
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
      });
      deleteAllImages();
      setImages([]);
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
      <div className="grid grid-rows-2 grid-flow-col gap-4 m-4 h-80">
        <div className="row-span-2 col-span-2">
          <ImageUploading value={image1} onChange={onChangeImage1} acceptType={['jpg', 'gif', 'png']} allowNonImageType={false} dataURLKey="data_url">{
            ({
              imageList,
              onImageUpload,
              onImageRemoveAll,
              onImageUpdate,
              onImageRemove,
              isDragging,
              dragProps,
              errors,
            }) => (!errors ? <div>
              {imageList[0] ? <img src={imageList[0]['data_url']} className="rounded-l-lg object-cover mx-auto h-80 flex justify-center items-center" alt="first" width="100%" height="100%" onDoubleClick={() => onImageRemove(0)}/> : 
                <div className="bg-slate-300 font-semibold text-slate-600 h-80 rounded-l-lg flex justify-center items-center"
                  style={isDragging ? { backgroundColor: '#d99932' } : {cursor: "pointer"}}
                  onClick={onImageUpload} 
                  {...dragProps}
                >
              Click or Drop here
            </div>}
            </div> : 
            errors && 
            <div>
              {errors.acceptType && <span onClick={onImageUpload} style={{cursor: "pointer"}}>Your selected file type is not allow</span>}
              {errors.maxFileSize && <span onClick={onImageUpload} style={{cursor: "pointer"}}>Selected file size exceed maxFileSize</span>}
              {errors.resolution && <span onClick={onImageUpload} style={{cursor: "pointer"}}>Selected file is not match your desired resolution</span>}
            </div>)
          }</ImageUploading>
        </div>
        <div className="row-span-1 col-span-1">
          <ImageUploading
              value={image2}
              onChange={onChangeImage2}
              acceptType={['jpg', 'gif', 'png']} allowNonImageType={false} 
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
                errors
                }) => (!errors ? <div>{imageList[0] ? <img src={imageList[0]['data_url']} className="mx-auto h-36" alt="first" width="100%" height="100%" onDoubleClick={() => onImageRemove(0)} style={{objectFit: "cover"}}/> : <div className="bg-slate-300 font-semibold text-slate-600 h-36 flex justify-center items-center"
                style={isDragging ? { backgroundColor: '#d99932' } : {cursor: "pointer"}}
                onClick={onImageUpload} onDoubleClick={onImageRemove}
                {...dragProps}
              >
                Click or Drop here
              </div>}</div> : 
              errors && <div>
                {errors.acceptType && <span onClick={onImageUpload} style={{cursor: "pointer"}}>Your selected file type is not allow</span>}
                {errors.maxFileSize && <span onClick={onImageUpload} style={{cursor: "pointer"}}>Selected file size exceed maxFileSize</span>}
                {errors.resolution && <span onClick={onImageUpload} style={{cursor: "pointer"}}>Selected file is not match your desired resolution</span>}
            </div>)}
          </ImageUploading>
        </div>
        <div className="row-span-1 col-span-1">
          <ImageUploading
              value={image4}
              onChange={onChangeImage4}
              acceptType={['jpg', 'gif', 'png']} allowNonImageType={false} 
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
                errors
                }) => (!errors ? <div>{imageList[0] ? <img src={imageList[0]['data_url']} className="mx-auto h-36" alt="first" width="100%" height="100%" onDoubleClick={() => onImageRemove(0)} style={{objectFit: "cover"}}/> : <div className="bg-slate-300 font-semibold text-slate-600 h-36 flex justify-center items-center"
                style={isDragging ? { backgroundColor: '#d99932' } : {cursor: "pointer"}}
                onClick={onImageUpload} onDoubleClick={onImageRemove}
                {...dragProps}
              >
                Click or Drop here
              </div>}</div> : 
              errors && <div>
                {errors.acceptType && <span onClick={onImageUpload} style={{cursor: "pointer"}}>Your selected file type is not allow</span>}
                {errors.maxFileSize && <span onClick={onImageUpload} style={{cursor: "pointer"}}>Selected file size exceed maxFileSize</span>}
                {errors.resolution && <span onClick={onImageUpload} style={{cursor: "pointer"}}>Selected file is not match your desired resolution</span>}
            </div>)}
          </ImageUploading>
        </div>
        <div className="row-span-1 col-span-1">
          <ImageUploading
              value={image3}
              onChange={onChangeImage3}
              acceptType={['jpg', 'gif', 'png']} allowNonImageType={false} 
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
                errors
                }) => (!errors ? <div>{imageList[0] ? <img src={imageList[0]['data_url']} className="rounded-tr-lg mx-auto h-36" alt="first" width="100%" height="100%" onDoubleClick={() => onImageRemove(0)} style={{objectFit: "cover"}}/> : <div className="bg-slate-300 font-semibold text-slate-600 h-36 flex justify-center items-center rounded-tr-lg"
                style={isDragging ? { backgroundColor: '#d99932' } : {cursor: "pointer"}}
                onClick={onImageUpload} onDoubleClick={onImageRemove}
                {...dragProps}
              >
                Click or Drop here
              </div>}</div> : 
              errors && <div>
                {errors.acceptType && <span onClick={onImageUpload} style={{cursor: "pointer"}}>Your selected file type is not allow</span>}
                {errors.maxFileSize && <span onClick={onImageUpload} style={{cursor: "pointer"}}>Selected file size exceed maxFileSize</span>}
                {errors.resolution && <span onClick={onImageUpload} style={{cursor: "pointer"}}>Selected file is not match your desired resolution</span>}
            </div>)}
          </ImageUploading>
        </div>
        <div className="row-span-1 col-span-1">
          <ImageUploading
              value={image5}
              onChange={onChangeImage5}
              acceptType={['jpg', 'gif', 'png']} allowNonImageType={false} 
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
                errors
                }) => (!errors ? <div>{imageList[0] ? <img src={imageList[0]['data_url']} className="mx-auto h-36 rounded-br-lg" alt="first" width="100%" height="100%" onDoubleClick={() => onImageRemove(0)} style={{objectFit: "cover"}}/> : <div className="bg-slate-300 font-semibold text-slate-600 h-36 flex justify-center items-center rounded-br-lg"
                style={isDragging ? { backgroundColor: '#d99932' } : {cursor: "pointer"}}
                onClick={onImageUpload} onDoubleClick={onImageRemove}
                {...dragProps}
              >
                Click or Drop here
              </div>}</div> : 
              errors && <div>
                {errors.acceptType && <span onClick={onImageUpload} style={{cursor: "pointer"}}>Your selected file type is not allow</span>}
                {errors.maxFileSize && <span onClick={onImageUpload} style={{cursor: "pointer"}}>Selected file size exceed maxFileSize</span>}
                {errors.resolution && <span onClick={onImageUpload} style={{cursor: "pointer"}}>Selected file is not match your desired resolution</span>}
            </div>)}
          </ImageUploading>
        </div>
      </div>
      <div>
      <ImageUploading
        multiple
        value={imagesDisplay}
        onChange={onChangeImageDisplay}
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
            <div className="grid grid-flow-col auto-cols-max h-60" style={imagesDisplay.length > 0 ? {maxHeight: "32rem", overflowX: "scroll", overflowY: "hidden"} : {display: "None"}}>            
              {imageList.map((image, index) => (
                <div key={index}>
                  <div className="ml-3 bg-cyan-700 h-16 w-56" style={{display: "flex", flexFlow: "row wrap"}}>
                  <img src={image['data_url']} alt="" className="auto" style={{width: '100%', height: '12rem', objectFit: "cover"}}/>
                  <i className="fa-solid fa-trash mt-1 icon-3x" style={{cursor: "pointer"}} onClick={() => onImageRemove(index)}></i>
                  </div>
                  <div>
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
