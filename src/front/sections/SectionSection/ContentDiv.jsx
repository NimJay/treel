import React from 'react';

/**
 * <ContentDiv>
 * Props: classe, section, content, isEditable
 */
const ContentDiv = ({ classe, section, content, isEditable }) => {

    let div = null;
    if (content.type == 'paragraph')
        div = (<p>{content.paragraph}</p>);

    return (
        <div className={"contentdiv row" + (isEditable ? ' editable' : '')}>
            {isEditable &&
                <div className="contentdiv-icons">
                    <span className="icon icon-arrow-down"></span>
                    <span className="icon icon-arrow-up"></span>
                    <span className="icon icon-edit"></span>
                </div>}
            {div}
        </div>
    );
}


export default ContentDiv;
