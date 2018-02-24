import React from 'react';
import { Link } from 'react-router-dom';
import LogoutButton from './LogoutButton.jsx';

class Nav extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showLinks: false
        }
    }

    showLinks() {this.setState({ showLinks: true });}
    hideLinks() {this.setState({ showLinks: false });}

    render () {
        let { app, setApp } = this.props,
            { showLinks } = this.state;

        if (!showLinks) {
            return (
                <nav className="navigation block row"
                    onMouseEnter={this.showLinks.bind(this)}>
                    <span className="icon icon-menu"></span>
                </nav>
            );
        }

        return (
            <nav className="navigation block"
                onMouseLeave={this.hideLinks.bind(this)}>
                <div className="row">
                    <span className="icon icon-menu"></span>
                    <Link to="/">Home</Link>
                    {app.isLoggedIn() &&
                        <LogoutButton setApp={setApp} isMini={true} />}
                </div>
            </nav>
        );
    }
}

export default Nav;
