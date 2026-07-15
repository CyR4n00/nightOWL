import { describe, it, expect, vi } from 'vitest';
import { voiceRoomService } from './VoiceRoomService';

// Mock supabaseClient to avoid missing env var errors
vi.mock('../supabaseClient', () => ({
  supabase: {
    functions: {
      invoke: vi.fn(),
    },
  },
}));

// Mock AgoraRTC to prevent actual initialization during tests
vi.mock('agora-rtc-sdk-ng', () => {
  return {
    default: {
      createClient: vi.fn(() => ({})),
      createMicrophoneAudioTrack: vi.fn(),
    }
  };
});

describe('VoiceRoomService', () => {
  describe('joinRoom', () => {
    it('throws an error if client is not initialized', async () => {
      // Artificially nullify the client to test the error path
      voiceRoomService.client = null;

      // Ensure that joining a room throws the expected error
      await expect(voiceRoomService.joinRoom('test-channel')).rejects.toThrow("Agora client not initialized");
    });
  });
});
