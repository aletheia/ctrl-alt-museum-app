import {Badge, Box, Heading, Menu, Text} from '@chakra-ui/react';
import {FC} from 'react';

import addresses from '../../config/contractAddresses.json';

const AppMenu: FC = () => {
  return (
    <Box
      border="1px"
      borderColor="gray"
      p={4}
      borderRadius="lg"
      margin="4px"
      width="100%"
    >
      <Menu>
        <Heading>This is my great dApp</Heading>
        <Badge>{addresses.chainName}</Badge>
      </Menu>
    </Box>
  );
};

export default AppMenu;
