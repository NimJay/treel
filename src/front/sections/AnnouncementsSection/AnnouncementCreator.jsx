import { ajax } from 'jquery';
import React from 'react';
import { log } from '../../util/Global.js';
import Checkbox from '../../components/Checkbox.jsx';
import Popup from '../../components/Popup.jsx';


class AnnouncementCreator extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            text: '',
            isEmail: false,
            errorMessage: '',
            currentAjax: null,

            // Returned from AJAX.
            announcement: null,
            numAccepted: null,
            rejected: null
        };
    }

    setText(e) {this.setState({ text: e.target.value });}
    setIsEmail(isEmail) {this.setState({ isEmail });}

    onSubmit(e) {
        e.preventDefault(); // Stop page refresh.

        let { classe } = this.props,
            classeId = classe._id,
            { currentAjax, text, isEmail } = this.state,
            errorMessage = '';

        if (currentAjax) return false;

        let m = null; // Erorr message.
        if (!text) m = 'Text cannot be empty.';
        else if (text.length < 10)
            m = 'Announcement must contain at least 10 characters.';
        else if (text.length > 2000)
            m = 'Announcement cannot be more than 2000 characters.';
        if (m) return this.setState({ 'errorMessage': m });

        currentAjax = ajax({
            type: 'POST',
            url: '/api/classe/create-announcement',
            contentType: 'application/json',
            data: JSON.stringify({ classeId, text, isEmail }),
            dataType: 'json',
            success: this.onAjaxSucces.bind(this),
            error: this.onAjaxError.bind(this)
        });
        this.setState({ currentAjax, errorMessage });
    }
    onAjaxSucces(data) {
        log(data);
        let { error, announcement, numAccepted, rejected } = data,
            cb = null,
            errorMessage = '',
            currentAjax = null;

        if (error && error.code == 4) errorMessage = 'Invalid input.';
        else if (error || !announcement) errorMessage = 'Something went wrong.';

        // Success!
        else {
            this.props.onCreation(announcement);
            if (!announcement.isEmail)
                cb = this.props.onClose;
        }

        this.setState({ currentAjax, errorMessage,
            announcement, numAccepted, rejected }, cb);
    }
    onAjaxError(error) {
        log(error);
        this.setState({ currentAjax: null,
            errorMessage: 'Sorry, something went wrong.' });
    }

    render() {
        let { onClose } = this.props,
            { text, isEmail, errorMessage, currentAjax, announcement,
                numAccepted, rejected } = this.state;

        // Announcement just created with isEmail, but no Follows.
        if (announcement && numAccepted === 0) {
            return (
                <Popup onClose={onClose} isMini={true}>
                    <p className='block row'>
                        No emails sent.<br/>
                        This class has no followers.
                    </p>
                </Popup>
            );
        }

        // Announcement just created with isEmail.
        if (announcement && announcement.isEmail
            && numAccepted !== null && Array.isArray(rejected)) {
            return (
                <Popup onClose={onClose} isMini={true}>
                    <section className='announcementcreator block row'>
                        <p>
                            Successfully sent {numAccepted}{' '}
                            email{numAccepted > 1 ? 's' : ''}.
                        </p>
                        <p>
                            <span className='color-red'>
                                {rejected.length > 0 ? 'Failed to email: ' : ''}
                            </span>
                            {rejected.join(', ')}
                        </p>
                    </section>
                </Popup>
            );
        }

        return (
            <Popup onClose={onClose}>
                <form className='announcementcreator block row'
                    onSubmit={this.onSubmit.bind(this)}>
                    <p className='errormessage'>{errorMessage}</p>
                    <textarea value={text} autoFocus={true}
                        placeholder='Announcement'
                        onChange={this.setText.bind(this)}></textarea>
                    <Checkbox label='Email Followers' value={isEmail}
                        onChange={this.setIsEmail.bind(this)} />
                    <div className='buttons-right'>
                        <button type='submit' disabled={currentAjax}>
                            Announce
                        </button>
                    </div>
                </form>
            </Popup>
        )
    }
}

export default AnnouncementCreator;
