import React, {useState, useContext} from 'react'
// import { AuthContext } from '/auth-context'
import Register from "./components/Register";
import Login from "./components/Login";
import {AuthContext} from "./auth-context";
import { BrowserRouter as Router,
    Switch,
    Route} from "react-router-dom";
import AdminDashboard from "./components/admin/AdminDashboard";
import AuthorDashboard from "./components/author/AuthorDashboard";
import Home from "./components/student/Home";


export default function Auth() {
    const auth = useContext(AuthContext);
    // if (auth.ClientRoleID)
    const [loginMode, setLoginMode] = useState()
    // alert(auth.isLoggedIn+' from Main App'+ auth.ClientRoleID)
    function changeMode() {
        setLoginMode(loginMode => !loginMode)
    }
    function SwitchCase(props) {
        let route=''
        if (!props.check){
            // alert('no auth')
            route= <Login/>;
        }
        else {
            switch (props.value) {
                case 1:
                    route = <Route path={'/AdminDashboard'}><AdminDashboard/> </Route>;
                    break
                case 2:
                    route = <Route path={'/AdminDashboard'}><AdminDashboard/> </Route>;
                    break
                case 3:
                    route = <Route path={'/AuthorDashboard'}><AuthorDashboard/> </Route>;
                    break
                case 4:
                    route = <Home/>;
                    break
            }
        }
        return <Router>{route}</Router>
    }

    return (
        // loginMode ?
        // <Login switch={changeMode}/>
        <SwitchCase value={auth.ClientRoleID} check={auth.isLoggedIn}/>
        // :<Login switch={changeMode}/>
        )

}
