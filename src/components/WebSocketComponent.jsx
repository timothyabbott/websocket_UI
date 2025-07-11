import React, { useState } from 'react';
import {
  Box,
  Button,
  Input,
  VStack,
  Text,
  HStack,
  Heading,
} from '@chakra-ui/react';
import { Divider } from '@chakra-ui/layout';

const ConnectionStatus = ({ socket, onConnect, onDisconnect }) => (
  <Box
    w="full"
    p={4}
    bg={socket ? "green.50" : "gray.50"}
    rounded="md"
    borderWidth={1}
    borderColor={socket ? "green.200" : "gray.200"}
  >
    <HStack spacing={4} justify="space-between">
      <Text fontWeight="medium">
        Status: {socket ? "Connected" : "Disconnected"}
      </Text>
      <HStack spacing={4}>
        <Button
          onClick={onConnect}
          colorScheme="green"
          isDisabled={socket !== null}
          size="md"
          w="150px"
        >
          Connect
        </Button>
        <Button
          onClick={onDisconnect}
          colorScheme="red"
          isDisabled={socket === null}
          size="md"
          w="150px"
        >
          Disconnect
        </Button>
      </HStack>
    </HStack>
  </Box>
);

const TopicSubscription = ({ socket }) => {
  const [topic, setTopic] = useState('');

  const subscribe = () => {
    if (socket) {
      socket.send(JSON.stringify({ action: 'subscribe', topic }));
    }
  };

  const unsubscribe = () => {
    if (socket) {
      socket.send(JSON.stringify({ action: 'unsubscribe', topic }));
    }
  };

  return (

      <HStack spacing={4}>
        <Input
          variant="outline"
          placeholder="Enter topic name"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          isDisabled={!socket}
        />
        <HStack spacing={4}>
          <Button
            onClick={subscribe}
            colorScheme="blue"
            isDisabled={!socket}
            w="150px"
          >
            Subscribe
          </Button>
          <Button
            onClick={unsubscribe}
            colorScheme="red"
            variant="outline"
            isDisabled={!socket}
            w="150px"
          >
            Unsubscribe
          </Button>
        </HStack>
      </HStack>

  );
};

const MessageInput = ({ socket }) => {
  const [customMessage, setCustomMessage] = useState('');
  // const [selectedTopic, setSelectedTopic] = useState('');

  const sendMessageToTopic = () => {
    if (socket && customMessage) {
      socket.send(
        JSON.stringify({
          action: 'publish',
          message: customMessage,
        })
      );
      setCustomMessage('');
    }
  };

  return (
    <VStack spacing={4} w="full">
      <HStack spacing={4} w="full">
        <Input
          variant="outline"
          placeholder="Type your message here"
          value={customMessage}
          onChange={(e) => setCustomMessage(e.target.value)}
          isDisabled={!socket}
        />
        <Button
          onClick={sendMessageToTopic}
          colorScheme="green"
          isDisabled={!socket || !customMessage}
          w="150px"
        >
          Send Message
        </Button>
      </HStack>
    </VStack>
  );
};

const MessageLog = ({ messages }) => (
  <Box w="full" p={4} bg="gray.50" rounded="md" borderWidth={1} borderColor="gray.200">
    <Heading as="h2" size="md" mb={4}>
      Message Log
    </Heading>
    <VStack
      align="start"
      spacing={2}
      maxH="300px"
      overflowY="auto"
      px={2}
    >
      {messages.map((msg, index) => (
        <Text key={index}>
          <strong>Topic:</strong> {msg.topic} |{' '}
          <strong>Message:</strong> {msg.message}
        </Text>
      ))}
    </VStack>
  </Box>
);


const WebSocketComponent = () => {
  const [socket, setSocket] = useState(null);
  const [messageLog, setMessageLog] = useState([]);


  const connect = () => {
    const websocket = new WebSocket('ws://localhost:8000/ws');
    setSocket(websocket);

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // Display all messages received from the server
      setMessageLog((prev) => [...prev, data]);
    };

    websocket.onclose = () => {
      console.log('Disconnected from WebSocket server.');
      setSocket(null);
    };
  };

  const disconnect = () => {
    if (socket) {
      socket.close();
      setSocket(null);
    }
  };

  return (
    <Box p={5} maxW="800px" mx="auto">
      <Box p={6} bg="white" rounded="lg" borderWidth={1} borderColor="gray.200" shadow="md">
        <VStack spacing={4}>
          <ConnectionStatus
            socket={socket}
            onConnect={connect}
            onDisconnect={disconnect}
          />
          <Divider />
          <TopicSubscription socket={socket} />
          <Divider />
          <MessageInput socket={socket} />
          <Divider />
          <MessageLog messages={messageLog} />
        </VStack>
      </Box>
    </Box>
  );
};


export default WebSocketComponent;