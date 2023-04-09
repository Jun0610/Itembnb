import { NavLink } from 'react-router-dom';
import { LoadingSmall } from "../components/Loading";
import "../styles/itempost.css";

const UserInfo = ({ user }) => {
    if (Object.keys(user).length)
        return (
            <div className="user">
                <div className="user-details">
                    <NavLink to={"/user/" + user._id}>
                        <h4 className='user-name'>User: <span style={{ fontWeight: "600" }}>{user.name}</span> </h4>

                    </NavLink>
                    <p className='user-desc'>{user.profileDesc || "This user has no profile description."}</p>
                </div>

                <img src={user.profilePic} alt="" className="user-img" />

            </div>);

    return (
        <div className="user">
            <div className="user-details">
                <NavLink to={"/user/" + user._id}>
                    <h4 className='user-name'>user: <span style={{ fontWeight: "600" }}></span> </h4>

                </NavLink>
                <p className='user-desc'>Loading...</p>
            </div>

            <LoadingSmall />

        </div>
    );
}

export default UserInfo;