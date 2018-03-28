import { ajax } from 'jquery';
import React from 'react';
import { log } from '../../util/Global.js';


/**
 * <ContentMover>
 * Props: classeId, sectionId, contentId, isMoveUp, onMove, disabled
 */
class ContentMover extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            currentAjax: null // The current AJAX request.
        };
    }

    move() {
        let { classeId, sectionId, contentId, isMoveUp, disabled } = this.props,
            { currentAjax } = this.state;

        if (currentAjax || disabled) return false;

        currentAjax = ajax({
            type: 'POST',
            url: '/api/content/move-content',
            contentType: 'application/json',
            data: JSON.stringify({ classeId, sectionId, contentId, isMoveUp }),
            dataType: 'json',
            success: this.onAjaxSuccess.bind(this),
            error: this.onAjaxError.bind(this)
        });
        this.setState({ currentAjax });
    }
    onAjaxSuccess(data) {
        log(data);
        let { onMove, isMoveUp } = this.props,
            { error } = data,
            cb = null,
            currentAjax = null;
        if (!error) cb = onMove.bind(null, isMoveUp);
        this.setState({ currentAjax }, cb);
    }
    onAjaxError(error) {
        log(error);
        this.setState({ currentAjax: null });
    }

    render() {
        let { isMoveUp, disabled } = this.props,
            { currentAjax } = this.state;
        return (
            <span className={"icon icon-arrow-" + (isMoveUp ? "up " : "down ") +
                (disabled ? "disabled " : "")} onClick={this.move.bind(this)}>
            </span>
        );
    }
}


export default ContentMover;
