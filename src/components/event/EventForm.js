import React, { useContext, useState, useEffect } from "react"
import { useHistory } from "react-router-dom"
import { GameContext } from "../game/GameProvider"
import { EventContext } from "./EventProvider"


export const EventForm = () => {
    const history = useHistory()
    const { games, getGames, createGame } = useContext(GameContext)
    const { createEvent } = useContext(EventContext)
    const today = new Date()

    const [currentEvent, setEvent] = useState({
        date: today.toISOString().split("T")[0],
        time: today.toISOString().split("T")[1].split(".")[0].slice(0,5),
        gameId: 0,
        description: ""
    })

    useEffect(() => {
        getGames()
    }, [])

    const changeEventState = e => {
        const newEvent = { ...currentEvent }
        newEvent[e.target.name] = e.target.value
        if (e.target.name.includes("Id")) newEvent[e.target.name] = parseInt(e.target.value)
        setEvent(newEvent)
    }

    return (
        <form className="gameForm">
            <h2 className="gameForm__title">Schedule New Event</h2>
            <fieldset>
                <div className="form-group">
                    <label htmlFor="description">Description: </label>
                    <input type="text" name="description" value={currentEvent.description} onChange={changeEventState} />
                </div>
            </fieldset>
            <fieldset>
                <div className="form-group">
                    <label htmlFor="gameId">Game: </label>
                    <select name="gameId" className="form-control"
                        value={currentEvent.gameId}
                        onChange={changeEventState}>
                        <option value="0">Select a game...</option>
                        {
                            games.map(game => (
                                <option key={game.id} value={game.id}>{game.title}</option>
                            ))
                        }
                    </select>
                </div>
            </fieldset>
            <fieldset>
                <div className="form-group">
                    <label htmlFor="date">Date: </label>
                    <input type="date" name="date" value={currentEvent.date} onChange={changeEventState} />
                </div>
            </fieldset>
            <fieldset>
                <div className="form-group">
                    <label htmlFor="time">Time: </label>
                    <input type="time" name="time" value={currentEvent.time} onChange={changeEventState} />
                </div>
            </fieldset>


            <button type="submit"
                onClick={evt => {
                    evt.preventDefault()
                    createEvent(currentEvent)
                    history.push("/events")
                }}
                className="btn btn-primary">Create Event</button>
        </form>
    )
}