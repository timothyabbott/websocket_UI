import {
  Box,Grid
} from '@chakra-ui/react';

import WebSocketComponent from "./components/WebSocketComponent.jsx";

const App = () => {


  return (
<Box p={4}  >
      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
        <WebSocketComponent/>
        <WebSocketComponent/>
        <WebSocketComponent/>
        <WebSocketComponent/>
      </Grid>
    </Box>

  );
};

export default App;