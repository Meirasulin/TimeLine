import { useState, useRef, useEffect } from 'react';

const Timeline1 = () => {
  const [timeRange, setTimeRange] = useState(24);
  const [currentTime, setCurrentTime] = useState(new Date());
  const timelineRef = useRef(null);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Generate time blocks that span before and after current time
  const generateTimeBlocks = () => {
    const blocks = [];
    const currentHour = currentTime.getHours();
    const hoursToShow = timeRange / 2; // Half before, half after current time
    
    const startHour = currentHour - hoursToShow;
    const endHour = currentHour + hoursToShow;
    
    for (let hour = startHour; hour < endHour; hour++) {
      const adjustedHour = hour < 0 ? hour + 24 : hour >= 24 ? hour - 24 : hour;
      blocks.push(adjustedHour);
    }
    return blocks;
  };

  // Sample events - in real app this would come from props
  const events = [
    { id: 1, start: 2, duration: 3, title: "Meeting 1", color: "bg-pink-600" },
    { id: 2, start: 5, duration: 2, title: "Meeting 2", color: "bg-teal-600" },
    { id: 3, start: 8, duration: 4, title: "Meeting 3", color: "bg-blue-600" },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-4 bg-gray-900">
      {/* Time range selector */}
      <div className="mb-4 flex gap-2">
        <button 
          onClick={() => setTimeRange(12)}
          className={`px-4 py-2 rounded ${timeRange === 12 ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300'}`}
        >
          12h
        </button>
        <button 
          onClick={() => setTimeRange(24)}
          className={`px-4 py-2 rounded ${timeRange === 24 ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300'}`}
        >
          24h
        </button>
        <button 
          onClick={() => setTimeRange(48)}
          className={`px-4 py-2 rounded ${timeRange === 48 ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300'}`}
        >
          48h
        </button>
      </div>

      {/* Timeline container */}
      <div 
        ref={timelineRef}
        className="relative w-full h-96 overflow-x-auto overflow-y-hidden bg-gray-800 rounded-lg"
      >
        {/* Time blocks container */}
        <div className="relative min-w-max h-full flex flex-col">
          {/* Top time markers */}
          <div className="flex h-8 border-b border-gray-700">
            {generateTimeBlocks().map((hour, index) => (
              <div 
                key={index}
                className="flex-none w-32 border-r border-gray-700 text-sm text-gray-400 px-2 py-1"
              >
                {hour.toString().padStart(2, '0')}:00
              </div>
            ))}
          </div>

          {/* Multiple rows for different event tracks */}
          {[...Array(5)].map((_, rowIndex) => (
            <div key={rowIndex} className="relative h-16 border-b border-gray-700">
              {events
                .filter(event => event.row === rowIndex)
                .map((event) => (
                  <div
                    key={event.id}
                    className={`absolute h-12 rounded ${event.color} bg-opacity-90 m-1`}
                    style={{
                      left: `${(event.start / timeRange) * 100}%`,
                      width: `${(event.duration / timeRange) * 100}%`,
                    }}
                  >
                    <div className="p-2 text-sm text-white truncate">
                      {event.title}
                    </div>
                  </div>
                ))}
            </div>
          ))}

          {/* Current time indicator - centered */}
          <div 
            className="absolute top-0 bottom-0 w-0.5 bg-white"
            style={{ left: '50%' }}
          >
            <div className="absolute top-0 w-2 h-2 bg-white rounded-full -ml-1"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline1;