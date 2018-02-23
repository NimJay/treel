import React from 'react';
import { Link } from 'react-router-dom';
import LogoutButton from './LogoutButton.jsx';

const Nav = ({ app, setApp }) => {
    return (
        <nav className="navigation block">
            <div className="row">
                <Link to="/">Home</Link>
                {app.isLoggedIn() &&
                    <LogoutButton setApp={setApp} isMini={true} />}
            </div>
        </nav>
    );
}

export default Nav;
