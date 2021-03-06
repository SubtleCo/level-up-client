import React, { useContext, useState, useEffect } from "react"
import { GameContext } from "./GameProvider.js"
import { useHistory, useParams } from 'react-router-dom'


export const GameForm = () => {
    const history = useHistory()
    const { createGame, getGameTypes, gameTypes, getGameById, updateGame } = useContext(GameContext)
    const { gameId } = useParams()

    /*
        Since the input fields are bound to the values of
        the properties of this state variable, you need to
        provide some default values.
    */
    const [currentGame, setCurrentGame] = useState({
        skillLevel: 1,
        numberOfPlayers: 0,
        title: "",
        maker: "",
        gameTypeId: 0
    })

    /*
        Get game types on initialization so that the <select>
        element presents game type choices to the user.
    */
    useEffect(() => {
        getGameTypes()
        if (gameId) {
            getGameById(parseInt(gameId))
                .then(editGame => {
                    setCurrentGame({
                        skillLevel: editGame.skill_level,
                        numberOfPlayers: editGame.number_of_players,
                        title: editGame.title,
                        maker: editGame.maker,
                        gameTypeId: editGame.gametype.id
                    })
                })
        }
    }, [])


    const handleInputChange = e => {
        const newGameState = { ...currentGame }
        newGameState[e.target.name] = e.target.value
        if (e.target.name.includes("Id")) newGameState[e.target.name] = parseInt(e.target.value)
        setCurrentGame(newGameState)
    }

    const handleSubmit = e => {
        // Prevent form from being submitted
        e.preventDefault()

        const game = {
            maker: currentGame.maker,
            title: currentGame.title,
            numberOfPlayers: parseInt(currentGame.numberOfPlayers),
            skillLevel: parseInt(currentGame.skillLevel),
            gameTypeId: parseInt(currentGame.gameTypeId)
        }

        // are we Editing or Creating?
        if (gameId) {
            updateGame(gameId, game)
                .then(() => history.push("/games"))
        } else {
            createGame(game)
                .then(() => history.push("/games"))
        }
    }


    return (
        <form className="gameForm">
            <h2 className="gameForm__title">Register New Game</h2>
            <fieldset>
                <div className="form-group">
                    <label htmlFor="title">Title: </label>
                    <input type="text" name="title" required autoFocus className="form-control"
                        value={currentGame.title}
                        onChange={handleInputChange}
                    />
                </div>
            </fieldset>
            <fieldset>
                <div className="form-group">
                    <label htmlFor="maker">Maker: </label>
                    <input type="text" name="maker" required autoFocus className="form-control"
                        value={currentGame.maker}
                        onChange={handleInputChange}
                    />
                </div>
            </fieldset>
            <fieldset>
                <div className="form-group">
                    <label htmlFor="numberOfPlayers">Number of Players: </label>
                    <input type="number" name="numberOfPlayers" required autoFocus className="form-control"
                        value={currentGame.numberOfPlayers}
                        onChange={handleInputChange}
                    />
                </div>
            </fieldset>
            <fieldset>
                <div className="form-group">
                    <label htmlFor="skillLevel">Skill Level: </label>
                    <input type="number" min="1" max="5" name="skillLevel" required autoFocus className="form-control"
                        value={currentGame.skillLevel}
                        onChange={handleInputChange}
                    />
                </div>
            </fieldset>
            <fieldset>
                <div className="form-group">
                    <label htmlFor="gameTypeId">Game Type: </label>
                    <select name="gameTypeId" required className="form-control"
                        value={currentGame.gameTypeId}
                        onChange={handleInputChange}
                    >
                        {
                            gameTypes.map(gT => <option key={gT.id} value={gT.id}>{gT.label}</option>)
                        }
                    </select>
                </div>
            </fieldset>

            <button type="submit"
                onClick={handleSubmit}
                className="btn btn-primary">{gameId ? "Edit" : "Create"}</button>
        </form>
    )
}