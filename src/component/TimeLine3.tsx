import React, { useState, useRef, useEffect } from 'react';

type Prop = {
    events: {
  id: string | number;
  title: string;
  startTime: Date;
  endTime: Date;
  color?: string;
    }[]
}

const Timeline3: React.FC<Prop> = ({ events = [] }) => {
  const [timeRange, setTimeRange] = useState(24);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const timelineRef = useRef(null);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Drag handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - timelineRef.current.offsetLeft);
    setScrollLeft(timelineRef.current.scrollLeft);
  };

  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);
  
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - timelineRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    timelineRef.current.scrollLeft = scrollLeft - walk;
  };

  // Get visible time range
  const getVisibleTimeRange = () => {
    const hoursToShow = timeRange / 2;
    const rangeStart = new Date(currentTime);
    const rangeEnd = new Date(currentTime);
    
    rangeStart.setHours(currentTime.getHours() - hoursToShow);
    rangeEnd.setHours(currentTime.getHours() + hoursToShow);
    
    return { rangeStart, rangeEnd };
  };

  // Generate time blocks within visible range
  const generateTimeBlocks = () => {
    const { rangeStart, rangeEnd } = getVisibleTimeRange();
    const blocks = [];
    const currentBlock = new Date(rangeStart);
    
    while (currentBlock < rangeEnd) {
      blocks.push(new Date(currentBlock));
      currentBlock.setHours(currentBlock.getHours() + 1);
    }
    
    return blocks;
  };

  // Filter and organize events within visible range
  const organizeVisibleEvents = () => {
    const { rangeStart, rangeEnd } = getVisibleTimeRange();
    
    const visibleEvents = events.filter(event => {
      const eventStart = new Date(event.startTime);
      const eventEnd = new Date(event.endTime);
      return eventStart < rangeEnd && eventEnd > rangeStart;
    });

    const sortedEvents = [...visibleEvents].sort(
      (a, b) => new Date(a.startTime) - new Date(b.startTime)
    );

    const rows = [];
    sortedEvents.forEach(event => {
      let rowIndex = 0;
      while (true) {
        if (!rows[rowIndex]) rows[rowIndex] = [];
        
        const canFit = rows[rowIndex].every(existingEvent => {
          const eventStart = new Date(event.startTime);
          const eventEnd = new Date(event.endTime);
          const existingStart = new Date(existingEvent.startTime);
          const existingEnd = new Date(existingEvent.endTime);
          return eventEnd <= existingStart || eventStart >= existingEnd;
        });
        
        if (canFit) {
          rows[rowIndex].push(event);
          event.row = rowIndex;
          break;
        }
        rowIndex++;
      }
    });
    
    return rows;
  };

  // Calculate event position relative to visible range
  const calculateEventPosition = (eventTime) => {
    const { rangeStart } = getVisibleTimeRange();
    const totalMinutes = timeRange * 60;
    const eventMinutes = (new Date(eventTime) - rangeStart) / (1000 * 60);
    return (eventMinutes / totalMinutes) * 100;
  };

  const formatTimeLabel = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const rows = organizeVisibleEvents();

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
      {/* Time range selector */}
      <div className="mb-6 flex gap-3">
        {[12, 24, 48].map(hours => (
          <button 
            key={hours}
            onClick={() => setTimeRange(hours)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ease-in-out
              ${timeRange === hours 
                ? 'bg-indigo-600 text-white shadow-md scale-105' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}`}
          >
            {hours}h
          </button>
        ))}
      </div>

      {/* Timeline container */}
      <div 
        ref={timelineRef}
        className="relative w-full h-[32rem] overflow-x-auto overflow-y-auto bg-gray-50 dark:bg-gray-800 
                   rounded-xl shadow-inner cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="relative min-w-max h-full flex flex-col">
          {/* Time markers */}
          <div className="sticky top-0 z-10 flex h-12 border-b border-gray-200 dark:border-gray-700 
                        bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
            {generateTimeBlocks().map((time, index) => (
              <div 
                key={index}
                className="flex-none w-40 border-r border-gray-200 dark:border-gray-700 
                         text-sm font-medium text-gray-600 dark:text-gray-400 px-4 py-3"
              >
                {formatTimeLabel(time)}
              </div>
            ))}
          </div>

          {/* Event rows */}
          <div className="flex-grow">
            {rows.map((rowEvents, rowIndex) => (
              <div 
                key={rowIndex}
                className="relative h-20 border-b border-gray-200 dark:border-gray-700 
                         hover:bg-gray-100/50 dark:hover:bg-gray-750/50 transition-colors duration-150"
              >
                {rowEvents.map((event) => {
                  const startPos = calculateEventPosition(event.startTime);
                  const endPos = calculateEventPosition(event.endTime);
                  const width = endPos - startPos;
                  
                  return (
                    <div
                      key={event.id}
                      className={`absolute h-16 rounded-lg ${event.color || 'bg-indigo-600'} 
                                shadow-lg transform hover:scale-[1.02] transition-all duration-150
                                hover:shadow-xl bg-opacity-90 hover:bg-opacity-100 m-2`}
                      style={{
                        left: `${startPos}%`,
                        width: `${Math.max(width, 0)}%`,
                      }}
                      title={`${event.title} (${formatTimeLabel(new Date(event.startTime))} - ${formatTimeLabel(new Date(event.endTime))})`}
                    >
                      <div className="p-3 text-sm font-medium text-white truncate">
                        {event.title}
                      </div>
                      <div className="px-3 text-xs text-white/80 truncate">
                        {formatTimeLabel(new Date(event.startTime))} - {formatTimeLabel(new Date(event.endTime))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Current time indicator */}
          <div 
            className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-20 transition-all duration-300"
            style={{ left: '50%' }}
          >
            <div className="absolute -top-1 w-3 h-3 bg-red-500 rounded-full -ml-[5px] shadow-md"/>
            <div className="absolute -top-1 w-3 h-3 bg-red-500 rounded-full -ml-[5px] animate-ping opacity-75"/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline3;