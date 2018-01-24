import React from 'react';


const SignUpPage = ({ app, setApp }) => (
    <div>
        {app.isLoggedIn()
            ? <LoggedInSection setApp={setApp} />
            : <SignUpSection setApp={setApp} />}
    </div>
);


const LoggedInSection = ({ setApp }) => (
    <section className="block container">
        <p>You must log out to create a new account.</p>
        <button onClick={setApp.bind({ user: null })}>Log Out</button>
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
    }

    setType(type) {this.setState({ type });}

    render() {

        let { email, password, type, name, errorMessage, currentAjax }
            = this.state;

        return (
            <section className="block row" style={{maxWidth: "500px"}}>
                <main>
                    <form onSubmit={this.onSubmit.bind(this)}>
                        <p className="errormessage">{errorMessage}</p>
                        <input type="text" placeholder="Email" autoFocus={true} /><br />
                        <input type="password" placeholder="Password" /><br />
                        <input type="text" placeholder="Name" /><br />
                        <Selector value={type} onSelect={this.setType.bind(this)}
                            options={[
                                {label: "Instructor", value: 1},
                                {label: "Student", value: 2}
                            ]} />
                        <div className="buttons-right">
                            <button type="submit">Sign Up</button>
                        </div>
                    </form>
                </main>
                <aside>
                </aside>
            </section>
        );
    }
}


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
