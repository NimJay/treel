import { ajax } from 'jquery';
import React from 'react';
import { Link } from 'react-router-dom';
import { User } from '../model/User.js';
import InstructorDashboard from '../sections/InstructorDashboard.jsx';
import LogoutButton from '../components/LogoutButton.jsx';


const HomePage = ({ app, setApp }) => {
    if (!app.isLoggedIn())
        return <LoginPage app={app} setApp={setApp} />;
    if (app.user.type == 1)
        return <InstructorDashboard app={app} setApp={setApp} />;
};


const LoginPage = ({ setApp }) => (
    <div id="page-home">
        <main className="block row">
            <LoginForm setApp={setApp} />
        </main>
        <aside className="block row" style={{'textAlign': 'center'}}>
            <p><Link to="/about">About</Link></p>
        </aside>
    </div>
);


/**
 * <LoginForm>
 * Props:
 * setApp(app): function for logging in a user.
 */
class LoginForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            currentAjax: null, // The current AJAX call.
            errorMessage: ""
        };
    }

    onSubmit(e) {
        e.preventDefault(); // Prevent page refresh.

        let { email, password, currentAjax } = this.state;

        if (currentAjax) return false; // Request in progress.

        currentAjax = ajax({
            type: 'POST',
            url: '/api/login',
            contentType: 'application/json',
            data: JSON.stringify({ email, password }),
            dataType: 'json',
            success: this.onAjaxSuccess.bind(this),
            error: this.onAjaxError.bind(this)
        });

        this.setState({ currentAjax });
    }
    onAjaxSuccess(data) {
        // TODO: log(data) using a helper log function.
        console.log(data);
        let { user, error } = data,
            e = "", // Error message.
            callback = null;
        if (error && error.code == 7) e = "Invalid combination.";
        else if (error || !user) e = "Sorry, something went wrong.";
        else {
            let { setApp, history } = this.props;
            callback = () => {
                setApp({ user: new User(user) }); // Login!
            }
        }
        this.setState({ currentAjax: null, errorMessage: e }, callback);
    }
    onAjaxError(error) {
        // TODO: log(error) using a helper log function.
        console.log(error);
        this.setState({
            errorMessage: "Sorry, something went wrong.",
            currentAjax: null
        });
    }

    setEmail(e){this.setState({ email: e.target.value });}
    setPassword(e){this.setState({ password: e.target.value });}


    render () {

        let { email, password, currentAjax, errorMessage } = this.state,
            disabled = currentAjax || !email.length || !password.length;

        return (
            <form style={{'textAlign': 'center'}}
                onSubmit={this.onSubmit.bind(this)}>
                <p className="errormessage">{errorMessage}</p>
                <input type="text" placeholder="Email" value={email}
                    onChange={this.setEmail.bind(this)} autoFocus={true} /><br/>
                <input type="password" placeholder="Password" value={password}
                    onChange={this.setPassword.bind(this)} />
                <div>
                    <button type="submit" className="buttons"
                        disabled={disabled}>Login</button>
                    <p style={{'fontSize': '14px'}}>
                        Or <Link to="/sign-up">sign up here</Link>.
                    </p>
                </div>
            </form>
        );
    }
}


export default HomePage;
