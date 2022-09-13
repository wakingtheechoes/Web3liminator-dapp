'use strict'

function NavBar(props) {
  function login() {
    provider.send('eth_requestAccounts', []).then((val) => {
      console.log(val)
    })
  }

  return (
    <nav
      className="navbar navbar-expand-lg bg-white  navbar-transparent position-fixed w-100 top-0 z-index-3 shadow-none py-2 start-0 end-0"
      id="navbarPresentationShadow"
    >
      <div className="container pt-1">
        <a
          className="navbar-brand font-weight-bolder ms-sm-3"
          href="#"
          rel="tooltip"
          data-placement="bottom"
          target="_blank"
        >
          RichOrRekt Game{' '}
          <span className="badge badge-xs badge-primary">BETA</span>
        </a>
        {props.activeAddress ? (
          <span
            id="balance-mobile"
            className="nav-link ps-2 d-flex justify-content-between align-items-center text-dark d-lg-none d-block"
          >
            Balance: {props.tokenBalance} STEAK
          </span>
        ) : (
          <span id="btn-connect-mobile">
            <button
              className="btn btn-sm bg-gradient-primary btn-round mb-0 ms-auto d-lg-none d-block"
              onClick={() => login()}
            >
              Connect Wallet
            </button>
          </span>
        )}
        <button
          className="navbar-toggler shadow-none ms-md-2"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navigation"
          aria-controls="navigation"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon mt-2">
            <span className="navbar-toggler-bar bar1"></span>
            <span className="navbar-toggler-bar bar2"></span>
            <span className="navbar-toggler-bar bar3"></span>
          </span>
        </button>
        <div
          className="collapse navbar-collapse w-100 pt-3 pb-2 py-lg-0"
          id="navigation"
        >
          <ul className="navbar-nav navbar-nav-hover mx-auto">
            <li className="nav-item dropdown dropdown-hover mx-2">
              <span
                className="nav-link ps-2 d-flex justify-content-between align-items-center text-dark"
                id="wallet-addy"
              >
                {props.activeAddress}
              </span>
            </li>
          </ul>
          <ul className="navbar-nav d-lg-block d-none">
            <li className="nav-item">
              {props.activeAddress ? (
                <span
                  className="nav-link ps-2 d-flex justify-content-between align-items-center text-dark"
                  id="token-balance"
                >
                  Balance: {props.tokenBalance} STEAK
                </span>
              ) : (
                <button
                  id="btn-connect"
                  className="btn btn-sm bg-gradient-primary btn-round mb-0 me-1"
                  onClick={() => login()}
                >
                  Connect Wallet
                </button>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
