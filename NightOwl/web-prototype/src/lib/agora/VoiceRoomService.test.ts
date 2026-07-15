import { describe, it, expect, vi, beforeEach } from 'vitest';
import { voiceRoomService } from './VoiceRoomService';
import type { IMicrophoneAudioTrack } from 'agora-rtc-sdk-ng';

describe('VoiceRoomService', () => {
  beforeEach(() => {
    // Reset the service state before each test
    voiceRoomService.localAudioTrack = null;
    vi.clearAllMocks();
  });

  describe('toggleMute', () => {
    it('should call setMuted(true) and return true when toggling mute on', async () => {
      // Mock the local audio track
      const mockSetMuted = vi.fn().mockResolvedValue(undefined);
      voiceRoomService.localAudioTrack = {
        setMuted: mockSetMuted,
      } as unknown as IMicrophoneAudioTrack;

      const result = await voiceRoomService.toggleMute(true);

      expect(mockSetMuted).toHaveBeenCalledWith(true);
      expect(result).toBe(true);
    });

    it('should call setMuted(false) and return true when toggling mute off', async () => {
      // Mock the local audio track
      const mockSetMuted = vi.fn().mockResolvedValue(undefined);
      voiceRoomService.localAudioTrack = {
        setMuted: mockSetMuted,
      } as unknown as IMicrophoneAudioTrack;

      const result = await voiceRoomService.toggleMute(false);

      expect(mockSetMuted).toHaveBeenCalledWith(false);
      expect(result).toBe(true);
    });

    it('should return false if localAudioTrack is null', async () => {
      // Ensure the track is null
      voiceRoomService.localAudioTrack = null;

      const result = await voiceRoomService.toggleMute(true);

      expect(result).toBe(false);
    });
  });
});
