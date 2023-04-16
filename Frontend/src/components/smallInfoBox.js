import { NavLink } from 'react-router-dom';
import { LoadingSmall } from "./Loading";
import "../styles/itempost.css";

export const SmallUserInfo = ({ user }) => {
    if (Object.keys(user).length)
        return (
            <div className="user w-36">
                <div className="user-details">

                    <img src={user.profilePic} alt="" className="user-img w-10 h-10 mx-auto" />

                    <NavLink to=
                        {"/user/" + user._id} onClick={() => window.location.href = "/user/" + user._id}>
                        <h6 className='user-name'>{user.name}</h6>
                    </NavLink>

                    {user.profileDesc ?
                        <p className='user-desc'>{user.profileDesc}</p> :
                        <p className='user-desc grayText'>This user has no profile description.</p>
                    }
                </div>
            </div>);

    return (
        <div className="user w-36">
            <div className="user-details">

                <LoadingSmall />

                <NavLink onClick={() => window.location.href = "/user/" + user._id}>
                    <h4 className='user-name'>User: <span style={{ fontWeight: "600" }}></span> </h4>
                </NavLink>

                <p className='user-desc'>Loading...</p>
            </div>
        </div>);
}

export const UserInfo = ({ user }) => {
    if (Object.keys(user).length)
        return (
            <div className="user flex">
                <div className="user-details flex-1">
                    <NavLink onClick={() => window.location.href = "/user/" + user._id}>

                        <h4 className='user-name'>User: <span style={{ fontWeight: "600" }}>{user.name}</span> </h4>
                    </NavLink>

                    {user.profileDesc ?
                        <p className='user-desc'>{user.profileDesc}</p> :
                        <p className='user-desc grayText'>This user has no profile description.</p>
                    }
                </div>

                <img src={user.profilePic} alt="" className="user-img w-32 h-32" />
            </div>);

    return (
        <div className="user">
            <div className="user-details">
                <NavLink onClick={() => window.location.href = "/user/" + user._id}>
                    <h4 className='user-name'>User: <span style={{ fontWeight: "600" }}></span> </h4>
                </NavLink>

                <p className='user-desc'>Loading...</p>
            </div>

            <LoadingSmall />

        </div>
    );
}

export const SmallItemInfo = ({ item }) => {
    if (Object.keys(item).length)
        return (
            <div className="user w-36">
                <div className="user-details">

                    <img src={item.images[0]} alt="" className="w-12 h-12 mx-auto" />

                    <NavLink to=
                        {"/user/" + item._id} onClick={() => window.location.href = "/user/" + item._id}>
                        <h6 className='user-name'>{item.name}</h6>
                    </NavLink>

                    {item.profileDesc ?
                        <p className='user-desc'>{item.profileDesc}</p> :
                        <p className='user-desc grayText'>This item has no description.</p>
                    }
                </div>
            </div>);

    return (
        <div className="user w-36">
            <div className="user-details">

                <LoadingSmall />

                <NavLink onClick={() => window.location.href = "/user/" + item._id}>
                    <h4 className='user-name'>User: <span style={{ fontWeight: "600" }}></span> </h4>
                </NavLink>

                <p className='user-desc'>Loading...</p>
            </div>
        </div>);
}