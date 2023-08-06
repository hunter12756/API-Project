import { useHistory, } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { useModal } from "../../context/Modal";
import * as eventData from '../../store/events'
import './DeleteEvent.css'
import { useEffect, useState } from 'react';
export default function DeleteEventModal({eventId,groupId}) {
    const dispatch = useDispatch();
    const history = useHistory();
    const { closeModal } = useModal();

    const handleDelete = (e) => {
        e.preventDefault();
        dispatch(eventData.deleteEventThunk(Number(eventId)))
        closeModal();
        history.push(`/groups/${groupId}`)
    }

    return (
        <>
            <div className='modal-container'>
                <h1>Confirm Delete</h1>
                <span>Are you sure you want to remove this event?</span>
                <div className='delete-container'>
                    <button id='delete-btn' onClick={handleDelete}>Yes (Delete Event)</button>
                </div>
                <div className='delete-container'>
                    <button id='delete-btn-no' onClick={closeModal}>No (Keep Event)</button>
                </div>
            </div>
        </>
    )
}
