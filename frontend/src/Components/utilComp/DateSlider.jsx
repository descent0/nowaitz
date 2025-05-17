import React from 'react';

const DateSlider = ({ selectedDate, setSelectedDate }) => {
  const scrollRef = React.useRef(null);
  
  // Generate dates for the next 10 days
  const dates = React.useMemo(() => {
    return Array.from({ length: 10 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i);
      return {
        full: date,
        day: date.toLocaleDateString('en-IN', { weekday: 'short' }),
        date: date.getDate(),
        month: date.toLocaleDateString('en-IN', { month: 'short' })
      };
    });
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  return (
    <div className="relative w-full shadow-sm rounded-lg">
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto gap-4 px-12 py-4 no-scrollbar"
      >
        {dates.map((date) => {
          const isSelected = selectedDate instanceof Date && selectedDate.toDateString() === date.full.toDateString();
          const today = isToday(date.full);
          
          return (
            <button
              key={date.full.toISOString()}
              onClick={() => setSelectedDate(date.full)}
              className={`flex flex-col items-center justify-center
                min-w-[6rem] p-4 rounded-xl transition-shadow border
                ${isSelected 
                  ? 'bg-blue-50 text-blue-600 border-blue-600 shadow-md' 
                  : today 
                    ? 'bg-white text-blue-600 border-blue-200' 
                    : 'bg-white hover:shadow-md text-gray-700 border-gray-100'}`}
            >
              <span className={`text-sm font-medium mb-1`}>
                {date.day}
              </span>
              <span className="text-2xl font-bold">
                {date.date}
              </span>
              <span className="text-sm font-medium mt-1">
                {date.month}
              </span>
              {today && !isSelected && (
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DateSlider;
