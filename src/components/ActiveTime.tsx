import { useState, useEffect } from 'react';
import { format } from 'date-fns';

const ActiveTime = () => {
  const [activeTime, setActiveTime] = useState('');

  useEffect(() => {
    const updateActiveTime = () => {
      const now = new Date();
      const formattedDate = format(now, 'd MMMM yyyy');
      const formattedTime = format(now, 'h:mm a');
      setActiveTime(`${formattedDate} ${formattedTime}`);
    };

    const interval = setInterval(updateActiveTime, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="text-center">
      <p className="text-lg">{activeTime ? activeTime : '...'}</p>
    </div>
  );
};

export default ActiveTime;
