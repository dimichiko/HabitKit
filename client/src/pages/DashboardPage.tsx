import React, { useEffect, useState } from "react";
import apiClient from "../apps/habitkit/utils/api";

interface Habit {
  _id: string;
  name: string;
  timesPerDay: number;
  createdAt: string;
  checkins: { [key: string]: number };
}

interface SquareProps {
  count: number;
  max: number;
  onClick: () => void;
  isToday: boolean;
}

const todayIso = new Date().toISOString().slice(0, 10);

const getDatesFrom = (start: string): string[] => {
  const dates: string[] = [];
  const curr = new Date(start);
  const today = new Date();
  curr.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  while (curr <= today) {
    dates.push(new Date(curr).toISOString().slice(0, 10));
    curr.setDate(curr.getDate() + 1);
  }
  return dates;
};

const Square: React.FC<SquareProps> = ({ count, max, onClick, isToday }) => {
  const opacity = count / max;
  const background = count === 0 ? "#e5e5e5" : `rgba(74, 222, 128, ${opacity})`;
  return (
    <div
      onClick={isToday ? onClick : undefined}
      style={{
        width: 40,
        height: 40,
        backgroundColor: background,
        border: "1px solid #ccc",
        cursor: isToday ? "pointer" : "default",
      }}
    ></div>
  );
};

const DashboardPage = () => {
  const [habits, setHabits] = useState<Habit[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: habits } = await apiClient.get("/habits");
      const withCheckins = await Promise.all(
        habits.map(async (h: any) => {
          const { data: checkins } = await apiClient.get(`/habits/${h._id}/checkins`);
          const map: { [key: string]: number } = {};
          checkins.forEach((c: any) => {
            map[c.date.slice(0, 10)] = c.count;
          });
          return { ...h, checkins: map };
        })
      );
      setHabits(withCheckins);
    };
    fetchData();
  }, []);

  const handleClick = async (habitId: string) => {
    await apiClient.post(`/habits/${habitId}/checkin`);
    const updated = await apiClient.get(`/habits/${habitId}/checkins`);
    const map: { [key: string]: number } = {};
    updated.data.forEach((c: any) => (map[c.date.slice(0, 10)] = c.count));
    setHabits((prev) =>
      prev.map((h) => (h._id === habitId ? { ...h, checkins: map } : h))
    );
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Hábitos</h2>
      {habits.map((habit) => {
        const days = getDatesFrom(habit.createdAt);
        return (
          <div key={habit._id} style={{ marginBottom: 40 }}>
            <h3>{habit.name} (x{habit.timesPerDay}/día)</h3>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {days.map((date) => (
                <Square
                  key={date}
                  count={habit.checkins[date] || 0}
                  max={habit.timesPerDay}
                  isToday={date === todayIso}
                  onClick={() => handleClick(habit._id)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardPage;
 