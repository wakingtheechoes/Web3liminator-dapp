'use strict'
const { useState, useEffect } = React

function GameRow(props) {
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
  const [myEntries, setMyEntries] = useState(0)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    GAME_READ_CONTRACT.gamesMapping(props.id).then((gDetail) => {
      setGameDetail(gDetail)
      //   console.log(gDetail)
      setLoaded(true)
    })
    GAME_READ_CONTRACT.getGameEntrants(props.id).then((gEntries) => {
      let myEntryCount = 0
      for (let i = 0; i < gEntries.length; i++) {
        if (props.userAddress == gEntries[i]) {
          myEntryCount++
        }
      }
      setEntries(gEntries)
      setMyEntries(myEntryCount)
    })
  }, [props.id, props.activeAddress])

  return (
    <tr>
      <td>
        <div className="d-flex px-2 py-1">
          <div className="d-flex flex-column justify-content-center">
            <h6 className="mb-0 text-sm">ID: {props.id}</h6>
            <p className="text-sm text-secondary mb-0">
              Host:{' '}
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
          {gameDetail.entryFee
            ? ethers.utils.formatUnits(gameDetail.entryFee, 18)
            : ''}{' '}
          STEAK
        </p>
      </td>
      <td>
        <p className="text-sm text-dark mb-0 text-center">
          {entries.length} /{' '}
          {gameDetail.maxEntrants ? gameDetail.maxEntrants.toNumber() : ''}
        </p>
      </td>
      <td className="align-middle text-center">
        <span className="text-secondary text-sm font-weight-bold text-dark">
          {gameDetail.maxEntriesPerWallet} ({myEntries})
        </span>
      </td>
      <td className="align-middle text-center text-sm text-dark">
        {entries.length >= gameDetail.minEntrants && (
          <span className="badge badge-md badge-success">
            Ready To Run (
            {gameDetail.minEntrants ? gameDetail.minEntrants.toNumber() : ''})
          </span>
        )}
      </td>
      <td className="align-middle">
        {activeNetwork.chainId == 137 &&
          myEntries < gameDetail.maxEntriesPerWallet &&
          entries.length < gameDetail.maxEntrants && (
            <div>
              <button
                id={'join-game-' + props.id}
                className="btn col-12 btn-sm bg-gradient-info btn-round text-light my-auto font-weight-bold text-xs join-game"
                data-gameid="GameID"
                data-toggle="tooltip"
                data-original-title="Join Game"
                onClick={() => GAME_READ_WRITE_CONTRACT.joinGame(props.id)}
              >
                Join Game
              </button>
              <br />
            </div>
          )}
        {activeNetwork.chainId == 137 &&
          props.userAddress == gameDetail.creator &&
          entries.length >= gameDetail.minEntrants && (
            <div>
              <button
                id={'run-game-' + props.id}
                className="btn col-12 btn-sm bg-gradient-success btn-round text-dark my-auto font-weight-bold mt-2 text-xs"
                onClick={() => GAME_READ_WRITE_CONTRACT.runGame(props.id)}
              >
                Run Game
              </button>
              <br />
            </div>
          )}
        {activeNetwork.chainId == 137 &&
          props.userAddress == gameDetail.creator && (
            <button
              id={'cancel-game-' + props.id}
              className="btn col-12 btn-sm bg-gradient-danger btn-round mt-2 text-light font-weight-bold text-xs"
              onClick={() => GAME_READ_WRITE_CONTRACT.cancelGame(props.id)}
            >
              Cancel Game
            </button>
          )}
      </td>
    </tr>
  )
}

function GamesTable(props) {
  const [gamesList, setGamesList] = useState([])

  useEffect(() => {
    GAME_READ_CONTRACT.getOnlyOpenGames().then((gList) => {
      setGamesList(gList)
    })
  }, [])

  return (
    <div className="container">
      <div className="row bg-white shadow mt-n7 border-radius-lg pb-4 p-3 mx-sm-0 mx-1 position-relative">
        <div className="row justify-content-center text-center ">
          <h3 className="text-uppercase opacity-8">Open Games</h3>
          <p className="text-secondary">
            Open games are automatically run if they reach the maximum entries.{' '}
            <br />
            They can also be run by the host any time after the minimum entries
            have been met.
          </p>
        </div>
        <div id="open-games-data" className="row justify-content-center">
          <div className="table-responsive">
            <table className="table align-items-center mb-0">
              <thead>
                <tr>
                  <th className="text-uppercase text-secondary text-md font-weight-bolder">
                    Game Info
                  </th>
                  <th className="text-uppercase text-secondary text-md font-weight-bolder ps-2">
                    Entry
                  </th>
                  <th className="text-center text-uppercase text-secondary text-md font-weight-bolder">
                    Entries
                  </th>
                  <th className="text-center text-uppercase text-secondary text-md font-weight-bolder">
                    Entries/Wallet
                  </th>
                  <th className="text-center text-uppercase text-secondary text-md font-weight-bolder">
                    Ready to Run
                  </th>
                  <th className="text-secondary"></th>
                </tr>
              </thead>
              <tbody id="open-games-table-body">
                {gamesList.map((game_id, i) => (
                  <GameRow
                    id={game_id.toNumber()}
                    userAddress={props.activeAddress}
                    signer={props.signer}
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

// const domContainer = document.querySelector('#open-games-table-body')
// const root = ReactDOM.createRoot(domContainer)
// root.render(e(GamesTable, { activeAddress: active_address, signer: null }))
