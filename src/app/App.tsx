import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Dimensions,
    Pressable,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { AddExpenseScreen } from './components/AddExpenseScreen';
import { AIChatScreen } from './components/AIChatScreen';
import { AnalyticsScreen } from './components/AnalyticsScreen';
import { CameraScreen } from './components/CameraScreen';
import { DashboardScreen } from './components/DashboardScreen';
import { ProfileScreen } from './components/ProfileScreen';

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  contentWrapper: {
    flex: 1,
    overflow: 'hidden',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1C4D8D',
    textAlign: 'center',
    marginBottom: 12,
  },
  screenSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 8,
    paddingBottom: 12,
    paddingHorizontal: 8,
    elevation: 10,
    shadowColor: '#1C4D8D',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: -4 },
    shadowRadius: 20,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingVertical: 4,
  },
  navIconContainer: {
    width: 44,
    height: 36,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  navIconContainerActive: {
    backgroundColor: 'rgba(28,77,141,0.1)',
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 2,
  },
  floatingButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 12,
    shadowColor: '#1C4D8D',
    shadowOpacity: 0.45,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 28,
    marginBottom: 8,
  },
  floatingButtonBase: {
    backgroundColor: 'rgb(28,77,141)',
  },
  floatingButtonActive: {
    backgroundColor: 'rgb(245,158,11)',
  },
  cameraLabelContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: -24,
  },
  cameraLabel: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 4,
  },
});

type ScreenId = 'home' | 'analytics' | 'add' | 'chat' | 'profile' | 'camera';

interface NavItem {
  id: ScreenId;
  label: string;
  icon: string;
}

const LEFT_NAV: NavItem[] = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'analytics', label: 'Analytics', icon: 'pie-chart' },
];

const RIGHT_NAV: NavItem[] = [
  { id: 'chat', label: 'AI Chat', icon: 'chatbubble' },
  { id: 'profile', label: 'Me', icon: 'person-circle' },
];

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ScreenId>('home');

  const getScreenContent = () => {
    const handleNavigate = (screenId: string) => setActiveScreen(screenId as ScreenId);
    switch (activeScreen) {
      case 'home':
        return <DashboardScreen onNavigate={handleNavigate} onAddTransaction={(type) => setActiveScreen('add')} />;
      case 'analytics':
        return <AnalyticsScreen />;
      case 'add':
        return <AddExpenseScreen onClose={() => setActiveScreen('home')} />;
      case 'chat':
        return <AIChatScreen />;
      case 'profile':
        return <ProfileScreen />;
      case 'camera':
        return <CameraScreen />;
      default:
        return <DashboardScreen onNavigate={handleNavigate} onAddTransaction={(type) => setActiveScreen('add')} />;
    }
  };

  const renderNavItem = (item: NavItem) => {
    const isActive = activeScreen === item.id;
    return (
      <Pressable
        key={item.id}
        onPress={() => setActiveScreen(item.id)}
        style={styles.navItem}
      >
        <View
          style={[
            styles.navIconContainer,
            isActive && styles.navIconContainerActive,
          ]}
        >
          <Ionicons
            name={item.icon as any}
            size={20}
            color={isActive ? '#1C4D8D' : '#94a3b8'}
          />
        </View>
        <Text style={[styles.navLabel, { color: isActive ? '#1C4D8D' : '#94a3b8' }]}>
          {item.label}
        </Text>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

      <View style={styles.safeArea}>
        <View style={styles.contentWrapper}>
        {getScreenContent()}
      </View>

        {/* Bottom Navigation */}
        <View style={styles.navBar}>
          {/* Left navigation items */}
          {LEFT_NAV.map(renderNavItem)}

          {/* Center floating camera button */}
          <View style={styles.cameraLabelContainer}>
            <Pressable
              onPress={() => setActiveScreen('camera')}
              style={[
                styles.floatingButton,
                activeScreen === 'camera'
                  ? styles.floatingButtonActive
                  : styles.floatingButtonBase,
              ]}
            >
              <Ionicons
                name="camera"
                size={24}
                color="#ffffff"
              />
            </Pressable>
            <Text
              style={[
                styles.cameraLabel,
                { color: activeScreen === 'camera' ? '#1C4D8D' : '#94a3b8' },
              ]}
            >
              Scan
            </Text>
          </View>

          {/* Right navigation items */}
          {RIGHT_NAV.map(renderNavItem)}
        </View>
      </View>
    </SafeAreaView>
  );
}
