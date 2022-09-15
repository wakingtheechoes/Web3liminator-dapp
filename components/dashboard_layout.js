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
      setChallengesRemain(challenges)
    })

    GAME_READ_CONTRACT.getAllPicksByWeek(props.weekOfSeason).then((picks) => {
      setCurrentWeekPicks(picks)
      getDataForPieChart(picks)
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
              <a className="navbar-brand" href="javascript:;"></a>
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
              Good luck next season! You may keep picking teams weekly if you
              want to play along for fun.
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
                  <div class="col-lg-6 offset-lg-3 cards">
                    <div class="card card-pricing card-raised">
                      <div class="card-body">
                        <h3 class="card-category">Set your Pick</h3>
                        <div class="card-icon icon-rose">
                          <i class="material-icons">sports_football</i>
                        </div>
                        <h3 class="card-title">
                          WEEK {props.weekOfSeason + 2}
                        </h3>
                        <a
                          href="#"
                          onClick={() => setPickWeek(props.weekOfSeason)}
                          class="btn btn-rose btn-round"
                        >
                          Click to see Games
                        </a>
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
