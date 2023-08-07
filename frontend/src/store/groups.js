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
        groups,
    }
}
export const getOneGroup = (group) => {
    return {

        type: GET_ONE_GROUP,
        group,
    }
}
export const createGroup = (group) => {
    return {

        type: CREATE_GROUP,
        group,
    }
}
export const updateGroup = (group) => {
    return {

        type: UPDATE_GROUP,
        group,
    }
}
export const deleteGroup = (groupId) => {
    return {

        type: DELETE_GROUP,
        groupId,
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
        dispatch(deleteGroup(groupId));
        return data;
    } else {
        return (data.errors)
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
        dispatch(updateGroup(updatedGroup));
        return updatedGroup;
    } else {
        const data = await res.json();
        return (data.errors)
    }
}
//create group
export const createGroupThunk = (group, url) => async (dispatch) => {
    const res = await csrfFetch(`/api/groups`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(group)

    });
    if (res.ok) {
        const data = await res.json();
        if (url) {
            const newRes = await csrfFetch(`/api/groups/${data.id}/images`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: url, preview: true })
            });
            if (newRes.ok) {
                const image = await newRes.json();
                data.GroupImages = [image]
            }
        }
        dispatch(createGroup(data));
        return data;
    } else {
        const data = await res.json();
        return (data.errors)
    }
}
//get All groups
export const getAllGroupsThunk = () => async (dispatch) => {
    try {
        const res = await csrfFetch('/api/groups')

        if (!res.ok) {
            const data = await res.json();
            return (data.errors);
        }
        const data = await res.json();

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
        return (data.errors)
    }
}
// !! REDUCER
const initialState = { allGroups: {}, singleGroup: {} };
const groupReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case GET_ALL_GROUPS:
            newState = { ...state, allGroups: action.groups }

            return newState
        case GET_ONE_GROUP:
            newState = { ...state, singleGroup: action.group }

            return newState;
        case CREATE_GROUP:
            newState = { ...state, allGroups: { ...state.allGroups, [action.group.id]: action.group } }

            return newState;
        case UPDATE_GROUP:
            newState = { ...state, allGroups: { ...state.allGroups, [action.group.id]: action.group } }

            return newState;
        case DELETE_GROUP:
            newState = { ...state }
            newState.allGroups.singleGroup = {};

            return newState;
        default:
            return state;
    }
}
export default groupReducer;
