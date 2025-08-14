import { describe, it, expect, beforeEach } from 'vitest';
import { createMusicTrackManager } from '../lib/music-track-manager';
import { MusicTrack } from '../lib/validation';

describe('Music Track Manager', () => {
  let manager: ReturnType<typeof createMusicTrackManager>;

  beforeEach(() => {
    manager = createMusicTrackManager();
  });

  describe('Default tracks', () => {
    it('should initialize with default tracks', () => {
      const tracks = manager.getAllTracks();
      expect(tracks.length).toBeGreaterThan(0);
      expect(tracks.every(track => track.isLocal === false)).toBe(true);
    });

    it('should have tracks in different categories', () => {
      const natureTracks = manager.getTracksByCategory('nature');
      const lofiTracks = manager.getTracksByCategory('lofi');
      const ambientTracks = manager.getTracksByCategory('ambient');
      
      expect(natureTracks.length).toBeGreaterThan(0);
      expect(lofiTracks.length).toBeGreaterThan(0);
      expect(ambientTracks.length).toBeGreaterThan(0);
    });
  });

  describe('Adding custom tracks', () => {
    it('should add a valid streaming track', () => {
      const trackData = {
        name: 'Custom Stream',
        description: 'A custom streaming track',
        url: 'https://example.com/custom.mp3',
        category: 'custom' as const,
        isLocal: false
      };

      const result = manager.addCustomTrack(trackData);
      expect(result.success).toBe(true);
      expect(result.track).toBeDefined();
      expect(result.track?.name).toBe('Custom Stream');
    });

    it('should add a valid local file track', () => {
      const trackData = {
        name: 'Local Track',
        description: 'A local music file',
        url: '/music/local.mp3',
        category: 'custom' as const,
        isLocal: true
      };

      const result = manager.addCustomTrack(trackData);
      expect(result.success).toBe(true);
      expect(result.track?.isLocal).toBe(true);
    });

    it('should generate ID if not provided', () => {
      const trackData = {
        name: 'No ID Track',
        description: 'Track without ID',
        url: 'https://example.com/music.mp3',
        category: 'nature' as const
      };

      const result = manager.addCustomTrack(trackData);
      expect(result.success).toBe(true);
      expect(result.track?.id).toBeDefined();
      expect(result.track?.id.startsWith('custom-')).toBe(true);
    });

    it('should reject track with invalid URL', () => {
      const trackData = {
        name: 'Invalid URL',
        description: 'Track with bad URL',
        url: 'not-a-url',
        category: 'custom' as const,
        isLocal: false
      };

      const result = manager.addCustomTrack(trackData);
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid URL');
    });

    it('should reject track with invalid file path for local files', () => {
      const trackData = {
        name: 'Invalid Path',
        description: 'Track with bad path',
        url: '', // empty path
        category: 'custom' as const,
        isLocal: true
      };

      const result = manager.addCustomTrack(trackData);
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined(); // Schema validation will catch this first
    });

    it('should reject duplicate track IDs', () => {
      const trackData = {
        id: 'duplicate-id',
        name: 'First Track',
        description: 'First track',
        url: 'https://example.com/first.mp3',
        category: 'custom' as const
      };

      // Add first track
      const firstResult = manager.addCustomTrack(trackData);
      expect(firstResult.success).toBe(true);

      // Try to add second track with same ID
      const secondTrackData = {
        ...trackData,
        name: 'Second Track',
        url: 'https://example.com/second.mp3'
      };

      const secondResult = manager.addCustomTrack(secondTrackData);
      expect(secondResult.success).toBe(false);
      expect(secondResult.error).toContain('already exists');
    });

    it('should reject track with missing required fields', () => {
      const trackData = {
        name: '', // empty name
        description: 'Missing name',
        url: 'https://example.com/music.mp3',
        category: 'custom' as const
      };

      const result = manager.addCustomTrack(trackData);
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('Managing custom tracks', () => {
    beforeEach(() => {
      // Add some test tracks
      manager.addCustomTrack({
        id: 'test-1',
        name: 'Test Track 1',
        description: 'First test track',
        url: 'https://example.com/test1.mp3',
        category: 'custom'
      });

      manager.addCustomTrack({
        id: 'test-2',
        name: 'Test Track 2',
        description: 'Second test track',
        url: '/local/test2.mp3',
        category: 'custom',
        isLocal: true
      });
    });

    it('should get custom tracks only', () => {
      const customTracks = manager.getCustomTracks();
      expect(customTracks.length).toBe(2);
      expect(customTracks.every(track => track.id.startsWith('test-'))).toBe(true);
    });

    it('should get all tracks including defaults and custom', () => {
      const allTracks = manager.getAllTracks();
      const customTracks = manager.getCustomTracks();
      
      expect(allTracks.length).toBeGreaterThan(customTracks.length);
      expect(allTracks.filter(t => t.id.startsWith('test-')).length).toBe(2);
    });

    it('should find track by ID', () => {
      const track = manager.getTrackById('test-1');
      expect(track).toBeDefined();
      expect(track?.name).toBe('Test Track 1');
    });

    it('should remove custom track', () => {
      const removed = manager.removeCustomTrack('test-1');
      expect(removed).toBe(true);
      
      const customTracks = manager.getCustomTracks();
      expect(customTracks.length).toBe(1);
      expect(customTracks[0].id).toBe('test-2');
    });

    it('should return false when removing non-existent track', () => {
      const removed = manager.removeCustomTrack('non-existent');
      expect(removed).toBe(false);
    });

    it('should update existing custom track', () => {
      const result = manager.updateCustomTrack('test-1', {
        name: 'Updated Track Name',
        description: 'Updated description'
      });

      expect(result.success).toBe(true);
      
      const track = manager.getTrackById('test-1');
      expect(track?.name).toBe('Updated Track Name');
      expect(track?.description).toBe('Updated description');
    });

    it('should reject update with invalid data', () => {
      const result = manager.updateCustomTrack('test-1', {
        url: 'not-a-valid-url-at-all'
      });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should return error when updating non-existent track', () => {
      const result = manager.updateCustomTrack('non-existent', {
        name: 'New Name'
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('not found');
    });

    it('should clear all custom tracks', () => {
      manager.clearCustomTracks();
      const customTracks = manager.getCustomTracks();
      expect(customTracks.length).toBe(0);
    });

    it('should set custom tracks in bulk', () => {
      const newTracks: MusicTrack[] = [
        {
          id: 'bulk-1',
          name: 'Bulk Track 1',
          description: 'First bulk track',
          url: 'https://example.com/bulk1.mp3',
          category: 'nature',
          isLocal: false
        },
        {
          id: 'bulk-2',
          name: 'Bulk Track 2',
          description: 'Second bulk track',
          url: '/local/bulk2.mp3',
          category: 'lofi',
          isLocal: true
        }
      ];

      const result = manager.setCustomTracks(newTracks);
      expect(result.success).toBe(true);

      const customTracks = manager.getCustomTracks();
      expect(customTracks.length).toBe(2);
      expect(customTracks.map(t => t.id)).toEqual(['bulk-1', 'bulk-2']);
    });

    it('should reject bulk set with invalid tracks', () => {
      const invalidTracks = [
        {
          id: 'invalid',
          name: '', // invalid: empty name
          description: 'Invalid track',
          url: 'https://example.com/invalid.mp3',
          category: 'nature' as const,
          isLocal: false
        }
      ];

      const result = manager.setCustomTracks(invalidTracks);
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('Track validation', () => {
    it('should validate streaming track access', async () => {
      const track: MusicTrack = {
        id: 'stream-test',
        name: 'Stream Test',
        description: 'Streaming track test',
        url: 'https://example.com/music.mp3',
        category: 'nature',
        isLocal: false
      };

      const result = await manager.validateTrackAccess(track);
      expect(result.accessible).toBe(true);
    });

    it('should validate local file track access', async () => {
      const track: MusicTrack = {
        id: 'local-test',
        name: 'Local Test',
        description: 'Local file test',
        url: '/path/to/music.mp3',
        category: 'nature',
        isLocal: true
      };

      const result = await manager.validateTrackAccess(track);
      expect(result.accessible).toBe(true);
    });

    it('should reject invalid streaming URL', async () => {
      const track: MusicTrack = {
        id: 'invalid-stream',
        name: 'Invalid Stream',
        description: 'Invalid streaming URL',
        url: 'not-a-url',
        category: 'nature',
        isLocal: false
      };

      const result = await manager.validateTrackAccess(track);
      expect(result.accessible).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should reject invalid local file path', async () => {
      const track: MusicTrack = {
        id: 'invalid-local',
        name: 'Invalid Local',
        description: 'Invalid local path',
        url: '', // empty path
        category: 'nature',
        isLocal: true
      };

      const result = await manager.validateTrackAccess(track);
      expect(result.accessible).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('Track filtering', () => {
    beforeEach(() => {
      // Add tracks with explicit isLocal setting to ensure they pass validation
      manager.addCustomTrack({
        name: 'Custom Nature',
        description: 'Custom nature sound',
        url: 'https://example.com/nature.mp3',
        category: 'nature',
        isLocal: false
      });

      manager.addCustomTrack({
        name: 'Custom Lofi',
        description: 'Custom lofi track',
        url: 'https://example.com/lofi.mp3',
        category: 'lofi',
        isLocal: false
      });

      manager.addCustomTrack({
        name: 'Custom Other',
        description: 'Custom category track',
        url: 'https://example.com/custom.mp3',
        category: 'custom',
        isLocal: false
      });
    });

    it('should filter tracks by category', () => {
      // Verify tracks were added
      const allTracks = manager.getAllTracks();
      const addedTracks = allTracks.filter(t => t.name.startsWith('Custom'));
      expect(addedTracks.length).toBe(3);
      
      const natureTracks = manager.getTracksByCategory('nature');
      const lofiTracks = manager.getTracksByCategory('lofi');
      const customTracks = manager.getTracksByCategory('custom');

      // Should include both default and custom tracks
      expect(natureTracks.some(t => t.name === 'Custom Nature')).toBe(true);
      expect(lofiTracks.some(t => t.name === 'Custom Lofi')).toBe(true);
      expect(customTracks.some(t => t.name === 'Custom Other')).toBe(true);
    });

    it('should return empty array for non-existent category', () => {
      const tracks = manager.getTracksByCategory('non-existent' as any);
      expect(tracks.length).toBe(0);
    });
  });

  describe('Reset functionality', () => {
    it('should reset to default tracks', () => {
      // Add custom tracks
      manager.addCustomTrack({
        name: 'Custom Track',
        description: 'Custom track',
        url: 'https://example.com/custom.mp3',
        category: 'custom'
      });

      const beforeReset = manager.getAllTracks();
      const customBefore = manager.getCustomTracks();
      
      expect(customBefore.length).toBe(1);

      // Reset
      manager.resetToDefaults();

      const afterReset = manager.getAllTracks();
      const customAfter = manager.getCustomTracks();

      expect(customAfter.length).toBe(0);
      expect(afterReset.length).toBeLessThan(beforeReset.length);
    });
  });
});