const { useState, useEffect } = React
function RegisterLayout(props) {
  const [eligibility, setEligibility] = useState(false)

  useEffect(() => {
    TOKEN_READ_CONTRACT.balanceOf(props.activeAddress).then((tokenCount) => {
      if (tokenCount.toNumber() > 0) {
        setEligibility(true)
      }
    })
  }, [props.activeAddress])

  function login() {
    provider.send('eth_requestAccounts', []).then((val) => {
      console.log(val)
    })
  }

  return (
    <div className="container register-container">
      <div className="row">
        <div className="col-md-10 ml-auto mr-auto">
          <div className="card card-signup">
            <h2 className="card-title text-center">Welcome to Web3liminator</h2>
            <div className="card-body">
              <div className="row">
                <div className="col-md-5 ml-auto">
                  <div className="info info-horizontal">
                    <div className="icon icon-rose">
                      <i className="material-icons">timeline</i>
                    </div>
                    <div className="description">
                      <h4 className="info-title">Pick Games to Win</h4>
                      <p className="description">
                        Pick an NFLgame winner each week. You can only use a
                        team one time the entire season. Pick a loser, and
                        you're out!
                      </p>
                    </div>
                  </div>
                  <div className="info info-horizontal">
                    <div className="icon icon-primary">
                      <i className="material-icons">code</i>
                    </div>
                    <div className="description">
                      <h4 className="info-title">Web3 Native</h4>
                      <p className="description">
                        Total transparency of picks and scoring via a custom
                        smart contract.
                      </p>
                    </div>
                  </div>
                  <div className="info info-horizontal">
                    <div className="icon icon-info">
                      <i className="material-icons">group</i>
                    </div>
                    <div className="description">
                      <h4 className="info-title">Community Focused</h4>
                      <p className="description">
                        Run a league that requires holding a specific ERC721
                        token.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-5 mr-auto my-auto">
                  {/* <div className="form-check">
                      <label className="form-check-label">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          checked=""
                        />
                        <span className="form-check-sign">
                          <span className="check"></span>
                        </span>
                        I agree to the
                        <a href="#something">terms and conditions</a>.
                      </label>
                    </div> */}
                  <div className="text-center">
                    {props.activeAddress ? (
                      <button
                        onClick={() => {
                          console.log(GAME_READ_CONTRACT)
                          GAME_READ_WRITE_CONTRACT.register().catch((e) =>
                            console.log(e)
                          )
                        }}
                        className="btn btn-info btn-lg"
                        disabled={eligibility ? '' : 'true'}
                      >
                        {eligibility ? 'Register' : 'Not Eligible'} <br />
                        (Requires having at least <br /> one staked CryptoDad or
                        CryptoMom)
                      </button>
                    ) : (
                      <button
                        onClick={() => login()}
                        className="btn btn-info btn-lg"
                      >
                        Connect Wallet
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
