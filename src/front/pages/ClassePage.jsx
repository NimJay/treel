import { ajax } from 'jquery';
import React from 'react';
import Nav from '../components/Nav.jsx';
import { Classe } from '../model/Classe.js';
import ClasseSection from '../sections/ClasseSection/ClasseSection.jsx';
import FollowSection from '../sections/FollowSection.jsx';
import SectionCreationSection from '../sections/SectionCreationSection.jsx';
import SectionSection from '../sections/SectionSection/SectionSection.jsx';
import { log } from '../util/Global.js';


class ClassePage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isMounted: false,
            currentAjax: null,
            invalid: false,
            error: false,
            classe: null,
            sections: null
        };
    }

    componentDidMount() {
        this.setState({
            isMouned: true,
            currentAjax: this.getClasse()
        });
    }

    getClasse() {
        return ajax({
            url: '/api/classe/get-classe',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ classeId:this.props.match.params.classeId }),
            dataType: 'json',
            success: this.onAjaxSuccess.bind(this),
            error: this.onAjaxError.bind(this)
        });
    }
    onAjaxSuccess(data) {
        log(data);
        let { error, classe, sections, follow } = data,
            currentAjax = null;
        if (classe) classe = new Classe(classe);
        let invalid = error && error.code == 4;
        error = !!error;
        this.setState(
            { error, invalid, currentAjax, classe, sections, follow });
    }
    onAjaxError(error) {
        log(error);
        this.setState({ error: true, currentAjax: null });
    }

    setClasse(classe) {this.setState({ classe });}
    setFollow(follow) {this.setState({ follow });}

    onSectionCreation(isAtTop, section) {
        let { sections } = this.state;
        // Warning: May be buggy; consider cloning.
        if (isAtTop) sections.sections.unshift(section);
        else sections.sections.push(section);
        this.setState({ sections });
    }

    onSectionUpdate(i, updated) {
        let { sections } = this.state;
        // Warning: May be buggy; consider cloning.
        sections.sections[i] = updated;
        this.setState({ sections });
    }

    onSectionMove(i, isMoveUp) {
        let ss = this.state.sections,
            swapIsDeleted = true;
        // Warning: May be buggy; consider cloning.
        if (isMoveUp) { // Move up until we're above a non-deleted Section.
            while (i > 0 && swapIsDeleted) {
                swapIsDeleted = ss.sections[i - 1].isDeleted;
                var temp = ss.sections[i];
                ss.sections[i] = ss.sections[i - 1];
                ss.sections[i - 1] = temp;
                i--;
            }
        } else { // Move down until we're below a non-deleted Section.
            while (i < ss.sections.length - 1 && swapIsDeleted) {
                swapIsDeleted = ss.sections[i + 1].isDeleted;
                var temp = ss.sections[i];
                ss.sections[i] = ss.sections[i + 1];
                ss.sections[i + 1] = temp;
                i++;
            }
        }
        this.setState({ sections: ss });
    }

    render() {

        let { app, setApp } = this.props,
            { isMounted, currentAjax, invalid, error, classe, sections,
                follow } = this.state;

        if (isMounted) return false;
        if (currentAjax) return <LoadingSection app={app} setApp={setApp} />;
        if (invalid) return <InvalidSection app={app} setApp={setApp} />;
        if (error || !classe || !sections)
            return <ErrorSection app={app} setApp={setApp} />;

        // Only editable to creator and instructors.
        let isEditable = app.isLoggedIn() &&
            (classe.instructors.map(i => i._id) + [classe.creator._id])
                .includes(app.user._id);
        let sectionSections = sections.sections.map((s, i) =>
            <SectionSection section={s} key={i} isEditable={isEditable}
                isFirst={i == 0} isLast={i == sections.sections.length - 1}
                onUpdate={this.onSectionUpdate.bind(this, i)}
                onMove={this.onSectionMove.bind(this, i)}
                classeId={classe._id} />
        );

        return (
            <div>
                {app.isLoggedIn() && <Nav app={app} setApp={setApp} />}
                <ClasseSection classe={classe} isEditable={isEditable}
                    onUpdate={this.setClasse.bind(this)} />
                {isEditable &&
                    <SectionCreationSection classeId={classe._id} isAtTop={true}
                        onCreation={this.onSectionCreation.bind(this, true)} />}
                {!isEditable && <FollowSection follow={follow} classe={classe}
                    setFollow={this.setFollow.bind(this)} />}
                {sectionSections}
                {isEditable && sections.sections.length > 0 &&
                    <SectionCreationSection classeId={classe._id}
                        isAtTop={false}
                        onCreation={this.onSectionCreation.bind(this, false)} />}
            </div>
        );
    }
}

const Section = ({ p, app, setApp }) => (
    <div>
        <Nav app={app} setApp={setApp} />
        <main className="block row"><p>{p}</p></main>
    </div>
);
const LoadingSection = (props) => <Section p="Loading..." {...props} />;
const InvalidSection = (props) => <Section p="This page is either non-existent or private." {...props} />;
const ErrorSection = (props) => <Section p="Sorry, something went wrong." {...props} />;

export default ClassePage;
