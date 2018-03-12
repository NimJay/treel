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

    searchScore(searchString) {
        let ss = searchString.toLowerCase().trim().split(/\s+/);
        let score = 2 - (ss.length * 1);
        for (var i in ss) {
            let s = ss[i]; // Current word of searchString.
            score += this.courseCode.toLowerCase().includes(s) * 4;
            score += this.courseCode.toLowerCase().includes(s) * 2;
            if (this.school.name)
                score += this.school.name.toLowerCase().includes(s);
            if (Array.isArray(this.instructors)) {
                this.instructors.map(i =>
                    { score += i.name.toLowerCase().includes(s) }
                )
            }
        }
        return score;
    }
}


export { Classe };
