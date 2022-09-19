const { useState, useEffect } = React
function PickGame(props) {
  const [games, setGames] = useState([])
  const [eliminated, setEliminated] = useState(false)
  const [picks, setPicks] = useState([])
  const [challengesRemain, setChallengesRemain] = useState(0)
  const [pastPicks, setPastPicks] = useState([])
  const [chainID, setChainID] = useState('0')
  const [pickLocked, setPickLocked] = useState(false)

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

    props.signer.getChainId().then((chainid) => {
      setChainID(chainid)
    })
  }, [props.weekOfSeason, props.activeAddress])

  useEffect(() => {
    let locked = false
    games.forEach((game) => {
      if (
        Math.floor(Date.now()) > parseInt(game.kickoffTime._hex) * 1000 &&
        (game.homeTeam == picks[props.weekOfSeason] ||
          game.awayTeam == picks[props.weekOfSeason])
      ) {
        locked = true
      }
    })
    setPickLocked(locked)
  }, [games, picks])

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
          {pickLocked ? (
            <span>
              {'Your pick for weeek '} {props.weekOfSeason + 2}
              {' is now locked. Good luck!'}
            </span>
          ) : (
            <span>
              {'Pick a team below to win on week '} {props.weekOfSeason + 2}
            </span>
          )}
          {!pickLocked && pastPicks[props.weekOfSeason] > 0 && (
            <span>
              , or{' '}
              <button
                className="btn btn-secondary"
                onClick={() => {
                  if (chainID == 137) {
                    pickTeam(props.weekOfSeason, 0)
                  } else {
                    Swal.fire({
                      title: 'Wrong Network',
                      text: 'You must be connected to the polygon network to make changes',
                      icon: 'warning',
                      // showCancelButton: true,
                      customClass: {
                        confirmButton: 'btn btn-success',
                        cancelButton: 'btn btn-danger',
                      },
                      confirmButtonText: 'Ok',
                    })
                  }
                }}
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
                  <th>Home Team</th>
                  <th>Kickoff</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {games.map((game, i) => (
                  <tr
                    key={i}
                    className={
                      Math.floor(Date.now()) <
                      parseInt(game.kickoffTime._hex) * 1000
                        ? 'my-0 text-white'
                        : game.winner == picks[props.weekOfSeason]
                        ? 'my-0 outline-win text-white'
                        : game.homeTeam == picks[props.weekOfSeason] ||
                          game.awayTeam == picks[props.weekOfSeason]
                        ? 'my-0 outline-loss text-white'
                        : 'my-0 text-white'
                    }
                  >
                    <td
                      className={
                        picks[props.weekOfSeason] == game.awayTeam
                          ? game.awayTeam == game.winner
                            ? 'bg-success' // win
                            : game.homeTeam == game.winner
                            ? 'bg-danger' //loss
                            : 'bg-info'
                          : ''
                      }
                    >
                      {Math.floor(Date.now()) <
                        parseInt(game.kickoffTime._hex) * 1000 &&
                      !pickLocked &&
                      !pastPicks.includes(game.awayTeam) ? (
                        <button
                          onClick={() => {
                            if (chainID == 137) {
                              pickTeam(props.weekOfSeason, game.awayTeam)
                            } else {
                              Swal.fire({
                                title: 'Wrong Network',
                                text: 'You must be connected to the polygon network to make changes',
                                icon: 'warning',
                                // showCancelButton: true,
                                customClass: {
                                  confirmButton: 'btn btn-success',
                                  cancelButton: 'btn btn-danger',
                                },
                                confirmButtonText: 'Ok',
                              })
                            }
                          }}
                          className={
                            picks[props.weekOfSeason] == game.awayTeam
                              ? 'btn btn-success btn-block btn-sm'
                              : pastPicks.includes(game.awayTeam)
                              ? 'btn btn-used btn-block btn-sm'
                              : 'btn btn-secondary btn-block btn-sm'
                          }
                        >
                          {TEAMS[game.awayTeam].abbreviation}{' '}
                        </button>
                      ) : (
                        <span>
                          {TEAMS[game.awayTeam].abbreviation}
                          {game.winner == game.awayTeam && (
                            <i className="material-icons">done</i>
                          )}
                        </span>
                      )}
                    </td>
                    <td
                      className={
                        picks[props.weekOfSeason] == game.homeTeam
                          ? game.homeTeam == game.winner
                            ? 'bg-success' // win
                            : game.awayTeam == game.winner
                            ? 'bg-danger' //loss
                            : 'bg-info'
                          : ''
                      }
                    >
                      {Math.floor(Date.now()) <
                        parseInt(game.kickoffTime._hex) * 1000 &&
                      !pickLocked &&
                      !pastPicks.includes(game.homeTeam) ? (
                        <button
                          onClick={() => {
                            if (chainID == 137) {
                              pickTeam(props.weekOfSeason, game.homeTeam)
                            } else {
                              Swal.fire({
                                title: 'Wrong Network',
                                text: 'You must be connected to the polygon network to make changes',
                                icon: 'warning',
                                // showCancelButton: true,
                                customClass: {
                                  confirmButton: 'btn btn-success',
                                  cancelButton: 'btn btn-danger',
                                },
                                confirmButtonText: 'Ok',
                              })
                            }
                          }}
                          className={
                            picks[props.weekOfSeason] == game.homeTeam
                              ? 'btn btn-success btn-block btn-sm'
                              : pastPicks.includes(game.homeTeam)
                              ? 'btn btn-used btn-block btn-sm'
                              : 'btn btn-secondary btn-block btn-sm'
                          }
                        >
                          {'@ '}
                          {TEAMS[game.homeTeam].abbreviation}
                        </button>
                      ) : (
                        <span>
                          {'@ '}
                          {TEAMS[game.homeTeam].abbreviation}{' '}
                          {game.winner == game.homeTeam && (
                            <i className="material-icons">done</i>
                          )}
                        </span>
                      )}
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
                    <td>
                      {Math.floor(Date.now()) <
                      parseInt(game.kickoffTime._hex) * 1000
                        ? 'Not Started'
                        : game.resultHasBeenSet
                        ? 'Complete'
                        : 'Locked'}
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
