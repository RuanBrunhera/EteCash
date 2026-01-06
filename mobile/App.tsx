import './gesture-handler'
import { StyleSheet } from 'react-native';
import Routes from './src/routes/index.routes';
import { NavigationContainer } from '@react-navigation/native';
import Login from './src/screens/login';

export default function App() {
  return (
    <NavigationContainer>
      {/* <Login/> */}
      <Routes />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  
});
