import { ajax } from 'jquery';
import React from 'react';
import Popup from '../../../components/Popup.jsx';
import { log } from '../../../util/Global.js';


/**
 * <ContentDeleter>
 * Props: classeId, sectionId, content, onDeletion
 */
class ContentDeleter extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            currentAjax: null, // The current AJAX request.
            showPopup: false
        };
    }

    showPopup() {this.setState({ showPopup: true });}
    hidePopup() {this.setState({ showPopup: false });}

    onDelete() {
        let { classeId, sectionId, content } = this.props,
            { currentAjax } = this.state,
            contentId = content._id;

        if (currentAjax) return false;

        currentAjax = ajax({
            type: 'POST',
            url: '/api/content/delete-content',
            contentType: 'application/json',
            data: JSON.stringify({ classeId, sectionId, contentId }),
            dataType: 'json',
            success: this.onAjaxSuccess.bind(this),
            error: this.onAjaxError.bind(this)
        });
        this.setState({ currentAjax });
    }
    onAjaxSuccess(data) {
        log(data);
        this.setState({ currentAjax: null },
            data.error ? null : this.props.onDeletion);
    }
    onAjaxError(error) {
        log(error);
        this.setState({ currentAjax: null });
    }

    render() {
        let { content } = this.props,
            { showPopup } = this.state;
        return (
            <span>
                <span className="icon icon-trash"
                    onClick={this.showPopup.bind(this)}></span>
                {showPopup &&
                    <Popup onDelete={this.onDelete.bind(this)}
                        onClose={this.hidePopup.bind(this)}>
                        <div className="block row">
                            <h2>Permanently delete?</h2>
                            <div className="buttons-right">
                                <button className="button-red"
                                    onClick={this.onDelete.bind(this)}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    </Popup>}
            </span>
        );
    }
}


export default ContentDeleter;
