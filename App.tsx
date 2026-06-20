import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import PostDetailsScreen from './screens/PostDetailsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Feed' }}
        />
        <Stack.Screen
          name="PostDetails"
          component={PostDetailsScreen}
          options={{ title: 'Post' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}