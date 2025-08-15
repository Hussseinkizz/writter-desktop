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
import { Input } from '../ui/input';
import {
  HiPlay,
  HiPause,
  HiStop,
  HiVolumeUp,
  HiMusicNote,
  HiRefresh,
  HiPlus,
  HiTrash,
  HiFolder,
} from 'react-icons/hi';
import { toast } from 'sonner';
import { useSettings } from '../../hooks/use-settings';
import {
  MusicTrack,
  MusicPlayerSettings,
  validateUrl,
  validateFilePath,
} from '../../lib/validation';
import { musicTrackManager } from '../../lib/music-track-manager';

/**
 * Add custom track form component
 */
const AddCustomTrackForm = ({
  onAdd,
  onCancel,
}: {
  onAdd: (track: Partial<MusicTrack>) => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    url: '',
    category: 'custom' as MusicTrack['category'],
    isLocal: false,
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
    setFormData({
      name: '',
      description: '',
      url: '',
      category: 'custom',
      isLocal: false,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 p-6 bg-neutral-800/30 rounded-xl border border-neutral-700/50">
      <h4 className="text-lg font-semibold text-neutral-200 flex items-center gap-2">
        <HiPlus className="h-5 w-5 text-violet-400" />
        Add Custom Track
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="track-name" className="text-neutral-300 font-medium">Track Name *</Label>
          <Input
            id="track-name"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="Enter track name"
            required
            className="bg-neutral-800 border-neutral-700 text-neutral-200 h-11"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="track-category" className="text-neutral-300 font-medium">Category</Label>
          <select
            id="track-category"
            value={formData.category}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                category: e.target.value as MusicTrack['category'],
              }))
            }
            className="flex h-11 w-full rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-200">
            <option value="nature">🌿 Nature</option>
            <option value="lofi">🎵 Lofi</option>
            <option value="ambient">🌌 Ambient</option>
            <option value="custom">🎶 Custom</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="track-description" className="text-neutral-300 font-medium">Description *</Label>
        <Input
          id="track-description"
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          placeholder="Describe the track"
          required
          className="bg-neutral-800 border-neutral-700 text-neutral-200 h-11"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-3 p-3 bg-neutral-800/50 rounded-lg">
          <Switch
            checked={formData.isLocal}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({ ...prev, isLocal: checked, url: '' }))
            }
          />
          <Label className="text-neutral-300 font-medium cursor-pointer">
            {formData.isLocal ? '📁 Local file' : '🌐 Streaming URL'}
          </Label>
        </div>

        <div className="space-y-2">
          <Label htmlFor="track-url" className="text-neutral-300 font-medium">
            {formData.isLocal ? 'File Path *' : 'Streaming URL *'}
          </Label>
          <Input
            id="track-url"
            value={formData.url}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, url: e.target.value }))
            }
            placeholder={
              formData.isLocal
                ? '/path/to/music/file.mp3'
                : 'https://example.com/music.mp3'
            }
            required
            className="bg-neutral-800 border-neutral-700 text-neutral-200 h-11"
          />
          <p className="text-xs text-neutral-400 mt-2 px-1">
            {formData.isLocal
              ? '💡 Enter the full path to your local music file'
              : '💡 Enter a valid HTTP or HTTPS URL'}
          </p>
        </div>
      </div>

      <div className="flex gap-3 justify-end pt-2">
        <Button type="button" variant="outline" onClick={onCancel} className="h-11 px-6">
          Cancel
        </Button>
        <Button type="submit" className="bg-violet-600 hover:bg-violet-700 h-11 px-6">
          <HiPlus className="h-4 w-4 mr-2" />
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
  showDelete = false,
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
      className={`group relative p-4 rounded-xl cursor-pointer transition-all duration-200 border ${
        isSelected
          ? 'bg-violet-600/20 border-violet-500/60 shadow-lg shadow-violet-500/10'
          : 'bg-gradient-to-r from-neutral-800/60 to-neutral-800/40 hover:from-neutral-800/80 hover:to-neutral-800/60 border-neutral-700/50 hover:border-neutral-600/50'
      }`}
      onClick={onSelect}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h4 className="font-semibold text-neutral-200 text-sm">{track.name}</h4>
            <span
              className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${
                track.category === 'nature'
                  ? 'bg-green-500/20 text-green-300 border border-green-500/40'
                  : track.category === 'lofi'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                  : track.category === 'ambient'
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                  : 'bg-orange-500/20 text-orange-300 border border-orange-500/40'
              }`}>
              {track.category === 'nature' ? '🌿' : track.category === 'lofi' ? '🎵' : track.category === 'ambient' ? '🌌' : '🎶'} {track.category}
            </span>
            {track.isLocal && (
              <span className="text-xs px-2 py-1 rounded-full bg-gray-500/20 text-gray-300 border border-gray-500/40 flex items-center gap-1 flex-shrink-0">
                <HiFolder className="h-3 w-3" />
                Local
              </span>
            )}
            {track.duration && (
              <span className="text-xs text-neutral-400 flex-shrink-0">{track.duration}</span>
            )}
          </div>
          <p className="text-sm text-neutral-400 mb-2 leading-relaxed">{track.description}</p>
          <p className="text-xs text-neutral-500 break-all font-mono bg-neutral-800/50 px-2 py-1 rounded">{track.url}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {showDelete && onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-9 w-9 opacity-0 group-hover:opacity-100 transition-opacity">
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
            className={`h-9 w-9 ${isPlaying ? 'text-green-400 bg-green-500/10' : 'text-neutral-300 hover:text-violet-300 hover:bg-violet-500/10'} transition-all`}>
            {isPlaying ? (
              <HiPause className="h-4 w-4" />
            ) : (
              <HiPlay className="h-4 w-4" />
            )}
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
  onPlayStateChange,
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
      const result = musicTrackManager.setCustomTracks(
        musicSettings.customTracks
      );
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
        toast.error(
          'Failed to load audio track - please check the URL or file path'
        );
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
    const accessCheck = await musicTrackManager.validateTrackAccess(
      selectedTrack
    );
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
      audioRef.current
        .play()
        .then(() => {
          onPlayStateChange(true);
          toast.success(`Playing: ${selectedTrack.name}`);
        })
        .catch((error) => {
          console.error('Playback error:', error);
          toast.error(
            'Failed to play audio - check if the file exists or URL is accessible'
          );
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
    allTracks.filter((track) => track.category === category);

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
          aria-label="Open background music player">
          <HiMusicNote className="text-xl" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[90vh] bg-neutral-900 border-neutral-700">
        <DialogHeader>
          <DialogTitle className="text-neutral-200 text-xl font-semibold flex items-center gap-2">
            <HiMusicNote className="text-violet-400" />
            Background Music Player
          </DialogTitle>
        </DialogHeader>

        <div className="max-h-[75vh] overflow-y-auto px-1">
          <div className="space-y-6">
          {/* Current Track & Controls */}
          <div className="p-6 bg-gradient-to-r from-neutral-800/60 to-neutral-800/40 rounded-xl border border-neutral-700/50 mx-1">
            <div className="flex items-center justify-between mb-6">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-neutral-200 mb-1">
                  {selectedTrack ? selectedTrack.name : 'No track selected'}
                </h3>
                {selectedTrack && (
                  <p className="text-sm text-neutral-400">
                    {selectedTrack.description}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={stopMusic}
                  disabled={!isPlaying}
                  className="h-11 px-4">
                  <HiStop className="h-4 w-4 mr-2" />
                  Stop
                </Button>
                <Button
                  onClick={togglePlayPause}
                  disabled={!selectedTrack || isLoading}
                  className="bg-violet-600 hover:bg-violet-700 h-11 px-6">
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

            {/* Progress Bar */}
            {selectedTrack && duration > 0 && (
              <div className="space-y-3">
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
                <div className="flex justify-between text-sm text-neutral-400">
                  <span className="font-mono">{formatTime(currentTime)}</span>
                  <span className="font-mono">{formatTime(duration)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Settings */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 bg-neutral-800/30 rounded-xl border border-neutral-700/30 mx-1">
            <div className="space-y-3">
              <Label className="text-neutral-200 flex items-center gap-2 font-medium">
                <HiVolumeUp className="h-4 w-4" />
                Volume
              </Label>
              <Slider
                value={[musicSettings.volume]}
                max={100}
                step={1}
                onValueChange={([value]) =>
                  updateMusicSettings({ volume: value })
                }
              />
              <span className="text-sm text-neutral-400 font-mono">
                {musicSettings.volume}%
              </span>
            </div>

            <div className="space-y-3">
              <Label className="text-neutral-200 font-medium">Auto-play</Label>
              <div className="flex items-center gap-2">
                <Switch
                  checked={musicSettings.autoplay}
                  onCheckedChange={(checked) =>
                    updateMusicSettings({ autoplay: checked })
                  }
                />
                <span className="text-sm text-neutral-400">
                  {musicSettings.autoplay ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-neutral-200 font-medium">Loop</Label>
              <div className="flex items-center gap-2">
                <Switch
                  checked={musicSettings.loop}
                  onCheckedChange={(checked) =>
                    updateMusicSettings({ loop: checked })
                  }
                />
                <span className="text-sm text-neutral-400">
                  {musicSettings.loop ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-neutral-200 font-medium">Fade In/Out</Label>
              <div className="flex items-center gap-2">
                <Switch
                  checked={musicSettings.fadeInOut}
                  onCheckedChange={(checked) =>
                    updateMusicSettings({ fadeInOut: checked })
                  }
                />
                <span className="text-sm text-neutral-400">
                  {musicSettings.fadeInOut ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>
          </div>

          {/* Music Source Configuration */}
          <div className="p-6 bg-neutral-800/30 rounded-xl border border-neutral-700/30 space-y-6 mx-1">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-neutral-200 flex items-center gap-2">
                🎵 Music Sources
              </h3>
              <Button
                onClick={() => setShowAddForm(!showAddForm)}
                size="sm"
                className="bg-violet-600 hover:bg-violet-700 h-10 px-4">
                <HiPlus className="h-4 w-4 mr-2" />
                Add Custom Track
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label className="text-neutral-200 font-medium">Music Source</Label>
                <select
                  value={musicSettings.musicSource}
                  onChange={(e) =>
                    updateMusicSettings({
                      musicSource: e.target.value as
                        | 'streaming'
                        | 'local'
                        | 'both',
                    })
                  }
                  className="flex h-11 w-full rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-200">
                  <option value="streaming">🌐 Streaming Only</option>
                  <option value="local">📁 Local Files Only</option>
                  <option value="both">🔄 Both</option>
                </select>
              </div>

              {(musicSettings.musicSource === 'local' ||
                musicSettings.musicSource === 'both') && (
                <div className="md:col-span-2 space-y-2">
                  <Label className="text-neutral-200 font-medium">
                    Local Music Directory
                  </Label>
                  <Input
                    value={musicSettings.localMusicDirectory || ''}
                    onChange={(e) =>
                      updateMusicSettings({
                        localMusicDirectory: e.target.value,
                      })
                    }
                    placeholder="/path/to/your/music/folder"
                    className="bg-neutral-800 border-neutral-700 text-neutral-200 h-11"
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
          <div className="space-y-6 mx-1">
            {/* Custom Tracks */}
            {customTracks.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-neutral-200 mb-4 flex items-center gap-2">
                  🎵 Custom Tracks
                  <span className="text-sm text-neutral-400 bg-neutral-800/50 px-2 py-1 rounded-full">
                    {customTracks.length}
                  </span>
                </h3>
                <div className="space-y-3">
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
            {(musicSettings.musicSource === 'streaming' ||
              musicSettings.musicSource === 'both') &&
              categoryTracks('nature').length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-neutral-200 mb-4 flex items-center gap-2">
                    🌿 Nature Sounds
                    <span className="text-sm text-neutral-400 bg-neutral-800/50 px-2 py-1 rounded-full">
                      {categoryTracks('nature').length}
                    </span>
                  </h3>
                  <div className="space-y-3">
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
            {(musicSettings.musicSource === 'streaming' ||
              musicSettings.musicSource === 'both') &&
              categoryTracks('lofi').length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-neutral-200 mb-4 flex items-center gap-2">
                    🎵 Lofi Music
                    <span className="text-sm text-neutral-400 bg-neutral-800/50 px-2 py-1 rounded-full">
                      {categoryTracks('lofi').length}
                    </span>
                  </h3>
                  <div className="space-y-3">
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
            {(musicSettings.musicSource === 'streaming' ||
              musicSettings.musicSource === 'both') &&
              categoryTracks('ambient').length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-neutral-200 mb-4 flex items-center gap-2">
                    🌌 Ambient
                    <span className="text-sm text-neutral-400 bg-neutral-800/50 px-2 py-1 rounded-full">
                      {categoryTracks('ambient').length}
                    </span>
                  </h3>
                  <div className="space-y-3">
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
              <div className="text-center py-12 text-neutral-400">
                <HiMusicNote className="h-16 w-16 mx-auto mb-6 opacity-50" />
                <p className="text-lg font-medium mb-2">No music tracks available</p>
                <p className="text-sm">Add custom tracks to get started</p>
              </div>
            )}
          </div>
        </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
