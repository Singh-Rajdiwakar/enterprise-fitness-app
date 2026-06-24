import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import AICameraScreen from '../screens/AICameraScreen.jsx';
import CommunityScreen from '../screens/CommunityScreen.jsx';
import DashboardScreen from '../screens/DashboardScreen.jsx';
import DietScreen from '../screens/DietScreen.jsx';
import LoginScreen from '../screens/LoginScreen.jsx';
import ProfileScreen from '../screens/ProfileScreen.jsx';
import RegisterScreen from '../screens/RegisterScreen';
import TrainerScreen from '../screens/TrainerScreen.jsx';
import WorkoutScreen from '../screens/WorkoutScreen.jsx';
import { colors } from '../theme/theme';

const AuthStackNavigator = createStackNavigator();
const AppStackNavigator = createStackNavigator();
const MainTabNavigator = createBottomTabNavigator();

const navigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.background,
    card: colors.background,
    primary: colors.accent,
  },
};

function AuthStack() {
  return (
    <AuthStackNavigator.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: colors.background },
      }}
    >
      <AuthStackNavigator.Screen name="Login" component={LoginScreen} />
      <AuthStackNavigator.Screen name="Register" component={RegisterScreen} />
    </AuthStackNavigator.Navigator>
  );
}

function MainTabs() {
  return (
    <MainTabNavigator.Navigator
      initialRouteName="Dashboard"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textDim,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ color, focused }) => (
          <View style={[styles.tabIcon, focused ? styles.activeTabIcon : null]}>
            <Text style={[styles.tabIconText, { color }]}>{getTabIcon(route.name)}</Text>
          </View>
        ),
      })}
    >
      <MainTabNavigator.Screen name="Dashboard" component={DashboardScreen} />
      <MainTabNavigator.Screen name="Workout" component={WorkoutScreen} />
      <MainTabNavigator.Screen name="Diet" component={DietScreen} />
      <MainTabNavigator.Screen name="Community" component={CommunityScreen} />
      <MainTabNavigator.Screen name="Profile" component={ProfileScreen} />
    </MainTabNavigator.Navigator>
  );
}

function AppStack() {
  return (
    <AppStackNavigator.Navigator
      initialRouteName="MainTabs"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: colors.background },
      }}
    >
      <AppStackNavigator.Screen name="MainTabs" component={MainTabs} />
      <AppStackNavigator.Screen name="AICamera" component={AICameraScreen} />
      <AppStackNavigator.Screen name="Trainer" component={TrainerScreen} />
    </AppStackNavigator.Navigator>
  );
}

function getTabIcon(routeName) {
  const icons = {
    Dashboard: 'D',
    Workout: 'W',
    Diet: 'N',
    Community: 'C',
    Profile: 'P',
  };

  return icons[routeName] || routeName[0];
}

export default function AppNavigator() {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      {isAuthenticated ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  tabBar: {
    position: 'absolute',
    left: 14,
    right: 14,
    bottom: 14,
    height: 72,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    borderRadius: 24,
    backgroundColor: 'rgba(2, 6, 23, 0.94)',
    paddingBottom: 10,
    paddingTop: 8,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '800',
  },
  tabIcon: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
  },
  activeTabIcon: {
    backgroundColor: 'rgba(147, 197, 253, 0.16)',
  },
  tabIconText: {
    fontSize: 12,
    fontWeight: '900',
  },
});
