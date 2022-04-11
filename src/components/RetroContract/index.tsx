import {
  Box,
  Button,
  Container,
  Heading,
  Input,
  Link,
  Menu,
  Spacer,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import {ExternalLinkIcon} from '@chakra-ui/icons';

import {FC, useEffect, useState} from 'react';

import addresses from '../../config/contractAddresses.json';
import contract from '../../config/abi/Retro.json';
import AddTokenToWallet from '../AddTokenToWallet';
import {ethers} from 'ethers';

export interface ContractProps {
  enabled: boolean;
}

const RetroContract: FC<ContractProps> = props => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [contractInstance, setContractInstance] = useState<
    ethers.Contract | undefined
  >();
  const [currentAccount, setCurrentaccount] = useState<string | undefined>(
    null
  );
  const [isProcessing, setProcessing] = useState<boolean | undefined>(false);
  const [receipt, setReceipt] = useState<
    ethers.providers.TransactionReceipt | undefined
  >(undefined);
  const [destinationAddress, setDestinationAddress] = useState<
    string | undefined
  >(null);
  const contractAddress = addresses.retro;

  const istantiateContract = async () => {
    const provider = new ethers.providers.Web3Provider(
      (window as any).ethereum
    );
    const accounts = await provider.send('eth_requestAccounts', []);
    const signer = await provider.getSigner();
    const instance = new ethers.Contract(contractAddress, contract.abi, signer);
    setCurrentaccount(accounts[0]);
    setContractInstance(instance);
  };

  const mintTokens = async () => {
    setIsLoading(true);
    const instance = contractInstance;
    if (instance) {
      try {
        const tx = await instance.mint(currentAccount, 1);
        const receipt = await tx.wait();
        setReceipt(receipt);
        setProcessing(true);
      } catch (e) {
        console.log('cannot mint tokens', e);
      }
    } else {
      console.log('no contract instance');
    }
    setIsLoading(false);
  };

  const sendTokens = async () => {
    setIsLoading(true);
    const instance = contractInstance;

    if (instance) {
      try {
        const tx = await instance.transfer(
          destinationAddress,
          ethers.utils.parseUnits('1', 18)
        );
        const receipt = await tx.wait();
        setReceipt(receipt);
        setProcessing(true);
      } catch (e) {
        console.log('cannot send tokens', e);
      }
    } else {
      console.log('Contract is not istantiated');
    }
    setIsLoading(false);
  };

  const setReceiverAddress = async (event: {target: {value: string}}) => {
    let address = event.target.value.trim();
    address = address.length > 0 ? address : null;
    setDestinationAddress(address);
  };

  useEffect(() => {
    if (props.enabled) {
      istantiateContract();
    }
  }, [props.enabled]);

  return (
    <>
      <Box border="1px solid gray" borderRadius="lg" p={4} m="4">
        {props.enabled && !isLoading && (
          <VStack spacing={4}>
            <Menu>
              <Heading size="lg">Retro Contract </Heading>
              <AddTokenToWallet
                tokenAddress={contractAddress}
                tokenDecimals={0}
                tokenImage="http://placekitten.com/200/300"
                tokenSymbol="RTO"
              />
              <Text>{contractAddress}</Text>
            </Menu>
            <Spacer />
            <VStack align="left">
              <Heading size="sm">Mint Tokens</Heading>
              <Text>
                Invoke smart contract method to mint a RTO token to your wallet.
                It should take a few seconds to be processed by BSC testnet
              </Text>
              <Button onClick={mintTokens}>Mint Tokens</Button>
            </VStack>
            <Spacer />
            <VStack align="left">
              <Heading size="sm">Transfer tokens</Heading>
              <Text>
                Invoke smart contract method to transfer a token from one wallet
                to another
              </Text>
              <Input
                id="receiverAddress"
                placeholder="Receiver Address"
                onChange={setReceiverAddress}
              />
              <Button
                onClick={sendTokens}
                disabled={destinationAddress === null}
              >
                Send Tokens
              </Button>
            </VStack>
            {receipt && (
              <>
                <Spacer />
                <VStack align="left">
                  <Heading size="sm">Latest Receipt</Heading>
                  <Text>
                    <small>Block Number: {receipt.blockNumber}</small>
                  </Text>
                  <Text>
                    <small>
                      Transaction Hash:{' '}
                      <Link
                        href={`https://testnet.bscscan.com/tx/${receipt.transactionHash}`}
                        isExternal
                      >
                        {receipt.transactionHash} <ExternalLinkIcon mx="2px" />
                      </Link>
                    </small>
                  </Text>
                </VStack>
              </>
            )}
          </VStack>
        )}

        {!props.enabled && (
          <Heading size="sm">Retro Contract is disabled</Heading>
        )}

        {isLoading && (
          <>
            <Container>
              <Heading size="sm">Loading...</Heading>
              <Spinner />
            </Container>
          </>
        )}
      </Box>
    </>
  );
};

export default RetroContract;

// NOTE: https://blog.logrocket.com/building-dapp-ethers-js/#getting-started-ethers-js
// NOTE: https://lzomedia.com/blog/tutorial-build-dapp-with-hardhat-react-and-ethers-js/
