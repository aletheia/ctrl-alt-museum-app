import {Box, Button, Heading, Text} from '@chakra-ui/react';
import {ethers} from 'ethers';
import {FC, useEffect, useState} from 'react';

import contract from '../../abi/Retro.json';

export interface ContractProps {
  address: string;
  provider: ethers.providers.Web3Provider;
}

const RetroContract: FC<ContractProps> = props => {
  const [contractInstance, setContractInstance] = useState<
    ethers.Contract | undefined
  >();
  const [currentAccount, setCurrentaccount] = useState<string | undefined>(
    null
  );
  const [isMinted, setMinted] = useState<boolean | undefined>(false);
  const [receipt, setReceipt] = useState<
    ethers.providers.TransactionReceipt | undefined
  >(undefined);
  const contractAddress = props.address;

  useEffect(() => {
    const contractInstance = async (
      provider: ethers.providers.Web3Provider
    ) => {
      const accounts = await provider.send('eth_requestAccounts', []);
      setCurrentaccount(accounts[0]);

      const signer = await provider.getSigner();
      const signerAddress = await signer.getAddress();

      const instance = new ethers.Contract(
        contractAddress,
        contract.abi,
        signer
      );
      setContractInstance(instance);
    };
    const {provider} = props;
    if (props.provider) {
      contractInstance(provider);
    }
  }, [props.address, props.provider]);

  const mintTokens = async () => {
    const instance = contractInstance;
    if (instance) {
      const tx = await instance.mint(currentAccount, 1);
      const receipt = await tx.wait();
      setReceipt(receipt);
      setMinted(true);
    }
  };

  return (
    <>
      <Box border="1px solid gray" borderRadius="lg" p={4} m="4">
        <Heading size="lg">Retro Contract</Heading>
        <Text>contract address: {contractAddress}</Text>
        <Button onClick={mintTokens}>Mint Tokens</Button>
        <Text>minted 1 token(s) to {currentAccount}</Text>
        {isMinted && !receipt && (
          <>
            <Box>Waiting for confirmation...</Box>
          </>
        )}
        {receipt && (
          <>
            <Box>
              <Heading size="sm">Latest Receipt</Heading>
              <Text>Block Number: {receipt.blockNumber}</Text>
              <Text>Transaction Hash: {receipt.transactionHash}</Text>
            </Box>
          </>
        )}
      </Box>
    </>
  );
};

export default RetroContract;

// NOTE: https://blog.logrocket.com/building-dapp-ethers-js/#getting-started-ethers-js
