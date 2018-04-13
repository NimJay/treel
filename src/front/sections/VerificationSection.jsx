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
            error: null // The error returned by AJAX.
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
        if (user) this.props.setApp({ 'user': new User(user) }); // Log in.
        this.setState({ currentAjax, error });
    }
    onAjaxError(error) {
        log(error);
        this.setState({ currentAjax: null, ajaxError: true });
    }

    render() {
        let { isMounted, currentAjax, ajaxError, error } = this.state;

        if (!isMounted) return null;
        if (currentAjax) return <LoadingSection />;
        if (ajaxError) return <ErrorSection />;
        if (error && error.code == 4) return <InvalidSection />;
        if (error) return <ErrorSection />;
        return (
            <main className='block row'>
                <h1>Success</h1>
                <p>Your email has been verified.</p>
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
