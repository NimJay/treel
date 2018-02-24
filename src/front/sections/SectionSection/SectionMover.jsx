import { ajax } from 'jquery';
import React from 'react';
import { log } from '../../util/Global.js';


/**
 * <SectionMover>
 * Props: classeId, sectionId, isMoveUp, onMove, disabled
 */
class SectionMover extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            currentAjax: null // The current AJAX request.
        };
    }

    move() {
        let { classeId, sectionId, isMoveUp, disabled } = this.props,
            { currentAjax } = this.state;

        if (currentAjax || disabled) return false;

        currentAjax = ajax({
            type: 'POST',
            url: '/api/section/move-section',
            contentType: 'application/json',
            data: JSON.stringify({ classeId, sectionId, isMoveUp }),
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
        if (error) errorMessage = "Something went wrong.";
        else cb = onMove.bind(null, isMoveUp);
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


export default SectionMover;
