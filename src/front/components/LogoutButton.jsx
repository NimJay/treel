import { ajax } from 'jquery';
import React from 'react';
import Cookies from 'js-cookie';

const LogoutButton = ({ setApp, isMini }) => {
    const logout = () => {
        Cookies.remove('connect.sid');
        setApp({ user: null });
        ajax({
            type: 'POST',
            url: '/api/logout',
            dataType: 'json',
            success: console.log // TODO: Use global "log".
        });
    }
    return (
        <button type="button" className={isMini ? "button-mini" : ""}
            onClick={logout}>Log Out</button>
    );
}


export default LogoutButton;
