import { ajax } from 'jquery';
import React from 'react';
import AnnouncementCreator from './AnnouncementCreator.jsx';


class AnnouncementsSection extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            currentAjax: null,
            showCreator: false, // Show/Hide <AnnouncementCreator>.
            showAnnouncements: false,
            numShown: 2 // 'Show older...' functionality.
        };
    }

    showCreator() {this.setState({ showCreator: true });}
    hideCreator() {this.setState({ showCreator: false });}
    showOlder() {this.setState({ 'numShown': this.state.numShown + 3 });}
    
    render() {
        let { announcements, classe, isEditable, onCreation } = this.props,
            { showCreator, numShown } = this.state;

        if (!isEditable && announcements.length == 0)
            return null;

        let sorter = (a, b) => {
            if (new Date(a.timeCreated) > new Date(b.timeCreated))
                return -1;
            return 1;
        };
        announcements = announcements.sort(sorter);
        let divs = announcements.slice(0, numShown).map((a, i) => (
            <div key={i} className='announcementssection-announcement'>
                <div>{a.text}</div>
                <div>{toHumanTime(a.timeCreated)}</div>
            </div>
        ));

        return (
            <section className='announcementssection block row'>
                {!isEditable && <h2>Announcements</h2>}
                {isEditable &&
                    <button className='button-mini'
                        onClick={this.showCreator.bind(this)}
                        type='button'>Create Announcement</button>}
                {divs}
                {showCreator &&
                    <AnnouncementCreator classe={classe}
                        onCreation={onCreation}
                        onClose={this.hideCreator.bind(this)} />}
                {announcements.length > numShown &&
                    <button className='button-mini'
                        onClick={this.showOlder.bind(this)}
                        type='button'>Show Older</button>}
            </section>
        )
    }
}

function toHumanTime(time) {
	let now = Date.now(),
        then = new Date(time);

	var sec = (now - then) / 1000; // Difference in seconds.
	if (sec < 10) {return "a few seconds ago"}

	var min = sec / 60; // Difference in minutes.
	if (min < 2) {return "a minute ago"}
	if (min < 50) {return Math.floor(min) + " minutes ago"}

	var hour = min / 60; // Difference in hour.
	if (hour < 2) {return "an hour ago"}
	if (hour < 23) {return Math.floor(hour) + " hours ago"}

	var day = hour / 24; // Difference in days.
	if (day < 2) {return "yesterday"}
	if (day < 6) {return "a few days ago"}
	if (day < 12) {return "about a week ago"}
	if (day < 24) {return "a few weeks ago"}

	var month = day / 7; // Difference in months.
	if (month < 11) {return Math.floor(month) + " months ago"}

	var year = month / 30; // Difference in years.
	if (year < 2) {return "about a year ago"}
	return Math.floor(month) + " years ago";
}

export default AnnouncementsSection;
