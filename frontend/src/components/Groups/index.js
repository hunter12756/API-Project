import './Groups.css'
import { useParams, Link, useHistory, NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import * as groupData from '../../store/groups'

export default function Groups() {
    const params = useParams();
    const dispatch = useDispatch();
    const history = useHistory();
    const path = window.location.pathname;
    //load up da data
    let groups = useSelector(state => state.group.allGroups);
    let groupsArr = Object.values(groups)


    useEffect(() => {
        dispatch(groupData.getAllGroupsThunk())
    }, [dispatch])
    return (
        <>
            <div className='groups-page'>
                <div className='top'>
                    <div className="event-group-links">
                        <NavLink id={path.startsWith('/events') ? "top-link-active" : "top-link"} to='/events'>Events</NavLink>
                        <NavLink id={path.startsWith('/groups') ? "top-link-active" : "top-link"} to='/groups'>Groups</NavLink>

                    </div>
                    <div className='link-subtext'>
                        Groups in Game Up
                    </div>
                </div>
                <div className='groups-container'>
                    <div className='all-groups'>
                        {groupsArr.map(group => {

                            return (
                                <NavLink id="middle-links" key={group.id} to={`groups/${group.id}`}>
                                    {console.log(group.Groups)}
                                    <div className='one-group'>
                                        <div className='img-container'>
                                            <img id='img' src={group.previewImage}></img>
                                        </div>
                                        <div className='group-info'>
                                            <div id="name">
                                                <h1>{group.name}</h1>
                                            </div>
                                            <div id='location-group'>
                                                <p>{group.city + ', ' + group.state}</p>
                                            </div>
                                            <div id='about-group'>
                                                {group.about}
                                            </div>
                                            {group.private ?
                                                <div id="numMembers-group">
                                                   {group.numMembers} Members · Private
                                                </div>
                                                :
                                                <div id="numMembers-group">
                                                    {group.numMembers} Members · Public
                                                </div>
                                            }
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
