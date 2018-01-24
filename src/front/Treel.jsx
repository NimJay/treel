import "babel-polyfill"; // Makes treel.js compatible with older browsers.
import React from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter,
    Route,
    Link
} from 'react-router-dom';
import { App } from './util/App.js';


// Import the various pages.
import AboutPage from './pages/AboutPage.jsx';
import HomePage from './pages/HomePage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';


/**
 * <Treel>
 * The outer-most React component. This is where is all starts.
 */
class Treel extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            app: new App({ user: null }) // TODO: Retrieve from "pre-data".
        };
    }

    /**
     * This function is to be used by children React components to alter
     * this.state.app which contains global data such as the logged in User.
     */
    setApp({ user }) {
        if (user !== undefined) this.app.user = user;
    }

    render() {

        let { app } = this.state;

        // Helper method for passing props to pages.
        let renderPage = (page, props) => {
            props.app = app;
            props.setApp = this.setApp.bind(this);
            return React.createElement(page, props);
        };

        return (
            <BrowserRouter>
                <div>
                    <Route exact path="/" render={renderPage.bind(null, HomePage)} />
                    <Route path="/about" render={renderPage.bind(null, AboutPage)} />
                    <Route path="/sign-up" render={renderPage.bind(null, SignUpPage)} />
                </div>
            </BrowserRouter>
        );
    }
}



// Render the React application onto DOM.
ReactDOM.render(
    <Treel />,
    document.getElementById('treel')
);
