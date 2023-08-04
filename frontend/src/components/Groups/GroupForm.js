import './GroupForm.css'
import { useParams, Link, useHistory, NavLink, } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import * as groupData from '../../store/groups'

export default function GroupForm() {
    const history = useHistory();
    const dispatch = useDispatch();

    //setters
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [name, setName] = useState("");
    const [about, setAbout] = useState("");
    const [type, setType] = useState(undefined);
    const [privacy, setPrivacy] = useState(undefined);
    const [url, setUrl] = useState("");
    const [validationErrors, setValidationErrors] = useState({});
    const [disabled, setDisabled] = useState(true)

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (Object.values(validationErrors).length) {
            setDisabled(true);
        }
        const newGroup = {
            city,
            state,
            name,
            about,
            type,
            privacy,
            url
        }
        dispatch(groupData.createGroupThunk(newGroup))
            .then((res) => {
                history.push(`groups/${res.id}`);
            })
            .catch((e) => {
                console.log("Error making group: ", e)
            })

        setCity("");
        setState("");
        setName("");
        setAbout("");
        setType(undefined);
        setPrivacy(undefined);
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
        if (!url.endsWith('.jpeg') || !url.endsWith('.jpg') || !url.endsWith('.png')) {
            errors.url = 'Image url must end in .png, .jpg, or .jpeg'
        }
        setValidationErrors(errors)
    }, [city, state, name, about, type, privacy, url])
    return (
        <form onSubmit={handleSubmit}>
            <div className='group-form'>
                <h1>Become an Organizer</h1>
                <h2>We'll walk you through a few steps to build your local community</h2>
                <div className='location-form'>
                    <h2>First, set your group's location</h2>
                    <label>Meetup groups meet locally, in person, and online. We'll connect you with people in your area, and more can join you online</label>
                    {/* CITY */}
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
                    {/* STATE */}
                    <input
                        type='text'
                        id='state'
                        value={state}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder='state'
                    />
                    {validationErrors.state && (
                        <p className='errors'> {validationErrors.state}</p>
                    )}
                </div>
                <div className='name-form'>
                    <h2>What will your group's name be?</h2>
                    <label>Choose a name that will give people a clear idea of what the group is about. Feel free to get creative! You can edit this later if you change your mind.</label>
                    <input
                    type='text'
                    id='name'
                    value={name}
                    onChange={(e)=>setName(e.target.value)}
                    placeholder='What is your group name?'
                    />
                    {validationErrors.name && (
                        <p className='errors'> {validationErrors.name}</p>
                    )}
                </div>
                <div className='about-form'>
                    <label>People will see this when we promote your group, but you'll be able to add it later, too</label>
                    <ol type='1'>
                        <li>What's the purpose of the group?</li>
                        <li>Who should join?</li>
                        <li>What will you do at your events?</li>
                    </ol>
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
                <div className='final-step-form'>
                    <h2>Final Steps...</h2>
                    {/* TYPE */}
                    <label>Is this an in person or online group?</label>
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
                    {/* PRIVACY */}
                    <label>Is this group private or public?</label>
                    <select
                    className='select-form'
                    value={type}
                    onChange={(e) => setPrivacy(e.target.value)}
                    >
                        <option value={undefined}>Select one</option>
                        <option value={true}>Private</option>
                        <option value={false}>Public</option>
                    </select>
                    {validationErrors.privacy && (
                        <p className='errors'> {validationErrors.privacy}</p>
                    )}
                    {/* URL */}
                    <label>Please add in image url for your group below:</label>
                    <input
                    type='text'
                    id='url'
                    value={url}
                    onChange={(e)=>setUrl(e.target.value)}
                    placeholder='Image Url'
                    />
                    {validationErrors.url && (
                        <p className='errors'> {validationErrors.url}</p>
                    )}
                </div>
                <div className='submit-btn'>
                        <button type='submit'>Create Group</button>
                </div>
            </div>

        </form>
    );
}
