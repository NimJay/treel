import { ajax } from 'jquery';
import React from 'react';
import { log } from '../util/Global.js';


class FollowSection extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isMini: !!props.follow,
            currentAjax: null // The current AJAX request.
        };
    }

    onClick() {
        let { currentAjax } = this.state;
        currentAjax = ajax({
            url: '/api/follow/' +
                (this.props.follow ? 'remove' : 'create') + '-follow',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ classeId: this.props.classe._id }),
            dataType: 'json',
            success: this.onAjaxSuccess.bind(this),
            error: this.onAjaxError.bind(this)
        });
        this.setState({ currentAjax });
    }
    onAjaxSuccess(data) {
        log(data);
        let { error, follow } = data,
            currentAjax = null,
            isMini = false;
        this.setState({ currentAjax, follow, isMini },
            this.props.setFollow.bind(null, follow));
    }
    onAjaxError(error) {
        log(error);
        this.setState({ currentAjax: null });
    }

    render() {
        let { follow } = this.props,
            { isMini, currentAjax } = this.state;
        return (
            <section className="followsection block row buttons-right">
                <button className={isMini && follow ? 'button-mini' : ''}
                    onClick={this.onClick.bind(this)}>
                    {follow ? 'Unf' : 'F'}ollow</button>
            </section>
        );
    }
}


export default FollowSection;
