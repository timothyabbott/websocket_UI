import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Input,
  VStack,
  Text,
  HStack,
  Heading,
} from '@chakra-ui/react';

const App = () => {
  const [socket, setSocket] = useState(null);
  const [topic, setTopic] = useState('');
  const [messageLog, setMessageLog] = useState([]);
  const [customMessage, setCustomMessage] = useState('');

  useEffect(() => {
    // Connect to WebSocket server when the app loads
    const websocket = new WebSocket('ws://localhost:8000/ws');
    setSocket(websocket);

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessageLog((prev) => [...prev, data]);
    };

    websocket.onclose = () => {
      console.log('Disconnected from WebSocket server.');
    };

    return () => {
      websocket.close();
    };
  }, []);

  const subscribe = () => {
    socket.send(JSON.stringify({ action: 'subscribe', topic }));
  };

  const unsubscribe = () => {
    socket.send(JSON.stringify({ action: 'unsubscribe', topic }));
  };

  const sendMessageToTopic = () => {
    socket.send(
      JSON.stringify({
        action: 'publish',
        topic,
        message: customMessage,
      })
    );
    setCustomMessage('');
  };

  return (
    <Box p={5}>
      <VStack spacing={4}>
        <Heading as="h1" size="lg">
          WebSocket UI
        </Heading>
        <HStack>
          <Input
            variant="outline"
            placeholder="Topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <Button onClick={subscribe} >
            Subscribe
          </Button>
          <Button onClick={unsubscribe} colorScheme="red">
            Unsubscribe
          </Button>
        </HStack>
        <HStack>
          <Input
            variant="outline"
            placeholder="Send a message to the topic"
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
          />
          <Button onClick={sendMessageToTopic} colorScheme="green">
            Submit
          </Button>
        </HStack>
        <Box w="full" p={4} bg="gray.100" rounded="md">
          <Heading as="h2" size="md" mb={4}>
            Message Log
          </Heading>
          <VStack align="start" spacing={2} maxH="300px" overflowY="scroll">
            {messageLog.map((msg, index) => (
              <Text key={index}>
                <strong>Topic:</strong> {msg.topic} |{' '}
                <strong>Message:</strong> {msg.message}
              </Text>
            ))}
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default App;