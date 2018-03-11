/**
 * A User of Treel.
 */
class User {
    constructor({ _id, email, name, type }) {
        this._id = _id;
        this.email = email;
        this.name = name;
        this.type = type;
    }
    isInstructor() {return this.type == 1;}
    isStudent() {return this.type == 2;}
}


export { User };
