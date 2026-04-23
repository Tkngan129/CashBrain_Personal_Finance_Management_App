import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useFinance } from '../context/FinanceContext';
import AIChatScreen from '../screens/AIChatScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const label = options.tabBarLabel ?? route.name;

        // Skip rendering the "Add" tab - it will be replaced by floating button
        if (route.name === 'Add') return null;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            onPress={onPress}
            style={styles.tabItem}
          >
            <Ionicons
              name={
                route.name === 'Home'
                  ? 'home-outline'
                  : route.name === 'Analytics'
                  ? 'bar-chart-outline'
                  : route.name === 'AI Chat'
                  ? 'chatbubble-outline'
                  : 'person-outline'
              }
              size={24}
              color={isFocused ? '#1C4D8D' : '#94A3B8'}
            />
            <Text style={[styles.tabLabel, { color: isFocused ? '#1C4D8D' : '#94A3B8' }]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: 'none' }, // hidden because we use custom
        }}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Analytics" component={AnalyticsScreen} />
        <Tab.Screen
          name="Add"
          component={() => null} // dummy screen - never rendered
          options={{
            tabBarButton: () => <FloatingAddButton />,
          }}
        />
        <Tab.Screen name="AI Chat" component={AIChatScreen} />
        <Tab.Screen name="Me" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const FloatingAddButton = () => {
  const { openAddModal } = useFinance();

  return (
    <TouchableOpacity style={styles.floatingButton} onPress={openAddModal}>
      <Text style={styles.floatingText}>+</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.92)',
    height: 70,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#1C4D8D',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 4,
    fontWeight: '500',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#1C4D8D',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1C4D8D',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
    zIndex: 10,
  },
  floatingText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '300',
    lineHeight: 38,
  },
});

export default AppNavigator;