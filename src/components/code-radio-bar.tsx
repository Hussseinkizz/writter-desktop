import { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { Bell, BellOff } from 'lucide-react';

export default function CodeRadioBar() {
  const STREAM_URL =
    'https://coderadio-admin.freecodecamp.org/radio/8010/radio.mp3';
  const META_URL =
    'https://coderadio-admin.freecodecamp.org/api/nowplaying/8010';

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [song, setSong] = useState('Loading...');
  const [volume, setVolume] = useState(50);
  const [notificationsOn, setNotificationsOn] = useState(true);

  const marqueeControls = useAnimation();
  const prevSongRef = useRef('');

  // Fetch current song metadata
  useEffect(() => {
    const fetchSong = async () => {
      try {
        const res = await fetch(META_URL);
        const data = await res.json();
        const newSong = data?.song || 'Unknown Track';

        if (newSong !== prevSongRef.current) {
          prevSongRef.current = newSong;
          setSong(newSong);
          if (notificationsOn && playing) {
            toast.success(`Now Playing: ${newSong}`);
          }
        }
      } catch {
        setSong('Error fetching track');
      }
    };
    fetchSong();
    const interval = setInterval(fetchSong, 10000);
    return () => clearInterval(interval);
  }, [notificationsOn, playing]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'ArrowUp') {
        changeVolume(5);
      } else if (e.code === 'ArrowDown') {
        changeVolume(-5);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  });

  const togglePlay = () => {
    if (!navigator.onLine) {
      if (notificationsOn)
        toast.error("You're offline — cannot start playback.");
      return;
    }

    if (!audioRef.current) return;
    if (playing) {
      fadeVolume(0, () => audioRef.current?.pause());
    } else {
      audioRef.current.volume = volume / 100;
      audioRef.current.play().catch(console.error);
    }
    setPlaying(!playing);
  };

  const changeVolume = (delta: number) => {
    const newVol = Math.min(100, Math.max(0, volume + delta));
    setVolume(newVol);
    if (audioRef.current) audioRef.current.volume = newVol / 100;
  };

  const fadeVolume = (target: number, callback?: () => void) => {
    if (!audioRef.current) return;
    let current = audioRef.current.volume;
    const step = (current - target) / 10;
    const fade = setInterval(() => {
      if (!audioRef.current) return;
      current -= step;
      if ((step > 0 && current <= target) || (step < 0 && current >= target)) {
        audioRef.current.volume = target;
        clearInterval(fade);
        if (callback) callback();
      } else {
        audioRef.current.volume = Math.max(0, Math.min(1, current));
      }
    }, 30);
  };

  // Animate marquee
  useEffect(() => {
    marqueeControls.start({
      x: ['100%', '-100%'],
      transition: {
        repeat: Infinity,
        duration: song.length / 4,
        ease: 'linear',
      },
    });
  }, [song, marqueeControls]);

  return (
    <div className="fixed bottom-0 left-0 w-full bg-black text-white flex items-center px-4 py-2 z-50 border-t border-zinc-800">
      {/* Play/Pause */}
      <Button
        onClick={togglePlay}
        variant="ghost"
        size="icon"
        title={playing ? 'Pause' : 'Play'}
        className="text-green-500 hover:text-green-400">
        {playing ? '⏸' : '▶'}
      </Button>

      {/* Song Title (Marquee) */}
      <div className="overflow-hidden whitespace-nowrap mx-4 flex-1">
        <motion.div animate={marqueeControls} className="inline-block">
          {song}
        </motion.div>
      </div>

      {/* Volume Slider */}
      <div className="w-32 flex items-center mr-3">
        <Slider
          value={[volume]}
          max={100}
          step={1}
          onValueChange={(val) => changeVolume(val[0] - volume)}
        />
      </div>

      {/* Notifications Toggle */}
      <Button
        onClick={() => setNotificationsOn(!notificationsOn)}
        variant="ghost"
        size="icon"
        title={
          notificationsOn ? 'Turn off notifications' : 'Turn on notifications'
        }
        className="text-gray-300 hover:text-white">
        {notificationsOn ? <Bell size={18} /> : <BellOff size={18} />}
      </Button>

      <audio ref={audioRef} src={STREAM_URL} preload="none" />
    </div>
  );
}
