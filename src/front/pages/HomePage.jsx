import React from 'react';
import { Link } from 'react-router-dom';


const HomePage = () => (
    <div id="page-home">
        <main className="block row">
            <LoginForm />
        </main>
        <aside className="block row">
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

    onSubmit() {
        if (currentAjax) return false;
        // TODO: Ajax call.
    }
    setEmail(e){this.setState({ email: e.target.value });}
    setPassword(e){this.setState({ password: e.target.value });}

    render () {
        let { email, password, currentAjax, errorMessage } = this.state;
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
                        disabled={currentAjax}>Login</button>
                    <p style={{'fontSize': '14px'}}>
                        Or <Link to="/sign-up">sign up here</Link>.
                    </p>
                </div>
            </form>
        );
    }
}


export default HomePage;
