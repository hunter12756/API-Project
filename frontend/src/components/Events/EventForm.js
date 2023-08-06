import './EventForm.css'
import { useHistory, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useReducer, useState, useRef } from 'react';
import * as eventData from '../../store/events'

export default function EventForm() {
    const history = useHistory();
    const dispatch = useDispatch();
    let { groupId } = useParams();
    let group = useSelector(state => state.group.singleGroup);
    const user = useSelector(state => state.session.user)
    const ref = useRef(true);
    // console.log(group)
    //setters
    const [type, setType] = useState(undefined);
    const [eventName, setEventName] = useState("");
    const [privacy, setPrivacy] = useState(undefined);
    const [price, setPrice] = useState('');
    const [capacity, setCapacity] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [url, setUrl] = useState('');
    const [description, setDescription] = useState("");
    const [validationErrors, setValidationErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newEvent = {
            name: eventName,
            type,
            capacity: Number(capacity),
            private: privacy === 'true',
            price: Number(price),
            startDate,
            endDate,
            url,
            description
        }
        dispatch(eventData.createEventThunk(newEvent, groupId, url))
            .then((data) => {
                console.log("eventstuff:" + data)
                //this is pushing to /groups/groups/theId
                history.push(`/events/${data.id}`);
            })
            .catch((e) => {
                console.log("Error making event: ", e)
            })
        setEventName("");
        setDescription("");
        setType("");
        setPrivacy("");
        setUrl("")
        setStartDate("");
        setEndDate("")
        setPrice("");
        setCapacity('');
    }

    useEffect(() => {
        const errors = {}
        if (!eventName) {
            errors.eventName = "Name is required"
        }
        if (!capacity) {
            errors.capacity = 'Capacity is required'
        } else if (!Number.isInteger(Number(capacity))) {
            errors.capacity = 'Price must be a number'
        }
        if (!type) {
            errors.type = "Event Type is required"
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
        if (!description) {
            errors.description = "Description is required";
        } else if (description.length < 30) {
            errors.description = "Description must be at least 30 characters long"
        }

        if (!price) {
            errors.price = 'Price is required'
        } else if (!Number.isInteger(Number(price))) {
            errors.price = 'Price must be a number'
        }
        if (!startDate) {
            errors.startDate = "Start date is required";
        } else if (new Date(startDate) < new Date()) {
            errors.startDate = "Start date must be in the future";
        }
        if (!endDate) {
            errors.endDate = "End date is required";
        }
        if (startDate > endDate) {
            errors.startDate = "Start date cannot be after end date";
            errors.endDate = "End date cannot be before start date";
        }
        setValidationErrors(errors)
    }, [eventName, description, price, capacity, startDate, endDate, type, privacy, url])

    if (!user) {
        return (
            <h1 className='error-404'>You must be logged in to access this</h1>
        )
    } else {
        if (!Object.values(group).length) {
            return (
                    alert("You must be the owner of the group to create this event"),
                    history.push('/forbidden')
            )
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className='event-form'>
                <div className='eventName-form'>
                    <h2>Create an event for {group.name}</h2>
                    <label> What is the name of your event?</label>
                    <div id='event-input'>
                        <input
                            type='text'
                            id='name'
                            value={eventName}
                            onChange={(e) => setEventName(e.target.value)}
                            placeholder='Event Name'
                        />
                        {validationErrors.eventName && (
                            <p className='errors'> {validationErrors.eventName}</p>
                        )}
                    </div>
                </div>
                <div className='middle-event-form'>
                    <div id='type'>
                        <label>Is this an in person or online event?</label>
                        <div id='event-input'>
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
                    <div id='privacy'>
                        <label>Is this event private or public?</label>
                        <div id='event-input'>
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
                    <div id='price'>
                        <label>What is the price for your event?</label>
                        <div id='event-input'>
                            <input
                                type='integer'
                                id='price'
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder='0'
                            />
                            {validationErrors.price && (
                                <p className='errors'> {validationErrors.price}</p>
                            )}
                        </div>
                    </div>
                    <div id='capacity'>
                        <label>What is the capacity for your event?</label>
                        <div id='event-input'>
                            <input
                                type='integer'
                                id='capacity'
                                value={capacity}
                                onChange={(e) => setCapacity(e.target.value)}
                                placeholder='0'
                            />
                            {validationErrors.capacity && (
                                <p className='errors'> {validationErrors.capacity}</p>
                            )}
                        </div>
                    </div>
                </div>
                <div className='date-form'>
                    <label>When does your event start?</label>
                    <div id='event-input'>
                        <input
                            type='date'
                            id='startDate'
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />

                        {validationErrors.startDate && (
                            <p className='errors'> {validationErrors.startDate}</p>
                        )}
                    </div>
                    <label>When does your event end?</label>
                    <div id='event-input'>
                        <input
                            type='date'
                            id='endDate'
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                        {validationErrors.endDate && (
                            <p className='errors'> {validationErrors.endDate}</p>
                        )}
                    </div>
                </div>
                <div className='url-form'>
                    {/* URL */}
                    <div id='url'>
                        <label>Please add in image url for your event below:</label>
                        <div id='event-input'>
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
                <div className='description-event-form'>
                    <div id='description'>
                        <label>Please describe your event below:</label>
                        <div id='event-input'>
                            <textarea
                                id='description'
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Please write atleast 30 characters"
                            >
                            </textarea>
                            {validationErrors.description && (
                                <p className='errors'> {validationErrors.description}</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className='submit-btn'>
                    <button disabled={Object.values(validationErrors).length} type='submit'>Create Event</button>
                </div>
            </div>
        </form>
    );
}
