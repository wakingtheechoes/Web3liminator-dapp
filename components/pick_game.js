const { useState, useEffect } = React
function PickGame(props) {
  const [games, setGames] = useState([])
  const [eliminated, setEliminated] = useState(false)
  const [picks, setPicks] = useState([])

  useEffect(() => {
    GAME_READ_CONTRACT.getAllGamesForWeek(props.weekOfSeason).then(
      (gamesList) => {
        setGames(gamesList)
        console.log(gamesList)
      }
    )

    GAME_READ_CONTRACT.isEliminated(props.activeAddress).then((elim) => {
      setEliminated(elim)
    })

    GAME_READ_CONTRACT.getPicksByAddress(props.activeAddress).then((picks) => {
      setPicks(picks)
    })
    // GAME_READ_CONTRACT.getGameEntrants(props.id).then((gEntries) => {
    //   let myEntryCount = 0
    //   for (let i = 0; i < gEntries.length; i++) {
    //     if (props.userAddress == gEntries[i]) {
    //       myEntryCount++
    //     }
    //   }
    //   setEntries(gEntries)
    //   setMyEntries(myEntryCount)
    // })
  }, [props.weekOfSeason, props.activeAddress])

  function pickTeam(week, team_id) {
    GAME_READ_WRITE_CONTRACT.pickWeeklyWinner(week, team_id)
  }

  return (
    <div className="container game-pick-container">
      <div className="row">
        <div className="col-md-10 ml-auto mr-auto">
          <div className="card">
            <h2 className="card-title text-center">
              {props.activeAddress.substring(0, 7) +
                '...' +
                props.activeAddress.substring(props.activeAddress.length - 7)}
            </h2>

            <h4 className="card-title text-center">
              ELIMINATOR STATUS:
              {eliminated ? ' ELIMINATED' : ' ALIVE'}
            </h4>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table">
                  <thead className="">
                    <tr>
                      <th>Away Team</th>
                      <th></th>
                      <th>Home Team</th>
                      <th>Kickoff</th>
                    </tr>
                  </thead>
                  <tbody>
                    {games.map((game, i) => (
                      <tr
                        key={i}
                        className={
                          Math.floor(Date.now() / 1000) <
                          game.kickoffTime.toString()
                            ? 'my-0'
                            : 'my-0 bg-dark'
                        }
                      >
                        <td>
                          <button
                            onClick={() =>
                              pickTeam(props.weekOfSeason, game.awayTeam)
                            }
                            className={
                              picks[props.weekOfSeason] == game.awayTeam
                                ? 'btn btn-success btn-block btn-sm'
                                : 'btn btn-secondary btn-block btn-sm'
                            }
                          >
                            {TEAMS[game.awayTeam].abbreviation}
                          </button>
                        </td>
                        <td className="text-center">@</td>
                        <td>
                          <button
                            onClick={() =>
                              pickTeam(props.weekOfSeason, game.homeTeam)
                            }
                            className={
                              picks[props.weekOfSeason] == game.homeTeam
                                ? 'btn btn-success btn-block btn-sm'
                                : 'btn btn-secondary btn-block btn-sm'
                            }
                          >
                            {TEAMS[game.homeTeam].abbreviation}
                          </button>
                        </td>
                        <td>
                          {new Date(
                            game.kickoffTime.toNumber() * 1000
                          ).toLocaleDateString('en-US')}
                          {/* <br />
                          {new Date(
                            game.kickoffTime.toNumber() * 1000
                          ).toLocaleTimeString('en-US')} */}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="row">
                <div className="col-md-12 ml-auto"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
