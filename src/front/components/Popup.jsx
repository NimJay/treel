import React from 'react';

const Popup = ({ children, onClose, className }) => (
    <div className="popup-wall">
        <div className={"popup " + (className ? className : '')}>
            <div className="popup-close">
                {onClose &&
                    <span onClick={onClose} className="icon icon-close"></span>}
            </div>
            {children}
        </div>
    </div>
);

export default Popup;
