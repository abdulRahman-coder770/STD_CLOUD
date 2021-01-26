import { createContext } from 'react';

export const AuthContext = createContext({
    isLoggedIn: false,
    login: () => {},
    logout: () => {},

    ClientID: -1,
    setUserID: () => {},

    ClientRoleID: -1,
    setRoleID: () => {},

    UniID: -1,
    setUniID: () => {},

    // UniName: "",
    // setUniName: () => {},
    //
    // UniShortName: "",
    // setUniShortName: () => {},

    MajorID: -1,
    setMajorID: () => {},

    // MajorName: "",
    // setMajorName: () => {},
    //
    // MajorShortName: "",
    // setMajorShortName: () => {},

    Token: "not set yet",
    setToken: () => {}
});
