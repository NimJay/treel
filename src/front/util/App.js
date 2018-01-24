/**
 * App carries global data such as the logged-in User, their school, etc.
 * The outer-most React component uses an App object
 * to manage the global state of the application.
 * This App object (and its properties) is passed down to any React component
 * that requires it.
 */
class App {
    constructor({ user }) {
        this.user = user;
    }

    isLoggedIn() {
        return !!this.user;
    }
}


export { App };
