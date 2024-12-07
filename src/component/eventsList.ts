const now = new Date();
const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);

export const myEvents = [
  {
    id: 1,
    title: "Meeting with Team",
    startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 0, 0),
    endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 11, 30, 0),
    color: "bg-blue-600",
  },
  {
    id: 2,
    title: "Lunch Break",
    startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 0, 0),
    endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 13, 0, 0),
    color: "bg-green-600",
  },
  {
    id: 3,
    title: "Client Presentation",
    startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 11, 0, 0),
    endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 30, 0),
    color: "bg-red-600",
  },
  {
    id: 4,
    title: "Workshop on React",
    startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 0, 0),
    endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 16, 0, 0),
    color: "bg-purple-600",
  },
  {
    id: 5,
    title: "Evening Yoga",
    startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 18, 0, 0),
    endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 19, 0, 0),
    color: "bg-orange-600",
  },
  {
    id: 6,
    title: "Team Catch-Up",
    startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 30, 0),
    endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 11, 15, 0),
    color: "bg-teal-600",
  },
  {
    id: 7,
    title: "Brainstorm Session",
    startTime: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 9, 0, 0),
    endTime: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 10, 30, 0),
    color: "bg-yellow-600",
  },
  {
    id: 8,
    title: "Lunch with Client",
    startTime: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 12, 0, 0),
    endTime: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 13, 30, 0),
    color: "bg-green-400",
  },
  {
    id: 9,
    title: "Daily Standup",
    startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 15, 0),
    endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 45, 0),
    color: "bg-blue-400",
  },
  {
    id: 10,
    title: "Code Review",
    startTime: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 14, 0, 0),
    endTime: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 15, 30, 0),
    color: "bg-gray-600",
  },
  {
    id: 11,
    title: "Marketing Strategy Meeting",
    startTime: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 16, 0, 0),
    endTime: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 17, 30, 0),
    color: "bg-pink-600",
  },
  {
    id: 12,
    title: "Catch-Up with Manager",
    startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 13, 30, 0),
    endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 15, 0),
    color: "bg-indigo-600",
  },
];
