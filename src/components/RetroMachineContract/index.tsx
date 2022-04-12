import {
  Box,
  Button,
  Container,
  FormLabel,
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
import contract from '../../config/abi/RetroMachine.json';
import AddTokenToWallet, {TokenType} from '../AddTokenToWallet';
import {ethers} from 'ethers';

export interface ContractProps {
  enabled: boolean;
}

const RetroMachineContract: FC<ContractProps> = props => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [contractInstance, setContractInstance] = useState<
    ethers.Contract | undefined
  >();
  const [currentAccount, setCurrentaccount] = useState<string | undefined>(
    null
  );
  const [machineName, setMachineName] = useState<string | undefined>(null);
  const [machineImage, setMachineImage] = useState<string | undefined>(null);

  const [receipt, setReceipt] = useState<
    ethers.providers.TransactionReceipt | undefined
  >(undefined);

  const contractAddress = addresses.retroMachine;

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
        const tx = await instance.mint(
          currentAccount,
          machineName,
          machineImage
        );
        const receipt = await tx.wait();
        setReceipt(receipt);
      } catch (e) {
        console.log('cannot mint tokens', e);
      }
    } else {
      console.log('no contract instance');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (props.enabled) {
      istantiateContract();
    }
  }, [props.enabled]);

  const updateMachineName = (e: any) => {
    setMachineName(e.target.value.trim());
  };

  const updateMachineImage = (e: any) => {
    setMachineImage(e.target.value.trim());
  };

  return (
    <>
      <Box border="1px solid gray" borderRadius="lg" p={4} m="4">
        {props.enabled && !isLoading && (
          <VStack spacing={4}>
            <Menu>
              <Heading size="lg">RetroMachine NFT </Heading>
              <AddTokenToWallet
                tokenType={TokenType.ERC721}
                tokenAddress={contractAddress}
                tokenDecimals={0}
                tokenImage="http://placekitten.com/250/350"
                tokenSymbol="RMT"
              />
              <Text>{contractAddress}</Text>
            </Menu>
            <Spacer />
            <VStack align="left">
              <Heading size="sm">Mint Tokens</Heading>
              <Text>
                Invoke smart contract method to mint a NFT token to your wallet.
                It should take a few seconds to be processed by BSC testnet
              </Text>
              <VStack align="left">
                <FormLabel htmlFor="machineName">Machine Name:</FormLabel>
                <Input
                  id="machineName"
                  placeholder="Machine name"
                  onChange={updateMachineName}
                />
                <FormLabel htmlFor="machineImage">Machine Image:</FormLabel>
                <Input
                  id="machineImage"
                  placeholder="Machine image"
                  onChange={updateMachineImage}
                />
              </VStack>
              <Button
                disabled={machineImage === null || machineName === null}
                onClick={mintTokens}
              >
                Mint Tokens
              </Button>
            </VStack>
            <Spacer />
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
          <Heading size="sm">RetroMachine NFT is disabled</Heading>
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

export default RetroMachineContract;

// NOTE: https://blog.logrocket.com/building-dapp-ethers-js/#getting-started-ethers-js
// NOTE: https://lzomedia.com/blog/tutorial-build-dapp-with-hardhat-react-and-ethers-js/
// https://lzomedia.com/blog/tutorial-build-dapp-with-hardhat-react-and-ethers-js/
