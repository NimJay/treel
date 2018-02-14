/**
 * Note: We use use the French words for "Class" because "class" is a
 * special keyword in JavaScript.
 */
class Classe {
    constructor({ _id, courseCode, courseName, term, isPrivate, isActive,
        school, instructors, creator }) {
        this._id = _id;
        this.courseCode = courseCode;
        this.courseName = courseName;
        this.term = term;
        this.isPrivate = isPrivate;
        this.isActive = isActive;
        this.school = school;
        this.instructors = instructors;
        this.creator = creator;
    }
}


export { Classe };
