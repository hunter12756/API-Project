import { csrfFetch } from "./csrf"

// TYPES
const GET_ALL_EVENTS = "events/allEvents"
// not sure on this get all one mf
const GET_ALL_EVENTS_BY_GROUP = "events/allEventsPerGroup"
const GET_ONE_EVENT = "events/oneEvent"
// not sure on this create one
const CREATE_EVENT = 'events/createEvent'

const DELETE_EVENT = 'events/deleteEvent'

// ACTION CREATORS
export const getAllEvents = (events) => {
    return {
        type: GET_ALL_EVENTS,
        events,
    }
}
export const getOneEvent = (event) => {
    return {
        type: GET_ONE_EVENT,
        event,
    }
}

export const getEventPerGroup = (event) =>{
    return {
        type: GET_ALL_EVENTS_BY_GROUP,
        event
    }
}
export const createEvent = (event) => {
    return {
        type: CREATE_EVENT,
        event,
    }
}

export const deleteEvent = (eventId) => {
    return {
        type: DELETE_EVENT,
        eventId,
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
        dispatch(deleteEvent(eventId));
        return data;
    } else {
        return console.log(data.errors)
    }
}

//create event
export const createEventThunk = (event,groupId, url) => async (dispatch) => {
    const res = await csrfFetch(`/api/groups/${groupId}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(event)
    });
    if (res.ok) {
        const data = await res.json();
        if (url) {
            const newRes = await csrfFetch(`/api/events/${data.id}/images`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({url:url,preview:true})
            });
            if(newRes.ok){
                const image = await newRes.json();
                data.EventImages =[image]
            }
        }
        dispatch(createEvent(data));
        return data;
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
        dispatch(getOneEvent(event));
        return event;
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
            newState={...state, allEvents: action.events}
            console.log("ALL EVENTS:", newState)
            return newState
        case GET_ONE_EVENT:
            newState={...state, singleEvent: action.event }
            console.log("CURRENT EVENT: ", newState)
            return newState;
        case CREATE_EVENT:
            newState = { ...state, allEvents: {...state.allEvents, [action.event.id]: action.event} }
            console.log("NEW EVENT: ", newState)
            return newState;
        case DELETE_EVENT:
            newState={...state}
            delete newState[action.eventId]
            console.log("WHATEVER EVENT DELETED SHOULD NOT SHOW UP IN THIS: ", newState)
            return newState;
        default:
            return state;
    }
}
export default eventReducer;
