import { useCallback, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
  AppState,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getMessages, sendMessage } from "../../services/messages";
import { useFocusEffect } from "@react-navigation/native";
import { ChatScreenProps } from "../../navigation/types";

interface FormattedMessage {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
}

const POLL_INTERVAL_MS = 4000;

const QUICK_REPLIES = [
  "Hello! 👋",
  "Where can we meet? 📍",
  "I am at the university reception. 🏫",
  "I have the item with me. ✔️",
  "Thank you! 🙌",
];

export default function ChatScreen({ route, navigation }: ChatScreenProps) {
  const insets = useSafeAreaInsets();
  const { matchId, otherStudentName, receiverId } = route.params;
  const [messages, setMessages] = useState<FormattedMessage[]>([]);
  const [inputText, setInputText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSending, setIsSending] = useState<boolean>(false);
  const flatListRef = useRef<FlatList<FormattedMessage>>(null);
  const isFetchingRef = useRef(false);

  // New messages are polled from the API while this screen is focused. The API checks that the
  // student belongs to the match. (Supabase Realtime was removed: it streamed every student's
  // messages to any client holding the public anon key.)
  useFocusEffect(
    useCallback(() => {
      fetchMessages();
      const timer = setInterval(fetchMessages, POLL_INTERVAL_MS);
      const appState = AppState.addEventListener("change", (state) => {
        if (state === "active") fetchMessages();
      });
      return () => {
        clearInterval(timer);
        appState.remove();
      };
    }, [matchId]),
  );

  async function fetchMessages() {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    try {
      const response = await getMessages(matchId);
      // Reverse array so the latest messages appear at the bottom
      setMessages(response.reverse());
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      isFetchingRef.current = false;
      setIsLoading(false);
    }
  }

  async function handleSend() {
    if (!inputText.trim()) return;

    const messageText = inputText.trim();
    setInputText("");
    setIsSending(true);

    try {
      const response = await sendMessage(matchId, {
        content: messageText,
        receiverId: receiverId,
      });

      // Prevent duplicates if a poll already added it, and normalize property casing
      setMessages((prev) => {
        const res = response as any;
        const responseId = res.id || res.Id || res.ID;
        if (prev.some((m) => m.id === responseId)) {
          return prev;
        }

        const formatted: FormattedMessage = {
          id: responseId,
          senderId: res.senderId || res.SenderId || res.senderid,
          content: res.content || res.Content,
          createdAt: res.createdAt || res.CreatedAt || res.createdat,
        };
        return [formatted, ...prev];
      });
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  }

  async function handleSendQuickReply(text: string) {
    setIsSending(true);
    try {
      const response = await sendMessage(matchId, {
        content: text,
        receiverId: receiverId,
      });

      setMessages((prev) => {
        const res = response as any;
        const responseId = res.id || res.Id || res.ID;
        if (prev.some((m) => m.id === responseId)) {
          return prev;
        }

        const formatted: FormattedMessage = {
          id: responseId,
          senderId: res.senderId || res.SenderId || res.senderid,
          content: res.content || res.Content,
          createdAt: res.createdAt || res.CreatedAt || res.createdat,
        };
        return [formatted, ...prev];
      });
    } catch (error) {
      console.error("Failed to send quick reply:", error);
    } finally {
      setIsSending(false);
    }
  }

  function renderMessage({ item }: { item: FormattedMessage }) {
    const isMine = item.senderId !== receiverId;

    return (
      <View
        className={`mb-3 flex-row ${isMine ? "justify-end" : "justify-start"}`}
      >
        <View
          className={`max-w-[80%] rounded-2xl px-4 py-3 ${
            isMine
              ? "bg-blue-600 rounded-tr-sm dark:bg-blue-500"
              : "bg-white border border-slate-200 shadow-sm shadow-slate-300/60 rounded-tl-sm dark:bg-zinc-800 dark:border-zinc-800 dark:shadow-none"
          }`}
        >
          <Text
            className={`text-base ${isMine ? "text-white" : "text-gray-900 dark:text-white"}`}
          >
            {item.content}
          </Text>
          <Text
            className={`mt-1 text-[10px] ${isMine ? "text-blue-100" : "text-slate-500"}`}
          >
            {new Date(item.createdAt || new Date()).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-slate-50 dark:bg-zinc-950"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      {/* Header */}
      <View
        className="flex-row items-center border-b border-slate-200 bg-white px-5 pb-4 dark:border-zinc-800 dark:bg-zinc-900"
        style={{ paddingTop: Math.max(insets.top, 20) + 10 }}
      >
        <Pressable onPress={() => navigation.goBack()} className="mr-4">
          <Ionicons name="arrow-back" size={24} color="#64748b" />
        </Pressable>
        <Text className="text-lg font-bold text-gray-900 dark:text-white">
          {otherStudentName || "Chat"}
        </Text>
      </View>
      {/* Message List */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          inverted
          data={messages}
          keyExtractor={(item, index) =>
            item.id?.toString() || index.toString()
          }
          renderItem={renderMessage}
          contentContainerStyle={{ flexGrow: 1, padding: 20, paddingTop: 10 }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View
              className="flex-1 items-center justify-center"
            >
              <Ionicons name="chatbubble-ellipses-outline" size={44} color="#94a3b8" />
              <Text className="mt-3 text-center text-slate-400 dark:text-zinc-500 text-base font-medium">
                No messages yet. Say hi!
              </Text>
            </View>
          }
        />
      )}
      {/* Quick Replies Row */}
      <View className="bg-slate-50 dark:bg-zinc-950 px-4 py-2 border-t border-slate-100 dark:border-zinc-800">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, paddingRight: 16 }}
        >
          {QUICK_REPLIES.map((reply, idx) => (
            <Pressable
              key={idx}
              onPress={() => handleSendQuickReply(reply)}
              className="rounded-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 px-4 py-2 shadow-xs active:opacity-75"
            >
              <Text className="text-xs font-bold text-blue-600 dark:text-blue-400">
                {reply}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Input Area */}
      <View
        className="flex-row items-center border-t border-slate-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900"
        style={{ paddingBottom: Math.max(insets.bottom, 12) }}
      >
        <TextInput
          className="mr-3 flex-1 rounded-full bg-slate-100 px-4 py-3 text-base text-gray-900 dark:bg-zinc-800 dark:text-white"
          placeholder="Type a message..."
          placeholderTextColor="#94a3b8"
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={500}
        />
        <Pressable
          onPress={handleSend}
          disabled={!inputText.trim() || isSending}
          className={`h-12 w-12 items-center justify-center rounded-full ${
            inputText.trim()
              ? "bg-blue-600 dark:bg-blue-500"
              : "bg-slate-300 dark:bg-zinc-700"
          }`}
        >
          {isSending ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Ionicons
              name="send"
              size={20}
              color={inputText.trim() ? "white" : "#94a3b8"}
              style={{ marginLeft: 3 }}
            />
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
