import { csrfFetch } from "./csrf"

// TYPES
const GET_ALL_EVENTS = "events/allEvents"
// not sure on this get all one mf
const GET_ALL_EVENTS_BY_GROUP = "events/allEventsPerGroup"
const GET_ONE_EVENT = "events/oneEvent"
// not sure on this create one
const CREATE_EVENT = 'events/createEvent'
const UPDATE_EVENT = 'events/updateEvent'
const DELETE_EVENT = 'events/deleteEvent'

// ACTION CREATORS
export const getAllEvents = (events) => {
    return {

        type: GET_ALL_EVENTS,
        payload: events,
    }
}
export const getOneEvent = (event) => {
    return {

        type: GET_ONE_EVENT,
        payload: event,
    }
}

export const getEventPerGroup = (event) =>{
    return {
        type: GET_ALL_EVENTS_BY_GROUP,
        payload: event
    }
}
export const createEvent = (event) => {
    return {

        type: CREATE_EVENT,
        payload:event,
    }
}
export const updateEvent = (event) => {
    return {

        type: UPDATE_EVENT,
        payload: event,
    }
}
export const deleteEvent = (eventId) => {
    return {

        type: DELETE_EVENT,
        payload: eventId,
    }
}


//!! THUNKS
//delete event
export const deleteEventThunk = (eventId) => async (dispatch) => {
    const res = await csrfFetch(`/api/events/${eventId}`, {
        method: "DELETE"
    });
    // Maybe not needed bc we are just nuking it?
    const data = await res.json();
    if (res.ok) {
        return dispatch(deleteEvent(eventId));
    } else {
        return console.log(data.errors)
    }
}

//update group
export const updateEventThunk = (event, eventId) => async (dispatch) => {
    const res = await csrfFetch(`/api/events/${eventId}`, {
        method: "PUT",
        body: JSON.stringify(event)
    });
    if (res.ok) {
        const updatedEvent = await res.json();
        return dispatch(updateEvent(updatedEvent));
    } else {
        const data = await res.json();
        return console.log(data.errors)
    }
}
//create event
export const createEventThunk = (event) => async (dispatch) => {
    const res = await csrfFetch(`/api/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(event)

    });
    if (res.ok) {
        const newEvent = await res.json();
        return dispatch(createEvent(newEvent));
    } else {
        const data = await res.json();
        return console.log(data.errors)
    }
}
//get All events
export const getAllEventsThunk = () => async (dispatch) => {
    const res = await csrfFetch(`/api/events`)
    if (!res.ok) {
        const data = await res.json();
        return console.log(data.errors);
    }
    const data = await res.json();
    console.log(data)
    let normalizedEvents = {};
    for (let event of data.Events) {
        normalizedEvents[event.id] = event;
    }
    dispatch(getAllEvents(normalizedEvents));
    return data;
}
//get ONE group
export const getOneEventThunk = (eventId) => async (dispatch) => {
    const res = await csrfFetch(`/api/events/${eventId}`);
    if (res.ok) {
        const event = await res.json();
        return dispatch(getOneEvent(event));
    } else {
        const data = await res.json();
        return console.log(data.errors)
    }
}
// !! REDUCER
const initialState = {allEvents:{},singleEvent:{}};
const eventReducer = (state = initialState, action)=>{
    let newState;
    switch(action.type){
        case GET_ALL_EVENTS:
            newState={...state, allEvents: action.payload}
            console.log("ALL EVENTS:", newState)
            return newState
        case GET_ONE_EVENT:
            newState={...state, singleEvent: action.payload }
            console.log("CURRENT EVENT: ", newState)
            return newState;
        case CREATE_EVENT:
            newState = {...state, singleEvent: action.payload}
            console.log("NEW EVENT: ", newState)
            return newState;
        case UPDATE_EVENT:
            newState = {...state, singleEvent: action.payload}
            console.log("UPDATED GROUP", newState)
            return newState;
        case DELETE_EVENT:
            newState={...state}
            newState.allEvents.singleEvent={};
            console.log("WHATEVER EVENT DELETED SHOULD NOT SHOW UP IN THIS: ", newState)
            return newState;
        default:
            return state;
    }
}
export default eventReducer;
