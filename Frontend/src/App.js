import "./App.css";
import Navbar from "./components/navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/homepage";
import UserProfile from './pages/userpage';
import CreateItemPost from "./pages/createItemPost";
import CreateRequest from "./pages/createRequest";
import CreateItemReview from "./pages/createItemReview";
import CreateUserReview from "./pages/createUserReview";
import DisplayItemPost from "./pages/displayItemPost";
import DisplayRequestPost from "./pages/displayRequest";
import DisplayReview from "./pages/displayReview";
import Unavailable404 from "./pages/Unavailable404";
import LoginWall from "./pages/LoginWall";
import SignUp from "./pages/signup";
import Login from "./pages/login";
import SelectedItemPost from "./pages/selectedItemPost";
import { UserContextProvider } from "./contexts/userContext";
import { ItemContextProvider } from "./contexts/itemContext";
import FavoriteItems from "./pages/FavoriteItems";
import StatusPage from "./pages/StatusPage";
import { NotificationProvider } from "./contexts/notificationContext";
import PendingPage from "./pages/PendingPage";
import EmailDisplayItemPost from "./pages/emailDisplayItemPost";
import EmailStatusPage from "./pages/emailStatusPage";
import AccountSettings from "./pages/accountSettings";
import EmailSelectedItemPost from "./pages/emailSelectedItemPost";
import LendingHistory from "./pages/lendingHistory";
import BorrowingHistory from "./pages/borrowingHistory";
import SearchResultsPage from "./pages/SearchResultsPage";


function App() {
    return (
        <div className="App">
            <UserContextProvider>
                <ItemContextProvider>
                    <Router>
                        <Navbar />
                        <NotificationProvider>
                            <Routes>
                                <Route path="*" element={<Unavailable404 />} />_
                                <Route path="/login-required" element={<LoginWall />} />_
                                <Route exact path="/" element={<Home />} />
                                <Route exact path="/create-item-post" element={<CreateItemPost />} />
                                <Route exact path='/create-item-request' element={<CreateRequest />} />
                                <Route exact path='/create-item-review/:itemId' element={<CreateItemReview />} />
                                <Route exact path='/create-user-review/:userId' element={<CreateUserReview />} />
                                <Route exact path='/lending-history' element={<LendingHistory />} />
                                <Route exact path='/borrowing-history' element={<BorrowingHistory />} />
                                <Route path="/display-item-post/itemId/:itemId/ownerId/:ownerId" element={<EmailDisplayItemPost />} />
                                <Route path="/selected-item-post/itemId/:itemId/ownerId/:ownerId" element={<EmailSelectedItemPost />} />
                                <Route path="/item-status/:id" element={<EmailStatusPage />} />
                                <Route path="/display-item-post/:id" element={<DisplayItemPost />} />
                                <Route path="/display-request-post/:id" element={<DisplayRequestPost />} />
                                <Route path="/display-review/:id" element={<DisplayReview />} />
                                <Route exact path="/signup" element={<SignUp />} />
                                <Route exact path="/login" element={<Login />} />
                                <Route path='/user/:id' element={<UserProfile />} />
                                <Route path='/settings' element={<AccountSettings />} />
                                <Route exact path="/selected-item-post/:itemId" element={<SelectedItemPost />} />
                                <Route exact path="/favorite-items" element={<FavoriteItems />} />
                                <Route exact path='/item-status' element={<StatusPage />}></Route>
                                <Route exact path='/pending-reservations' element={<PendingPage />}></Route>
                                <Route exact path='/search-results/:searchString' element={<SearchResultsPage />}></Route>
                            </Routes>
                        </NotificationProvider>
                    </Router>
                </ItemContextProvider>
            </UserContextProvider>
        </div>
    );
}

export default App;
