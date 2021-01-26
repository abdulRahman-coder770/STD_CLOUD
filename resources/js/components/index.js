import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter as Router, Route,Link} from "react-router-dom";
import GuestHome from "./GuestHome";
import Login from "./Login";
import Register from "./Register";
import AdminDashboard from "./admin/AdminDashboard";
import AuthorDashboard from "./author/AuthorDashboard";
import Home from "./student/Home";
import 'bootstrap/dist/css/bootstrap.min.css';
import roles from "./roles";
import logout from "./logout";
import Questions from "./student/Questions";
import chat from "./student/chatpanel";
import showQuestion from "./student/showQuestion";
import message from "./message";
// import Chatpanel from "./student/chatpanel";

import Echo from 'laravel-echo';
// import Uploads from "./student/Uploads";
import MajorUploads from "./student/Uploads";
import profile from "./student/profile";
import Blog from "./student/Blog";
import Blogger from "./student/Blog";
import showPost from "./student/showPost";

export default function Index(){

    return(
        <Router>
            <Route exact path='/' component={GuestHome}/>
            <Route exact path='/login' component={Login}/>
            <Route exact path='/register' component={Register}/>
            <Route exact path='/admin-dashboard' component={AdminDashboard}/>
            <Route exact path='/author-dashboard' component={AuthorDashboard}/>
            <Route exact path='/home' component={Home}/>
            <Route exact path='/questions' component={Questions}/>
            <Route exact path='/chat' component={chat}/>
            <Route exact path='/MajorUploads' component={MajorUploads}/>
            <Route exact path='/questions/:id' component={showQuestion}/>
            <Route exact path='/posts/:id' component={showPost}/>
            <Route exact path='/profile' component={profile}/>
            <Route exact path='/Blog' component={Blogger}/>
            {/*<Route exact path='/chat' component={Chatpanel}/>*/}

            <Route exact path='/logout' component={logout}/>
            <Route exact path='/roles' component={roles}/>
        </Router>
    )
}

ReactDOM.render(<Index/>,document.getElementById('root'))
