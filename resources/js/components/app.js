import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Auth from "../Auth";
import MainApp from "../MainApp";

// import './App.css';
import {AuthContext} from "../auth-context";

function App() {

    const [isLoggedIn, setIsLoggedIn] = useState();
    const [clientID, setClientID] = useState();
    const [ClientRoleID, setClientRoleID] = useState();
    const [UniID, setUniID] = useState();
    const [MajorID, setMajorID] = useState();
    // const [orgName, setOrgName] = useState();
    const [token, setToken] = useState();
    // alert(isLoggedIn)

    let route;

    const login = ()=> {
        setIsLoggedIn(true);
        // alert(isLoggedIn+' has logged in');
    }


    const logout = ()=> {
        setIsLoggedIn(false);
    }

    const setUserID = (id)=> {
        setClientID(id);
    }

    const setUnivID = (id)=> {
        setUniID(id);
    }
    const setMajorsID = (id)=> {
        setMajorID(id);
    }

    // const setTheOrgName = (name)=> {
    //     setOrgName(name);
    // }

    const setRoleID = (id)=> {
        setClientRoleID(id);
    }

    const setUserToken = (t)=>{
        setToken(t)
    }

    // if(isLoggedIn){
    //     route = <MainApp/>;
    // }
    // else{// if not logged in
    //     route = <Auth/>;
    // }


    return <div className="App">
        <AuthContext.Provider
            value={ { isLoggedIn:isLoggedIn,
                login: login,
                logout:logout,
                ClientID:clientID,
                ClientRoleID:ClientRoleID,
                setUserID:setUserID,
                setRoleID:setRoleID,
                setUniID:setUnivID,
                setMajorID:setMajorsID,
                UniID:UniID,
                MajorID: MajorID,
                // setOrgName:setTheOrgName,
                // OrgName:orgName,
                setToken:setUserToken,
                Token:token
            }}>
            {<Auth/>}
        </AuthContext.Provider>
    </div>;
}



export default App;

