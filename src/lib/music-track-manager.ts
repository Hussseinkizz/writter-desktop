import { MusicTrack, validateMusicTrack, validateUrl, validateFilePath } from '../lib/validation';
import { toast } from 'sonner';

/**
 * Default streaming music tracks (fallback when no custom tracks configured)
 */
const createDefaultStreamingTracks = (): MusicTrack[] => [
  {
    id: 'rain-forest',
    name: 'Rain Forest',
    description: 'Gentle rain sounds with forest ambience',
    url: 'https://www.soundjay.com/misc/sounds/rain-01.mp3',
    category: 'nature',
    duration: '10:00',
    isLocal: false
  },
  {
    id: 'ocean-waves',
    name: 'Ocean Waves',
    description: 'Relaxing ocean waves on the shore',
    url: 'https://www.soundjay.com/misc/sounds/ocean-01.mp3',
    category: 'nature',
    duration: '8:30',
    isLocal: false
  },
  {
    id: 'lofi-beats-1',
    name: 'Chill Lofi Beats',
    description: 'Relaxing lofi hip hop for focus',
    url: 'https://www.chosic.com/wp-content/uploads/2021/05/lofi1.mp3',
    category: 'lofi',
    duration: '15:20',
    isLocal: false
  },
  {
    id: 'ambient-space',
    name: 'Ambient Space',
    description: 'Deep space ambient sounds',
    url: 'https://www.soundjay.com/misc/sounds/ambient-01.mp3',
    category: 'ambient',
    duration: '12:45',
    isLocal: false
  },
  {
    id: 'birds-chirping',
    name: 'Morning Birds',
    description: 'Peaceful bird songs in the morning',
    url: 'https://www.soundjay.com/misc/sounds/birds-01.mp3',
    category: 'nature',
    duration: '7:20',
    isLocal: false
  },
  {
    id: 'lofi-piano',
    name: 'Lofi Piano',
    description: 'Soft piano melodies with vinyl crackle',
    url: 'https://www.chosic.com/wp-content/uploads/2021/05/lofi2.mp3',
    category: 'lofi',
    duration: '9:15',
    isLocal: false
  }
];

/**
 * Music track manager factory function
 */
export function createMusicTrackManager() {
  let tracks: MusicTrack[] = createDefaultStreamingTracks();
  let customTracks: MusicTrack[] = [];

  /**
   * Add a custom music track with validation
   */
  const addCustomTrack = (trackData: Partial<MusicTrack>): { success: boolean; error?: string; track?: MusicTrack } => {
    try {
      // Generate ID if not provided
      const id = trackData.id || `custom-${Date.now()}`;
      const trackToValidate = {
        ...trackData,
        id,
        category: trackData.category || 'custom',
        isLocal: trackData.isLocal ?? true
      };

      const validation = validateMusicTrack(trackToValidate);
      if (!validation.isValid) {
        return { success: false, error: validation.error };
      }

      const newTrack = validation.data!;
      
      // Validate URL/file path specifically
      if (newTrack.isLocal) {
        const pathValidation = validateFilePath(newTrack.url);
        if (!pathValidation.isValid) {
          return { success: false, error: `Invalid file path: ${pathValidation.error}` };
        }
      } else {
        const urlValidation = validateUrl(newTrack.url);
        if (!urlValidation.isValid) {
          return { success: false, error: `Invalid URL: ${urlValidation.error}` };
        }
      }

      // Check for duplicate IDs
      if (customTracks.some(track => track.id === newTrack.id)) {
        return { success: false, error: 'Track with this ID already exists' };
      }

      customTracks.push(newTrack);
      toast.success(`Added custom track: ${newTrack.name}`);
      return { success: true, track: newTrack };
    } catch (error) {
      return { success: false, error: 'Failed to add track' };
    }
  };

  /**
   * Remove a custom track
   */
  const removeCustomTrack = (trackId: string): boolean => {
    const initialLength = customTracks.length;
    customTracks = customTracks.filter(track => track.id !== trackId);
    
    if (customTracks.length < initialLength) {
      toast.success('Custom track removed');
      return true;
    }
    return false;
  };

  /**
   * Update an existing custom track
   */
  const updateCustomTrack = (trackId: string, updates: Partial<MusicTrack>): { success: boolean; error?: string } => {
    const trackIndex = customTracks.findIndex(track => track.id === trackId);
    if (trackIndex === -1) {
      return { success: false, error: 'Track not found' };
    }

    const updatedTrack = { ...customTracks[trackIndex], ...updates };
    const validation = validateMusicTrack(updatedTrack);
    
    if (!validation.isValid) {
      return { success: false, error: validation.error };
    }

    customTracks[trackIndex] = validation.data!;
    toast.success(`Updated track: ${validation.data!.name}`);
    return { success: true };
  };

  /**
   * Get all available tracks (default + custom)
   */
  const getAllTracks = (): MusicTrack[] => {
    return [...tracks, ...customTracks];
  };

  /**
   * Get tracks by category
   */
  const getTracksByCategory = (category: MusicTrack['category']): MusicTrack[] => {
    return getAllTracks().filter(track => track.category === category);
  };

  /**
   * Get custom tracks only
   */
  const getCustomTracks = (): MusicTrack[] => {
    return [...customTracks];
  };

  /**
   * Set custom tracks (bulk operation)
   */
  const setCustomTracks = (newTracks: MusicTrack[]): { success: boolean; error?: string } => {
    try {
      // Validate all tracks
      for (const track of newTracks) {
        const validation = validateMusicTrack(track);
        if (!validation.isValid) {
          return { success: false, error: `Invalid track ${track.id}: ${validation.error}` };
        }
      }

      customTracks = [...newTracks];
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to set custom tracks' };
    }
  };

  /**
   * Clear all custom tracks
   */
  const clearCustomTracks = (): void => {
    customTracks = [];
    toast.success('All custom tracks cleared');
  };

  /**
   * Get track by ID
   */
  const getTrackById = (trackId: string): MusicTrack | undefined => {
    return getAllTracks().find(track => track.id === trackId);
  };

  /**
   * Validate track URL/path accessibility
   */
  const validateTrackAccess = async (track: MusicTrack): Promise<{ accessible: boolean; error?: string }> => {
    try {
      if (track.isLocal) {
        // For local files, we'd need to use Tauri's fs API to check if file exists
        // For now, just validate the path format
        const pathValidation = validateFilePath(track.url);
        return { accessible: pathValidation.isValid, error: pathValidation.error };
      } else {
        // For streaming URLs, validate format
        const urlValidation = validateUrl(track.url);
        return { accessible: urlValidation.isValid, error: urlValidation.error };
      }
    } catch (error) {
      return { accessible: false, error: 'Failed to validate track access' };
    }
  };

  /**
   * Reset to default tracks
   */
  const resetToDefaults = (): void => {
    tracks = createDefaultStreamingTracks();
    customTracks = [];
    toast.success('Reset to default tracks');
  };

  return {
    addCustomTrack,
    removeCustomTrack,
    updateCustomTrack,
    getAllTracks,
    getTracksByCategory,
    getCustomTracks,
    setCustomTracks,
    clearCustomTracks,
    getTrackById,
    validateTrackAccess,
    resetToDefaults
  };
}

/**
 * Singleton instance for global use
 */
export const musicTrackManager = createMusicTrackManager();