import { ajax } from 'jquery';
import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { User } from '../model/User.js';
import LogoutButton from '../components/LogoutButton.jsx';


const SignUpPage = ({ app, setApp }) => (
    <div>
        {app.isLoggedIn()
            ? <LoggedInSection setApp={setApp} />
            : <SignUpSectionWithRouter setApp={setApp} />}
        <nav className="block row" style={{maxWidth: "500px"}}>
            <Link to="/">Home</Link>
        </nav>
    </div>
);


const LoggedInSection = ({ setApp }) => (
    <section className="block row" style={{maxWidth: "500px"}}>
        <p>You must log out to create a new account.</p>
        <LogoutButton setApp={setApp} />
    </section>
);


/**
 * <SignUpSection>
 * setApp({user}): function for modifying the global App object.
 */
class SignUpSection extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            type: null,
            name: '',
            errorMessage: null,
            currentAjax: null
        }
    }

    onSubmit(e) {
        e.preventDefault(); // Prevent page refresh.

        let { email, password, type, name, currentAjax } = this.state;

        if (currentAjax) return false; // Request in progress.

        currentAjax = ajax({
            type: 'POST',
            url: '/api/user/create-user',
            contentType: 'application/json',
            data: JSON.stringify({ email, password, type, name }),
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
        if (error && error.code == 4) e = "Invalid input.";
        else if (error && error.code == 6) e = "Email already in use.";
        else if (error || !user) e = "Sorry, something went wrong."
        else {
            let { setApp, history } = this.props;
            callback = () => {
                setApp({ user: new User(user) }); // Login!
                history.push('/');
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

    // State setters.
    setType(type) {this.setState({ type });}
    setEmail(e) {this.setState({ email: e.target.value })}
    setName(e) {this.setState({ name: e.target.value })}
    setPassword(e) {this.setState({ password: e.target.value })}

    render() {

        let { email, password, type, name, errorMessage, currentAjax }
            = this.state;

        return (
            <main className="block row" style={{maxWidth: "500px"}}>
                <form onSubmit={this.onSubmit.bind(this)}>
                    <p className="errormessage">{errorMessage}</p>
                    <input type="text" placeholder="Email" autoFocus={true}
                        value={email}
                        onChange={this.setEmail.bind(this)} /><br />
                    <input type="password" placeholder="Password"
                        value={password}
                        onChange={this.setPassword.bind(this)} /><br />
                    <input type="text" placeholder="Name" value={name}
                        onChange={this.setName.bind(this)} /><br />
                    <label>I am</label>
                    <Selector value={type} onSelect={this.setType.bind(this)}
                        options={[
                            {label: "an Instructor", value: 1},
                            {label: "a Student", value: 2}
                        ]} />
                    <div className="buttons-right">
                        <button type="submit">Sign Up</button>
                    </div>
                </form>
            </main>
        );
    }
}
const SignUpSectionWithRouter = withRouter(SignUpSection);

/**
 * Props:
 * value: The current selection.
 * options: A list of {label, value} pairs.
 * onSelect(value): function to call when selected.
 *
 * TODO: Make more semantic (e.g., don't use spans maybe?).
 */
const Selector = ({ value, options, onSelect }) => (
    <div className="selector">
        {options.map(o => (
            <span className={o.value === value ? "active" : ""}
                tabIndex={0} key={o.label}
                onClick={onSelect.bind(null, o.value)}>{o.label}</span>))}
    </div>
);


export default SignUpPage;
