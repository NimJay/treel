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
        <div className="contentdiv row">
            {isEditable && <div>Edit panel</div>}
            {div}
        </div>
    );
}


export default ContentDiv;
