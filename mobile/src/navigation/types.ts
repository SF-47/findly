import { NavigatorScreenParams, CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { FoundItem, LostItem, ItemsMatch, CardItem } from "../types";

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  PendingVerification: undefined;
  Main: NavigatorScreenParams<MainStackParamList>;
};

export type MainTabParamList = {
  Home: undefined;
  Browse: { initialFilter?: "All" | "Lost" | "Found" } | undefined;
  Report: {
    prefillType?: "lost" | "found";
    prefillItemName?: string;
    prefillCategoryId?: string | number;
    prefillCategoryName?: string;
  } | undefined;
  Matches: undefined;
  Menu: undefined;
};

export type MainStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  ItemDetails: { item: CardItem; isMyReport?: boolean };
  MatchDetails: { match: ItemsMatch; currentStudentName: string };
  Profile: undefined;
  MyReports: undefined;
  EditReport: { editItem: CardItem };
  ChangePassword: undefined;
  Chats: undefined;
  Chat: { matchId: string; otherStudentName: string; receiverId: string };
  Notifications: undefined;
};

export type LoginScreenProps = NativeStackScreenProps<RootStackParamList, "Login">;
export type RegisterScreenProps = NativeStackScreenProps<RootStackParamList, "Register">;
export type PendingVerificationScreenProps = NativeStackScreenProps<RootStackParamList, "PendingVerification">;

export type HomeScreenProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, "Home">,
  NativeStackScreenProps<MainStackParamList>
>;
export type BrowseScreenProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, "Browse">,
  NativeStackScreenProps<MainStackParamList>
>;
export type ReportScreenProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, "Report">,
  NativeStackScreenProps<MainStackParamList>
>;
export type MatchesScreenProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, "Matches">,
  NativeStackScreenProps<MainStackParamList>
>;
export type MenuScreenProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, "Menu">,
  NativeStackScreenProps<MainStackParamList>
>;

export type ItemDetailsScreenProps = NativeStackScreenProps<MainStackParamList, "ItemDetails">;
export type MatchDetailsScreenProps = NativeStackScreenProps<MainStackParamList, "MatchDetails">;
export type ProfileScreenProps = NativeStackScreenProps<MainStackParamList, "Profile">;
export type MyReportsScreenProps = NativeStackScreenProps<MainStackParamList, "MyReports">;
export type EditReportScreenProps = NativeStackScreenProps<MainStackParamList, "EditReport">;
export type ChangePasswordScreenProps = NativeStackScreenProps<MainStackParamList, "ChangePassword">;
export type ChatsListScreenProps = NativeStackScreenProps<MainStackParamList, "Chats">;
export type ChatScreenProps = NativeStackScreenProps<MainStackParamList, "Chat">;
export type NotificationsScreenProps = NativeStackScreenProps<MainStackParamList, "Notifications">;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
