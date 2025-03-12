import { useState } from "react";
import { Calendar, ChevronDown } from "lucide-react";
import { format } from "date-fns";

export default function DatePicker({ date, setDate }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center h-10 px-4 bg-white/10 hover:bg-white/20 text-white rounded-md"
      >
        <Calendar className="mr-2 h-4 w-4" />
        {format(date, "MMM dd, yyyy")}
        <ChevronDown className="ml-2 h-4 w-4" />
      </button>

      {isOpen && (
        <div className="absolute top-12 left-0 bg-neutral-800 border border-white/10 rounded-lg p-4 w-64 z-50">
          <div className="grid grid-cols-7 gap-1 text-center text-sm text-gray-300 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
              <div key={day} className="p-1">{day}</div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {getCalendarDays(date).map((day, index) => (
              <button
                key={index}
                onClick={() => {
                  setDate(day);
                  setIsOpen(false);
                }}
                className={`h-8 rounded-md text-sm ${
                  day.getMonth() === date.getMonth()
                    ? "hover:bg-white/10"
                    : "text-gray-500"
                } ${
                  format(day, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
                    ? "bg-blue-600 hover:bg-blue-700"
                    : ""
                }`}
              >
                {day.getDate()}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function to generate calendar days
function getCalendarDays(date) {
  const days = [];
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  
  // Previous month days
  const prevMonthEnd = new Date(date.getFullYear(), date.getMonth(), 0);
  const prevDays = prevMonthEnd.getDate() - start.getDay() + 1;
  for (let i = prevDays; i <= prevMonthEnd.getDate(); i++) {
    days.push(new Date(date.getFullYear(), date.getMonth() - 1, i));
  }

  // Current month days
  for (let i = 1; i <= end.getDate(); i++) {
    days.push(new Date(date.getFullYear(), date.getMonth(), i));
  }

  // Next month days
  const nextDays = 7 - (days.length % 7);
  for (let i = 1; i <= nextDays; i++) {
    days.push(new Date(date.getFullYear(), date.getMonth() + 1, i));
  }

  return days;
}
