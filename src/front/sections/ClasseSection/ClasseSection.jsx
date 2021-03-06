import React from 'react';
import Popup from '../../components/Popup.jsx';
import ClasseEditor from './ClasseEditor.jsx';
import StudentListEditor from './StudentListEditor.jsx';


/**
 * <ClasseSection>
 * Props: isEditable, classe, onUpdate(classe)
 */
class ClasseSection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showEditor: false,
            showSLEditor: false // Hide/Show <StudentListEditor>
        };
    }

    showEditor() {this.setState({ showEditor: true });}
    hideEditor() {this.setState({ showEditor: false });}
    showSLEditor() {this.setState({ showSLEditor: true, showEditor: false });}
    hideSLEditor() {this.setState({ showSLEditor: false });}
    onUpdate(classe) {
        this.setState({ showEditor: false },
            this.props.onUpdate.bind(null, classe));
    }

    render() {

        let { isEditable, classe, onUpdate } = this.props,
            { showEditor, showSLEditor } = this.state;

        return (
            <header className="block classesection">
                {!classe.isActive && !isEditable && <InactiveDiv />}
                <div className="row">
                    <div>
                        <h1>
                            {classe.courseCode + ' '}
                            <span>{classe.courseName}</span>
                        </h1>
                    </div>
                    <div>
                        {isEditable && <span className="icon icon-edit"
                            onClick={this.showEditor.bind(this)}></span>}
                    </div>
                    <div>{classe.term} &mdash; {classe.school.name}</div>
                    <InstructorsDiv instructors={classe.instructors} />
                </div>
                {isEditable && <PrivateActiveDiv isPrivate={classe.isPrivate}
                    isActive={classe.isActive} />}
                {showEditor &&
                    <Popup onClose={this.hideEditor.bind(this)}>
                        <ClasseEditor classe={classe}
                            onEditStudentList={this.showSLEditor.bind(this)}
                            onUpdate={this.onUpdate.bind(this)} />
                    </Popup>}
                {showSLEditor &&
                    <Popup onClose={this.hideSLEditor.bind(this)}>
                        <StudentListEditor classe={classe}
                            onClose={this.hideSLEditor.bind(this)} />
                    </Popup>}
            </header>
        );
    }
}

const InactiveDiv = () => (
    <aside className="row">
        This page is<span className="color-red"> inactive</span>.
    </aside>
);

const PrivateActiveDiv = ({ isPrivate, isActive }) => {
    if (!isPrivate && isActive) return null;
    return (
        <aside className="row">
            This page is
                {isPrivate && ' private'}
                {isPrivate && !isActive && ' and'}
                {!isActive && <span className="color-red"> inactive</span>}.
        </aside>
    );
};

const InstructorsDiv = ({ instructors }) => (
    instructors.length == 0 ? null :
        <div>{instructors.map(i => i.name).join(', ')}</div>
);


export default ClasseSection;
