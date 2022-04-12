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
  /* Declaring a variable called balance and setting it to null. */
  const [balance, setBalance] = useState<string | undefined>(null);
  /* Declaring a variable called currentAccount and setting it to null. */
  const [currentAccount, setCurrentAccount] = useState<string | undefined>(
    null
  );
  /* Declaring a variable called chainId and setting it to null. */
  const [chainId, setChainId] = useState<number | undefined>(null);

  useEffect(() => {
    if (isMetamaskAvailable()) {
      const metamask = (window as any).ethereum;
      metamask.on('accountsChanged', accounts => {
        console.log('accountsChanges', accounts);
        connectToMetamask();
      });
      metamask.on('chainChanged', networkId => {
        console.log('networkChanged', networkId);
        connectToMetamask();
      });
    }
  }, [currentAccount]);

  /**
   * If the window object has a property called ethereum, then return true, otherwise return false.
   * @returns The function isMetamaskAvailable is returning a boolean value.
   */
  const isMetamaskAvailable = () => {
    return typeof (window as any).ethereum !== 'undefined';
  };

  /**
   * It connects to Metamask, gets the current account, gets the balance, and gets the chain ID
   */
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
        {
          // If the window object has a property called ethereum, then return true, otherwise return false.
          // If ethereum object is not available, invite user to install metamask
          !isMetamaskAvailable() && <Text>Install Metamask</Text>
        }

        {
          // If an address is detected, connect the wallet
          isMetamaskAvailable() && !currentAccount && (
            <>
              <Text>
                Connect to Metamask to show your balance and access contract
                methods
              </Text>
              <Center>
                <Button onClick={connectToMetamask}>Connect your wallet</Button>
              </Center>
            </>
          )
        }

        {
          // Checking if the currentAccount is not null and the chainId is null. If that is true, then it will
          // display the text "Loading...".
          currentAccount && !chainId && (
            <>
              <Text>Loading...</Text>
            </>
          )
        }

        {
          // Checking if the currentAccount is not null and the chainId is not null. If that is true, then it will
          // display the text "Balance is..." and the balance.
          currentAccount && chainId && (
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
          )
        }
      </Box>
      <RetroContract enabled={currentAccount !== null} />
      <RetroMachineContract enabled={currentAccount !== null} />
    </>
  );
};

export default MetamaskConnect;

// TODO: Retro contract address 0x18671cEb32551442684C20eeD0Af95abB88C8ea5
// TODO: RetroMachine contract address 0x06C3748EC6471808C37f73fc5b49006ec1eb1A6C
