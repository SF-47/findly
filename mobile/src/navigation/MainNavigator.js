import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useColorScheme } from "nativewind";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import HomeScreen from "../screens/main/HomeScreen";
import BrowseScreen from "../screens/main/BrowseScreen";
import ReportScreen from "../screens/main/ReportScreen";
import MatchesScreen from "../screens/main/MatchesScreen";
import ProfileScreen from "../screens/main/ProfileScreen";
import ComponentsDemoScreen from "../screens/main/ComponentsDemoScreen";
import ItemDetailsScreen from "../screens/main/ItemDetailsScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const icons = {
  Home: "home-outline",
  Browse: "search-outline",
  Report: "add-circle-outline",
  Matches: "sparkles-outline",
  Profile: "person-outline",
  Demo: "layers-outline",
};

function MainTabs() {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const bottomPadding = Math.max(insets.bottom, 12);
  const topPadding = Math.max(insets.top, 24) + 12;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        sceneStyle: {
          backgroundColor: isDark ? "#09090b" : "#f8fafc",
          paddingHorizontal: 20,
          paddingTop: topPadding,
        },
        tabBarActiveTintColor: isDark ? "#60a5fa" : "#2563eb",
        tabBarInactiveTintColor: "#94a3b8",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "700",
        },
        tabBarStyle: {
          height: 60 + bottomPadding,
          paddingBottom: bottomPadding,
          paddingTop: 8,
          borderTopColor: isDark ? "#3f3f46" : "#e2e8f0",
          backgroundColor: isDark ? "#18181b" : "#ffffff",
        },
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={icons[route.name]} color={color} size={size} />
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Browse" component={BrowseScreen} />
      <Tab.Screen name="Report" component={ReportScreen} />
      <Tab.Screen name="Matches" component={MatchesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Demo" component={ComponentsDemoScreen} />
    </Tab.Navigator>
  );
}

export default function MainNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="ItemDetails" component={ItemDetailsScreen} />
    </Stack.Navigator>
  );
}
