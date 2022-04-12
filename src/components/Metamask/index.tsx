import {Box, Button, Center, Container, Text} from '@chakra-ui/react';
import {ethers} from 'ethers';
import {FC} from 'react';

import {useState, useEffect} from 'react';
import {chainIdToNetwork} from '../../util/constants';
import RetroContract from '../RetroContract';
import RetroMachineContract from '../RetroMachineContract';

const MetamaskConnect: FC = () => {
  const [currentProvider, setCurrentProvider] = useState<
    ethers.providers.Web3Provider | undefined
  >();
  const [balance, setBalance] = useState<string | undefined>(null);
  const [currentAccount, setCurrentAccount] = useState<string | undefined>(
    null
  );
  const [chainId, setChainId] = useState<number | undefined>(null);

  useEffect(() => {}, [currentAccount]);

  const isMetamaskAvailable = () => {
    return typeof (window as any).ethereum !== 'undefined';
  };

  const connectToMetamask = async () => {
    const provider = new ethers.providers.Web3Provider(
      (window as any).ethereum
    );

    setCurrentProvider(provider);
    const accounts = await provider.send('eth_requestAccounts', []);
    setCurrentAccount(accounts[0]);
    const balance = await provider.getBalance(accounts[0]);
    setBalance(ethers.utils.formatEther(balance));
    const chain = await provider.getNetwork();
    setChainId(chain.chainId);
  };

  const disconnectAccount = async () => {
    setCurrentAccount(null);
  };

  return (
    <>
      <Box border="1px solid gray" borderRadius="lg" p={4} m="4">
        {!isMetamaskAvailable() && <Text>Install Metamask</Text>}

        {!currentAccount && (
          <>
            <Text>
              Connect to Metamask to show your balance and access contract
              methods
            </Text>
            <Center>
              <Button onClick={connectToMetamask}>Connect your wallet</Button>
            </Center>
          </>
        )}
        {currentAccount && !chainId && (
          <>
            <Text>Loading...</Text>
          </>
        )}
        {currentAccount && chainId && (
          <>
            <Center>
              <Box p={4}>
                <Text>
                  <strong>Account address:</strong> {currentAccount}
                </Text>
                <Text>
                  <strong>Balance:</strong> {balance}
                  {chainIdToNetwork(chainId).coin}
                </Text>
                <Text>
                  <strong>Chain:</strong> {chainIdToNetwork(chainId).name} (
                  {chainId})
                </Text>
              </Box>
            </Center>
            <Center>
              <Button onClick={disconnectAccount}>Disconnect</Button>
            </Center>
          </>
        )}
      </Box>
      <RetroContract enabled={currentAccount !== null} />
      <RetroMachineContract enabled={currentAccount !== null} />
    </>
  );
};

export default MetamaskConnect;

// TODO: Retro contract address 0x18671cEb32551442684C20eeD0Af95abB88C8ea5
// TODO: RetroMachine contract address 0x06C3748EC6471808C37f73fc5b49006ec1eb1A6C
