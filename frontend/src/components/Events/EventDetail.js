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
                    <NavLink to='/events'>{'< '}Events</NavLink>
                </div>
                <div id='name-detail'>
                            <h1> {event.name}</h1>
                        </div>
                <div className='top-info'>
                <div>
                    Hosted by, {event.Group.Organizer + event.Group.Organizer}
                </div>
                    <div id='img-container'>
                        <img className='img' alt='preview' src={event.EventImages[0].url}></img>
                        {console.log(event.EventImages[0].url)}
                    </div>
                    <div id='info-container'>

                        <div id='location-detail'>
                            {event.state}
                        </div>
                        {/* <div id='numMembers-detail'>
                            {event.private ? <div>{event.numMembers} Members · Private</div> : <div>{group.numMembers} Members · Public</div>}
                        </div> */}
                        {/* <div id='organizer-detail'>
                            Organized by {group.Organizer.firstName + ' ' + group.Organizer.lastName}
                        </div> */}

                        {/* TODO ADD IMPLEMENTATION */}
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
