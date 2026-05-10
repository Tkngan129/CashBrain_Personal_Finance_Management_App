import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useState } from 'react';
import {
    Pressable,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AddExpenseScreen } from './components/AddExpenseScreen';
import { AIChatScreen } from './components/AIChatScreen';
import { AllTransactionsScreen } from './components/AllTransactionsScreen';
import { AnalyticsScreen } from './components/AnalyticsScreen';
import { CameraScreen } from './components/CameraScreen';
import { DashboardScreen } from './components/DashboardScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { LoginScreen } from './components/LoginScreen';
import { ThemeProvider, useColors } from '../context/ThemeContext';

type ScreenId =
	| 'home'
	| 'analytics'
	| 'add'
	| 'transactions'
	| 'chat'
	| 'profile'
	| 'camera';

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
  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  );
}

function AppInner() {
	const colors = useColors();
	const [activeScreen, setActiveScreen] =
		useState<ScreenId>('home');
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [addTransactionType, setAddTransactionType] =
		useState<'expense' | 'income'>('expense');
	const [addTransactionReturnScreen, setAddTransactionReturnScreen] =
		useState<ScreenId>('home');

	const handleNavigate = (screenId: string) => {
		setActiveScreen(screenId as ScreenId);
	};

	const handleAddTransaction = useCallback((
		type: 'expense' | 'income',
		returnScreen: ScreenId = 'home',
	) => {
		setAddTransactionType(type);
		setAddTransactionReturnScreen(returnScreen);
		setActiveScreen('add');
	}, []);

	const getScreenContent = () => {
		switch (activeScreen) {
			case 'home':
				return (
					<DashboardScreen
						onNavigate={handleNavigate}
						onAddTransaction={
							handleAddTransaction
						}
					/>
				);

			case 'analytics':
				return (
					<AnalyticsScreen
						onAddTransaction={(type) => handleAddTransaction(type, 'analytics')}
					/>
				);

			case 'transactions':
				return (
					<AllTransactionsScreen
						onClose={() => setActiveScreen('home')}
					/>
				);

			case 'add':
				return (
					<AddExpenseScreen
						initialType={addTransactionType}
						onClose={() =>
							setActiveScreen(addTransactionReturnScreen)
						}
					/>
				);

			case 'chat':
				return <AIChatScreen />;

			case 'profile':
				return <ProfileScreen onLogout={() => setIsAuthenticated(false)} />;

			case 'camera':
				return <CameraScreen />;

			default:
				return (
					<DashboardScreen
						onNavigate={handleNavigate}
						onAddTransaction={
							handleAddTransaction
						}
					/>
				);
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
						isActive &&
							styles.navIconContainerActive,
					]}
				>
					<Ionicons
						name={item.icon as any}
						size={22}
						color={
							isActive
								? '#1C4D8D'
								: '#94A3B8'
						}
					/>
				</View>

				<Text
					style={[
						styles.navLabel,
						{
							color: isActive
								? '#1C4D8D'
								: '#94A3B8',
						},
					]}
				>
					{item.label}
				</Text>
			</Pressable>
		);
	};

	if (!isAuthenticated) {
		return <LoginScreen onLogin={() => setIsAuthenticated(true)} />;
	}

	return (
		<SafeAreaView
			style={[styles.container, { backgroundColor: colors.navBar }]}
			edges={['top', 'left', 'right']}
		>
			<StatusBar
				barStyle="dark-content"
				backgroundColor={colors.navBar}
			/>

			<View style={[styles.contentWrapper, { backgroundColor: colors.bg }]}>
				{getScreenContent()}
			</View>

			<View style={[styles.navBar, { backgroundColor: colors.navBar, borderTopColor: colors.navBorder }]}>
				{LEFT_NAV.map(renderNavItem)}

				<View style={styles.cameraLabelContainer}>
					<Pressable
						onPress={() =>
							setActiveScreen('camera')
						}
						style={[
							styles.floatingButton,
							activeScreen === 'camera'
								? styles.floatingButtonActive
								: styles.floatingButtonBase,
						]}
					>
						<Ionicons
							name="camera"
							size={26}
							color="#ffffff"
						/>
					</Pressable>

					<Text
						style={[
							styles.cameraLabel,
							{
								color:
									activeScreen ===
									'camera'
										? '#1C4D8D'
										: colors.textMuted,
							},
						]}
					>
						Scan
					</Text>
				</View>

				{RIGHT_NAV.map(renderNavItem)}
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#FFFFFF',
	},

	contentWrapper: {
		flex: 1,
		backgroundColor: '#F8FAFC',
	},

	navBar: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',

		backgroundColor: '#FFFFFF',

		borderTopWidth: 1,
		borderTopColor: '#E2E8F0',

		paddingTop: 10,
		paddingBottom: 18,
		paddingHorizontal: 6,

		minHeight: 82,

		elevation: 12,

		shadowColor: '#000',
		shadowOpacity: 0.08,
		shadowOffset: {
			width: 0,
			height: -2,
		},
		shadowRadius: 10,
	},

	navItem: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 4,
	},

	navIconContainer: {
		width: 44,
		height: 38,
		borderRadius: 14,

		justifyContent: 'center',
		alignItems: 'center',

		marginBottom: 4,
	},

	navIconContainerActive: {
		backgroundColor: 'rgba(28,77,141,0.12)',
	},

	navLabel: {
		fontSize: 11,
		fontWeight: '600',
		marginTop: 2,
	},

	floatingButton: {
		width: 62,
		height: 62,
		borderRadius: 31,

		justifyContent: 'center',
		alignItems: 'center',

		marginBottom: 10,

		elevation: 14,

		shadowColor: '#1C4D8D',
		shadowOpacity: 0.3,
		shadowOffset: {
			width: 0,
			height: 6,
		},
		shadowRadius: 14,
	},

	floatingButtonBase: {
		backgroundColor: '#1C4D8D',
	},

	floatingButtonActive: {
		backgroundColor: '#F59E0B',
	},

	cameraLabelContainer: {
		alignItems: 'center',
		justifyContent: 'center',

		marginTop: -34,
	},

	cameraLabel: {
		fontSize: 11,
		fontWeight: '600',
		marginTop: 4,
	},
});