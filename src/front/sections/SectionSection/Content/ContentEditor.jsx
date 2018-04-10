import { ajax } from 'jquery';
import React from 'react';
import Popup from '../../../components/Popup.jsx';
import { log } from '../../../util/Global.js';


/**
 * <ContentEditor>
 * Props: classeId, sectionId, content, onUpdate(content)
 */
class ContentEditor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            content: props.content,
            showPopup: false,
            errorMessage: '',
            currentAjax: null
        };
    }


    // State setters.
    showPopup() {this.setState({ showPopup: true });}
    hidePopup() {this.setState({ showPopup: false });}
    setContent(field, value) {
        if (value.target) value = value.target.value; // From onChange(e).
        let { content } = this.state;
        content[field] = value;
        this.setState({ content });
    }


    onSubmit(e) {
        e.preventDefault(); // Prevent page refresh.

        let { currentAjax, content } = this.state,
            { classeId, sectionId } = this.props;
        if (currentAjax) return false; // AJAX is progress.

        // Validate.
        let c = content, // Alias.
            m = null; // Erorr message.
        if (c.type == 'text') {
            if (!c.text) m = 'Text cannot be empty.';
        } else if (c.type == 'link') {
            if (!c.link || c.link.indexOf('.') == -1) m = 'Invalid link.';
            if (!c.name) m = 'Name cannot be empty.';
        } else if (c.type == 'file') {
            if (!c.name) m = 'Name cannot be empty.';
        } else {m = 'Sorry, something went wrong.';}
        if (m) return this.setState({ errorMessage: m });

        currentAjax = ajax({
            type: 'POST',
            url: '/api/content/update-content',
            contentType: 'application/json',
            data: JSON.stringify({ classeId, sectionId, content }),
            dataType: 'json',
            success: this.onAjaxSuccess.bind(this),
            error: this.onAjaxError.bind(this)
        });
        this.setState({ currentAjax });
    }
    onAjaxSuccess(data) {
        log(data);
        let { error, content } = data,
            currentAjax = null,
            errorMessage = '',
            showPopup = true,
            cb = null;

        if (error && error.code == 4) {
            errorMessage = 'Invalid input.';
        } else if (error || !content) {
            errorMessage = 'Something went wrong.';
        } else {
            showPopup = false;
            cb = this.props.onUpdate.bind(null, content);
        }

        this.setState({ currentAjax, errorMessage, showPopup }, cb);
    }
    onAjaxError(error) {
        log(error);
        this.setState({ currentAjax: null,
            errorMessage: 'Something went wrong.' });
    }


    render() {
        let { showPopup, errorMessage, content } = this.state;

        if (!showPopup) {
            return (
                <span className='icon icon-edit'
                    onClick={this.showPopup.bind(this)}></span>
            );
        }

        let Editor = null;
        if (content.type == 'text') Editor = TextEditor;
        if (content.type == 'link') Editor = LinkEditor;
        if (content.type == 'file') Editor = FileEditor;
        if (!Editor) return null;

        return (
            <Popup onClose={this.hidePopup.bind(this)}>
                <form className='block row' onClick={this.onSubmit.bind(this)}>
                    <p className='errormessage'>{errorMessage}</p>
                    <Editor content={content}
                        setContent={this.setContent.bind(this)} />
                    <div className='buttons-right'>
                        <button type='submit'>Save</button>
                    </div>
                </form>
            </Popup>
        )
    }
}


const TextEditor = ({ content, setContent }) => (
    <div>
        <textarea value={content.text} autoFocus={true} placeholder="Text"
            onChange={setContent.bind(this, 'text')}></textarea>
    </div>
);


const FileEditor = ({ content, setContent }) => (
    <div>
        <input type="text" value={content.name} placeholder="Name"
            onChange={setContent.bind(this, 'name')} autoFocus={true} />
        <textarea value={content.description}
            placeholder="Description"
            onChange={setContent.bind(this, 'description')}></textarea>
    </div>
);


const LinkEditor = ({ content, setContent }) => (
    <div>
        <input autoFocus={true} value={content.link} placeholder="Link"
            onChange={setContent.bind(this, 'link')} type="text" /><br/>
        <input type="text" value={content.name} placeholder="Name"
            onChange={setContent.bind(this, 'name')} />
        <textarea value={content.description} placeholder="Description"
            onChange={setContent.bind(this, 'description')}></textarea>
    </div>
);


export default ContentEditor;
