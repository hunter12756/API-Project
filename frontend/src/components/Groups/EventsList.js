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
        console.log("CURRENT GROUP EVENTS:", filterEvents)
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
        return new Date(a.startDate) - new Date(b.startDate)
    })
    pastEvents.sort((a, b) => {
        return new Date(a.startDate) - new Date(b.startDate)
    })

    console.log("Future events: ", futureEvents)
    console.log("Past Events: ", pastEvents)

    return (
        <>
            {/* Upcoming events */}
            <div className="future-events">
                <h2>{futureEvents.length > 0 ? `Upcoming Events (${futureEvents.length})` : ''}</h2>
                {futureEvents.map((futureEvent) => {
                    { console.log(futureEvent.previewImage) }
                    return (
                        <NavLink to={`/events/${futureEvent.id}`}>
                            <div className="mini-event">
                                <div className="mini-event-img">
                                    <img id='event-lists-images' src={futureEvent.previewImage} alt='test'></img>
                                </div>
                                <div className="mini-event-info">
                                    <div className="mini-event-time">
                                        {futureEvent.startDate.split("T")[0] + ' · ' +'<'+futureEvent.startDate.split("T")[1].split("Z")[0].slice(".",5)+'>'}
                                    </div>
                                    <div className="mini-event-name">
                                        {futureEvent.name}
                                    </div>
                                    <div className="mini-event-location">
                                        {futureEvent.Group.city+', '+futureEvent.Group.state}
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
                    { console.log(pastEvent.previewImage) }
                    return (
                        <NavLink to={`/events/${pastEvent.id}`}>
                            <div className="mini-event">
                                <div className="mini-event-img">
                                    <img id='event-lists-images' src={pastEvent.previewImage} alt='test'></img>
                                </div>
                                <div className="mini-event-info">
                                    <div className="mini-event-time">
                                        {pastEvent.startDate.split("T")[0] + ' · ' +'<'+pastEvent.startDate.split("T")[1].split("Z")[0].slice(".",5)+'>'}
                                    </div>
                                    <div className="mini-event-name">
                                        {pastEvent.name}
                                    </div>
                                    <div className="mini-event-location">
                                        {pastEvent.Group.city+', '+pastEvent.Group.state}
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
