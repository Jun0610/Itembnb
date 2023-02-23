import React, {useEffect} from 'react';
import Select from 'react-select';
import ImageUploading from 'react-images-uploading';

const categories = 
[{value: 'ACADEMICS', label: "Academics"},
{value: 'HOUSEHOLD', label: "Household"},
{value: 'ENTERTAINMENT', label: "Entertainment"},
{value: 'OUTDOOR', label: "Outdoor"},
{value: 'ELECTRONIC', label: "Electronic"},
{value: 'MISC', label: "Misc"}];

const DisplayItemPost = () => {
  const [item, setItem] = React.useState({
    name: "Music Box",
    description: "This is a pretty music box.",
    price: 50,
    revservHist: [],
    unavailList: [],
    review: [],
    category: [{value: 'ACADEMICS', label: "Academics"}, {value: 'HOUSEHOLD', label: "Household"}],
    images: [],
  });
  const [isEditing, setIsEditing] = React.useState(false);
  const [image, setImages] = React.useState([]);
  const maxNumber = 20;

  useEffect(() => {
    // call API to fetch the item data
  }, {});

  const onItemChange = (e) => {
    setItem({
        ...item,
        [e.target.id]: e.target.value
    });
  }

  const onChangeImage = (imageList, addUpdateIndex) => {
    console.log(imageList, addUpdateIndex);
    setImages(imageList);
  }

  const handleCategory = (o) => {
    var categories = [];
    o.forEach((element) => categories.push(element['value']));
    setItem({
      ...item, 
      category: categories,
    })
  }

  return (
    <div>
        <div>Display Item Post</div>
        <div>
            <button className="hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-full" style={{backgroundColor: '#F7D65A'}} onClick={() => setIsEditing(!isEditing)}>{isEditing ? 'Save' : 'Edit'}</button>
            <button className="hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-full" style={{backgroundColor: '#F7D65A'}}>Delete</button>
        </div>
        <div>
        <ImageUploading
        multiple
        value={image}
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
              {imageList[0] ? <img src={imageList[0]['data_url']} className="mx-auto h-80" alt="first" width="100%" height="100%" style={{objectFit: "cover"}}/> : 
              <div className="bg-slate-300 font-semibold text-slate-600 h-80 rounded-l-lg flex justify-center items-center"
                style={isDragging ? { backgroundColor: '#d99932' } : {cursor: "pointer"}}
                onClick={onImageUpload} onDoubleClick={onImageRemove}
                {...dragProps}
              >
                Click or Drop here
              </div>}
            </div>
            <div className="row-span-1 col-span-1">
              {imageList[1] ? <img src={imageList[1]['data_url']} className="mx-auto h-36" alt="first" width="100%" height="100%" style={{objectFit: "cover"}}/> : <div className="bg-slate-300 font-semibold text-slate-600 h-36 flex justify-center items-center"
                style={isDragging ? { backgroundColor: '#d99932' } : {cursor: "pointer"}}
                onClick={onImageUpload} onDoubleClick={onImageRemove}
                {...dragProps}
              >
                Click or Drop here
              </div>}
            </div>
            <div className="row-span-1 col-span-1">
              {imageList[2] ? <img src={imageList[2]['data_url']} className="mx-auto h-36" alt="first" width="100%" height="100%" style={{objectFit: "cover"}}/> : <div className="bg-slate-300 font-semibold text-slate-600 h-36 flex justify-center items-center"
                style={isDragging ? { backgroundColor: '#d99932' } : {cursor: "pointer"}}
                onClick={onImageUpload} onDoubleClick={onImageRemove}
                {...dragProps}
              >
                Click or Drop here
              </div>}
            </div>
            <div className="row-span-1 col-span-1">
              {imageList[3] ? <img src={imageList[3]['data_url']} className="mx-auto h-36" alt="first" width="100%" height="100%" style={{objectFit: "cover"}}/> : <div className="bg-slate-300 font-semibold text-slate-600 h-36 flex justify-center items-center rounded-tr-lg"
                style={isDragging ? { backgroundColor: '#d99932' } : {cursor: "pointer"}}
                onClick={onImageUpload} onDoubleClick={onImageRemove}
                {...dragProps}
              >
                Click or Drop here
              </div>}
            </div>
            <div className="row-span-1 col-span-1">
              {imageList[4] ? <img src={imageList[4]['data_url']} className="mx-auto h-36" alt="first" width="100%" height="100%" style={{objectFit: "cover"}}/> : <div className="bg-slate-300 font-semibold text-slate-600 h-36 flex justify-center items-center rounded-br-lg"
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
        <div>Name</div>
        <input id="name" type="text" value={item.name} name="name" readOnly={isEditing ? false : true} onChange={onItemChange}/>
        <div>Description</div>
        <input id="description" type="text" value={item.description} readOnly={isEditing ? false : true} onChange={onItemChange}/>
        <div>Price</div>
        <input id="price" type="number" value={item.price} readOnly={isEditing ? false: true} onChange={onItemChange}/>
        <div>Category tags</div>
        <Select className="mt-1 block basic-multi-select" id="category" defaultValue={item.category} isMulti name="category" options={categories} classNamePrefix="select" onChange={handleCategory
              }/>
    </div>
  )
}

export default DisplayItemPost;