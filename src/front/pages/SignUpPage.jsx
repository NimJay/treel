import { ajax } from 'jquery';
import React from 'react';
import { Link } from 'react-router-dom';
import { User } from '../model/User.js';
import LogoutButton from '../components/LogoutButton.jsx';


const SignUpPage = ({ app, setApp }) => (
    <div id="page-signup">
        {app.isLoggedIn()
            ? <LoggedInSection setApp={setApp} />
            : <SignUpSection />}
        <nav className="block row">
            <Link to="/">Home</Link>
        </nav>
    </div>
);


const LoggedInSection = ({ setApp }) => (
    <section className="block row">
        <p>You must log out to create a new account.</p>
        <LogoutButton setApp={setApp} />
    </section>
);


/**
 * <SignUpSection>
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
            currentAjax: null,
            user: null // The User created and returned from server.
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
            e = ""; // Error message.
        if (error && error.code == 4) e = "Invalid input.";
        else if (error && error.code == 6) e = "Email already in use.";
        else if (error || !user) e = "Sorry, something went wrong."
        else user = new User(user);

        this.setState({ currentAjax: null, errorMessage: e, user: user });
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

        let { email, password, type, name, errorMessage, currentAjax, user }
            = this.state;

        if (user)
            return <UserCreatedSection user={user} />;

        return (
            <main className="block row">
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

const UserCreatedSection = ({ user }) => (
    <section className='block row'>
        <h2>Verify Email</h2>
        <p>
            We just sent a verification email to{' '}
            <strong className='color-green'>{user.email}</strong>.<br/>
            Please click the link in that email to start using Treel.
        </p>
        <p>Can't find the email? Check your spam/junk folder.</p>
    </section>
);

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
