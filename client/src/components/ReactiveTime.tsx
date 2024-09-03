import moment from 'moment';
import { useEffect, useState } from 'react';

const ReactiveTime = ({ interval = 1000 }) => {
  const [currentTime, setCurrentTime] = useState(moment());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(moment());
    }, interval);

    return () => {
      clearInterval(timer);
    };
  }, [interval]);

  return <span>{moment(currentTime).format('llll')}</span>;
};

export default ReactiveTime;
