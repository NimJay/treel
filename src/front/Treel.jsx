import "babel-polyfill"; // Makes treel.js compatible with older browsers.
import React from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter,
    Route,
    Link
} from 'react-router-dom';


// Import the various pages.
import AboutPage from './pages/AboutPage.jsx';
import HomePage from './pages/HomePage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';


// The outer-most React component. This is where is all starts.
const Treel = () => (
    <BrowserRouter>
        <div>
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/sign-up">Sign Up</Link>
            <Route exact path="/" component={HomePage} />
            <Route path="/about" component={AboutPage} />
            <Route path="/sign-up" component={SignUpPage} />
        </div>
    </BrowserRouter>
);


// Render the React application onto DOM.
ReactDOM.render(
    <Treel />,
    document.getElementById('treel')
);
