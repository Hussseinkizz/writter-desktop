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
import { Input } from '../ui/input';
import { 
  HiPlay, 
  HiPause, 
  HiStop, 
  HiVolumeUp, 
  HiVolumeOff,
  HiMusicNote,
  HiRefresh,
  HiPlus,
  HiTrash,
  HiFolder
} from 'react-icons/hi';
import { toast } from 'sonner';
import { useSettings } from '../../hooks/use-settings';
import { MusicTrack, MusicPlayerSettings, validateUrl, validateFilePath } from '../../lib/validation';
import { musicTrackManager } from '../../lib/music-track-manager';

/**
 * Add custom track form component
 */
const AddCustomTrackForm = ({ onAdd, onCancel }: { 
  onAdd: (track: Partial<MusicTrack>) => void; 
  onCancel: () => void; 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    url: '',
    category: 'custom' as MusicTrack['category'],
    isLocal: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.url) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate URL or file path
    const validation = formData.isLocal 
      ? validateFilePath(formData.url)
      : validateUrl(formData.url);
    
    if (!validation.isValid) {
      toast.error(validation.error || 'Invalid URL or file path');
      return;
    }

    onAdd(formData);
    setFormData({ name: '', description: '', url: '', category: 'custom', isLocal: false });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-neutral-800/30 rounded-lg">
      <h4 className="font-semibold text-neutral-200">Add Custom Track</h4>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="track-name">Track Name *</Label>
          <Input
            id="track-name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter track name"
            required
          />
        </div>
        <div>
          <Label htmlFor="track-category">Category</Label>
          <select
            id="track-category"
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as MusicTrack['category'] }))}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="nature">Nature</option>
            <option value="lofi">Lofi</option>
            <option value="ambient">Ambient</option>
            <option value="custom">Custom</option>
          </select>
        </div>
      </div>

      <div>
        <Label htmlFor="track-description">Description *</Label>
        <Input
          id="track-description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Describe the track"
          required
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Switch
            checked={formData.isLocal}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isLocal: checked, url: '' }))}
          />
          <Label>Local file (instead of streaming URL)</Label>
        </div>
        
        <div>
          <Label htmlFor="track-url">
            {formData.isLocal ? 'File Path *' : 'Streaming URL *'}
          </Label>
          <Input
            id="track-url"
            value={formData.url}
            onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
            placeholder={formData.isLocal ? '/path/to/music/file.mp3' : 'https://example.com/music.mp3'}
            required
          />
          <p className="text-xs text-neutral-400 mt-1">
            {formData.isLocal 
              ? 'Enter the full path to your local music file'
              : 'Enter a valid HTTP or HTTPS URL'
            }
          </p>
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-violet-600 hover:bg-violet-700">
          Add Track
        </Button>
      </div>
    </form>
  );
};

/**
 * Music track item component
 */
const TrackItem = ({ 
  track, 
  isPlaying, 
  onPlay,
  onSelect,
  isSelected,
  onDelete,
  showDelete = false
}: { 
  track: MusicTrack; 
  isPlaying: boolean;
  onPlay: () => void;
  onSelect: () => void;
  isSelected: boolean;
  onDelete?: () => void;
  showDelete?: boolean;
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
              track.category === 'ambient' ? 'bg-blue-600/20 text-blue-400' :
              'bg-orange-600/20 text-orange-400'
            }`}>
              {track.category}
            </span>
            {track.isLocal && (
              <span className="text-xs px-2 py-1 rounded-full bg-gray-600/20 text-gray-400">
                <HiFolder className="inline h-3 w-3 mr-1" />
                Local
              </span>
            )}
            {track.duration && (
              <span className="text-xs text-neutral-500">{track.duration}</span>
            )}
          </div>
          <p className="text-sm text-neutral-400">{track.description}</p>
          <p className="text-xs text-neutral-500 mt-1 break-all">{track.url}</p>
        </div>
        <div className="flex items-center gap-2 ml-2">
          {showDelete && onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="text-red-400 hover:text-red-300"
            >
              <HiTrash className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onPlay();
            }}
          >
            {isPlaying ? <HiPause className="h-4 w-4" /> : <HiPlay className="h-4 w-4" />}
          </Button>
        </div>
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
  const [selectedTrack, setSelectedTrack] = useState<MusicTrack | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const { settings, updateSetting } = useSettings();
  const musicSettings = settings.musicPlayer;
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load custom tracks on mount
  useEffect(() => {
    if (musicSettings.customTracks.length > 0) {
      const result = musicTrackManager.setCustomTracks(musicSettings.customTracks);
      if (!result.success) {
        console.warn('Failed to load custom tracks:', result.error);
      }
    }
  }, []);

  // Get all available tracks
  const allTracks = musicTrackManager.getAllTracks();

  // Update music settings
  const updateMusicSettings = (updates: Partial<MusicPlayerSettings>) => {
    updateSetting('musicPlayer', { ...musicSettings, ...updates });
  };

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.loop = musicSettings.loop;
      audioRef.current.volume = musicSettings.volume / 100;
      
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
        if (!musicSettings.loop) {
          onPlayStateChange(false);
        }
      });
      audioRef.current.addEventListener('error', (e) => {
        console.error('Audio error:', e);
        toast.error('Failed to load audio track - please check the URL or file path');
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
      audioRef.current.volume = musicSettings.volume / 100;
      audioRef.current.loop = musicSettings.loop;
    }
  }, [musicSettings]);

  // Play/pause control with validation
  const togglePlayPause = async () => {
    if (!selectedTrack) {
      toast.error('Please select a track first');
      return;
    }

    if (!audioRef.current) return;

    // Validate track access before playing
    const accessCheck = await musicTrackManager.validateTrackAccess(selectedTrack);
    if (!accessCheck.accessible) {
      toast.error(`Cannot access track: ${accessCheck.error}`);
      return;
    }

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
      }).catch((error) => {
        console.error('Playback error:', error);
        toast.error('Failed to play audio - check if the file exists or URL is accessible');
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

  // Add custom track handler
  const handleAddCustomTrack = (trackData: Partial<MusicTrack>) => {
    const result = musicTrackManager.addCustomTrack(trackData);
    if (result.success && result.track) {
      // Update settings with new custom tracks
      const newCustomTracks = musicTrackManager.getCustomTracks();
      updateMusicSettings({ customTracks: newCustomTracks });
      setShowAddForm(false);
    } else {
      toast.error(result.error || 'Failed to add track');
    }
  };

  // Delete custom track handler  
  const handleDeleteCustomTrack = (trackId: string) => {
    if (musicTrackManager.removeCustomTrack(trackId)) {
      const newCustomTracks = musicTrackManager.getCustomTracks();
      updateMusicSettings({ customTracks: newCustomTracks });
      
      // If deleted track was selected, clear selection
      if (selectedTrack?.id === trackId) {
        if (isPlaying) {
          stopMusic();
        }
        setSelectedTrack(null);
      }
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const categoryTracks = (category: string) => 
    allTracks.filter(track => track.category === category);

  const customTracks = musicTrackManager.getCustomTracks();

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
                value={[musicSettings.volume]}
                max={100}
                step={1}
                onValueChange={([value]) => updateMusicSettings({ volume: value })}
              />
              <span className="text-xs text-neutral-400">{musicSettings.volume}%</span>
            </div>
            
            <div className="space-y-2">
              <Label className="text-neutral-200">Auto-play</Label>
              <Switch
                checked={musicSettings.autoplay}
                onCheckedChange={(checked) => updateMusicSettings({ autoplay: checked })}
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-neutral-200">Loop</Label>
              <Switch
                checked={musicSettings.loop}
                onCheckedChange={(checked) => updateMusicSettings({ loop: checked })}
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-neutral-200">Fade In/Out</Label>
              <Switch
                checked={musicSettings.fadeInOut}
                onCheckedChange={(checked) => updateMusicSettings({ fadeInOut: checked })}
              />
            </div>
          </div>

          {/* Music Source Configuration */}
          <div className="p-4 bg-neutral-800/30 rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-neutral-200">Music Sources</h3>
              <Button
                onClick={() => setShowAddForm(!showAddForm)}
                size="sm"
                className="bg-violet-600 hover:bg-violet-700"
              >
                <HiPlus className="h-4 w-4 mr-2" />
                Add Custom Track
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-2">
                <Label className="text-neutral-200">Music Source</Label>
                <select
                  value={musicSettings.musicSource}
                  onChange={(e) => updateMusicSettings({ 
                    musicSource: e.target.value as 'streaming' | 'local' | 'both' 
                  })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="streaming">Streaming Only</option>
                  <option value="local">Local Files Only</option>
                  <option value="both">Both</option>
                </select>
              </div>
              
              {(musicSettings.musicSource === 'local' || musicSettings.musicSource === 'both') && (
                <div className="col-span-2 space-y-2">
                  <Label className="text-neutral-200">Local Music Directory</Label>
                  <Input
                    value={musicSettings.localMusicDirectory || ''}
                    onChange={(e) => updateMusicSettings({ localMusicDirectory: e.target.value })}
                    placeholder="/path/to/your/music/folder"
                  />
                </div>
              )}
            </div>

            {showAddForm && (
              <AddCustomTrackForm
                onAdd={handleAddCustomTrack}
                onCancel={() => setShowAddForm(false)}
              />
            )}
          </div>

          {/* Track Categories */}
          <div className="space-y-4">
            {/* Custom Tracks */}
            {customTracks.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-neutral-200 mb-3 flex items-center gap-2">
                  🎵 Custom Tracks
                  <span className="text-sm text-neutral-400">({customTracks.length})</span>
                </h3>
                <div className="space-y-2">
                  {customTracks.map((track) => (
                    <TrackItem
                      key={track.id}
                      track={track}
                      isPlaying={isPlaying && selectedTrack?.id === track.id}
                      onPlay={togglePlayPause}
                      onSelect={() => selectTrack(track)}
                      isSelected={selectedTrack?.id === track.id}
                      onDelete={() => handleDeleteCustomTrack(track.id)}
                      showDelete={true}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Nature Sounds */}
            {(musicSettings.musicSource === 'streaming' || musicSettings.musicSource === 'both') && categoryTracks('nature').length > 0 && (
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
            )}

            {/* Lofi Music */}
            {(musicSettings.musicSource === 'streaming' || musicSettings.musicSource === 'both') && categoryTracks('lofi').length > 0 && (
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
            )}

            {/* Ambient */}
            {(musicSettings.musicSource === 'streaming' || musicSettings.musicSource === 'both') && categoryTracks('ambient').length > 0 && (
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
            )}

            {/* No tracks message */}
            {allTracks.length === 0 && (
              <div className="text-center py-8 text-neutral-400">
                <HiMusicNote className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No music tracks available</p>
                <p className="text-sm">Add custom tracks to get started</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};