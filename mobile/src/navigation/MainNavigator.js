import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useColorScheme } from "nativewind";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import HomeScreen from "../screens/main/HomeScreen";
import BrowseScreen from "../screens/main/BrowseScreen";
import ReportScreen from "../screens/main/ReportScreen";
import MatchesScreen from "../screens/main/MatchesScreen";
import MenuScreen from "../screens/main/MenuScreen";
import ItemDetailsScreen from "../screens/main/ItemDetailsScreen";
import ProfileScreen from "../screens/main/ProfileScreen";
import MyReportsScreen from './../screens/main/MyReportsScreen';
import ChangePasswordScreen from './../screens/main/ChangePasswordScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const icons = {
  Home: "home-outline",
  Browse: "search-outline",
  Report: "add-circle-outline",
  Matches: "sparkles-outline",
  Menu: "menu-outline",
};

function MainTabs() {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const bottomPadding = Math.max(insets.bottom, 12);
  const topPadding = Math.max(insets.top, 24) + 12;

  const activeColor = isDark ? "#60a5fa" : "#2563eb";
  const inactiveColor = "#94a3b8";

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarHideOnKeyboard: true,

        sceneStyle: {
          backgroundColor: isDark ? "#09090b" : "#f8fafc",
          paddingHorizontal: 20,
          paddingTop: topPadding,
        },

        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,

        tabBarIcon: ({ focused }) => (
          <Ionicons
            name={icons[route.name]}
            size={focused ? 28 : 24}
            color={focused ? activeColor : inactiveColor}
          />
        ),

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "700",
        },

        tabBarStyle: {
          height: 60 + bottomPadding,
          paddingBottom: bottomPadding,
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: isDark ? "#3f3f46" : "#e2e8f0",
          backgroundColor: isDark ? "#18181b" : "#ffffff",
          elevation: 0,
          shadowOpacity: 0,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Browse" component={BrowseScreen} />
      <Tab.Screen name="Report" component={ReportScreen} />
      <Tab.Screen name="Matches" component={MatchesScreen} />
      <Tab.Screen name="Menu" component={MenuScreen} />
    </Tab.Navigator>
  );
}

export default function MainNavigator() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: isDark ? "#09090b" : "#f8fafc",
        },
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabs} />

      <Stack.Screen
        name="ItemDetails"
        component={ItemDetailsScreen}
      />

      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
      />

      <Stack.Screen
      name="MyReports"
      component={MyReportsScreen}/>

      <Stack.Screen 
      name="ChangePassword"
      component={ChangePasswordScreen}/>
    </Stack.Navigator>
  );
}
