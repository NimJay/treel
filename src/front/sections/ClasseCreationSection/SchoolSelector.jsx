import React from 'react';
import { ajax } from 'jquery';
import { School, searchSchools } from '../../model/School.js';
import { log } from '../../util/Global.js';


/**
 * <SchoolSelector>
 * Props: school, onSelect(school), createNewSchool()
 */
class SchoolSelector extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isMounted: false,
            currentAjax: null,
            error: false,
            schools: null,
            searchString: "",
            displayCantFind: false
        };
    }

    componentDidMount() {
        this.setState({
            isMounted: true,
            currentAjax: this.getSchools()
        });
    }

    getSchools() {
        return ajax({
            'type': 'POST',
            'url': '/api/school/get-schools',
            'dataType': 'json',
            'success': this.onAjaxSuccess.bind(this),
            'error': this.onAjaxError.bind(this)
        });
    }
    onAjaxSuccess(data) {
        log(data);
        let { error, schools } = data,
            currentAjax = null;
        error = error || !schools;
        if (schools) schools = schools.map(s => new School(s));
        this.setState({ schools, error, currentAjax });
    }
    onAjaxError(error) {
        log(error);
    }

    setSearchString(e) {
        this.setState({ searchString: e.target.value, displayCantFind: true });
    }

    render() {
        let { school, onSelect, createNewSchool } = this.props,
            { isMounted, currentAjax, error, schools,
            searchString, displayCantFind } = this.state;

        if (!isMounted) return null;
        if (currentAjax) return <LoadingSection />;
        if (error) return <ErrorSection />;
        if (school)
            return <SelectedSchool school={school}
                onEdit={onSelect.bind(null, null)} />;

        schools = searchSchools(schools, searchString);

        let schoolDivs = schools.map(s =>
            <SchoolDiv school={s} onClick={onSelect.bind(null, s)}
                key={s._id} />);

        return (
            <div className="schoolselector">
                <h2>Find Your School</h2>
                <input type="text" placeholder="Search" autoFocus={true}
                    value={searchString}
                    onChange={this.setSearchString.bind(this)} />
                {schoolDivs}
                {displayCantFind ?
                    <CantFindP createNewSchool={createNewSchool} /> : null}
            </div>
        );
    }
}

const CantFindP = ({ createNewSchool }) => (
    <p className="schoolselector-cantfind">
        Can't find your school?{" "}
        <span onClick={createNewSchool}>
            Add it to our database.
        </span>
    </p>
);

const SelectedSchool = ({ school, onEdit }) => (
    <div className="selectedschool">
        <div>
            <span>{school.name}</span>
            <span>{school.country}</span>
        </div>
        <div>
            <span className="icon icon-edit" onClick={onEdit}></span>
        </div>
    </div>
);
const ErrorSection = () => (<div><p>Sorry, something went wrong. Please try refreshing.</p></div>);
const LoadingSection = () => (<div><p>Loading...</p></div>);
const SchoolDiv = ({ school, onClick }) => (
    <div onClick={onClick} className="schoolselector-school">
        <span>{school.name}</span>
        <span>{school.country}</span>
    </div>
);

export default SchoolSelector;
