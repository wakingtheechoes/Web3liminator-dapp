const { useState, useEffect } = React

function DashboardLayout(props) {
  const [games, setGames] = useState([])
  const [eliminated, setEliminated] = useState(false)
  const [picks, setPicks] = useState([])
  const [challengesRemain, setChallengesRemain] = useState(0)
  const [pastPicks, setPastPicks] = useState([])
  const [pickWeek, setPickWeek] = useState(null)
  const [playersElimStatus, setPlayersElimStatus] = useState([])
  const [currentWeekPicks, setCurrentWeekPicks] = useState([])
  const [steakAllowance, setSteakAllowance] = useState(0)

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

    GAME_READ_CONTRACT.getAllEliminatedStatus().then((status_list) => {
      setPlayersElimStatus(status_list)
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
      setChallengesRemain(1 - challenges)
    })

    GAME_READ_CONTRACT.getAllPicksByWeek(props.weekOfSeason).then((picks) => {
      setCurrentWeekPicks(picks)
      getDataForPieChart(picks)
    })

    TOKEN_READ_CONTRACT.allowance(
      props.activeAddress,
      GAME_CONTRACT_ADDRESS
    ).then((allowance) => {
      console.log(allowance)
      setSteakAllowance(parseInt(ethers.utils.formatUnits(allowance, 18)))
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

  function getDataForPieChart(currentWeekPicks) {
    let picksObject = {}
    for (let i = 0; i < currentWeekPicks.length; i++) {
      picksObject[TEAMS[currentWeekPicks[i]]] = picksObject[
        TEAMS[currentWeekPicks[i]]
      ]
        ? picksObject[TEAMS[currentWeekPicks[i]]] + 1
        : 1
    }
    let team_labels = []
    let return_vals = []
    for (let i = 0; i < TEAMS.length; i++) {
      if (picksObject[TEAMS[i].abbreviation]) {
        return_vals.push(picksObject[TEAMS[i].abbreviation])
        team_labels.push(TEAMS[i].abbreviation)
      }
    }
    console.log(return_vals)
    new Chartist.Pie('#chartPreferences', {
      labels: team_labels,
      series: [return_vals],
    })
  }

  return (
    <div className="wrapper ">
      <div
        className="sidebar"
        data-color="orange"
        data-background-color="default"
        data-image="../assets/img/sidebar-1.jpg"
      >
        <div className="logo">
          <a href="" className="simple-text logo-mini">
            <img
              src="https://steak.cryptodadsnft.com/img/stake.png"
              width="100%"
            ></img>
          </a>
          <a href="" className="simple-text logo-normal">
            STEAK LEAGUE
          </a>
        </div>
        <div className="sidebar-wrapper">
          <div className="user">
            <div className="user-info">
              <a
                data-toggle="collapse"
                href="#collapseExample"
                className="username"
              >
                <span>
                  {props.username}
                  <b className="caret"></b>
                </span>
              </a>
              <div className="collapse" id="collapseExample">
                <ul className="nav">
                  <li className="nav-item">
                    <a className="nav-link" href="#">
                      <span className="sidebar-normal">
                        {' '}
                        Edit Username (Coming Soon){' '}
                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <ul className="nav">
            <li
              className={pickWeek == null ? 'nav-item active' : 'nav-item'}
              onClick={() => setPickWeek(null)}
            >
              <a className="nav-link" href="#">
                <i className="material-icons">dashboard</i>
                <p> Dashboard </p>
              </a>
            </li>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map(
              (week, i) => (
                <li
                  className={pickWeek == i ? 'nav-item active' : 'nav-item'}
                  onClick={() => setPickWeek(week)}
                  key={i}
                >
                  <a className="nav-link" href="#">
                    <p>
                      Week {week + 2}
                      {' - '}
                      <span className="badge badge-lg">
                        {TEAMS[pastPicks[week]]
                          ? TEAMS[pastPicks[week]].abbreviation
                          : 'NONE'}
                      </span>
                    </p>
                  </a>
                </li>
              )
            )}
          </ul>
        </div>
      </div>
      <div className="main-panel">
        <nav className="navbar navbar-expand-lg navbar-transparent navbar-absolute fixed-top ">
          <div className="container-fluid">
            <div className="navbar-wrapper">
              <div className="navbar-minimize"></div>
              <a className="navbar-brand" href="#"></a>
            </div>
            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              aria-controls="navigation-index"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="sr-only">Toggle navigation</span>
              <span className="navbar-toggler-icon icon-bar"></span>
              <span className="navbar-toggler-icon icon-bar"></span>
              <span className="navbar-toggler-icon icon-bar"></span>
            </button>
          </div>
        </nav>
        <div className="content">
          {eliminated ? (
            <div className="alert alert-danger" role="alert">
              <strong>Oh No!</strong> It looks like you have been eliminated.
              {challengesRemain > 0 && props.weekOfSeason < 11 ? (
                <p className="mt-2">
                  You are eligible to buy back into the eliminator by buying a
                  challenge flag for 100 $STEAK. You will not be able to make
                  any more picks until you buy one.
                </p>
              ) : (
                <p className="mt-2">
                  It looks like a challenge flag is not an option :( Better luck
                  next season
                </p>
              )}
            </div>
          ) : (
            <div className="alert alert-success" role="alert">
              <strong>Congratulations!</strong> You are still alive and have not
              been eliminated yet.
            </div>
          )}
          {pickWeek == null ? (
            <div className="content">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-lg-3 col-md-6 col-sm-6">
                    <div className="card card-stats">
                      <div className="card-header card-header-success card-header-icon">
                        <div className="card-icon">
                          <i className="material-icons">done</i>
                        </div>
                        <p className="card-category">Players Alive</p>
                        <h3 className="card-title">
                          {playersElimStatus.reduce((prev, cur) => {
                            return cur == false ? prev + 1 : prev
                          }, 0)}
                        </h3>
                      </div>
                      <div className="card-footer"></div>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-6 col-sm-6">
                    <div className="card card-stats">
                      <div className="card-header card-header-danger card-header-icon">
                        <div className="card-icon">
                          <i className="material-icons">person_off</i>
                        </div>
                        <p className="card-category">Players Eliminated</p>
                        <h3 className="card-title">
                          {playersElimStatus.reduce((prev, cur) => {
                            return cur == true ? prev + 1 : prev
                          }, 0)}
                        </h3>
                      </div>
                      <div className="card-footer"></div>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-6 col-sm-6">
                    <div className="card card-stats">
                      <div className="card-header card-header-success card-header-icon">
                        <div className="card-icon">
                          <i className="material-icons">date_range</i>
                        </div>
                        <p className="card-category">Current Week</p>
                        <h3 className="card-title">{props.weekOfSeason + 2}</h3>
                      </div>
                      <div className="card-footer"></div>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-6 col-sm-6">
                    <div className="card card-stats">
                      <div className="card-header card-header-info card-header-icon">
                        <div className="card-icon">
                          <i className="material-icons">shield</i>
                        </div>
                        <p className="card-category">Current Pick</p>
                        <h3 className="card-title">
                          {pastPicks[props.weekOfSeason]
                            ? TEAMS[pastPicks[props.weekOfSeason]].abbreviation
                            : 'NONE'}
                        </h3>
                      </div>
                      <div className="card-footer"></div>
                    </div>
                  </div>
                </div>
                <br />
                <div className="row">
                  <div className="col-lg-6 cards">
                    <div className="card card-pricing card-raised">
                      <div className="card-body">
                        <h3 className="card-category">Set your Pick</h3>
                        <div className="card-icon icon-rose">
                          <i className="material-icons">sports_football</i>
                        </div>
                        <h3 className="card-title">
                          WEEK {props.weekOfSeason + 2}
                        </h3>
                        <a
                          href="#"
                          onClick={() => setPickWeek(props.weekOfSeason)}
                          className="btn btn-rose btn-round"
                        >
                          Click to see Games
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 cards">
                    <div className="card card-pricing card-raised">
                      <div className="card-body">
                        <h3 className="card-category">Eliminated?</h3>
                        <h3 className="card-title">Buy a challenge flag</h3>
                        <p>
                          A challenge flag nullifies one losing pick, and can
                          only be bought or used through week 9 of the NFL
                          season. One challenge flag can be bought per wallet.
                        </p>
                        {challengesRemain > 0 ? (
                          steakAllowance > 100 ? (
                            <a
                              href="#"
                              onClick={() =>
                                GAME_READ_WRITE_CONTRACT.buyAChallengeFlag()
                              }
                              className="btn btn-rose btn-round"
                            >
                              Click to buy a challenge
                            </a>
                          ) : (
                            <a
                              href="#"
                              onClick={() =>
                                TOKEN_READ_WRITE_CONTRACT.approve(
                                  GAME_CONTRACT_ADDRESS,
                                  ethers.utils.parseUnits('1000', 18)
                                )
                              }
                              className="btn btn-rose btn-round"
                            >
                              Click to approve STEAK
                            </a>
                          )
                        ) : (
                          <h3>Challenge Flag Already Bought</h3>
                        )}
                        <br />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="content">
              <div className="container-fluid">
                <PickGame
                  activeAddress={props.activeAddress}
                  signer={props.signer}
                  weekOfSeason={pickWeek}
                  username={props.username}
                ></PickGame>
              </div>
            </div>
          )}
        </div>
        {/* <footer className="footer">
          <div className="container-fluid">
            <nav className="float-left">
              <ul>
                <li>
                  <a href="https://www.creative-tim.com">Creative Tim</a>
                </li>
                <li>
                  <a href="https://creative-tim.com/presentation">About Us</a>
                </li>
                <li>
                  <a href="https://www.creative-tim.com/blog">Blog</a>
                </li>
                <li>
                  <a href="https://www.creative-tim.com/license">Licenses</a>
                </li>
              </ul>
            </nav>
            <div className="copyright float-right">
              &copy;
              <script>document.write(new Date().getFullYear())</script>, made
              with <i className="material-icons">favorite</i> by
              <a href="https://www.creative-tim.com" target="_blank">
                Creative Tim
              </a>{' '}
              for a better web.
            </div>
          </div>
        </footer> */}
      </div>
    </div>
  )
}
