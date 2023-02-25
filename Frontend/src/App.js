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
import {UserContextProvider} from "./contexts/userContext";

function App() {
  return (
    <div className="App">
      <UserContextProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/create-item-post" element={<CreateItemPost />} />
          <Route exact path='/create-item-request' element={<CreateRequest />} />
          <Route exact path="/display-item-post" element={<DisplayItemPost />} />
          <Route path="/display-request-post/:id" element={<DisplayRequestPost />} />
          <Route exact path="/signup" element={<SignUp />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path='/user' element={<UserProfile />} />
        </Routes>
      </Router>
      </UserContextProvider>
    </div>
  );
}

export default App;
