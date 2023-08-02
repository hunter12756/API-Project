import './Groups.css'
import { useParams, Link, useHistory, NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import * as groupData from '../../store/groups'

export default function Groups() {
    const params = useParams();
    const dispatch = useDispatch();
    const history = useHistory();

    //load up da data
    let groups = useSelector(state => state.group.groups);
    //let groupsArr = groupsObj ? [...Object.values(groupsObj)] : []
    console.log(groups) //this is undefined?
    useEffect(() => {
            dispatch(groupData.getAllGroupsThunk())
    }, [dispatch])
    return (
        <>
            <div className='groups-page'>

                <div className="event-group-links">
                    <Link to='/events'>Events</Link>
                    <Link to='/groups'>Groups</Link>
                    <p>Groups in Game Up</p>
                </div>
                <div className='groups-container'>
                    <div className='tile'>
                        {groups && groups.map(group => {
                            return (
                                <NavLink key={group.id} to={`groups/${group.id}`}>
                                    <div>
                                        <h1>{group.name}</h1>
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
