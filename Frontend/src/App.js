import "./App.css";
import Navbar from "./components/navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/homepage";
import UserProfile from './pages/userpage';
import CreateItemPost from "./pages/createItemPost";
import CreateRequest from "./pages/createRequest";
import DisplayItemPost from "./pages/displayItemPost";
import DisplayRequestPost from "./pages/displayRequest";
import SignUp from "./pages/signup";
import Login from "./pages/login";
import SelectedItemPost from "./pages/selectedItemPost";
import { UserContextProvider } from "./contexts/userContext";
import { ItemContextProvider } from "./contexts/itemContext";
import FavoriteItems from "./pages/FavoriteItems";

function App() {
  return (
    <div className="App">
      <UserContextProvider>
        <ItemContextProvider>
          <Router>
            <Navbar />
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route exact path="/create-item-post" element={<CreateItemPost />} />
              <Route exact path='/create-item-request' element={<CreateRequest />} />
              <Route path="/display-item-post/:id" element={<DisplayItemPost />} />
              <Route path="/display-request-post/:id" element={<DisplayRequestPost />} />
              <Route exact path="/signup" element={<SignUp />} />
              <Route exact path="/login" element={<Login />} />
              <Route path='/user/:id' element={<UserProfile />} />
              <Route exact path="/selected-item-post/:itemId" element={<SelectedItemPost />} />
              <Route exact path="/favorite-items" element={<FavoriteItems />} />
            </Routes>
          </Router>
        </ItemContextProvider>
      </UserContextProvider>
    </div>
  );
}

export default App;
