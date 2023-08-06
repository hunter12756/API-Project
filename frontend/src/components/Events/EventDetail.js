import './EventDetail.css'
import { useParams, useHistory, NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import * as eventData from '../../store/events'
import OpenModalButton from '../OpenModalButton'
import DeleteEventModal from './DeleteEventModal';

export default function EventDetail() {
    let { eventId } = useParams();
    let dispatch = useDispatch();
    let history = useHistory();
    const currentUser = useSelector(state => state.session.user)
    let event = useSelector(state => state.event.singleEvent);
    console.log(event)
    useEffect(() => {
        dispatch(eventData.getOneEventThunk(eventId))
    }, [dispatch, eventId])

    if (!event.id) return null;
    const comingSoon = () => {
        alert("Feature coming soon...")
    }


    return (
        <>
            <div className='group-info-page'>
                <div className='back-link'>
                    <NavLink id='back-button'to='/events'>{'< '}Events</NavLink>
                </div>
                <div id='name-detail'>
                    <h1> {event.name}</h1>
                </div>
                    <div>
                        Hosted by: {event.Organizer.firstName + ' ' + event.Organizer.lastName}
                    </div>
                <div className='top-info'>
                    <div id='img-container'>
                        <img className='img' alt='preview' src={event.EventImages[0].url}></img>
                        {console.log(event.EventImages[0].url)}
                    </div>
                    <div id='info-container'>
                        <div >
                            <NavLink id='group-link-info' to={`/groups/${event.Group.id}`}>

                                <div>

                                    <img id='tiny-img' src={event.GroupImages[0].url}></img>
                                </div>
                                <div>
                                    <div>
                                        {event.Group.name}
                                    </div>
                                    <div id='ocation-detail'>
                                        {event.Group.state + ", " + event.Group.city}
                                    </div>
                                    <div id='umMembers-detail'>
                                        {event.Group.private ? <div>· Private</div> : <div> · Public</div>}
                                    </div>

                                </div>
                            </NavLink>
                        </div>
                        <div className='event-detail-info'>
                            <div id='time-container'>
                                <div id='time-detail'>
                                    Start: {event.startDate.split("T")[0]+ ' · '+ event.startDate.split("T")[1].split("Z")[0].slice(".",5)}
                                </div>
                                <div id='time-detail'>
                                    End: {event.endDate.split("T")[0]+ ' · ' + event.endDate.split("T")[1].split("Z")[0].slice(".",5)}
                                </div>
                            </div>
                            <div id='price-container'>
                                Price: {event.price<=0 ? 'FREE' : event.price}
                            </div>
                            <div id='location-container'>
                                Location: {event.Group.city +', '+ event.Group.state}
                            </div>
                        </div>
                        <div id='authorized-btn' hidden={!currentUser || currentUser.id !== event.Group.id}>
                            {console.log(event)}
                            <OpenModalButton
                                id='link-btns'
                                modalComponent={<DeleteEventModal />}
                                buttonText='Delete' />
                        </div>
                    </div>

                </div>
                <div className='middle-info'>
                    <h1>Details</h1>
                    <div id='description-detail'>
                        {event.description}
                    </div>

                </div>

                {/* if group has past events put in div that shows pastevents */}
                <div className='upcoming-events-container'>

                </div>
                {/* if group has past events put in div that shows pastevents */}
                <div className='past-events-container'>

                </div>
            </div>
        </>
    )

}
