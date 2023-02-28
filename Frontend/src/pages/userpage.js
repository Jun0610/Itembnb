import React, {lazy, useEffect} from "react";
import ItemService from '../tools/itemsService';
import {useParams} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Post from "../components/post";

import "../styles/homepage.css";
import "../styles/userpage.css";

const url = "http://localhost:8888/api/user";

class UserService {
    static async getUser(id) {
        console.log(url + "/profile-data/" + id);
        return new Promise((resolve, reject) => {
            fetch(`${url}/profile-data/${id}`)
            .then(res => res.json())
            .then((res) => {
                const data = res.data;
                resolve(data);
            }).catch((err) => {
                reject(err);
            })
        })
    }
}

const Userpage = () => {
  const {id} = useParams(); // id of user

  // Get user info from the server
  const [userInfo, setUserInfo] = React.useState([]);

  /*
  const getOneItem = async() => {
    // const itemData = await ItemService.getItem(userInfo.postedItems[i]);
    const itemData = await ItemService.getItem("63ec624c09acb0b1c1fe9173");
    console.log("ITEM DATA RECIVED", itemData);
    setUserItems(() => [
        userItems,
        // <Post key={item._id} post={item} isRequest={false} favorites={favorites} />
        <Post post={itemData} isRequest = {false}/>
    ]);
    console.log("add item", userItems);
  }; */

  useEffect(() => {
    async function fetchData() {
        const data = await UserService.getUser(id);
        setUserInfo(data);

        /*
        const returnUserItems = async (data) => {
            console.log("data", data);

            if (data.postedItems.length == 0) {
                setUserItems(<div>{data.name} has no items!</div>);
            }
            else {
                for (let i = 0; i < data.postedItems.length; i++) {
                    console.log("add item??");
                    await getOneItem();
                }
            }
        }
        // returnUserItems(data);
        */

    } 
    fetchData();
  }, []);

  const [userItems, setUserItems] = React.useState([]);
  useEffect(() => {
    async function loadItems() {
        const componentPromises =
        userInfo.postedItems.map(async index => {
            const itemData = await ItemService.getItem("63ec624c09acb0b1c1fe9173");
            return <Post post={itemData} isRequest = {false}/>;
        });

        Promise.all(componentPromises).then(setUserItems);
    }
    loadItems();
  }, []);

  /* if (! Object.keys(userInfo).length) { // if user info hasn't loaded
    return ""; // just show a blank screen
  } */

  /*
  const returnUserItems = () => {
    if (userInfo.postedItems.length == 0) {
        return <div>{userInfo.name} has no items!</div>
    }

    let userItems = [];
    for (let i = 0; i < userInfo.postedItems.length; i++) {
        let itemData = ItemService.getItem(userInfo.postedItems[i]);
        setUserItems(() => [
        userItems,
        // <Post key={item._id} post={item} isRequest={false} favorites={favorites} />
        <Post post={itemData} isRequest = {false}/>
        ]);
    }
    return userItems;
  }
  */

  /*
  const wrapper = () => {
    if (returnUserItems is Promise) {
        return "";
    }
    return returnUserItems();
  } */

  return (
    <div id="page_content_container">
        <div id="profile_leftbox" className="add_padding">
            <div>
                <img id="profilepic" src={userInfo.profilePic}/>

                <h6 className="user_stat">{userInfo.name} has left X reviews</h6>
            </div>
        </div>

        <div id="profile_main" className="add_padding">
            <div className="add_padding">
                <h1>{userInfo.name}'s Profile</h1>
                <p>Borrower Rating: {userInfo.borrowerRating}/5</p>
                <p>Lender Rating: {userInfo.lenderRating}/5</p>
                <p><strong>Profile Description: </strong>{userInfo.profileDesc}</p>
            </div>

        <h3 className="item-post-header">{userInfo.name}'s Posted Items</h3>
            <div className="cardcontainer">
                {userItems}
            </div>
        <h3 className="item-post-header">{userInfo.name}'s Item Requests</h3>
        <div className="cardcontainer">
        </div>
        </div>
    </div>
  );

};

export default Userpage;