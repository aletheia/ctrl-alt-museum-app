import {Container} from '@chakra-ui/react';
import React from 'react';
import AppMenu from '../AppMenu';
import MetamaskConnect from '../Metamask';

function App() {
  return (
    <div className="App">
      <Container>
        <AppMenu />

        <MetamaskConnect />
      </Container>
    </div>
  );
}

export default App;
