import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/context/AuthContext';
import usePushNotifications from './src/hooks/usePushNotifications';
import AppNavigator from './src/navigation/AppNavigator.jsx';

function AppContent() {
  usePushNotifications();

  return (
    <>
      <StatusBar style="light" />
      <AppNavigator />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
