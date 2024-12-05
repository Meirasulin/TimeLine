import React, { useState, useRef, useEffect } from 'react';

// Type definition for event props (for documentation)
type Prop = {
    events: {
  id: string | number;
  title: string;
  startTime: Date;
  endTime: Date;
  color?: string;
    }[]
}

const Timeline2: React.FC<Prop> = ({ events = [] }) => {
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

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - timelineRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    timelineRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  // Generate time blocks with minutes
  const generateTimeBlocks = () => {
    const blocks = [];
    const hoursToShow = timeRange / 2;
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    
    // Calculate start and end times
    const startTime = new Date(currentTime);
    startTime.setHours(currentHour - hoursToShow);
    startTime.setMinutes(currentMinute);
    
    const endTime = new Date(currentTime);
    endTime.setHours(currentHour + hoursToShow);
    endTime.setMinutes(currentMinute);

    const currentBlock = new Date(startTime);
    
    while (currentBlock < endTime) {
      blocks.push(new Date(currentBlock));
      currentBlock.setHours(currentBlock.getHours() + 1);
    }
    
    return blocks;
  };

  // Calculate position for an event
  const calculateEventPosition = (eventTime) => {
    const hoursToShow = timeRange / 2;
    const centerTime = new Date(currentTime);
    const startTime = new Date(centerTime.setHours(centerTime.getHours() - hoursToShow));
    const totalMinutes = timeRange * 60;
    
    const eventMinutes = (eventTime - startTime) / (1000 * 60);
    return (eventMinutes / totalMinutes) * 100;
  };

  // Group events by row to prevent overlapping
  const organizeEventsInRows = () => {
    const sortedEvents = [...events].sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
    const rows = [];
    
    sortedEvents.forEach(event => {
      let rowIndex = 0;
      while (true) {
        if (!rows[rowIndex]) {
          rows[rowIndex] = [];
        }
        
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

  const rows = organizeEventsInRows();

  const formatTimeLabel = (date) => {
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 bg-gray-900">
      <div className="mb-4 flex gap-2">
        {[12, 24, 48].map(hours => (
          <button 
            key={hours}
            onClick={() => setTimeRange(hours)}
            className={`px-4 py-2 rounded ${timeRange === hours ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300'}`}
          >
            {hours}h
          </button>
        ))}
      </div>

      <div 
        ref={timelineRef}
        className="relative w-full h-96 overflow-x-auto overflow-y-auto bg-gray-800 rounded-lg cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="relative min-w-max h-full flex flex-col">
          {/* Time markers */}
          <div className="sticky top-0 z-10 flex h-8 border-b border-gray-700 bg-gray-800">
            {generateTimeBlocks().map((time, index) => (
              <div 
                key={index}
                className="flex-none w-32 border-r border-gray-700 text-sm text-gray-400 px-2 py-1"
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
                className="relative h-16 border-b border-gray-700 hover:bg-gray-750"
              >
                {rowEvents.map((event) => {
                  const startPos = calculateEventPosition(new Date(event.startTime));
                  const endPos = calculateEventPosition(new Date(event.endTime));
                  const width = endPos - startPos;
                  
                  return (
                    <div
                      key={event.id}
                      className={`absolute h-12 rounded ${event.color || 'bg-blue-600'} bg-opacity-90 m-1 
                                hover:bg-opacity-100 transition-opacity`}
                      style={{
                        left: `${startPos}%`,
                        width: `${width}%`,
                      }}
                      title={`${event.title} (${formatTimeLabel(new Date(event.startTime))} - ${formatTimeLabel(new Date(event.endTime))})`}
                    >
                      <div className="p-2 text-sm text-white truncate">
                        {event.title}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Current time indicator */}
          <div 
            className="absolute top-0 bottom-0 w-0.5 bg-white z-20"
            style={{ left: '50%' }}
          >
            <div className="absolute top-0 w-2 h-2 bg-white rounded-full -ml-1"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline2;