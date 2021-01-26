import React, {useContext} from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route
  } from "react-router-dom";
// import NavBar from './NavBar'
import {AuthContext} from "./auth-context";

import AdminDashboard from "./components/admin/AdminDashboard";
import AuthorDashboard from "./components/author/AuthorDashboard";
import Home from "./components/student/Home";
import GuestHome from "./components/GuestHome";

export default function MainApp() {

    const auth = useContext(AuthContext);
    // auth.ClientRoleID=1
    alert(auth.isLoggedIn+' from Main App'+ auth.ClientRoleID)



    return (
        <Router>
            <GuestHome/>
        <SwitchCase value={auth.ClientRoleID}/>
            {/*<Route exact path="/Home">*/}
            {/*<GuestHome/>*/}
            {/*</Route>*/}
            {/*<NavBar/>*/}
            {/*<Switch>*/}

            {/*    {auth.ClientRoleID===1 || auth.ClientRoleID===2 ?*/}
            {/*    <Route exact path="/AdminDashboard">*/}


            {/*    <AdminDashboard/>*/}


            {/*    </Route>*/}
            {/*        : null}*/}
            {/*    /!*<Route exact path="/AuthorDashboard">*!/*/}

            {/*    /!*    {auth.ClientRoleID===3 ?*!/*/}
            {/*    /!*        <AuthorDashboard/>*!/*/}
            {/*    /!*        : null}*!/*/}
            {/*    {auth.ClientRoleID===3 ?*/}
            {/*    <Route exact path="/AuthorDashboard">*/}


            {/*    <AuthorDashboard/>*/}

            {/*    </Route>*/}
            {/*        : null}*/}
            {/*    {auth.ClientRoleID===4 ?*/}
            {/*    <Route exact path="/Home">*/}

            {/*    <Home/>*/}

            {/*    </Route>*/}
            {/*        : null}*/}


            {/*</Switch>*/}

        </Router>

    )
}

