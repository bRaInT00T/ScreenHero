import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import RewardsScreen from './screens/RewardsScreen';
import SettingsScreen from './screens/SettingsScreen';
import EditTasksScreen from './screens/EditTasksScreen';
import PointConversionScreen from './screens/PointConversionScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Rewards" component={RewardsScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Edit Tasks" component={EditTasksScreen} />
        <Stack.Screen name="Point Conversion" component={PointConversionScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
