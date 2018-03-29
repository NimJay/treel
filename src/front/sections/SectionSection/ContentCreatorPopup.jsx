import React from 'react';
import Popup from '../../components/Popup.jsx';
import ParagraphCreator from './ParagraphCreator.jsx';
import LinkCreator from './LinkCreator.jsx';


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

        if (type == "paragraph") {
            return (
                <Popup onClose={onClose}>
                    <ParagraphCreator classe={classe} section={section}
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
        }
        if (type == "file") return null;

        return (
            <Popup onClose={onClose}>
                <div className="block row">
                    <h2>Select Content Type</h2>
                    <button onClick={this.setType.bind(this, "paragraph")}
                        className="button-mini">Paragraph</button><br/>
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
