import { ajax } from 'jquery';
import React from 'react';
import Popup from '../components/Popup.jsx';
import { log } from '../util/Global.js';

/**
 * <SectionCreationSection>
 * Props: classeId, onCreation(section), isAtTop
 */
class SectionCreationSection extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showCreator: false,
            currentAjax: null,
            errorMessage: "",
            name: ""
        };
    }

    showCreator() {this.setState({ showCreator: true, name: "" })}
    hideCreator() {this.setState({ showCreator: false })}
    setName(e) {this.setState({ name: e.target.value })}

    onSubmit(e) {
        e.preventDefault(); // Stop page refresh.
        let { isAtTop, classeId } = this.props,
            { currentAjax, name } = this.state;
        if (currentAjax) return false;
        currentAjax = ajax({
            type: 'POST',
            url: '/api/section/create-section',
            contentType: 'application/json',
            data: JSON.stringify({ classeId, name, isAtTop }),
            dataType: 'json',
            success: this.onAjaxSucces.bind(this),
            error: this.onAjaxError.bind(this)
        });
        this.setState({ currentAjax });
    }
    onAjaxSucces(data) {
        log(data);
        let { error, section } = data,
            callback = null,
            showCreator = true,
            errorMessage = "",
            currentAjax = null;
        if (error && error.code == 4) errorMessage = "Invalid input.";
        else if (error || !section) errorMessage = "Something went wrong.";
        else {
            callback = this.props.onCreation(null, section);
            showCreator = false;
        }
        this.setState({ currentAjax, errorMessage, showCreator }, callback);
    }
    onAjaxError(error) {
        log(error);
        this.setState({ currentAjax: null,
            errorMessage: "Sorry, something went wrong." });
    }

    render () {

        let { onCreation, isAtTop } = this.props,
            { showCreator, name, errorMessage } = this.state;

        return (
            <div className="sectioncreationsection block">
                <div className="align-right row">
                    <button type="button"
                        onClick={this.showCreator.bind(this)}>
                        New Section</button>
                </div>
                {showCreator &&
                    <Popup onClose={this.hideCreator.bind(this)}>
                        <form onSubmit={this.onSubmit.bind(this)}
                            className="block row">
                            <h2>Create a Section</h2>
                            <p className="errormessage">{errorMessage}</p>
                            <input type="text" value={name} autoFocus={true}
                                onChange={this.setName.bind(this)}
                                placeholder="Name" />
                            <div className="buttons-right">
                                <button type="submit">Create</button>
                            </div>
                        </form>
                    </Popup>}
            </div>
        );
    }
}


export default SectionCreationSection;
