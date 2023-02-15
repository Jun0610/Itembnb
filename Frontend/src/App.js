import logo from "./logo.svg";
import "./App.css";
import Navbar from "./components/navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/homepage";
import CreateItemPost from "./pages/createItemPost";

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Home />} />{" "}
          <Route exact path="/create-item-post" element={<CreateItemPost />} />{" "}
        </Routes>{" "}
      </Router>{" "}
    </div>
  );
}

export default App;
