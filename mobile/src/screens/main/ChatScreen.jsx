import { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getMessages, sendMessage } from "../../services/messages";
import { supabase } from "../../api/supabaseClient";

export default function ChatScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const { matchId, otherStudentName, receiverId } = route.params;
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const flatListRef = useRef(null);

  useEffect(() => {
    fetchMessages();

    const channel = supabase
      .channel("messages-channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "Messages",
        },
        (payload) => {
          console.log(
            "Realtime payload received! FULL PAYLOAD:",
            JSON.stringify(payload),
          );
          const newMessage = payload.new;

          // Postgres column casing can be tricky (MatchId vs matchid vs matchId)
          const actualMatchId =
            newMessage.MatchId || newMessage.matchId || newMessage.matchid;

          if (actualMatchId !== matchId) {
            console.log("Message is for a different match. Ignoring.");
            return;
          }

          const formattedMessage = {
            id: newMessage.Id || newMessage.id,
            senderId:
              newMessage.SenderId || newMessage.senderId || newMessage.senderid,
            content: newMessage.Content || newMessage.content,
            createdAt:
              newMessage.CreatedAt ||
              newMessage.createdAt ||
              newMessage.createdat,
          };

          setMessages((prev) => {
            // Prevent duplicating the message if we just sent it
            if (prev.some((m) => m.id === formattedMessage.id)) {
              return prev;
            }
            return [formattedMessage, ...prev];
          });
        },
      )
      .subscribe((status) => {
        console.log("Supabase Realtime Connection Status:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchMessages() {
    try {
      const response = await getMessages(matchId);
      // Reverse array so the latest messages appear at the bottom
      setMessages(response.reverse());
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
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
      // Add the new message at the beginning of the inverted array
      setMessages((prev) => [response, ...prev]);
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  }

  function renderMessage({ item }) {
    const isMine = item.senderId !== receiverId;

    return (
      <View
        className={`mb-3 flex-row ${isMine ? "justify-end" : "justify-start"}`}
      >
        <View
          className={`max-w-[80%] rounded-2xl px-4 py-3 ${
            isMine
              ? "bg-blue-600 rounded-tr-sm dark:bg-blue-500"
              : "bg-slate-200 rounded-tl-sm dark:bg-zinc-800"
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
          contentContainerStyle={{ padding: 20, paddingTop: 10 }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text
              className="mt-10 text-center text-slate-500"
              style={{ transform: [{ scaleY: -1 }] }}
            >
              No messages yet. Say hi!
            </Text>
          }
        />
      )}
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
