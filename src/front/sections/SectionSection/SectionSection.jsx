import React from 'react';
import Popup from '../../components/Popup.jsx';
import SectionEditor from './SectionEditor.jsx';
import SectionMover from './SectionMover.jsx';
import ContentCreatorPopup from './ContentCreatorPopup.jsx';
import ContentDiv from './ContentDiv.jsx';


/**
 * <SectionSection>
 * Props:
 *    classe, section, onUpdate(section), onDelete(), onMove(), isEditable,
 *    isFirst, isLast, onContentCreation(content), onContentMove(j, isMoveUp)
 */
class SectionSection extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showEditor: false, // <SectionEditor>
            showCreator: false // <ContentCreatorPopup>
        };
    }


    showEditor() {this.setState({ showEditor: true });}
    hideEditor() {this.setState({ showEditor: false });}
    showCreator() {this.setState({ showCreator: true });}
    hideCreator() {this.setState({ showCreator: false });}
    onUpdate(section) {
        this.setState({ showEditor: false },
            this.props.onUpdate.bind(null, section));
    }

    onContentCreation(content) {
        this.setState({ showCreator: false },
            this.props.onContentCreation.bind(null, content));
    }


    render() {

        let { classe, section, onMove, isEditable, isFirst, isLast,
            onContentCreation, onContentMove, onContentDeletion } = this.props,
            { showEditor, showCreator } = this.state;

        let contentDivs = section.contents.map((c, i) =>
            <ContentDiv classe={classe} section={section} content={c}
                isEditable={isEditable} key={c._id}
                isFirst={i == 0} isLast={i + 1 == section.contents.length}
                onMove={onContentMove.bind(null, i)}
                onDeletion={onContentDeletion.bind(null, i)} />
        );

        return (
            <section className={"sectionsection block" +
                (section.isDeleted ? ' deleted' : '') +
                (isEditable ? ' editable' : '')}>
                <div className="row">
                    <div><h2>{section.name}</h2></div>
                    {isEditable ?
                        <div>
                            <SectionMover isMoveUp={false} onMove={onMove}
                                disabled={isLast} classeId={classe._id}
                                sectionId={section._id} />
                            <SectionMover isMoveUp={true} onMove={onMove}
                                disabled={isFirst} classeId={classe._id}
                                sectionId={section._id} />
                            <span className="icon icon-edit"
                                onClick={this.showEditor.bind(this)}></span>
                        </div>
                        : <div></div>}
                    {section.isDeleted && <DeletedWarning/>}
                </div>
                {contentDivs}
                {isEditable &&
                    <div className="row">
                        <button onClick={this.showCreator.bind(this)}
                            className="button-mini">Add Content</button>
                    </div>}
                {showEditor &&
                    <Popup onClose={this.hideEditor.bind(this)}>
                        <SectionEditor section={section} classeId={classe._id}
                            onUpdate={this.onUpdate.bind(this)} />
                    </Popup>}
                {showCreator &&
                    <ContentCreatorPopup onClose={this.hideCreator.bind(this)}
                        onCreation={this.onContentCreation.bind(this)}
                        classe={classe} section={section} />}
            </section>
        );
    }
}

const DeletedWarning = () => (
    <p>
        This section will be
        <span className="color-red"> deleted </span>
        the next time you load this page.
    </p>
);

export default SectionSection;
