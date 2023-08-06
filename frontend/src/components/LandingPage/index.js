import './LandingPage.css';
import { useSelector } from 'react-redux';
import { NavLink, } from 'react-router-dom';
import OpenModalMenuButton from '../OpenModalButton'
import SignupFormModal from '../SignupFormModal';
export default function LandingPage() {
    // const history = useHistory();
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
                            Game Together: Where Gamers Unite! Join our vibrant online community dedicated to bringing gamers from all walks of life together. Whether you're a seasoned gamer or a noob, GameUp offers a supportive and motivating space to connect with like-minded individuals who share your passion for gaming.
                        </p>

                    </div>
                    <div>
                        <img className='main-img' src='/images/landing-main.png' alt='main-stuff'></img>
                    </div>

                </div>
                <div className='middle-landing' >
                    <h1> How Game Up works</h1>
                    <p>Game Up is a user friendly site that enables its users to find like minded gamers that share their similar interests to form groups and friendships to play games together!</p>
                </div>

                {/* next "row" of stuff */}
                <div className='landing-page-stacks'>
                    <div className='card'>
                        <NavLink className='link' to='/groups'>
                            <div>
                                <img alt='landing-group' src='/images/allGroup.svg'></img>
                            </div>
                            <div id='link-text'>
                                See all groups
                            </div>
                            <div id='landing-cap-container'>

                            <p className='landing-captions'>Discover the types of games and genres right for you by exploring the already made communities that span multiple genres of games! You're sure to find something you'll love!</p>
                            </div>
                        </NavLink>
                    </div>
                    <div className='card'>
                        <NavLink className='link' to='/events'>
                            <div>
                                <img alt='landing-events' src='/images/allEvents.svg'></img>
                            </div>
                            <div id='link-text'>
                                Find an event
                            </div>
                            <div id='landing-cap-container'>

                            <p className='landing-captions'>Explore the newest gaming events offered by different groups on our platform! Open your mind to new genres and be amazed</p>
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
                                <img alt='landing-create' src='/images/createGroup.svg'></img>
                            </div>
                            <div id={user? 'link-text': 'link-text-login'}>
                                Start a new Group

                            </div>
                            <div id='landing-cap-container'>

                            <p className='landing-captions'>Start your own gaming group on our platform, gather friends and meet new ones on the way! Create a welcoming community that supports everyone! </p>
                            </div>
                        </NavLink>
                    </div>

                </div>
                <div className={user ? 'hidden' : 'join-meetup-btn'}>
                    <OpenModalMenuButton
                        buttonText="Join Game Up"
                        modalComponent={<SignupFormModal />} />
                </div>
            </div>

        </div>
    );
}
