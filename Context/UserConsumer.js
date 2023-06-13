import React from 'react';
import { Text, View } from 'react-native';
import { UserConsumer } from './UserContext';

export default function SomeComponent() {
  return (
    <UserConsumer>
      {user => (
        <View>
          <Text>Bonjour, {user ? user.name : 'Invité'}!</Text>
        </View>
      )}
    </UserConsumer>
  );
}
