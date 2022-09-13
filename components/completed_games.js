'use strict'
const { useState, useEffect } = React

function CompletedGameRow(props) {
  const [gameDetail, setGameDetail] = useState({
    creator: '',
    entryFee: 0,
    completed: false,
    isPublic: false,
    maxEntrants: 0,
    maxEntriesPerWallet: 0,
    minEntrants: 0,
    prize: 0,
    randomRequestID: 0,
    randomWordReturned: 0,
    requestedRandom: false,
    winner: '',
  })
  const [entries, setEntries] = useState([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setLoaded(false)
    console.log('useEffect in completed game row')
    GAME_READ_CONTRACT.gamesMapping(props.id).then((gDetail) => {
      setGameDetail(gDetail)
      setLoaded(true)
    })
    GAME_READ_CONTRACT.getGameEntrants(props.id).then((gEntries) => {
      setEntries(gEntries)
      //   console.log(component.state.entries)
    })
  }, [props.id])

  return (
    <tr>
      <td>
        <div className="d-flex px-2 py-1">
          <div className="d-flex flex-column justify-content-center">
            <h6 className="mb-0 text-sm">ID: {props.id}</h6>
            <p className="text-sm text-secondary mb-0">
              Host:
              {props.userAddress == gameDetail.creator
                ? 'YOU'
                : gameDetail.creator.substring(0, 5) +
                  '...' +
                  gameDetail.creator.substring(35, gameDetail.creator.length)}
            </p>
          </div>
        </div>
      </td>
      <td>
        <p className="text-sm font-weight-bold text-dark mb-0">
          {entries.length}
        </p>
      </td>
      <td>
        <p className="text-sm text-dark mb-0 text-center">
          {gameDetail.prize
            ? ethers.utils.formatUnits(gameDetail.prize, 18) + ' STEAK'
            : ''}{' '}
        </p>
      </td>
      <td className="align-middle text-center">
        <span className="text-secondary text-sm font-weight-bold text-dark">
          {gameDetail.winner.substring(0, 7) == '0x00000'
            ? 'CANCELLED'
            : props.userAddress == gameDetail.winner
            ? 'YOU'
            : gameDetail.winner.substring(0, 5) +
              '...' +
              gameDetail.winner.substring(35, gameDetail.winner.length)}
        </span>
      </td>
    </tr>
  )
}

function CompletedGamesTable(props) {
  const [completedGames, setCompletedGames] = useState([])

  useEffect(() => {
    console.log('useEffect in completed game table')
    GAME_READ_CONTRACT.getOpenGames().then((gList) => {
      console.log(gList)
      console.log('Updated Game List', gList.toString())
      let completedGames = []
      gList.map((gameID, i) => {
        console.log('address prop', props.activeAddress)
        if (gameID < 1) {
          completedGames.unshift(i + 1)
        }
      })
      setCompletedGames(completedGames.slice(0, 10))
    })
  }, [])

  // console.log('rendering completed table rows', completed_games.toString())
  return (
    <div className="container">
      <div className="row bg-white shadow mt-5 border-radius-lg pb-4 p-3 mx-sm-0 mx-1 position-relative">
        <div className="row justify-content-center text-center text-uppercase opacity-8">
          <h3>Recent Completed Games</h3>
        </div>
        <div className="row justify-content-center">
          <div className="table-responsive">
            <table className="table align-items-center mb-0">
              <thead>
                <tr>
                  <th className="text-uppercase text-secondary text-md font-weight-bolder">
                    Game Info
                  </th>
                  <th className="text-uppercase text-secondary text-md font-weight-bolder ps-2">
                    Entries
                  </th>
                  <th className="text-center text-uppercase text-secondary text-md font-weight-bolder">
                    Prize
                  </th>
                  <th className="text-center text-uppercase text-secondary text-md font-weight-bolder">
                    Winner
                  </th>
                </tr>
              </thead>
              <tbody>
                {completedGames.map((gameID, i) => (
                  <CompletedGameRow
                    id={gameID}
                    userAddress={props.activeAddress}
                    key={i}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

// const completedGamesDomContainer = document.querySelector(
//   '#completed-games-table-body'
// )
// const completedGamesRoot = ReactDOM.createRoot(completedGamesDomContainer)
// completedGamesRoot.render(
//   e(CompletedGamesTable, { activeAddress: active_address })
// )
