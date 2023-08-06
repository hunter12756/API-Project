import './Events.css'
import { useParams, Link, useHistory, NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import * as eventData from '../../store/events'

export default function Events() {
    const params = useParams();
    const dispatch = useDispatch();
    const history = useHistory();
    const path = window.location.pathname;
    //load up da data
    let events = useSelector(state => state.event.allEvents);
    let eventsArr = Object.values(events)
    useEffect(() => {
        dispatch(eventData.getAllEventsThunk())
    }, [dispatch])
    if(!events) return;

    return (
        <>
            <div className='groups-page'>
                <div className='top'>
                    <div className="event-group-links">
                        <NavLink id={path.startsWith('/events') ? "top-link-active" : "top-link-total"} to='/events'>Events</NavLink>
                        <NavLink id={path.startsWith('/groups') ? "top-link-active" : "top-link-total"} to='/groups'>Groups</NavLink>

                    </div>
                    <div className='link-subtext'>
                        Events in Game Up
                    </div>
                </div>
                <div className='groups-container'>
                    <div className='all-groups'>

                        {eventsArr.map(event => {
                            return (
                                <NavLink id="middle-links" key={event.id} to={`events/${event.id}`}>
                                    <div className='one-group'>
                                        <div className='img-container'>
                                            <img id='img' src={event && event.previewImage}></img>
                                        </div>
                                        <div className='group-info'>
                                        <div id='time'>
                                            {console.log(event)}
                                                {event.startDate && (
                                                    event.startDate.split("T")[0] + ' · ' +'<'+event.startDate.split("T")[1].split("Z")[0].slice(".",5)+'>' )}
                                            </div>
                                            <div id="name">
                                                <h1>{event && event.name}</h1>
                                            </div>
                                            {/* Broken on render */}
                                            <div id='location'>
                                                <p>Location: {event.Group && event.Group.city + ', ' + event.Group && event.Group.state}</p>
                                            </div>
                                            <div id='about'>
                                                {event && event.description}
                                            </div>
                                        </div>
                                    </div>
                                </NavLink>
                            );
                        })}
                    </div>
                </div>
            </div>

        </>

    );
}
