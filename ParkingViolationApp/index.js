// ./ index.js
import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import AppContainer from './src/AppContainer';  // Import AppContainer
import { name as appName } from './app.json';


AppRegistry.registerComponent(appName, () => AppContainer);
