import { NavLink } from "react-router-dom"
import './Forbidden.css'
export default function ForbiddenError() {
    return (
        <>
            <div className="error-404">

                <h1 >404 Not Found Error</h1>
                <NavLink className='safety-btn' to=''>
                    <button>TAKE ME BACK TO SAFETY</button>
                </NavLink>
            </div>
        </>
    )
}
