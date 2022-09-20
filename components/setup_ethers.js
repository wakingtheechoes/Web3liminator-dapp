'use strict'

const ALCHEMY_RPC_URL =
  'https://polygon-mainnet.g.alchemy.com/v2/jI66Ll05xpLRz-TJR7tVW56Q3NRQDrXx'
const GAME_CONTRACT_ADDRESS = '0x7eA10231b304899C0dA51E9825C02561F6003f7d'
const TOKEN_CONTRACT_ADDRESS = '0x9d4314EFe6DaE51C1543Bab8f1E861F9800f6802' // L2 staking state for cmoms/dads

const TOKEN_CONTRACT_ABI = [
  { inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'Approval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'from', type: 'address' },
      { indexed: true, internalType: 'address', name: 'to', type: 'address' },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    inputs: [],
    name: 'DOMAIN_SEPARATOR',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '', type: 'address' },
      { internalType: 'address', name: '', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'spender', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256[]', name: 'amounts', type: 'uint256[]' },
      { internalType: 'address[]', name: 'to', type: 'address[]' },
    ],
    name: 'bulkMint',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'from', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'burn',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'user', type: 'address' }],
    name: 'getMintAllowance',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
      { internalType: 'address', name: 'to', type: 'address' },
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'mintingPaused',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'nonces',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'address', name: 'spender', type: 'address' },
      { internalType: 'uint256', name: 'value', type: 'uint256' },
      { internalType: 'uint256', name: 'deadline', type: 'uint256' },
      { internalType: 'uint8', name: 'v', type: 'uint8' },
      { internalType: 'bytes32', name: 'r', type: 'bytes32' },
      { internalType: 'bytes32', name: 's', type: 'bytes32' },
    ],
    name: 'permit',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bool', name: 'paused', type: 'bool' }],
    name: 'setMintingPaused',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'from', type: 'address' },
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'user', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'updateMintAllowance',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]

const GAME_CONTRACT_ABI = [
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'uint8', name: 'version', type: 'uint8' },
    ],
    name: 'Initialized',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    inputs: [],
    name: 'activeWeekIndex',
    outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'addressesRegisteredList',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'addressesRegisteredMapping',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'addressesToChallengesBoughtMapping',
    outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'advanceActiveWeekIndex',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint8[]', name: 'game_weeks', type: 'uint8[]' },
      {
        internalType: 'enum Web3liminator_V1.NFLTeam[]',
        name: 'home_teams',
        type: 'uint8[]',
      },
      {
        internalType: 'enum Web3liminator_V1.NFLTeam[]',
        name: 'away_teams',
        type: 'uint8[]',
      },
      { internalType: 'uint256[]', name: 'kickoff_times', type: 'uint256[]' },
    ],
    name: 'bulkAddGames',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint8[]', name: 'game_weeks', type: 'uint8[]' },
      { internalType: 'uint256[]', name: 'game_indexes', type: 'uint256[]' },
      {
        internalType: 'enum Web3liminator_V1.NFLTeam[]',
        name: 'home_teams',
        type: 'uint8[]',
      },
      {
        internalType: 'enum Web3liminator_V1.NFLTeam[]',
        name: 'away_teams',
        type: 'uint8[]',
      },
      { internalType: 'uint256[]', name: 'kickoff_times', type: 'uint256[]' },
    ],
    name: 'bulkChangeGameDetail',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint8[]', name: 'game_weeks', type: 'uint8[]' },
      { internalType: 'uint256[]', name: 'game_ids', type: 'uint256[]' },
      {
        internalType: 'enum Web3liminator_V1.NFLTeam[]',
        name: 'winning_teams',
        type: 'uint8[]',
      },
    ],
    name: 'bulkUpdateGameResults',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'buyAChallengeFlag',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'cachedEliminationList',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'challengeFlagBuyingEnabled',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '', type: 'address' },
      { internalType: 'uint256', name: '', type: 'uint256' },
    ],
    name: 'contestantWinnersPicked',
    outputs: [
      {
        internalType: 'enum Web3liminator_V1.NFLTeam',
        name: '',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'contestantWinsPickedScore',
    outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'eligibilityCheckAddress',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getAllEliminatedStatus',
    outputs: [{ internalType: 'bool[]', name: '', type: 'bool[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint8', name: 'week_of_season', type: 'uint8' }],
    name: 'getAllGamesForWeek',
    outputs: [
      {
        components: [
          {
            internalType: 'enum Web3liminator_V1.NFLTeam',
            name: 'homeTeam',
            type: 'uint8',
          },
          {
            internalType: 'enum Web3liminator_V1.NFLTeam',
            name: 'awayTeam',
            type: 'uint8',
          },
          {
            internalType: 'enum Web3liminator_V1.NFLTeam',
            name: 'winner',
            type: 'uint8',
          },
          { internalType: 'uint256', name: 'kickoffTime', type: 'uint256' },
          { internalType: 'uint8', name: 'week', type: 'uint8' },
          { internalType: 'bool', name: 'resultHasBeenSet', type: 'bool' },
        ],
        internalType: 'struct Web3liminator_V1.NFLGame[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint8', name: 'week_of_season', type: 'uint8' }],
    name: 'getAllPicksByWeek',
    outputs: [
      {
        internalType: 'enum Web3liminator_V1.NFLTeam[]',
        name: '',
        type: 'uint8[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getContestantList',
    outputs: [{ internalType: 'address[]', name: '', type: 'address[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint8', name: 'week_of_season', type: 'uint8' }],
    name: 'getNumberOfGamesInWeek',
    outputs: [
      { internalType: 'uint256', name: 'numberOfGames', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'addressToCheck', type: 'address' },
    ],
    name: 'getPicksByAddress',
    outputs: [
      {
        internalType: 'enum Web3liminator_V1.NFLTeam[]',
        name: '',
        type: 'uint8[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint8', name: 'week_of_season', type: 'uint8' }],
    name: 'getTeamResultsByWeek',
    outputs: [
      {
        internalType: 'enum Web3liminator_V1.WeeklyResult[]',
        name: '',
        type: 'uint8[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint8', name: 'numberToGive', type: 'uint8' },
      { internalType: 'address', name: 'recipient', type: 'address' },
    ],
    name: 'giveChallengeFlags',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'eligibilityAddress', type: 'address' },
      { internalType: 'uint8', name: 'leagueWeeks', type: 'uint8' },
      { internalType: 'uint8', name: 'startingWeekOfSeason', type: 'uint8' },
      { internalType: 'address', name: 'paymentTokenAddress', type: 'address' },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'addressToCheck', type: 'address' },
    ],
    name: 'isEliminated',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'addressToCheck', type: 'address' },
    ],
    name: 'isRegistered',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'numberOfLeagueWeeks',
    outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'paymentToken',
    outputs: [
      { internalType: 'contract IERC20Upgradeable', name: '', type: 'address' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint8', name: 'week_of_season', type: 'uint8' },
      {
        internalType: 'enum Web3liminator_V1.NFLTeam',
        name: 'team_to_win',
        type: 'uint8',
      },
    ],
    name: 'pickWeeklyWinner',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'string', name: 'username', type: 'string' }],
    name: 'register',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint8', name: 'week_of_season', type: 'uint8' }],
    name: 'setActiveWeekIndex',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bool', name: 'enabled', type: 'bool' }],
    name: 'setChallengeFlagBuying',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'eligibilityAddress', type: 'address' },
    ],
    name: 'setEligibilityTokenAddress',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'paymentTokenAddress', type: 'address' },
    ],
    name: 'setPaymentToken',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'startingWeek',
    outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'enum Web3liminator_V1.NFLTeam',
        name: '',
        type: 'uint8',
      },
      { internalType: 'uint256', name: '', type: 'uint256' },
    ],
    name: 'teamResultsByWeek',
    outputs: [
      {
        internalType: 'enum Web3liminator_V1.WeeklyResult',
        name: '',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint8[]', name: 'game_weeks', type: 'uint8[]' },
      {
        internalType: 'enum Web3liminator_V1.NFLTeam[]',
        name: 'teams',
        type: 'uint8[]',
      },
      {
        internalType: 'enum Web3liminator_V1.WeeklyResult[]',
        name: 'results',
        type: 'uint8[]',
      },
    ],
    name: 'updateTeamWeeklyResults',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'usernamesMapping',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint8', name: '', type: 'uint8' },
      { internalType: 'uint256', name: '', type: 'uint256' },
    ],
    name: 'weeksToGamesMapping',
    outputs: [
      {
        internalType: 'enum Web3liminator_V1.NFLTeam',
        name: 'homeTeam',
        type: 'uint8',
      },
      {
        internalType: 'enum Web3liminator_V1.NFLTeam',
        name: 'awayTeam',
        type: 'uint8',
      },
      {
        internalType: 'enum Web3liminator_V1.NFLTeam',
        name: 'winner',
        type: 'uint8',
      },
      { internalType: 'uint256', name: 'kickoffTime', type: 'uint256' },
      { internalType: 'uint8', name: 'week', type: 'uint8' },
      { internalType: 'bool', name: 'resultHasBeenSet', type: 'bool' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'withdrawAll',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]

const read_provider = new ethers.providers.JsonRpcProvider(ALCHEMY_RPC_URL, 137)
let provider
if (window.ethereum) {
  provider = new ethers.providers.Web3Provider(window.ethereum, 137)
} else {
  provider = null
}

// If you don't specify a //url//, Ethers connects to the default
// (i.e. ``http:/\/localhost:8545``)

function ethers_login() {
  provider.send('eth_requestAccounts', []).then((val) => {
    console.log(val)
  })
}

let active_address = ''
let activeNetwork
let GAME_READ_WRITE_CONTRACT
let TOKEN_READ_WRITE_CONTRACT

if (window.ethereum) {
  window.ethereum.on('chainChanged', async () => {
    console.log('network change')
    window.location.reload()
    // activeNetwork = await provider.getNetwork()
    // root.render(
    //   e(MainAppLayout, {
    //     activeAddress: active_address,
    //     signer: signer,
    //   })
    // )
  })

  window.ethereum.on('accountsChanged', async () => {
    // Do something
    signer = await provider.getSigner()
    console.log(signer)
    activeNetwork = await provider.getNetwork()
    signer
      .getAddress()
      .then((val) => {
        // connected to site
        console.log('Account:', val)
        active_address = val
        console.log(active_address)
        GAME_READ_WRITE_CONTRACT = new ethers.Contract(
          GAME_CONTRACT_ADDRESS,
          GAME_CONTRACT_ABI,
          signer
        )
        TOKEN_READ_WRITE_CONTRACT = new ethers.Contract(
          TOKEN_CONTRACT_ADDRESS,
          TOKEN_CONTRACT_ABI,
          signer
        )
        root.render(
          e(MainAppLayout, {
            activeAddress: active_address,
            signer: signer,
          })
        )
      })
      .catch((err) => {
        // not connected to site
        console.log(err)

        // The provider also allows signing transactions to
        // send ether and pay to change state within the blockchain.
        // For this, we need the account signer...
        // Prompt user for account connections
      })
    console.log('account changed')
  })
}
let signer
if (provider != null) {
  signer = provider.getSigner()

  // signer = await provider.getSigner()
  console.log(signer)
  provider.getNetwork().then((val) => (activeNetwork = val))
  signer
    .getAddress()
    .then((val) => {
      console.log(val)
      active_address = val
      GAME_READ_WRITE_CONTRACT = new ethers.Contract(
        GAME_CONTRACT_ADDRESS,
        GAME_CONTRACT_ABI,
        signer
      )
      console.log(GAME_READ_WRITE_CONTRACT)
      TOKEN_READ_WRITE_CONTRACT = new ethers.Contract(
        TOKEN_CONTRACT_ADDRESS,
        TOKEN_CONTRACT_ABI,
        signer
      )
      root.render(
        e(MainAppLayout, {
          activeAddress: active_address,
          signer: signer,
        })
      )
    })
    .catch((err) => {
      // not connected to site
      console.log(err)

      // The provider also allows signing transactions to
      // send ether and pay to change state within the blockchain.
      // For this, we need the account signer...
      // Prompt user for account connections
    })
}

// TODODODODODO
// document.getElementById('btn-big-connect').onclick = ethers_login

// The provider also allows signing transactions to
// send ether and pay to change state within the blockchain.
// For this, we need the account signer...
// Prompt user for account connections
// provider.send('eth_requestAccounts', []).then((val) => {
//   console.log(val)
//   //   const signer = provider.getSigner()
//   //   signer.getAddress().then((val) => {
//   //     console.log('Account:', val)
//   //   })
// })

// The Contract object
const GAME_READ_CONTRACT = new ethers.Contract(
  GAME_CONTRACT_ADDRESS,
  GAME_CONTRACT_ABI,
  read_provider
)
const TOKEN_READ_CONTRACT = new ethers.Contract(
  TOKEN_CONTRACT_ADDRESS,
  TOKEN_CONTRACT_ABI,
  read_provider
)
