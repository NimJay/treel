import React from 'react';
import ContentMover from './ContentMover.jsx';


/**
 * <ContentDiv>
 * Props:
 *    classe, section, content, isEditable, isFirst, isLast, onMove(isMoveUp)
 */
const ContentDiv = (
    { classe, section, content, isEditable, isFirst, isLast, onMove }) => {

    let div = null;
    if (content.type == 'paragraph')
        div = (<p>{content.paragraph}</p>);

    return (
        <div className={"contentdiv row" + (isEditable ? ' editable' : '')}>
            {isEditable &&
                <div className="contentdiv-icons">
                    <ContentMover classeId={classe._id} sectionId={section._id}
                        contentId={content._id} isMoveUp={false}
                        disabled={isLast} onMove={null} onMove={onMove} />
                    <ContentMover classeId={classe._id} sectionId={section._id}
                        contentId={content._id} isMoveUp={true}
                        disabled={isFirst} onMove={null} onMove={onMove} />
                    <span className="icon icon-edit"></span>
                </div>}
            {div}
        </div>
    );
}


export default ContentDiv;
