import React from 'react';

const Popup = ({ children, isClosable, onClose }) => (
    <div className="popup-wall">
        <div className="popup">
            <div className="popup-close">
                {!isClosable &&
                    <span onClick={onClose} className="icon icon-close"></span>}
            </div>
            {children}
        </div>
    </div>
);

export default Popup;
