import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import colors from "../config/colors";

//Complete screen linked to order history
  export default function CompleteScreen() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Completed</Text>
      </View>
    );
  }

