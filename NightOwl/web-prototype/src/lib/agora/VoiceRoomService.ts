import AgoraRTC, {
  IAgoraRTCClient,
  IMicrophoneAudioTrack,
  UID
} from 'agora-rtc-sdk-ng';

// Use the user's provided Agora App ID as a fallback if the env var isn't set.
const AGORA_APP_ID = import.meta.env.VITE_AGORA_APP_ID || '7ab68dbdc79048318306b351da4c19b8';

class VoiceRoomService {
  client: IAgoraRTCClient | null = null;
  localAudioTrack: IMicrophoneAudioTrack | null = null;
  isConnected: boolean = false;

  // Note: Replace with your actual Agora App ID
  appId = AGORA_APP_ID;

  constructor() {
    this.client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
  }

  async joinRoom(channelName: string, uid: UID | null = null): Promise<UID> {
    if (!this.client) throw new Error("Agora client not initialized");

    try {
      // In a production app, you should generate a token from your server
      // For this prototype, we'll use a null token which works if app certificate is disabled in Agora console
      const token = null;

      const joinedUid = await this.client.join(this.appId, channelName, token, uid);

      // Create local audio track
      this.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();

      // Publish local audio
      await this.client.publish([this.localAudioTrack]);

      this.isConnected = true;
      return joinedUid;
    } catch (error) {
      console.error("Failed to join voice room:", error);
      throw error;
    }
  }

  async leaveRoom() {
    if (!this.client) return;

    try {
      // Stop and close local track
      if (this.localAudioTrack) {
        this.localAudioTrack.stop();
        this.localAudioTrack.close();
        this.localAudioTrack = null;
      }

      // Leave channel
      await this.client.leave();
      this.isConnected = false;
    } catch (error) {
      console.error("Failed to leave voice room:", error);
    }
  }

  muteMicrophone() {
    if (this.localAudioTrack) {
      this.localAudioTrack.setMuted(true);
    }
  }

  unmuteMicrophone() {
    if (this.localAudioTrack) {
      this.localAudioTrack.setMuted(false);
    }
  }
}

// Export a singleton instance
export const voiceRoomService = new VoiceRoomService();
