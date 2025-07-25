import { useState, useEffect } from 'react';

function convertTime(str) {
  if (!str) return '';
  let hour = parseInt(str.substring(0, 2), 10);
  const suffix = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12;
  return `${hour}:00 ${suffix}`;
}

export default function DealAvailability({ storeHours, setAvailability }) {
  const [mode, setMode] = useState('recurring'); // 'recurring' or 'one-time'
  const [daysOpen, setDaysOpen] = useState([]);
  const [selectedDays, setSelectedDays] = useState([]);
  const [validTimes, setValidTimes] = useState({});
  const [selectedDay, setSelectedDay] = useState(null);

  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isAllDay, setIsAllDay] = useState(false);

  const dayOptions = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Parse store hours
  useEffect(() => {
    if (storeHours?.periods) {
      const openDaysSet = new Set();
      const timeMap = {};

      for (let period of storeHours.periods) {
        const day = period.open.day;
        openDaysSet.add(day);

        if (!timeMap[day]) {
          timeMap[day] = [];
        }

        timeMap[day].push({
          start: convertTime(period.open.time),
          end: convertTime(period.close.time),
        });
      }

      const openDays = [...openDaysSet];
      setDaysOpen(openDays);
      setValidTimes(timeMap);

      // Auto-select first open day
      if (openDays.length > 0) {
        setSelectedDay(openDays[0]);
      }
    }
  }, [storeHours]);

  // Auto-select first selected day if user picks some
  useEffect(() => {
    if (selectedDays.length > 0 && !selectedDays.includes(selectedDay)) {
      setSelectedDay(selectedDays[0]);
    }
  }, [selectedDays]);

  // Construct availability object
  useEffect(() => {
    const data =
      mode === 'recurring'
        ? { type: 'recurring', days: selectedDays, startTime, endTime, isAllDay }
        : { type: 'one-time', startDate, endDate, startTime, endTime, isAllDay };

    setAvailability(data);
  }, [mode, selectedDays, startDate, endDate, startTime, endTime, isAllDay]);

  return (
    <div>
      <label className="block font-semibold mb-2">Availability</label>

      {/* Mode Toggle */}
      <div className="flex gap-4 mb-2">
        <label>
          <input
            type="radio"
            checked={mode === 'recurring'}
            onChange={() => setMode('recurring')}
          />
          <span className="ml-1">Recurring (Weekly)</span>
        </label>
        <label>
          <input
            type="radio"
            checked={mode === 'one-time'}
            onChange={() => setMode('one-time')}
          />
          <span className="ml-1">One-time (Date range)</span>
        </label>
      </div>

      {/* Day Selection (Recurring Mode) */}
      {mode === 'recurring' && (
        <div className="mb-4">
          <label className="block mb-1">Select Days:</label>
          <div className="flex flex-wrap gap-2">
            {dayOptions.map((day, index) => (
              <label
                key={day}
                className={`flex items-center gap-1 ${
                  !daysOpen.includes(index) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <input
                  type="checkbox"
                  value={index}
                  disabled={!daysOpen.includes(index)}
                  checked={selectedDays.includes(index)}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (e.target.checked) {
                      setSelectedDays((prev) => [...prev, val]);
                    } else {
                      setSelectedDays((prev) => prev.filter((d) => d !== val));
                    }
                  }}
                />
                {day}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Commented Out: Pick a Day to Set Time (for future use) */}
      {/*
      {selectedDays.length > 0 && (
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Pick a Day to Set Time:</label>
          <select
            value={selectedDay ?? ''}
            onChange={(e) => setSelectedDay(parseInt(e.target.value))}
            className="border p-2 w-full"
          >
            <option value="">Select Day</option>
            {selectedDays.map((d) => (
              <option key={d} value={d}>
                {dayOptions[d]}
              </option>
            ))}
          </select>
        </div>
      )}
      */}

      {/* Date Range (One-Time Mode) */}
      {mode === 'one-time' && (
        <div className="mb-4 space-y-2">
          <label className="block">Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border p-2"
          />
          <label className="block">End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border p-2"
          />
        </div>
      )}

      {/* All Day Toggle */}
      <div className="flex items-center gap-2 mb-4">
        <input
          type="checkbox"
          checked={isAllDay}
          onChange={() => setIsAllDay(!isAllDay)}
        />
        <label>All Day</label>
      </div>

      {/* Time Selection */}
      {!isAllDay && selectedDays.length > 0 && (
        <>
          <p className="text-sm text-gray-500 mb-2">
            The selected time will apply to all selected days.
          </p>

          <div className="mb-2">
            <label className="block font-semibold mb-1">Start Time</label>
            <select
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full border p-2"
            >
              <option value="">Select</option>
              {validTimes[selectedDay]?.map((slot, i) => (
                <option key={`start-${i}`} value={slot.start}>
                  {slot.start}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-2">
            <label className="block font-semibold mb-1">End Time</label>
            <select
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full border p-2"
            >
              <option value="">Select</option>
              {validTimes[selectedDay]?.map((slot, i) => (
                <option key={`end-${i}`} value={slot.end}>
                  {slot.end}
                </option>
              ))}
            </select>
          </div>
        </>
      )}
    </div>
  );
}
