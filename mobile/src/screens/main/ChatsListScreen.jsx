import React, { useState, useEffect, useCallback } from "react";
import { FlatList, Pressable, Text, View, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ScreenHeader from "../../components/ScreenHeader";
import { getMyMatches, getMatchMessages } from "../../services/matchService";
import { getCurrentStudent } from "../../services/studentService";
import { useFocusEffect } from "@react-navigation/native";

export default function ChatsListScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [chats, setChats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchChats() {
    try {
      setIsLoading(true);
      const student = await getCurrentStudent();
      const matches = await getMyMatches();

      if (!matches) {
        setChats([]);
        return;
      }

      const chatsData = await Promise.all(
        matches.map(async (match) => {
          const isLostMine = match.lostItem.studentName === student.fullName;
          const otherStudentName = isLostMine ? match.foundItem.studentName : match.lostItem.studentName;
          const itemName = isLostMine ? match.lostItem.itemName : match.foundItem.itemName;
          const receiverId = isLostMine ? match.foundItem.studentId : match.lostItem.studentId;
          
          let initials = "??";
          if (otherStudentName) {
            initials = otherStudentName.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
          }

          let lastMessage = "Tap to view chat";
          let time = "";
          
          try {
            const messages = await getMatchMessages(match.id);
            if (messages && messages.length > 0) {
              const last = messages[messages.length - 1];
              lastMessage = last.content;
              time = new Date(last.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            }
          } catch (error) {
            console.log("Error fetching messages for match", match.id, error.message);
          }

          // Array of vibrant tailwind colors for avatars
          const colors = ["bg-blue-500", "bg-purple-500", "bg-emerald-500", "bg-orange-500", "bg-rose-500", "bg-indigo-500"];
          // Pick a consistent color based on the match ID string length
          const colorIndex = match.id.length % colors.length;

          return {
            id: match.id,
            matchId: match.id,
            receiverId,
            studentName: otherStudentName,
            lastMessage,
            time,
            unread: 0,
            itemName,
            initials,
            color: colors[colorIndex],
          };
        })
      );

      // Sort chats by time (if available) or keep original order
      setChats(chatsData);
    } catch (error) {
      console.error("Failed to fetch chats", error);
    } finally {
      setIsLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchChats();
    }, [])
  );

  function handleChatPress(chat) {
    navigation.navigate("Chat", { 
      matchId: chat.matchId, 
      otherStudentName: chat.studentName,
      receiverId: chat.receiverId
    });
  }

  return (
    <View className="flex-1 bg-slate-50 dark:bg-zinc-950">
      <View
        className="px-5 pb-4 bg-slate-50 dark:bg-zinc-950 border-b border-slate-200 dark:border-zinc-800"
        style={{ paddingTop: Math.max(insets.top, 24) + 12, zIndex: 10 }}
      >
        <View className="flex-row items-center">
          <Pressable
            className="mr-4 h-11 w-11 items-center justify-center rounded-xl bg-white dark:bg-zinc-900 shadow-sm border border-slate-200 dark:border-zinc-800"
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={22} color="#64748b" />
          </Pressable>
          <ScreenHeader
            title="Messages"
            subtitle="Coordinate meetups for matched items."
          />
        </View>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
      ) : (
        <FlatList
          data={chats}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 100, paddingTop: 12, paddingHorizontal: 20 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="mt-20 items-center justify-center">
              <View className="mb-4 h-24 w-24 items-center justify-center rounded-full bg-slate-100 dark:bg-zinc-900">
                <Ionicons name="chatbubbles-outline" size={40} color="#94a3b8" />
              </View>
              <Text className="text-lg font-black text-slate-900 dark:text-white">
                No active chats
              </Text>
              <Text className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400 px-10">
                When you accept a match, you'll be able to chat with the other student here to arrange a meetup.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <Pressable
              className="mb-3 flex-row rounded-3xl bg-white p-4 border border-slate-200 dark:border-zinc-800 shadow-sm shadow-slate-300/60 dark:shadow-none dark:bg-zinc-900"
              onPress={() => handleChatPress(item)}
            >
              <View className={`mr-4 h-14 w-14 items-center justify-center rounded-full ${item.color}`}>
                <Text className="text-lg font-black text-white">{item.initials}</Text>
              </View>

              <View className="flex-1 justify-center">
                <View className="flex-row items-center justify-between">
                  <Text className="text-base font-bold text-slate-900 dark:text-white">
                    {item.studentName}
                  </Text>
                  <Text className={`text-xs font-semibold ${item.unread > 0 ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-zinc-500"}`}>
                    {item.time}
                  </Text>
                </View>

                <Text className="mt-0.5 text-xs font-medium text-slate-500 dark:text-zinc-400">
                  Regarding: {item.itemName}
                </Text>

                <View className="mt-1 flex-row items-center justify-between">
                  <Text 
                    className={`flex-1 text-sm ${item.unread > 0 ? "font-bold text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-300"}`}
                    numberOfLines={1}
                  >
                    {item.lastMessage}
                  </Text>
                  {item.unread > 0 && (
                    <View className="ml-2 h-5 min-w-[20px] items-center justify-center rounded-full bg-blue-600 px-1.5 dark:bg-blue-500">
                      <Text className="text-[10px] font-black text-white">{item.unread}</Text>
                    </View>
                  )}
                </View>
              </View>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

