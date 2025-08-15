import { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Slider } from '../ui/slider';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { ScrollArea } from '../ui/scroll-area';
import {
  HiPlay,
  HiPause,
  HiStop,
  HiVolumeUp,
  HiMusicNote,
  HiRefresh,
  HiExclamationCircle,
  HiWifi,
} from 'react-icons/hi';
import { toast } from 'sonner';
import { useSettings } from '../../hooks/use-settings';

/**
 * Background music player component props
 */
interface BackgroundMusicPlayerProps {
  isPlaying: boolean;
  onPlayStateChange: (playing: boolean) => void;
}

/**
 * Simple online-only background music player
 */
export const BackgroundMusicPlayer = ({
  isPlaying,
  onPlayStateChange,
}: BackgroundMusicPlayerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTrack, setCurrentTrack] = useState('Code Radio - Focus Music');
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const { settings, updateSetting } = useSettings();
  const musicSettings = settings.musicPlayer;

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Code Radio stream URL (FreeCodeCamp's music stream)
  const STREAM_URL =
    'https://coderadio-admin-v2.freecodecamp.org/listen/coderadio/radio.mp3';
  const META_URL = '';

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Fetch current track metadata
  useEffect(() => {
    if (!isOnline) return;

    const fetchTrackInfo = async () => {
      try {
        let data: any = null;
        if (!META_URL) {
          const response = await fetch(META_URL);
          data = await response.json();
        }
        const trackName = data?.song || 'Code Radio - Lofi Music';
        setCurrentTrack(trackName);
      } catch (error) {
        console.error('Failed to fetch track info:', error);
        setCurrentTrack('Code Radio - Lofi');
      }
    };

    fetchTrackInfo();
    const interval = setInterval(fetchTrackInfo, 15000); // Update every 15 seconds

    return () => clearInterval(interval);
  }, [isOnline]);

  // Initialize audio element only when dialog is opened
  useEffect(() => {
    if (isOpen && !audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.src = STREAM_URL;
      audioRef.current.volume = musicSettings.volume / 100;
      audioRef.current.crossOrigin = 'anonymous';

      // Event listeners
      audioRef.current.addEventListener('loadstart', () => setIsLoading(true));
      audioRef.current.addEventListener('canplay', () => setIsLoading(false));
      audioRef.current.addEventListener('playing', () => setIsLoading(false));
      audioRef.current.addEventListener('error', (e) => {
        console.error('Audio error:', e);
        toast.error('Failed to load audio stream');
        setIsLoading(false);
        onPlayStateChange(false);
      });
    }

    return () => {
      if (audioRef.current && !isOpen) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [isOpen]);

  // Update volume when settings change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = musicSettings.volume / 100;
    }
  }, [musicSettings.volume]);

  const togglePlayPause = async () => {
    if (!isOnline) {
      toast.error(
        'You are offline. Please connect to the internet to play music.'
      );
      return;
    }

    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      onPlayStateChange(false);
      toast.success('Music paused');
    } else {
      setIsLoading(true);
      try {
        // Reset the audio source for fresh stream
        audioRef.current.load();
        await audioRef.current.play();
        onPlayStateChange(true);
        toast.success(`Playing: ${currentTrack}`);
      } catch (error) {
        console.error('Playback error:', error);
        toast.error('Failed to play audio stream');
        onPlayStateChange(false);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const stopMusic = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      onPlayStateChange(false);
      toast.success('Music stopped');
    }
  };

  const updateVolume = (volume: number) => {
    updateSetting('musicPlayer', { ...musicSettings, volume });
  };

  const updateNotifications = (enabled: boolean) => {
    updateSetting('musicPlayer', { ...musicSettings, autoplay: enabled });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`rounded-full transition relative ${
            isPlaying ? 'text-green-500' : 'text-neutral-400'
          } hover:bg-zinc-800`}
          title="Background Music"
          aria-label="Open background music player">
          <HiMusicNote className="text-xl" />
          {!isOnline && (
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] bg-neutral-900 border-neutral-700">
        <DialogHeader>
          <DialogTitle className="text-neutral-200 text-xl font-semibold flex items-center gap-2">
            <HiMusicNote className="text-violet-400" />
            Background Music Player
            {!isOnline && (
              <span className="text-red-400 text-sm font-normal flex items-center gap-1">
                <HiExclamationCircle className="h-4 w-4" />
                Offline
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
          <div className="space-y-6">
            {/* Offline Notice */}
            {!isOnline && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                <div className="flex items-center gap-3 text-red-400">
                  <HiWifi className="h-6 w-6" />
                  <div>
                    <p className="font-semibold">You are currently offline</p>
                    <p className="text-sm text-red-300">
                      Music streaming requires an internet connection. Offline
                      music support is coming soon!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Current Track & Controls */}
            <div className="p-6 bg-gradient-to-r from-neutral-800/60 to-neutral-800/40 rounded-xl border border-neutral-700/50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-neutral-200 mb-1 truncate">
                    {currentTrack}
                  </h3>
                  <p className="text-sm text-neutral-400">
                    {isOnline
                      ? '🎵 Chill Lofi - Enjoy!'
                      : '📡 Waiting for connection...'}
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={stopMusic}
                    disabled={!isPlaying || !isOnline}
                    className="h-11 px-4">
                    <HiStop className="h-4 w-4 mr-2" />
                    Stop
                  </Button>
                  <Button
                    onClick={togglePlayPause}
                    disabled={isLoading || !isOnline}
                    className="bg-violet-600 hover:bg-violet-700 disabled:bg-neutral-700 h-11 px-6">
                    {isLoading ? (
                      <HiRefresh className="h-5 w-5 animate-spin" />
                    ) : isPlaying ? (
                      <>
                        <HiPause className="h-5 w-5 mr-2" />
                        Pause
                      </>
                    ) : (
                      <>
                        <HiPlay className="h-5 w-5 mr-2" />
                        Play
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Live Stream Indicator */}
              {isOnline && (
                <div className="flex items-center gap-2 text-sm text-neutral-400">
                  <div className="flex items-center gap-1">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        isPlaying
                          ? 'bg-red-500 animate-pulse'
                          : 'bg-neutral-500'
                      }`}></div>
                    <span>{isPlaying ? 'LIVE' : 'READY'}</span>
                  </div>
                  <span>•</span>
                  <span>Streaming Quality: 128kbps</span>
                </div>
              )}
            </div>

            {/* Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-neutral-800/30 rounded-xl border border-neutral-700/30">
              <div className="space-y-3">
                <Label className="text-neutral-200 flex items-center gap-2 font-medium">
                  <HiVolumeUp className="h-4 w-4" />
                  Volume
                </Label>
                <Slider
                  value={[musicSettings.volume]}
                  max={100}
                  step={1}
                  onValueChange={([value]) => updateVolume(value)}
                  disabled={!isOnline}
                />
                <span className="text-sm text-neutral-400 font-mono">
                  {musicSettings.volume}%
                </span>
              </div>

              <div className="space-y-3">
                <Label className="text-neutral-200 font-medium">
                  Notifications
                </Label>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={musicSettings.autoplay}
                    onCheckedChange={updateNotifications}
                  />
                  <span className="text-sm text-neutral-400">
                    {musicSettings.autoplay ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <p className="text-xs text-neutral-500">
                  Show notifications when tracks change
                </p>
              </div>
            </div>

            {/* Coming Soon Notice */}
            <div className="p-4 bg-violet-500/10 border border-violet-500/30 rounded-xl">
              <div className="flex items-center gap-3 text-violet-400">
                <HiMusicNote className="h-5 w-5" />
                <div>
                  <p className="font-semibold text-sm">🚀 Coming Soon</p>
                  <p className="text-xs text-violet-300">
                    Local music files, custom playlists, nature sounds, and
                    offline support
                  </p>
                </div>
              </div>
            </div>

            {/* Usage Tips */}
            <div className="p-4 bg-neutral-800/20 rounded-xl border border-neutral-700/30">
              <p className="text-xs text-neutral-400 leading-relaxed">
                💡 <strong className="text-neutral-300">Tips:</strong> This
                player streams live lofi music from{' '}
                <a
                  href="https://coderadio.freecodecamp.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-violet-400 hover:text-violet-300 underline font-medium">
                  Code Radio
                </a>
                . Perfect for hyper focus sessions! Use the volume slider to
                adjust volume. Internet connection required. Music courtesy of{' '}
                <a
                  href="https://www.freecodecamp.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-violet-400 hover:text-violet-300 underline font-medium">
                  freeCodeCamp
                </a>
                .
              </p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
