import React from 'react';
import Popup from '../../../components/Popup.jsx';
import FileCreator from './Creator/FileCreator.jsx';
import LinkCreator from './Creator/LinkCreator.jsx';
import TextCreator from './Creator/TextCreator.jsx';


/**
 * <ContentCreatorPopup>
 * Props: classe, section, onCreation(content), onClose
 */
class ContentCreatorPopup extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            type: null
        };
    }

    setType(type) {this.setState({ type });}

    render() {
        let { classe, section, onCreation, onClose } = this.props,
            { type } = this.state;

        if (type == "text") {
            return (
                <Popup onClose={onClose}>
                    <TextCreator classe={classe} section={section}
                        onCreation={onCreation} />
                </Popup>
            );
        } else if (type == "link") {
            return (
                <Popup onClose={onClose}>
                    <LinkCreator classe={classe} section={section}
                        onCreation={onCreation} />
                </Popup>
            );
        } else if (type == "file") {
            return (
                <Popup onClose={onClose}>
                    <FileCreator classe={classe} section={section}
                        onCreation={onCreation} />
                </Popup>
            );
        }

        return (
            <Popup className="contentcreatorpopup-selection" onClose={onClose}>
                <div className="block row">
                    <h2>Select Content Type</h2>
                    <button onClick={this.setType.bind(this, "text")}
                        className="button-mini">Text</button><br/>
                    <button onClick={this.setType.bind(this, "link")}
                        className="button-mini">Link</button><br/>
                    <button onClick={this.setType.bind(this, "file")}
                        className="button-mini">File</button>
                </div>
            </Popup>
        );
    }
}


export default ContentCreatorPopup;
