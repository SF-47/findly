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
