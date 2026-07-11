import { Ionicons } from "@expo/vector-icons";
import { Modal, Pressable, Text, View } from "react-native";
import { useEffect, useState } from "react";
import { useColorScheme } from "nativewind";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function isSameDay(firstDate: Date, secondDate: Date): boolean {
  return (
    firstDate.getFullYear() === secondDate.getFullYear() &&
    firstDate.getMonth() === secondDate.getMonth() &&
    firstDate.getDate() === secondDate.getDate()
  );
}

function stripTime(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function getCalendarDates(monthDate: Date): (Date | null)[] {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const dates = [];

  for (let index = 0; index < firstDay.getDay(); index += 1) {
    dates.push(null);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    dates.push(new Date(year, month, day));
  }

  while (dates.length % 7 !== 0) {
    dates.push(null);
  }

  return dates;
}

interface CalendarModalProps {
  isVisible: boolean;
  maximumDate?: Date | null;
  onClose: () => void;
  onSelectDate: (date: Date) => void;
  selectedDate: Date;
  subtitle?: string;
  title?: string;
}

export default function CalendarModal({
  isVisible,
  maximumDate,
  onClose,
  onSelectDate,
  selectedDate,
  subtitle = "Select a date",
  title = "Choose date",
} : CalendarModalProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const [calendarMonth, setCalendarMonth] = useState<Date>(
    () => new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1),
  );
  const maxDateOnly = maximumDate ? stripTime(maximumDate) : null;

  useEffect(() => {
    if (isVisible) {
      setCalendarMonth(
        new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1),
      );
    }
  }, [isVisible, selectedDate]);

  function changeCalendarMonth(monthOffset : number) {
    setCalendarMonth(
      (current) =>
        new Date(current.getFullYear(), current.getMonth() + monthOffset, 1),
    );
  }

  function isDisabledDate(date :Date | null) : boolean{
    if (!date || !maxDateOnly) {
      return false;
    }

    return stripTime(date) > maxDateOnly;
  }

  function handleSelectDate(date: Date | null) {
    if (!date || isDisabledDate(date)) {
      return;
    }

    onSelectDate(date);
  }

  function handleUseToday() {
    const today = new Date();

    if (isDisabledDate(today)) {
      return;
    }

    onSelectDate(today);
  }

  return (
    <Modal
      animationType="fade"
      onRequestClose={onClose}
      transparent
      visible={isVisible}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className="rounded-t-3xl bg-white px-5 pb-6 pt-5 dark:bg-zinc-950">
          <View className="mb-5 flex-row items-center justify-between">
            <View>
              <Text className="text-2xl font-black text-slate-900 dark:text-white">
                {title}
              </Text>
              <Text className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">
                {subtitle}
              </Text>
            </View>

            <Pressable
              className="h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-zinc-800"
              onPress={onClose}
            >
              <Ionicons name="close" size={22} color="#64748b" />
            </Pressable>
          </View>

          <View className="mb-4 flex-row items-center justify-between">
            <Pressable
              className="h-11 w-11 items-center justify-center rounded-xl bg-slate-100 dark:bg-zinc-800"
              onPress={() => changeCalendarMonth(-1)}
            >
              <Ionicons
                name="chevron-back"
                size={22}
                color={isDark ? "#e2e8f0" : "#334155"}
              />
            </Pressable>

            <Text className="text-lg font-black text-slate-900 dark:text-white">
              {monthNames[calendarMonth.getMonth()]}{" "}
              {calendarMonth.getFullYear()}
            </Text>

            <Pressable
              className="h-11 w-11 items-center justify-center rounded-xl bg-slate-100 dark:bg-zinc-800"
              onPress={() => changeCalendarMonth(1)}
            >
              <Ionicons
                name="chevron-forward"
                size={22}
                color={isDark ? "#e2e8f0" : "#334155"}
              />
            </Pressable>
          </View>

          <View className="mb-2 flex-row">
            {weekDays.map((day) => (
              <Text
                className="flex-1 text-center text-xs font-black uppercase text-slate-400"
                key={day}
              >
                {day}
              </Text>
            ))}
          </View>

          <View className="flex-row flex-wrap">
            {getCalendarDates(calendarMonth).map((date, index) => {
              const dateIsSelected = date && isSameDay(date, selectedDate);
              const dateIsDisabled = date ? isDisabledDate(date) : false;

              return (
                <View className="w-[14.2857%] p-1" key={index}>
                  {date ? (
                    <Pressable
                      className={`h-11 items-center justify-center rounded-xl ${
                        dateIsSelected
                          ? "bg-blue-600"
                          : dateIsDisabled
                            ? "bg-transparent"
                            : "bg-slate-50 dark:bg-zinc-900"
                      }`}
                      disabled={dateIsDisabled}
                      onPress={() => handleSelectDate(date)}
                    >
                      <Text
                        className={`font-black ${
                          dateIsSelected
                            ? "text-white"
                            : dateIsDisabled
                              ? "text-slate-300 dark:text-zinc-700"
                              : "text-slate-800 dark:text-slate-100"
                        }`}
                      >
                        {date.getDate()}
                      </Text>
                    </Pressable>
                  ) : (
                    <View className="h-11" />
                  )}
                </View>
              );
            })}
          </View>

          <Pressable
            className="mt-4 h-12 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/30"
            onPress={handleUseToday}
          >
            <Text className="font-black text-blue-600 dark:text-blue-300">
              Use today
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
