import './LandingPage.css';
import { useSelector } from 'react-redux';
import { NavLink, useHistory } from 'react-router-dom';
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import SignupFormModal from '../SignupFormModal';
export default function LandingPage() {
    const history = useHistory();
    const user = useSelector(state => state.session.user)
    return (
        // col
        <div className='landing'>
            {/* col */}
            <div className='outer'>
                {/* column */}
                <div className='inner'>
                    {/* make this row */}
                    <div className='about'>
                        <h1>
                            The gaming platform-
                            Where interests
                            become friendships
                        </h1>
                        <p>
                            Game Together: Where Gamers Unite! Join our vibrant online community dedicated to bringing gamers from all walks of life together. Whether you're a seasoned gamer or a noob, GameTogether offers a supportive and motivating space to connect with like-minded individuals who share your passion for gaming.
                        </p>

                    </div>
                    <div>
                        <img className='main-img' src='/images/landing-main.png' alt='main-image'></img>
                    </div>
                </div>

                {/* next "row" of stuff */}
                <div>
                    <h1> How Game Up works</h1>
                    <p>Game Up is a user friendly site that enables its users to find like minded gamers that share their similar interests to form groups and friendships to play games together!</p>
                </div>
                <div className='landing-page-stacks'>
                    <div className='card'>
                        <NavLink className='link' to='/groups'>
                            <div>
                                <img src='/images/allGroup.svg'></img>
                            </div>
                            <div id='link-text'>
                                See all groups
                            </div>
                        </NavLink>
                    </div>
                    <div className='card'>
                        <NavLink className='link' to='/events'>
                            <div>
                                <img src='/images/allEvents.svg'></img>
                            </div>
                            <div id='link-text'>
                                Find an event
                            </div>
                        </NavLink>
                    </div>
                    <div className={user ? 'card' : 'disabled-card'}>

                        <NavLink to='/groups/create' className={user ? 'link' : 'disabled-link'}
                            onClick={(e) => {
                                if (!user) {
                                    e.preventDefault()
                                }
                            }}>
                            <div>
                                <img src='/images/createGroup.svg'></img>
                            </div>
                            <div id='link-text'>
                                Start a new Group
                            </div>
                        </NavLink>
                    </div>

                </div>
            </div>

        </div>
    );
}
