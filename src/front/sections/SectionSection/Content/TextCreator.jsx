import { ajax } from 'jquery';
import React from 'react';
import { log } from '../../../util/Global.js';


/**
 * <TextCreator>
 * Props: classe, section, onCreation(content)
 */
class TextCreator extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            text: "",
            currentAjax: null, // The current AJAX request.
            errorMessage: ""
        };
    }

    setText(e) {this.setState({ text: e.target.value });}

    onSubmit(e) {
        e.preventDefault(); // Stop page refresh.

        let { classe, section } = this.props,
            classeId = classe._id,
            sectionId = section._id,
            { currentAjax, text } = this.state,
            content = { text };
        content.type = 'text';

        if (currentAjax) return false;

        currentAjax = ajax({
            type: 'POST',
            url: '/api/content/create-content',
            contentType: 'application/json',
            data: JSON.stringify({ classeId, sectionId, content }),
            dataType: 'json',
            success: this.onAjaxSucces.bind(this),
            error: this.onAjaxError.bind(this)
        });
        this.setState({ currentAjax });
    }
    onAjaxSucces(data) {
        log(data);
        let { error, content } = data,
            cb = null,
            errorMessage = "",
            currentAjax = null;
        if (error && error.code == 4) errorMessage = "Invalid input.";
        else if (error || !content) errorMessage = "Something went wrong.";
        else cb = this.props.onCreation.bind(null, content);
        this.setState({ currentAjax, errorMessage }, cb);
    }
    onAjaxError(error) {
        log(error);
        this.setState({ currentAjax: null,
            errorMessage: "Sorry, something went wrong." });
    }


    render() {
        let { text, errorMessage, currentAjax } = this.state;

        return (
            <section className="block row">
                <form onSubmit={this.onSubmit.bind(this)}>
                    <p className="errormessage">{errorMessage}</p>
                    <textarea value={text} autoFocus={true}
                        placeholder="Text"
                        onChange={this.setText.bind(this)}></textarea>
                    <div className="buttons-right">
                        <button type="submit"
                            disabled={currentAjax}>Create</button>
                    </div>
                </form>
            </section>
        );
    }
}


export default TextCreator;
