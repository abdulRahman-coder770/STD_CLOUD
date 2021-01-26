import React from 'react';
import ReactDOM from 'react-dom';
import {
    Redirect,
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
export default function logout() {
    localStorage.clear();
    return (
    <Redirect to='/roles'/>
    );
}
