const { useState, useEffect } = React

function MainAppLayout(props) {
  const [registered, setRegistered] = useState(false)

  useEffect(() => {
    GAME_READ_CONTRACT.isRegistered(props.activeAddress).then(
      (isRegistered) => {
        if (isRegistered) {
          setRegistered(true)
        }
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
            weekOfSeason={0}
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
