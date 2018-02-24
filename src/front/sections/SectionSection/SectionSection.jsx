import React from 'react';
import Popup from '../../components/Popup.jsx';
import SectionEditor from './SectionEditor.jsx';
import SectionMover from './SectionMover.jsx';


/**
 * <SectionSection>
 * Props:
 *    classeId, section, onUpdate(section), onDelete(), onMove(), isEditable,
 *    isFirst, isLast
 */
class SectionSection extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showEditor: false
        };
    }


    showEditor() {this.setState({ showEditor: true });}
    hideEditor() {this.setState({ showEditor: false });}
    onUpdate(section) {
        this.setState({ showEditor: false },
            this.props.onUpdate.bind(null, section));
    }


    render() {

        let { classeId, section, onMove, isEditable, isFirst, isLast } =
            this.props,
            { showEditor } = this.state;

        return (
            <section className={"sectionsection block" +
                (section.isDeleted ? ' deleted' : '')}>
                <div className="row">
                    <div><h2>{section.name}</h2></div>
                    {isEditable ?
                        <div>
                            <SectionMover isMoveUp={false} onMove={onMove}
                                disabled={isLast} classeId={classeId}
                                sectionId={section._id} />
                            <SectionMover isMoveUp={true} onMove={onMove}
                                disabled={isFirst} classeId={classeId}
                                sectionId={section._id} />
                            <span className="icon icon-edit"
                                onClick={this.showEditor.bind(this)}></span>
                        </div>
                        : <div></div>}
                    {section.isDeleted && <DeletedWarning/>}
                </div>
                {showEditor &&
                    <Popup onClose={this.hideEditor.bind(this)}>
                        <SectionEditor section={section} classeId={classeId}
                            onUpdate={this.onUpdate.bind(this)} />
                    </Popup>}
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
