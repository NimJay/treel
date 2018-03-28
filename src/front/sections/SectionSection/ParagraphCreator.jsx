import { ajax } from 'jquery';
import React from 'react';
import { log } from '../../util/Global.js';


/**
 * <ParagraphCreator>
 * Props: classe, section, onCreation(content)
 */
class ParagraphCreator extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            paragraph: "",
            currentAjax: null, // The current AJAX request.
            errorMessage: ""
        };
    }

    setParagraph(e) {this.setState({ paragraph: e.target.value });}

    onSubmit(e) {
        e.preventDefault(); // Stop page refresh.

        let { classe, section } = this.props,
            classeId = classe._id,
            sectionId = section._id,
            { currentAjax, paragraph } = this.state,
            content = { paragraph };
        content.type = 'paragraph';

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
        let { paragraph, errorMessage, currentAjax } = this.state;

        return (
            <section className="block row">
                <form onSubmit={this.onSubmit.bind(this)}>
                    <p className="errormessage">{errorMessage}</p>
                    <textarea value={paragraph} autoFocus={true}
                        placeholder="Paragraph"
                        onChange={this.setParagraph.bind(this)}></textarea>
                    <div className="buttons-right">
                        <button type="submit"
                            disabled={currentAjax}>Create</button>
                    </div>
                </form>
            </section>
        );
    }
}


export default ParagraphCreator;
