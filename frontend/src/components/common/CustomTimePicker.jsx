import { useState, useEffect } from 'react';
import { FaClock } from 'react-icons/fa';

const CustomTimePicker = ({ selectedTime, onChange, className }) => {
  const [hour, setHour] = useState(12);
  const [minute, setMinute] = useState(0);
  const [ampm, setAmpm] = useState('AM');

  // Generate hour options (1-12)
  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  
  // Generate minute options (0, 30)
  const minutes = [0, 30];

  useEffect(() => {
    if (selectedTime) {
      const date = new Date(selectedTime);
      let hours = date.getHours();
      const mins = date.getMinutes();
      const period = hours >= 12 ? 'PM' : 'AM';
      
      // Convert to 12-hour format
      if (hours === 0) hours = 12;
      else if (hours > 12) hours -= 12;
      
      setHour(hours);
      setMinute(mins);
      setAmpm(period);
    }
  }, [selectedTime]);

  const handleTimeChange = (newHour, newMinute, newAmpm) => {
    const date = new Date(selectedTime || new Date());
    
    // Convert to 24-hour format
    let hour24 = newHour;
    if (newAmpm === 'PM' && newHour !== 12) {
      hour24 += 12;
    } else if (newAmpm === 'AM' && newHour === 12) {
      hour24 = 0;
    }
    
    date.setHours(hour24, newMinute, 0, 0);
    onChange(date);
  };

  const handleHourChange = (newHour) => {
    setHour(newHour);
    handleTimeChange(newHour, minute, ampm);
  };

  const handleMinuteChange = (newMinute) => {
    setMinute(newMinute);
    handleTimeChange(hour, newMinute, ampm);
  };

  const handleAmpmChange = (newAmpm) => {
    setAmpm(newAmpm);
    handleTimeChange(hour, minute, newAmpm);
  };

  return (
    <div className={`bg-academic-slate-50 p-4 rounded-xl border border-academic-slate-200 ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <FaClock className="text-academic-navy-600" />
        <span className="text-sm font-medium text-academic-navy-900">Select Time</span>
      </div>
      
      <div className="flex gap-3">
        {/* Hour Selector */}
        <div className="flex-1">
          <label className="block text-xs font-medium text-academic-slate-700 mb-2">Hour</label>
          <select
            value={hour}
            onChange={(e) => handleHourChange(parseInt(e.target.value))}
            className="w-full px-3 py-2 bg-white border-2 border-academic-slate-300 rounded-lg text-academic-navy-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-academic-gold-500 focus:border-academic-gold-500 transition-all duration-300 hover:border-academic-slate-400"
          >
            {hours.map((h) => (
              <option key={h} value={h}>
                {h.toString().padStart(2, '0')}
              </option>
            ))}
          </select>
        </div>

        {/* Minute Selector */}
        <div className="flex-1">
          <label className="block text-xs font-medium text-academic-slate-700 mb-2">Min</label>
          <select
            value={minute}
            onChange={(e) => handleMinuteChange(parseInt(e.target.value))}
            className="w-full px-3 py-2 bg-white border-2 border-academic-slate-300 rounded-lg text-academic-navy-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-academic-gold-500 focus:border-academic-gold-500 transition-all duration-300 hover:border-academic-slate-400"
          >
            {minutes.map((m) => (
              <option key={m} value={m}>
                {m.toString().padStart(2, '0')}
              </option>
            ))}
          </select>
        </div>

        {/* AM/PM Selector */}
        <div className="flex-1">
          <label className="block text-xs font-medium text-academic-slate-700 mb-2">Period</label>
          <select
            value={ampm}
            onChange={(e) => handleAmpmChange(e.target.value)}
            className="w-full px-3 py-2 bg-white border-2 border-academic-slate-300 rounded-lg text-academic-navy-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-academic-gold-500 focus:border-academic-gold-500 transition-all duration-300 hover:border-academic-slate-400"
          >
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        </div>
      </div>

      {/* Time Display */}
      <div className="mt-3 p-2 bg-academic-gold-50 border border-academic-gold-200 rounded-lg text-center">
        <span className="text-academic-gold-800 font-bold text-lg">
          {hour.toString().padStart(2, '0')}:{minute.toString().padStart(2, '0')} {ampm}
        </span>
      </div>
    </div>
  );
};

export default CustomTimePicker;
