import React, {useState, useContext} from 'react'
import  {Redirect,
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";

export default function roles(){
    if (localStorage.getItem('role_id')==='4'){
        return <Redirect to='/questions'/>
    } else if (localStorage.getItem('role_id')==='3'){
        return <Redirect to='/author-dashboard'/>
    } else if (localStorage.getItem('role_id')==='2' || localStorage.getItem('role_id')==='1'){
        return <Redirect to='/admin-dashboard'/>
    }

    else return <Redirect to='/login'/>
}
