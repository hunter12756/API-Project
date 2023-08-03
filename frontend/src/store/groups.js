import { csrfFetch } from "./csrf"

// TYPES
const GET_ALL_GROUPS = "groups/allGroups"
const GET_ONE_GROUP = "groups/oneGroup"
const CREATE_GROUP = 'groups/createGroup'
const UPDATE_GROUP = 'groups/updateGroup'
const DELETE_GROUP = ' groups/deleteGroup'

// ACTION CREATORS
export const getAllGroups = (groups) => {
    return {
        type: GET_ALL_GROUPS,
        payload: groups,
    }
}
export const getOneGroup = (group) => {
    return {

        type: GET_ONE_GROUP,
        payload: group,
    }
}
export const createGroup = (group) => {
    return {

        type: CREATE_GROUP,
        payload: group,
    }
}
export const updateGroup = (group) => {
    return {

        type: UPDATE_GROUP,
        payload: group,
    }
}
export const deleteGroup = (groupId) => {
    return {

        type: DELETE_GROUP,
        payload: groupId,
    }
}


//!! THUNKS
//delete group
export const deleteGroupThunk = (groupId) => async (dispatch) => {
    const res = await csrfFetch(`/api/groups/${groupId}`, {
        method: "DELETE"
    });
    const data = await res.json();
    if (res.ok) {
        return dispatch(deleteGroup(groupId));
    } else {
        return console.log(data.errors)
    }
}

//update group
export const updateGroupThunk = (group, groupId) => async (dispatch) => {
    const res = await csrfFetch(`/api/groups/${groupId}`, {
        method: "PUT",
        body: JSON.stringify(group)
    });
    if (res.ok) {
        const updatedGroup = await res.json();
        return dispatch(updateGroup(updatedGroup));
    } else {
        const data = await res.json();
        return console.log(data.errors)
    }
}
//create group
export const createGroupThunk = (group) => async (dispatch) => {
    const res = await csrfFetch(`/api/groups`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(group)

    });
    const data = await res.json();
    if (res.ok) {
        return dispatch(createGroup(group));
    } else {
        const data = await res.json();
        return console.log(data.errors)
    }
}
//get All groups
export const getAllGroupsThunk = () => async (dispatch) => {
    try {
        const res = await csrfFetch('/api/groups')

        if (!res.ok) {
            const data = await res.json();
            return console.log(data.errors);
        }
        const data = await res.json();
        console.log(data)
        let normalizedGroups = {};
        for (let group of data.Groups) {
            normalizedGroups[group.id] = group;
        }
        dispatch(getAllGroups(normalizedGroups));
        return data;
    } catch (e) {
        console.error("ERROR GETTING GROUP", e)
    }

}
//get ONE group
export const getOneGroupThunk = (groupId) => async (dispatch) => {
    const res = await csrfFetch(`/api/groups/${groupId}`);
    if (res.ok) {
        const group = await res.json();
        return dispatch(getOneGroup(group));
    } else {
        const data = await res.json();
        return console.log(data.errors)
    }
}
// !! REDUCER
const initialState = {allGroups:{},singleGroup:{}};
const groupReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case GET_ALL_GROUPS:
            newState = { ...state, allGroups: action.payload }
            console.log("ALL GROUPS:", newState)
            return newState
        case GET_ONE_GROUP:
            newState = { ...state, singleGroup: action.payload }
            console.log("CURRENT GROUP: ", newState)
            return newState;
        case CREATE_GROUP:
            newState = { ...state, singleGroup: action.payload }
            console.log("NEW GROUP:", newState)
            return newState;
        case UPDATE_GROUP:
            newState = { ...state, singleGroup: action.payload }
            console.log("UPDATED GROUP", newState)
            return newState;
        case DELETE_GROUP:
            newState = { ...state }
            newState.allGroups.singleGroup = {};
            console.log("WHATEVER GROUP DELETE SHOULD NOT SHOW UP IN THIS: ", newState)
            return newState;
        default:
            return state;
    }
}
export default groupReducer;
