import React from 'react';
import ContentMover from './ContentMover.jsx';
import ContentDeleter from './ContentDeleter.jsx';


/**
 * <ContentDiv>
 * Props:
 *    classe, section, content, isEditable, isFirst, isLast, onMove(isMoveUp)
 */
const ContentDiv = ({ classe, section, content, isEditable, isFirst, isLast,
    onMove, onDeletion }) => {

    let div = null;

    if (content.type == 'text')
        div = (<p>{content.text}</p>);

    else if (content.type == 'link') {
        let link = content.link;
        if (!link.match(/^https?:\/\//i)) link = 'http://' + link;
        div = (<p><a href={link}>{content.name}</a> {content.description}</p>);

    } else if (content.type == 'file') {
        div = (<p><a href={"/file/" + content.file}>
            {content.name}</a> {content.description}</p>);
    }

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
                    <ContentDeleter classeId={classe._id} sectionId={section._id}
                        content={content} onDeletion={onDeletion} />
                </div>}
            {div}
        </div>
    );
}


export default ContentDiv;
