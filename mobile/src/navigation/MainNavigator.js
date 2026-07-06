import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useColorScheme } from "nativewind";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import HomeScreen from "../screens/main/HomeScreen";
import BrowseScreen from "../screens/main/BrowseScreen";
import ReportScreen from "../screens/main/ReportScreen";
import MatchesScreen from "../screens/main/MatchesScreen";
import MenuScreen from "../screens/main/MenuScreen";
import ItemDetailsScreen from "../screens/main/ItemDetailsScreen";
import ProfileScreen from "../screens/main/ProfileScreen";
import MyReportsScreen from "./../screens/main/MyReportsScreen";
import ChangePasswordScreen from "./../screens/main/ChangePasswordScreen";
import MatchDetailsScreen from "../screens/main/MatchDetailsScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const icons = {
  Home: "home-outline",
  Browse: "search-outline",
  Report: "add-circle-outline",
  Matches: "sparkles-outline",
  Menu: "menu-outline",
};

function AppTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const bottomPadding = Math.max(insets.bottom, 12);
  const activeColor = isDark ? "#60a5fa" : "#2563eb";
  const inactiveColor = "#94a3b8";

  return (
    <View
      className="flex-row border-t dark:border-zinc-700 dark:bg-zinc-900"
      style={{
        backgroundColor: isDark ? "#18181b" : "#ffffff",
        borderTopColor: isDark ? "#3f3f46" : "#e2e8f0",
        height: 60 + bottomPadding,
        paddingBottom: bottomPadding,
        paddingTop: 8,
      }}
    >
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const options = descriptors[route.key].options;
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;
        const color = isFocused ? activeColor : inactiveColor;

        function handlePress() {
          const event = navigation.emit({
            canPreventDefault: true,
            target: route.key,
            type: "tabPress",
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        }

        function handleLongPress() {
          navigation.emit({
            target: route.key,
            type: "tabLongPress",
          });
        }

        return (
          <Pressable
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : undefined}
            className="flex-1 items-center justify-center"
            key={route.key}
            onLongPress={handleLongPress}
            onPress={handlePress}
          >
            <Ionicons
              name={icons[route.name]}
              size={isFocused ? 28 : 24}
              color={color}
            />

            <Text className="mt-1 text-xs font-bold" style={{ color }}>
              {typeof label === "string" ? label : route.name}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function MainTabs() {
  const [reportScreenKey, setReportScreenKey] = useState(0);
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const bottomPadding = Math.max(insets.bottom, 12);
  const topPadding = Math.max(insets.top, 24) + 12;

  const activeColor = isDark ? "#60a5fa" : "#2563eb";
  const inactiveColor = "#94a3b8";

  return (
    <Tab.Navigator
      tabBar={(props) => <AppTabBar {...props} />}
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
      <Tab.Screen
        name="Report"
        listeners={{
          blur: () => setReportScreenKey((key) => key + 1),
        }}
      >
        {() => <ReportScreen key={reportScreenKey} />}
      </Tab.Screen>
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

      <Stack.Screen name="ItemDetails" component={ItemDetailsScreen} />

      <Stack.Screen name="MatchDetails" component={MatchDetailsScreen} />

      <Stack.Screen name="Profile" component={ProfileScreen} />

      <Stack.Screen name="MyReports" component={MyReportsScreen} />

      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
    </Stack.Navigator>
  );
}
