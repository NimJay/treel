import React from 'react';
import Popup from '../../components/Popup.jsx';
import ClasseEditor from './ClasseEditor.jsx';


/**
 * <ClasseSection>
 * Props: isEditable, classe, onUpdate(classe)
 */
class ClasseSection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showEditor: false
        };
    }

    showEditor() {this.setState({ showEditor: true });}
    hideEditor() {this.setState({ showEditor: false });}
    onUpdate(classe) {
        this.setState({ showEditor: false },
            this.props.onUpdate.bind(null, classe));
    }

    render() {

        let { isEditable, classe, onUpdate } = this.props,
            { showEditor } = this.state;

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
                {!classe.isActive && isEditable && <InactiveDiv />}
                {showEditor &&
                    <Popup onClose={this.hideEditor.bind(this)}>
                        <ClasseEditor classe={classe}
                            onUpdate={this.onUpdate.bind(this)} />
                    </Popup>}
            </header>
        );
    }
}


const InactiveDiv = () => (
    <aside className="row">
        This page is <span className="color-red">inactive</span>.
    </aside>
);

const InstructorsDiv = ({ instructors }) => (
    instructors.length == 0 ? null :
        <div>{instructors.map(i => i.name).join(', ')}</div>
);


export default ClasseSection;
