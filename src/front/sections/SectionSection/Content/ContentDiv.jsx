import React from 'react';
import ContentMover from './ContentMover.jsx';
import ContentDeleter from './ContentDeleter.jsx';
import ContentEditor from './ContentEditor.jsx';


/**
 * <ContentDiv>
 * Props:
 *    classe, section, content, isEditable, isFirst, isLast, onMove(isMoveUp),
 *    onDeletion(), onUpdate(content)
 */
class ContentDiv extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showIcons: false
        }
    }

    showIcons() {this.setState({ showIcons: true });}
    hideIcons() {this.setState({ showIcons: false });}

    render() {
        let { classe, section, content, isEditable, isFirst, isLast,
            onMove, onDeletion, onUpdate } = this.props,
            { showIcons } = this.state;

        let div = null;
        if (content.type == 'text') {
            div = (<p>{content.text.split('\n')
                .map((a, i) => <span key={i}>{a}<br/></span>)}</p>);

        } else if (content.type == 'link') {
            let link = content.link;
            if (!link.match(/^https?:\/\//i)) link = 'http://' + link;
            div = (<p><a href={link}>{content.name}</a> {content.description}</p>);

        } else if (content.type == 'file') {
            div = (<p><a href={"/file/" + content.file}>
                {content.name}</a> {content.description}</p>);
        }


        return (
            <div className={"contentdiv row" + (isEditable ? ' editable' : '')}>

                {isEditable && showIcons &&
                    <div className='contentdiv-icons'
                        onMouseLeave={this.hideIcons.bind(this)}>
                        <ContentDeleter classeId={classe._id} sectionId={section._id}
                            content={content} onDeletion={onDeletion} />
                        <ContentMover classeId={classe._id} sectionId={section._id}
                            contentId={content._id} isMoveUp={false}
                            disabled={isLast} onMove={null} onMove={onMove} />
                        <ContentMover classeId={classe._id} sectionId={section._id}
                            contentId={content._id} isMoveUp={true}
                            disabled={isFirst} onMove={null} onMove={onMove} />
                        <ContentEditor classeId={classe._id} sectionId={section._id}
                            content={content} onUpdate={onUpdate} />
                        <span className='icon icon-more-horizontal'></span>
                    </div>}

                {isEditable && !showIcons &&
                    <div className='contentdiv-icons'>
                        <span className='icon icon-more-horizontal'
                            onMouseEnter={this.showIcons.bind(this)}></span>
                    </div>}

                {div}
            </div>
        );
    }
}


export default ContentDiv;
