import React from 'react';
import { Link } from 'react-router-dom';
import ClasseCreationSection from
    '../sections/ClasseCreationSection/ClasseCreationSection.jsx';

const ClasseCreationPage = ({ app, setApp }) => {
    return (
        <div>
            {app.isLoggedIn() && app.user.type == 1 ?
                <ClasseCreationSection /> :
                <MustBeInstructor />}
        </div>
    );
}

const MustBeInstructor = () => (
    <div className="block row">
        <p>You must be logged in as an Instructor to view this page.</p>
        <Link className="button" to="/">Home</Link>
    </div>
);
export default ClasseCreationPage;
