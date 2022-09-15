const { useState, useEffect } = React
function PickGame(props) {
  const [games, setGames] = useState([])
  const [eliminated, setEliminated] = useState(false)
  const [picks, setPicks] = useState([])
  const [challengesRemain, setChallengesRemain] = useState(0)
  const [pastPicks, setPastPicks] = useState([])

  useEffect(() => {
    GAME_READ_CONTRACT.getAllGamesForWeek(props.weekOfSeason).then(
      (gamesList) => {
        setGames(gamesList)
        console.log(gamesList)
      }
    )
    GAME_READ_CONTRACT.getPicksByAddress(props.activeAddress).then((picks) => {
      setPastPicks(picks)
    })

    GAME_READ_CONTRACT.isEliminated(props.activeAddress).then((elim) => {
      setEliminated(elim)
    })

    GAME_READ_CONTRACT.getPicksByAddress(props.activeAddress).then((picks) => {
      setPicks(picks)
    })

    GAME_READ_CONTRACT.addressesToChallengesBoughtMapping(
      props.activeAddress
    ).then((challenges) => {
      setChallengesRemain(challenges)
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
    console.log(week, team_id)
    console.log(GAME_READ_WRITE_CONTRACT)
    GAME_READ_WRITE_CONTRACT.pickWeeklyWinner(week, team_id).catch((e) => {
      Swal.fire({
        title: 'Error',
        text: e.data.message,
        icon: 'warning',
        // showCancelButton: true,
        customClass: {
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-danger',
        },
        confirmButtonText: 'Ok',
      })
    })
  }

  return (
    <div className="ml-auto mr-auto">
      <div className="card-header">
        <h3>
          Pick a team below to win on week {props.weekOfSeason + 2}
          {pastPicks[props.weekOfSeason] > 0 && (
            <span>
              , or{' '}
              <button
                className="btn btn-secondary"
                onClick={() => pickTeam(props.weekOfSeason, 0)}
              >
                Click here to reset to "None"
              </button>
            </span>
          )}
        </h3>
      </div>
      <div className="card-body">
        {games.length > 0 ? (
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
                      Math.floor(Date.now()) <
                      parseInt(game.kickoffTime._hex) * 1000
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
                            : pastPicks.includes(game.awayTeam)
                            ? 'btn btn-used btn-block btn-sm'
                            : 'btn btn-secondary btn-block btn-sm'
                        }
                      >
                        {TEAMS[game.awayTeam].abbreviation}
                      </button>
                    </td>
                    <td className="text-center">@</td>
                    <td>
                      <button
                        onClick={() => {
                          console.log(game.homeTeam)
                          pickTeam(props.weekOfSeason, game.homeTeam)
                        }}
                        className={
                          picks[props.weekOfSeason] == game.homeTeam
                            ? 'btn btn-success btn-block btn-sm'
                            : pastPicks.includes(game.homeTeam)
                            ? 'btn btn-used btn-block btn-sm'
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
                      <br />
                      {new Date(
                        game.kickoffTime.toNumber() * 1000
                      ).toLocaleTimeString('en-US')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <h4 className="text-light">
            No games have been loaded into the contract for this week yet. Check
            back later.
          </h4>
        )}
        <div className="row">
          <div className="col-md-12 ml-auto"></div>
        </div>
      </div>
    </div>
  )
}
