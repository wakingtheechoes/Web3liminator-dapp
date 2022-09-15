const { useState, useEffect } = React

function MainAppLayout(props) {
  const [registered, setRegistered] = useState(false)
  const [username, setUsername] = useState(false)
  const [activeWeek, setActiveWeek] = useState(0)

  useEffect(() => {
    GAME_READ_CONTRACT.isRegistered(props.activeAddress).then(
      (isRegistered) => {
        if (isRegistered == true) {
          console.log('registered', isRegistered)
          setRegistered(true)
        } else {
          setRegistered(false)
        }
      }
    )

    GAME_READ_CONTRACT.activeWeekIndex().then((aw) => {
      setActiveWeek(aw)
    })

    GAME_READ_CONTRACT.usernamesMapping(props.activeAddress).then(
      (returned_username) => {
        setUsername(returned_username)
      }
    )
  }, [props.activeAddress])

  return (
    <div>
      {props.activeAddress && registered ? (
        <div>
          <PickGame
            activeAddress={props.activeAddress}
            signer={props.signer}
            weekOfSeason={activeWeek}
            username={username}
          />
          {/* <NavBar
            activeAddress={props.activeAddress}
            tokenBalance={tokenBalance}
          />
          <Hero
            tokenBalance={tokenBalance}
            tokenAllowance={tokenAllowance}
            activeAddress={props.activeAddress}
            signer={props.signer}
          />
          <GamesTable
            activeAddress={props.activeAddress}
            signer={props.signer}
            tokenBalance={tokenBalance}
            tokenAllowance={tokenAllowance}
          />
          <CompletedGamesTable activeAddress={props.active_address} /> */}
        </div>
      ) : (
        <RegisterLayout
          activeAddress={props.activeAddress}
          signer={props.signer}
        ></RegisterLayout>
      )}
    </div>
  )
}

const e = React.createElement

const reactAppDOM = document.querySelector('#react-app-main-layout')
const root = ReactDOM.createRoot(reactAppDOM)
root.render(e(MainAppLayout, { activeAddress: active_address }))
