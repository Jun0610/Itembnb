import "./App.css";
import Navbar from "./components/navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/homepage";
import CreateItemPost from "./pages/createItemPost";
import DisplayItemPost from "./pages/displayItemPost";
import SignUp from "./pages/signup";
import Login from "./pages/login";
import SelectedItemPost from "./pages/selectedItemPost";
import {UserContextProvider} from "./contexts/userContext";
import {ItemContextProvider} from "./contexts/itemContext";

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
            <Route exact path="/display-item-post" element={<DisplayItemPost />} />
            <Route exact path="/signup" element={<SignUp />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/selected-item-post" element={<SelectedItemPost />} />
          </Routes>
        </Router>
      </ItemContextProvider>
      </UserContextProvider>
    </div>
  );
}

export default App;
