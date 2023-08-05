import { NavLink, useHistory } from "react-router-dom"

export default function EventsList({events,groupId}){
    const futureEvents=[];
    const pastEvents=[];
    const time = new Date();
    const history = useHistory();

    const res = [];
    for(const [key,value] of Object.entries(events)){
        res.push(value)
    }
    console.log("ALLEVENTS: ",res)
    for(let event of res){
        console.log("CURRENT EVENT: ",event)
        if(event.previewImage === undefined){
            event.previewImage="unavailable"
        }
        if(new Date(event.startDate)>time){
            futureEvents.push(event)
        } else {
            pastEvents.push(event)
        }
    }

    futureEvents.sort((a,b)=> {
        return new Date(a.startDate) - new Date(b.startDate)
    })

    pastEvents.sort((a,b)=> {
        return new Date(a.startDate) - new Date(b.startDate)
    })

    console.log("Future events: ",futureEvents)
    console.log("Past Events: ", pastEvents)
    return(
        <>
        {/* Upcoming events */}
        <div className="future-events">
            <h2>{futureEvents.length ? `Upcoming Events ${futureEvents.length}`:''}</h2>

        </div>
        {/* Past events */}
        <div className="past-events">
            <h2> {pastEvents.length ? `Past Events (${pastEvents.length})`:''}</h2>
            {pastEvents.map((pastEvent)=>{
                <NavLink to={`/events/${pastEvent.id}`}>
                    <img src={pastEvent.previewImage}></img>
                </NavLink>
            })}
        </div>
        </>
    )
}
