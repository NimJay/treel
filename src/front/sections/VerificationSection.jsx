import { ajax } from 'jquery';
import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { User } from '../model/User.js';
import { log } from '../util/Global.js';


class VerificationSection extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isMounted: false,
            currentAjax: null,
            ajaxError: false, // true iff ajax() failed.
            error: null, // The error returned by AJAX.
            user: null
        };
    }

    componentDidMount() {
        let a = ajax({
            url: '/api/verification/verify',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ code: this.props.code }),
            dataType: 'json',
            success: this.onAjaxSuccess.bind(this),
            error: this.onAjaxError.bind(this)
        });
        this.setState({ currentAjax: a, isMounted: true });
    }
    onAjaxSuccess(data) {
        log(data);
        let { error, user } = data,
            currentAjax = null;
        if (user) {
            user = new User(user);
            this.props.setApp({ user }); // Log in.
        }
        this.setState({ currentAjax, error, user });
    }
    onAjaxError(error) {
        log(error);
        this.setState({ currentAjax: null, ajaxError: true });
    }

    render() {
        let { isMounted, currentAjax, ajaxError, error, user } = this.state;

        if (!isMounted) return null;
        if (currentAjax) return <LoadingSection />;
        if (ajaxError) return <ErrorSection />;
        if (error && error.code == 4) return <InvalidSection />;
        if (error || !user) return <ErrorSection />;
        return (
            <main className='block'>
                <div className='row'>
                    <p>Your email has been verified.</p>
                </div>

                <div className='row'>
                    {user.isInstructor() &&
                        <Link to='/class/new'
                            className='button'>Create Class</Link>}
                    {user.isInstructor() &&
                        <p>Or <Link to='/class/new'>find a class</Link>.</p>}
                    {user.isStudent() &&
                        <Link to='/search' className='button'>Find Class</Link>}
                </div>
            </main>
        );
    }
}


const LoadingSection = () => (
    <section className='block row'><p>Verifying...</p></section>
);
const ErrorSection = () => (
    <section className='block row'>
        <p className='color-red'>
            Sorry, something went wrong. Email not verified.
        </p>
    </section>
);
const InvalidSection = () => (
    <section className='block row'>
        <p>This link is either expired or invalid.</p>
    </section>
);


export default withRouter(VerificationSection);
