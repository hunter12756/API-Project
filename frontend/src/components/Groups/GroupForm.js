import './GroupForm.css'
import {  useHistory,  } from 'react-router-dom'
import { useDispatch, useSelector} from 'react-redux';
import { useEffect, useState } from 'react';
import * as groupData from '../../store/groups'

export default function GroupForm() {
    const history = useHistory();
    const dispatch = useDispatch();
    const user = useSelector(state => state.session.user)
    //setters
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [name, setName] = useState("");
    const [about, setAbout] = useState("");
    const [type, setType] = useState(undefined);
    const [privacy, setPrivacy] = useState(undefined);
    const [url, setUrl] = useState("");
    const [validationErrors, setValidationErrors] = useState({});


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (Object.values(validationErrors).length) {

        }

        const newGroup = {
            city,
            state,
            name,
            about,
            type,
            private:privacy==='true'
        }

        dispatch(groupData.createGroupThunk(newGroup, url))
            .then((data) => {
                //this is pushing to /groups/groups/theId
                history.push(`/groups/${data.id}`);
            })
            .catch((e) => {
                console.error("Error making group: ", e)
            })

        setCity("");
        setState("");
        setName("");
        setAbout("");
        setType("");
        setPrivacy("");
        setUrl("")
    }

    useEffect(() => {
        const errors = {}
        if (!city) {
            errors.city = "City is required"
        }
        if (!state) {
            errors.state = "State is required"
        }
        if (!name) {
            errors.name = "Name is required"
        }
        if (about.length < 30) {
            errors.about = "Description must be at least 30 characters long"
        }
        if (!type) {
            errors.type = "Group Type is required"
        }
        if (!privacy) {
            errors.privacy = "Visibility Type is required"
        }
        if (!url) {
            errors.url = 'URL is required'
        }
        if (!url.endsWith('.jpeg') && !url.endsWith('.jpg') && !url.endsWith('.png')) {
            errors.url = 'Image url must end in .png, .jpg, or .jpeg'
        }
        setValidationErrors(errors)
    }, [city, state, name, about, type, privacy, url])

    if(!user){
        return(
            alert("You must be logged in to create a Group"),
            history.push('/no-login-data')
        )
    }
    return (
        <form onSubmit={handleSubmit}>
            <div className='group-form'>
                <h3 id='become-organizer'>Start a new Group</h3>
                <h2>We'll walk you through a few steps to build your local community</h2>
                <div className='location-form'>
                    <h2>First, set your group's location</h2>
                    <label>Meetup groups meet locally, in person, and online. We'll connect you with people in your area, and more can join you online</label>
                    {/* CITY */}
                    <div id='input'>

                        <input
                            type='text'
                            id='city'
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder='city'
                        />
                        {validationErrors.city && (
                            <p className='errors'> {validationErrors.city}</p>
                        )}
                    </div>
                    {/* STATE */}
                    <div id='input'>

                        <input
                            type='text'
                            id='state'
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            placeholder='state'
                        />
                        {validationErrors.state && (
                            <p className='errors'> {validationErrors.state}</p>
                        )}
                    </div>
                </div>
                <div className='name-form'>
                    <h2>What will your group's name be?</h2>
                    <label>Choose a name that will give people a clear idea of what the group is about. Feel free to get creative! You can edit this later if you change your mind.</label>
                    <div id='input'>

                        <input
                            type='text'
                            id='name'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder='What is your group name?'
                        />
                        {validationErrors.name && (
                            <p className='errors'> {validationErrors.name}</p>
                        )}
                    </div>
                </div>
                <div className='about-form'>
                    <h2>Now describe what your group will be about</h2>
                    <label>People will see this when we promote your group, but you'll be able to add it later, too</label>
                    <ol type='1'>
                        <li>What's the purpose of the group?</li>
                        <li>Who should join?</li>
                        <li>What will you do at your events?</li>
                    </ol>
                    <div id= 'input'>

                    <textarea
                        id='about'
                        value={about}
                        onChange={(e) => setAbout(e.target.value)}
                        placeholder="Please write atleast 30 characters"
                    >
                    </textarea>
                    {validationErrors.about && (
                        <p className='errors'> {validationErrors.about}</p>
                    )}
                    </div>
                </div>
                <div className='final-step-form'>
                    <h2>Final Steps...</h2>
                    {/* TYPE */}
                    <div id='type'>

                        <label>Is this an in person or online group?</label>
                        <div id='final-input'>

                        <select
                            className='select-form'
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                        >
                            <option value={undefined}>Select one</option>
                            <option value={"Online"}>Online</option>
                            <option value={"In person"}>In person</option>
                        </select>
                        {validationErrors.type && (
                            <p className='errors'> {validationErrors.type}</p>
                        )}
                        </div>
                    </div>
                    {/* PRIVACY */}
                    <div id='privacy'>

                        <label>Is this group private or public?</label>
                        <div id='final-input'>

                        <select
                            className='select-form'
                            value={privacy}
                            onChange={(e) => setPrivacy(e.target.value)}
                        >
                            <option value={undefined}>Select one</option>
                            <option value={true}>Private</option>
                            <option value={false}>Public</option>
                        </select>
                        {validationErrors.privacy && (
                            <p className='errors'> {validationErrors.privacy}</p>
                        )}
                        </div>
                    </div>
                    {/* URL */}
                    <div id='url'>
                        <label>Please add in image url for your group below:</label>
                        <div id='final-input'>

                        <input
                            type='text'
                            id='url'
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder='Image Url'
                        />
                        {validationErrors.url && (
                            <p className='errors'> {validationErrors.url}</p>
                        )}
                        </div>
                    </div>
                </div>
                <div className='submit-btn'>
                    <button disabled={Object.values(validationErrors).length} type='submit'>Create Group</button>
                </div>
            </div>

        </form>
    );
}
