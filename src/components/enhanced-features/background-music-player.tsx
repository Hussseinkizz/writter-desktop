import { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '../ui/dialog';
import { Slider } from '../ui/slider';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { 
  HiPlay, 
  HiPause, 
  HiStop, 
  HiVolumeUp, 
  HiVolumeOff,
  HiMusicNote,
  HiRefresh
} from 'react-icons/hi';
import { toast } from 'sonner';

/**
 * Background music track interface
 */
interface MusicTrack {
  id: string;
  name: string;
  description: string;
  url: string;
  category: 'nature' | 'lofi' | 'ambient';
  duration?: string;
}

/**
 * Create default music tracks
 */
const createDefaultTracks = (): MusicTrack[] => {
  return [
    {
      id: 'rain-forest',
      name: 'Rain Forest',
      description: 'Gentle rain sounds with forest ambience',
      url: 'https://www.soundjay.com/misc/sounds/rain-01.mp3',
      category: 'nature',
      duration: '10:00'
    },
    {
      id: 'ocean-waves',
      name: 'Ocean Waves',
      description: 'Relaxing ocean waves on the shore',
      url: 'https://www.soundjay.com/misc/sounds/ocean-01.mp3',
      category: 'nature',
      duration: '8:30'
    },
    {
      id: 'lofi-beats-1',
      name: 'Chill Lofi Beats',
      description: 'Relaxing lofi hip hop for focus',
      url: 'https://www.chosic.com/wp-content/uploads/2021/05/lofi1.mp3',
      category: 'lofi',
      duration: '15:20'
    },
    {
      id: 'ambient-space',
      name: 'Ambient Space',
      description: 'Deep space ambient sounds',
      url: 'https://www.soundjay.com/misc/sounds/ambient-01.mp3',
      category: 'ambient',
      duration: '12:45'
    },
    {
      id: 'birds-chirping',
      name: 'Morning Birds',
      description: 'Peaceful bird songs in the morning',
      url: 'https://www.soundjay.com/misc/sounds/birds-01.mp3',
      category: 'nature',
      duration: '7:20'
    },
    {
      id: 'lofi-piano',
      name: 'Lofi Piano',
      description: 'Soft piano melodies with vinyl crackle',
      url: 'https://www.chosic.com/wp-content/uploads/2021/05/lofi2.mp3',
      category: 'lofi',
      duration: '9:15'
    }
  ];
};

/**
 * Music player settings interface
 */
interface PlayerSettings {
  volume: number;
  autoplay: boolean;
  loop: boolean;
  fadeInOut: boolean;
}

/**
 * Create default player settings
 */
const createDefaultSettings = (): PlayerSettings => {
  return {
    volume: 50,
    autoplay: false,
    loop: true,
    fadeInOut: true,
  };
};

/**
 * Music track item component
 */
const TrackItem = ({ 
  track, 
  isPlaying, 
  onPlay,
  onSelect,
  isSelected 
}: { 
  track: MusicTrack; 
  isPlaying: boolean;
  onPlay: () => void;
  onSelect: () => void;
  isSelected: boolean;
}) => {
  return (
    <div 
      className={`p-3 rounded-lg cursor-pointer transition-all ${
        isSelected 
          ? 'bg-violet-600/20 border border-violet-500' 
          : 'bg-neutral-800/50 hover:bg-neutral-800'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-neutral-200">{track.name}</h4>
            <span className={`text-xs px-2 py-1 rounded-full ${
              track.category === 'nature' ? 'bg-green-600/20 text-green-400' :
              track.category === 'lofi' ? 'bg-purple-600/20 text-purple-400' :
              'bg-blue-600/20 text-blue-400'
            }`}>
              {track.category}
            </span>
            {track.duration && (
              <span className="text-xs text-neutral-500">{track.duration}</span>
            )}
          </div>
          <p className="text-sm text-neutral-400">{track.description}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onPlay();
          }}
          className="ml-2"
        >
          {isPlaying ? <HiPause className="h-4 w-4" /> : <HiPlay className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};

/**
 * Background music player component props
 */
interface BackgroundMusicPlayerProps {
  isPlaying: boolean;
  onPlayStateChange: (playing: boolean) => void;
}

/**
 * Background music player dialog component
 */
export const BackgroundMusicPlayer = ({ 
  isPlaying, 
  onPlayStateChange 
}: BackgroundMusicPlayerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tracks] = useState<MusicTrack[]>(createDefaultTracks());
  const [selectedTrack, setSelectedTrack] = useState<MusicTrack | null>(null);
  const [settings, setSettings] = useState<PlayerSettings>(createDefaultSettings());
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.loop = settings.loop;
      audioRef.current.volume = settings.volume / 100;
      
      // Event listeners
      audioRef.current.addEventListener('loadstart', () => setIsLoading(true));
      audioRef.current.addEventListener('canplay', () => setIsLoading(false));
      audioRef.current.addEventListener('timeupdate', () => {
        if (audioRef.current) {
          setCurrentTime(audioRef.current.currentTime);
        }
      });
      audioRef.current.addEventListener('loadedmetadata', () => {
        if (audioRef.current) {
          setDuration(audioRef.current.duration);
        }
      });
      audioRef.current.addEventListener('ended', () => {
        if (!settings.loop) {
          onPlayStateChange(false);
        }
      });
      audioRef.current.addEventListener('error', () => {
        toast.error('Failed to load audio track');
        setIsLoading(false);
        onPlayStateChange(false);
      });
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Update audio settings
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = settings.volume / 100;
      audioRef.current.loop = settings.loop;
    }
  }, [settings]);

  // Play/pause control
  const togglePlayPause = () => {
    if (!selectedTrack) {
      toast.error('Please select a track first');
      return;
    }

    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      onPlayStateChange(false);
    } else {
      if (audioRef.current.src !== selectedTrack.url) {
        audioRef.current.src = selectedTrack.url;
      }
      audioRef.current.play().then(() => {
        onPlayStateChange(true);
        toast.success(`Playing: ${selectedTrack.name}`);
      }).catch(() => {
        toast.error('Failed to play audio');
        onPlayStateChange(false);
      });
    }
  };

  const stopMusic = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      onPlayStateChange(false);
      setCurrentTime(0);
    }
  };

  const selectTrack = (track: MusicTrack) => {
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      onPlayStateChange(false);
    }
    setSelectedTrack(track);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const categoryTracks = (category: string) => 
    tracks.filter(track => track.category === category);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`rounded-full transition ${
            isPlaying ? 'text-green-500' : 'text-neutral-400'
          } hover:bg-zinc-800`}
          title="Background Music"
          aria-label="Open background music player"
        >
          <HiMusicNote className="text-xl" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-neutral-900 border-neutral-700">
        <DialogHeader>
          <DialogTitle className="text-neutral-200 text-xl font-semibold flex items-center gap-2">
            <HiMusicNote className="text-violet-400" />
            Background Music Player
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Current Track & Controls */}
          <div className="p-4 bg-neutral-800/50 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-neutral-200">
                  {selectedTrack ? selectedTrack.name : 'No track selected'}
                </h3>
                {selectedTrack && (
                  <p className="text-sm text-neutral-400">{selectedTrack.description}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={stopMusic}
                  disabled={!isPlaying}
                >
                  <HiStop className="h-4 w-4" />
                </Button>
                <Button
                  onClick={togglePlayPause}
                  disabled={!selectedTrack || isLoading}
                  className="bg-violet-600 hover:bg-violet-700"
                >
                  {isLoading ? (
                    <HiRefresh className="h-4 w-4 animate-spin" />
                  ) : isPlaying ? (
                    <HiPause className="h-4 w-4" />
                  ) : (
                    <HiPlay className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            {/* Progress Bar */}
            {selectedTrack && duration > 0 && (
              <div className="space-y-2">
                <Slider
                  value={[currentTime]}
                  max={duration}
                  step={1}
                  className="w-full"
                  onValueChange={([value]) => {
                    if (audioRef.current) {
                      audioRef.current.currentTime = value;
                      setCurrentTime(value);
                    }
                  }}
                />
                <div className="flex justify-between text-xs text-neutral-400">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Settings */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-neutral-800/30 rounded-lg">
            <div className="space-y-2">
              <Label className="text-neutral-200 flex items-center gap-2">
                <HiVolumeUp className="h-4 w-4" />
                Volume
              </Label>
              <Slider
                value={[settings.volume]}
                max={100}
                step={1}
                onValueChange={([value]) => setSettings(prev => ({ ...prev, volume: value }))}
              />
              <span className="text-xs text-neutral-400">{settings.volume}%</span>
            </div>
            
            <div className="space-y-2">
              <Label className="text-neutral-200">Auto-play</Label>
              <Switch
                checked={settings.autoplay}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoplay: checked }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-neutral-200">Loop</Label>
              <Switch
                checked={settings.loop}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, loop: checked }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-neutral-200">Fade In/Out</Label>
              <Switch
                checked={settings.fadeInOut}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, fadeInOut: checked }))}
              />
            </div>
          </div>

          {/* Track Categories */}
          <div className="space-y-4">
            {/* Nature Sounds */}
            <div>
              <h3 className="text-lg font-semibold text-neutral-200 mb-3 flex items-center gap-2">
                🌿 Nature Sounds
                <span className="text-sm text-neutral-400">({categoryTracks('nature').length})</span>
              </h3>
              <div className="space-y-2">
                {categoryTracks('nature').map((track) => (
                  <TrackItem
                    key={track.id}
                    track={track}
                    isPlaying={isPlaying && selectedTrack?.id === track.id}
                    onPlay={togglePlayPause}
                    onSelect={() => selectTrack(track)}
                    isSelected={selectedTrack?.id === track.id}
                  />
                ))}
              </div>
            </div>

            {/* Lofi Music */}
            <div>
              <h3 className="text-lg font-semibold text-neutral-200 mb-3 flex items-center gap-2">
                🎵 Lofi Music
                <span className="text-sm text-neutral-400">({categoryTracks('lofi').length})</span>
              </h3>
              <div className="space-y-2">
                {categoryTracks('lofi').map((track) => (
                  <TrackItem
                    key={track.id}
                    track={track}
                    isPlaying={isPlaying && selectedTrack?.id === track.id}
                    onPlay={togglePlayPause}
                    onSelect={() => selectTrack(track)}
                    isSelected={selectedTrack?.id === track.id}
                  />
                ))}
              </div>
            </div>

            {/* Ambient */}
            <div>
              <h3 className="text-lg font-semibold text-neutral-200 mb-3 flex items-center gap-2">
                🌌 Ambient
                <span className="text-sm text-neutral-400">({categoryTracks('ambient').length})</span>
              </h3>
              <div className="space-y-2">
                {categoryTracks('ambient').map((track) => (
                  <TrackItem
                    key={track.id}
                    track={track}
                    isPlaying={isPlaying && selectedTrack?.id === track.id}
                    onPlay={togglePlayPause}
                    onSelect={() => selectTrack(track)}
                    isSelected={selectedTrack?.id === track.id}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};