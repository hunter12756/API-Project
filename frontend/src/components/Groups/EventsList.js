import { NavLink, useHistory } from "react-router-dom"
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as eventData from '../../store/events'
export default function EventsList({ events, groupId }) {
    const [futureEvents, setFutureEvents] = useState([]);
    const [pastEvents, setPastEvents] = useState([]);
    const time = new Date();
    const history = useHistory();
    const dispatch = useDispatch();
    useEffect(() => {
        const eventsArr = Object.values(events)
        const filterEvents = eventsArr.filter((events) => events.groupId === Number(groupId))

        let fEvents = [];
        let pEvents = [];
        for (let event of filterEvents) {
            if (new Date(event.startDate) > time) {
                fEvents.push(event)
            } else {
                pEvents.push(event)
            }
        }
        setFutureEvents(fEvents)
        setPastEvents(pEvents)
    }, [events])

    futureEvents.sort((a, b) => {
        const dateA = new Date(a.startDate);
        const dateB = new Date(b.startDate);

        if (dateA > new Date() && dateB > new Date()) {
            return dateA - dateB; // Both upcoming, sort by date
        } else if (dateA <= new Date() && dateB <= new Date()) {
            return dateA - dateB; // Both past, sort by date
        } else if (dateA <= new Date()) {
            return 1; // a is past, b is upcoming
        } else {
            return -1; // a is upcoming, b is past
        }
    });
    pastEvents.sort((a, b) => {
        const dateA = new Date(a.startDate);
        const dateB = new Date(b.startDate);

        if (dateA > new Date() && dateB > new Date()) {
            return dateA - dateB; // Both upcoming, sort by date
        } else if (dateA <= new Date() && dateB <= new Date()) {
            return dateA - dateB; // Both past, sort by date
        } else if (dateA <= new Date()) {
            return 1; // a is past, b is upcoming
        } else {
            return -1; // a is upcoming, b is past
        }
    });
    return (
        <>
            {/* Upcoming events */}
            <div className="future-events">
                <h2>{futureEvents.length > 0 ? `Upcoming Events (${futureEvents.length})` : ''}</h2>
                {futureEvents.map((futureEvent) => {
                    return (
                        <NavLink key={futureEvent.id} to={`/events/${futureEvent.id}`}>
                            <div className="mini-event">
                                <div className="mini-event-img">
                                    <img id='event-lists-images' src={futureEvent.previewImage} alt='test'></img>

                                </div>

                                <div className="mini-event-info">
                                    <div className="mini-event-time">
                                        {futureEvent.startDate.split("T")[0] + ' · ' + '<' + futureEvent.startDate.split("T")[1].split("Z")[0].slice(".", 5) + '>'}
                                    </div>
                                    <div className="mini-event-name">
                                        {futureEvent.name}
                                    </div>
                                    <div className="mini-event-location">
                                        {futureEvent.Group.city + ', ' + futureEvent.Group.state}
                                    </div>
                                </div>
                                <div className="mini-event-about">
                                        {futureEvent.description}
                                    </div>

                            </div>

                        </NavLink>
                    )

                })}
            </div>
            {/* Past events */}
            <div className="past-events">
                <h2> {pastEvents.length > 0 ? `Past Events (${pastEvents.length})` : ''}</h2>
                {pastEvents.map((pastEvent) => {

                    return (
                        <NavLink key={pastEvent.id} to={`/events/${pastEvent.id}`}>
                            <div className="mini-event">
                                <div className="mini-event-img">
                                    <img id='event-lists-images' src={pastEvent.previewImage} alt='test'></img>
                                </div>
                                <div className="mini-event-info">
                                    <div className="mini-event-time">
                                        {pastEvent.startDate.split("T")[0] + ' · ' + '<' + pastEvent.startDate.split("T")[1].split("Z")[0].slice(".", 5) + '>'}
                                    </div>
                                    <div className="mini-event-name">
                                        {pastEvent.name}
                                    </div>
                                    <div className="mini-event-location">
                                        {pastEvent.Group.city + ', ' + pastEvent.Group.state}
                                    </div>
                                </div>
                                <div className="mini-event-about">
                                    {pastEvent.description}
                                </div>
                            </div>

                        </NavLink>
                    )

                })}
            </div>
        </>
    )
}
