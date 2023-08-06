import { useHistory, } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { useModal } from "../../context/Modal";
import * as eventData from '../../store/events'
import './DeleteEvent.css'
export default function DeleteEventModal() {
    const dispatch = useDispatch();
    const history = useHistory();
    const { closeModal } = useModal();
    const event = useSelector(state=>state.event.singleEvent)
    const handleDelete = (e) => {
        e.preventDefault();
        dispatch(eventData.deleteEventThunk(event.id))
        closeModal();
        history.push('/groups')
    }
    return (
        <>
            <div className='modal-container'>
                <h1>Confirm Delete</h1>
                <span>Are you sure you want to remove this event?</span>
                <div className='delete-container'>
                    <button id='delete-btn' onClick={handleDelete}>Yes</button>
                </div>
                <div className='delete-container'>

                    <button id='delete-btn-no' onClick={closeModal}>No</button>
                </div>
            </div>
        </>
    )
}
