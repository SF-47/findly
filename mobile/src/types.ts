import { Ionicons } from "@expo/vector-icons";

export interface University {
  id: string;
  shortName: string;
  fullName: string;
  branch: string;
  createdAt: string;
}

export interface Admin {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  passwordHash: string;
  role: string;
  universityId: string | null;
  university: University | null;
  createdAt: string;
}

export interface Category {
  id: number;
  name: string;
  description: string | null;
}

export interface Student {
  id: string;
  fullName: string;
  email: string;
  passwordHash: string;
  universityId: string;
  universityStudentId: string;
  phoneNumber: string;
  universityCardImageUrl: string;
  isVerified: boolean;
  expoPushToken: string | null;
  createdAt: string;
  university: University | null;
  universityShortName?: string;
  universityFullName?: string;
  universityBranch?: string;
}

export interface FoundItem {
  id: string;
  studentId: string;
  categoryId: number;
  itemName: string;
  description: string;
  color: string;
  location: string;
  foundDate: string;
  imageUrl: string;
  status: string;
  createdAt: string;
  student: Student;
  category: Category;
  studentName?: string;
  categoryName?: string;
  date?: string;
}

export interface LostItem {
  id: string;
  studentId: string;
  categoryId: number;
  itemName: string;
  description: string;
  color: string;
  location: string;
  lostDate: string;
  imageUrl: string;
  status: string;
  createdAt: string;
  student: Student;
  category: Category;
  studentName?: string;
  categoryName?: string;
  date?: string;
}

export interface ItemsMatch {
  id: string;
  lostItemId: string;
  lostItem: LostItem;
  foundItemId: string;
  foundItem: FoundItem;
  matchPercentage: number;
  confidenceLevel: string;
  reasoningSummary: string;
  status: string;
  createdAt: string;
  reviewedAt: string | null;
  reviewedByAdminId: string | null;
  reviewedByAdmin: Admin | null;
}

export interface Message {
  id: string;
  matchId: string;
  match: ItemsMatch;
  senderId: string;
  sender: Student;
  receiverId: string;
  receiver: Student;
  content: string;
  createdAt: string;
}

export interface CardItem {
  id: string;
  studentId: string;
  categoryId: number;
  itemName: string;
  description: string;
  color: string;
  location: string;
  lostDate?: string;
  foundDate?: string;
  imageUrl?: string;
  status: string;
  createdAt: string;
  student?: Student;
  category?: Category;
  itemType: "Lost" | "Found";
  categoryName?: string;
  studentName?: string;

  // Mapped properties for ItemCard
  title: string;
  icon?: keyof typeof Ionicons.glyphMap;
  type: string;
  badgeColor: string;
  meta: string;
}

export type MainStackParamList = {
  MainTabs: undefined;
  Home: undefined;
  Browse: undefined;
  Report: {
    prefillType?: "lost" | "found";
    prefillItemName?: string;
    prefillCategoryId?: string;
    prefillCategoryName?: string;
  } | undefined;
  Matches: undefined;
  Menu: undefined;
  ItemDetails: { item: CardItem; isMyReport?: boolean };
  MatchDetails: { match: ItemsMatch };
  Profile: undefined;
  MyReports: undefined;
  EditReport: { editItem: CardItem };
  ChangePassword: undefined;
  Chats: undefined;
  Chat: { chatId: string; matchId: string; otherUserName?: string };
  Notifications: undefined;
};
