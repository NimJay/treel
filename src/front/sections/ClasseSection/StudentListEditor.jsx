import React from 'react';


class MyComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            currentAjax: null // The current AJAX request.
        };
    }

    render() {
        let { } = this.props,
            { } = this.state;
        return (
            <div>
                MyComponent
            </div>
        );
    }
}


export default MyComponent;
