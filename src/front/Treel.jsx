import "babel-polyfill"; // Makes treel.js compatible with older browsers.
import clone from 'clone';
import React from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter,
    Link,
    Route,
    Switch
} from 'react-router-dom';
import { getUser } from './util/PreData.js';
import { App } from './util/App.js';


// Import the various pages.
import AboutPage from './pages/AboutPage.jsx';
import ClasseCreationPage from './pages/ClasseCreationPage.jsx';
import ClassePage from './pages/ClassePage.jsx';
import ClasseSearchPage from './pages/ClasseSearchPage.jsx';
import HomePage from './pages/HomePage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import VerificationPage from './pages/VerificationPage.jsx';


/**
 * <Treel>
 * The outer-most React component. This is where is all starts.
 */
class Treel extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            app: new App({ user: getUser() })
        };
    }

    /**
     * This function is to be used by children React components to alter
     * this.state.app which contains global data such as the logged in User.
     */
    setApp({ user }) {
        let app = clone(this.state.app);
        if (user !== undefined) app.user = user;
        this.setState({ app });
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
                <Switch>
                    <Route exact path="/" render={renderPage.bind(null, HomePage)} />
                    <Route path="/about" render={renderPage.bind(null, AboutPage)} />
                    <Route path="/class/new" render={renderPage.bind(null, ClasseCreationPage)} />
                    <Route path="/class/:classeId" render={renderPage.bind(null, ClassePage)} />
                    <Route path="/search" render={renderPage.bind(null, ClasseSearchPage)} />
                    <Route path="/verify/:code" render={renderPage.bind(null, VerificationPage)} />
                    <Route path="/sign-up" render={renderPage.bind(null, SignUpPage)} />
                    <Route path="*" render={renderPage.bind(null, NotFoundPage)} />
                </Switch>
            </BrowserRouter>
        );
    }
}



// Render the React application onto DOM.
ReactDOM.render(
    <Treel />,
    document.getElementById('treel')
);
