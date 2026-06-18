import { describe, it, expect, vi, beforeEach } from 'vitest';
import AgoraRTC from 'agora-rtc-sdk-ng';

// Mock imported modules before importing the file that uses them
vi.mock('agora-rtc-sdk-ng', () => {
  return {
    default: {
      createClient: vi.fn(),
      createMicrophoneAudioTrack: vi.fn(),
    }
  };
});

vi.mock('../supabaseClient', () => {
  return {
    supabase: {
      functions: {
        invoke: vi.fn()
      }
    }
  };
});

import { voiceRoomService } from './VoiceRoomService';

describe('VoiceRoomService', () => {
  beforeEach(() => {
    // Reset the singleton state
    voiceRoomService.client = null;
    vi.clearAllMocks();
  });

  describe('joinRoom', () => {
    it('should throw an error if the client is not initialized', async () => {
      // client is null because we cleared it in beforeEach
      await expect(voiceRoomService.joinRoom('test-channel')).rejects.toThrow("Agora client not initialized");
    });
  });
});
