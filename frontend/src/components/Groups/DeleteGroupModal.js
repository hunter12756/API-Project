import { useHistory, } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { useModal } from "../../context/Modal";
import * as groupData from '../../store/groups'

export default function DeleteGroupModal() {
    const dispatch = useDispatch();
    const history = useHistory();
    const { closeModal } = useModal();
    const group = useSelector(state=>state.group.singleGroup)
    const handleDelete = (e) => {
        e.preventDefault();
        dispatch(groupData.deleteGroupThunk(group.id))
        closeModal();
        history.push('/groups')
    }
    return (
        <>
            <div>
                <h1>Confirm Delete</h1>
                <span>Are you sure you want to remove this group?</span>
                <div>
                    <button onClick={handleDelete}>Yes</button>
                    <button onClick={closeModal}>No</button>
                </div>
            </div>
        </>
    )
}
