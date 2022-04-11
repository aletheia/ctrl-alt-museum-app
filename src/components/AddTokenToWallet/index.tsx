import {Link} from '@chakra-ui/react';
import {FC} from 'react';

export interface TokenProps {
  tokenAddress: string;
  tokenSymbol: string;
  tokenDecimals: number;
  tokenImage: string;
}

const AddTokenToWallet: FC<TokenProps> = props => {
  const addTokenToWallet = async () => {
    const {tokenAddress, tokenDecimals, tokenImage, tokenSymbol} = props;
    try {
      // wasAdded is a boolean. Like any RPC method, an error may be thrown.
      const wasAdded = await (window as any).ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20', // Initially only supports ERC20, but eventually more!
          options: {
            address: tokenAddress, // The address that the token is at.
            symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
            decimals: tokenDecimals, // The number of decimals in the token
            image: tokenImage, // A string url of the token logo
          },
        },
      });

      if (wasAdded) {
        console.log('Thanks for your interest!');
      } else {
        console.log('Your loss!');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Link onClick={addTokenToWallet}>
      Add {props.tokenSymbol} token to your wallet{' '}
    </Link>
  );
};

export default AddTokenToWallet;
