export const chainIdToNetwork = (chainId: number) => {
  switch (chainId) {
    case 1:
      return {name: 'ethereum', coin: 'ETH'};
    case 3:
      return {name: 'ropsten', coin: 'ETH'};
    case 4:
      return {name: 'rinkeby', coin: 'ETH'};
    case 42:
      return {name: 'kovan', coin: 'ETH'};
    case 5:
      return {name: 'goerli', coin: 'ETH'};
    case 97:
      return {name: 'Binance Testnet', coin: 'BNB'};
    default:
      return {name: 'unknown', coin: ''};
  }
};
