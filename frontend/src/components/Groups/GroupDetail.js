import './GroupDetail.css'
import { useParams, useHistory, NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import * as groupData from '../../store/groups'
import * as eventData from '../../store/events'
import OpenModalButton from '../OpenModalButton'
import DeleteGroupModal from './DeleteGroupModal';
import EventsList from './EventsList'
export default function GroupDetail() {
    let { groupId } = useParams();
    let dispatch = useDispatch();
    let history = useHistory();
    const currentUser = useSelector(state => state.session.user)
    let group = useSelector(state => state.group.singleGroup);
    let events = useSelector(state=> state.event.allEvents)


    useEffect(() => {
        dispatch(groupData.getOneGroupThunk(groupId)).then(dispatch(eventData.getAllEventsThunk()))
    }, [dispatch, groupId])

    if (!group.id) return null;
    const comingSoon = () => {
        alert("Feature coming soon...")
    }

    return (
        <>
            <div className='group-info-page'>
                <div className='back-link'>
                    <NavLink id='back-button' to='/groups'>{'< '}Groups</NavLink>
                </div>
                <div className='top-info'>
                    <div id='img-container'>
                        <img className='img' alt='preview' src={group.GroupImages[0].url}></img>

                    </div>
                    <div id='info-container'>
                        <div id='name-detail'>
                            <h1> {group.name}</h1>
                        </div>
                        <div id='location-detail'>
                            {group.state}
                        </div>
                        <div id='numMembers-detail'>

                            {group.private ? <div>{group.numEvents} Events · Private</div> : <div>{group.numEvents} Events · Public</div>}
                        </div>
                        <div id='organizer-detail'>
                            Organized by: {group.Organizer.firstName + ' ' + group.Organizer.lastName}
                        </div>
                        <div onClick={comingSoon} id='join-group-btn-detail' hidden={!currentUser || currentUser.id === group.Organizer.id}>
                            <button>Join this group </button>
                        </div>
                        <div id='authorized-btn' hidden={!currentUser || currentUser.id !== group.Organizer.id}>
                            <NavLink id='link-btns' to={`/groups/${groupId}/events/create`}>
                                <button >Create Event</button>
                            </NavLink>
                            <NavLink id='link-btns' to={`/groups/${groupId}/edit`}>
                                <button>Update</button>
                            </NavLink>
                            <OpenModalButton
                                id='link-btns'
                                modalComponent={<DeleteGroupModal />}
                                buttonText='Delete' />
                        </div>
                    </div>

                </div>
                <div className='middle-info'>
                    <h1>Organizer</h1>
                    <div id='organizer-detail'>
                        {group.Organizer.firstName + ' ' + group.Organizer.lastName}
                    </div>
                    <h1>What we're about</h1>
                    <div id='about-detail'>
                        {group.about}
                    </div>

                </div>

                <div className='events-list'>
                    { Object.values(events).length && <EventsList events={events} groupId={groupId}/>}
                 </div>
            </div>
        </>
    )

}
