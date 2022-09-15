const { useState, useEffect } = React
function RegisterLayout(props) {
  const [eligibility, setEligibility] = useState(false)
  const [username, setUsername] = useState('')
  const [chainID, setChainID] = useState('0')

  useEffect(() => {
    TOKEN_READ_CONTRACT.balanceOf(props.activeAddress).then((tokenCount) => {
      if (tokenCount.toNumber() > 0) {
        setEligibility(true)
      }
    })

    props.signer.getChainId().then((chainid) => {
      setChainID(chainid)
    })
  }, [props.activeAddress])

  function login() {
    provider.send('eth_requestAccounts', []).then((val) => {
      window.location.reload()
    })
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-12 ml-auto mr-auto">
          <div className="card card-signup">
            <h2 className="card-title text-center mt-3  ">
              CryptoDads Steak League
            </h2>
            <div className="card-body mb-4">
              <div className="row">
                <div className="col-lg-6 order-2 order-lg-1 ml-auto">
                  <div className="info info-horizontal info-register">
                    <div className="icon icon-rose">
                      <i className="material-icons">timeline</i>
                    </div>
                    <div className="description  text-white">
                      <h3 className="info-title  text-white">
                        Pick Games to Win
                      </h3>
                      <p className="description  text-white">
                        Pick an NFL winner each week. You can only use a team{' '}
                        <strong>one time the entire season</strong>. Pick a
                        loser, and you're out! (Alpha: you may be able to use
                        some STEAK to find your way back in)
                      </p>
                    </div>
                  </div>
                  <div className="info info-horizontal  info-register">
                    <div className="icon icon-primary">
                      <i className="material-icons">code</i>
                    </div>
                    <div className="description  text-white">
                      <h3 className="info-title  text-white">Custom Build</h3>
                      <p className="description text-white">
                        Built By a Cryptodads for Cryptodads (And Moms!)
                      </p>
                    </div>
                  </div>
                  <div className="info info-horizontal  info-register">
                    <div className="icon icon-info">
                      <img
                        src="https://steak.cryptodadsnft.com/img/stake.png"
                        width="30px"
                      />
                    </div>
                    <div className="description">
                      <h3 className="info-title text-white">STEAK!</h3>
                      <p className="description text-white">
                        Requires having at least one staked mom or dad to be
                        able to join the league and make your weekly picks
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 order-1 order-lg-2 mr-auto my-auto">
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
                      <div>
                        {chainID == 137 ? (
                          <div>
                            <div className="mb-6">
                              <p className="mb-0">Connected Wallet:</p>
                              <p>{props.activeAddress}</p>
                            </div>
                            <br></br>
                            <div className="form-group has-default">
                              <div className="input-group">
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Choose a username to join"
                                  value={username}
                                  onChange={(e) => {
                                    console.log(e.target.value)
                                    setUsername(e.target.value)
                                  }}
                                />
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                console.log(GAME_READ_CONTRACT)
                                console.log(username)

                                GAME_READ_WRITE_CONTRACT.register(
                                  username
                                ).catch((e) => {
                                  console.log(e)

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
                              }}
                              className="btn btn-info btn-lg"
                              disabled={
                                eligibility && username.length > 0 ? '' : true
                              }
                            >
                              {eligibility ? 'Register' : 'Not Eligible'}
                            </button>
                            <br />
                            <br />
                            {!eligibility && (
                              <h4 className="text-warning">
                                To be eligible for the STEAK league you must
                                have at least one staked CryptoDad or CryptoMom
                                throughout the league duration
                              </h4>
                            )}
                          </div>
                        ) : (
                          <div>
                            <button
                              onClick={() => {
                                window.ethereum
                                  .request({
                                    method: 'wallet_switchEthereumChain',
                                    params: [
                                      {
                                        chainId: '0x89',
                                      },
                                    ],
                                  })
                                  .then(() => {
                                    window.location.reload()
                                  })
                                  .catch(() => {
                                    window.ethereum.request({
                                      method: 'wallet_addEthereumChain',
                                      params: [
                                        {
                                          chainId: '0x89',
                                          rpcUrls: [
                                            'https://rpc-mainnet.matic.network/',
                                          ],
                                          chainName: 'Matic Mainnet',
                                          nativeCurrency: {
                                            name: 'MATIC',
                                            symbol: 'MATIC',
                                            decimals: 18,
                                          },
                                          blockExplorerUrls: [
                                            'https://polygonscan.com/',
                                          ],
                                        },
                                      ],
                                    })
                                  })
                              }}
                              className="btn btn-info btn-lg"
                            >
                              Switch to Polygon.
                            </button>
                            <h4>
                              You must be on the polygon network to interact
                              with the Steak League site
                            </h4>
                          </div>
                        )}
                      </div>
                    ) : !signer ? (
                      <div>
                        <h4 className="mx-4 text-warning">
                          <strong>
                            In order to interact with the Steak League site, you
                            will need to use a Web3 Enabled browser such as
                            Brave or install the Metamask plugin for your
                            current browser
                          </strong>
                        </h4>
                      </div>
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
