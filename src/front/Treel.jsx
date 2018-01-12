import "babel-polyfill"; // Makes treel.js compatible with older browsers.
import React from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter,
    Route,
    Link
} from 'react-router-dom';


// The various pages.
const HomePage = () => (<div>Home</div>);
const AboutPage = () => (<div>About</div>);
const SignUpPage = () => (<div>Sign Up</div>);


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
