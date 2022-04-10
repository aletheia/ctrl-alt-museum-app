import {Box, Heading, Menu, Text} from '@chakra-ui/react';
import {FC} from 'react';

const AppMenu: FC = () => {
  return (
    <Box border="1px" borderColor="gray" p={4} borderRadius="lg" margin="4px">
      <Menu>
        <Heading>This is my great dApp</Heading>
      </Menu>
    </Box>
  );
};

export default AppMenu;
