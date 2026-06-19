import AgoraRTC from 'agora-rtc-sdk-ng';
import type {
  IAgoraRTCClient,
  IMicrophoneAudioTrack,
  UID
} from 'agora-rtc-sdk-ng';
import { supabase } from '../supabaseClient';

// Use the user's provided Agora App ID as a fallback if the env var isn't set.
const AGORA_APP_ID = import.meta.env.VITE_AGORA_APP_ID || '';
if (!AGORA_APP_ID) {
  console.warn("Agora App ID is missing. Ensure you have set VITE_AGORA_APP_ID in your .env file.");
}

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
      // Call Supabase Edge Function to get token
      let token = null;
      try {
        const { data, error } = await supabase.functions.invoke('agora-token', {
          body: { channelName, uid: uid ? parseInt(uid.toString(), 10) : 0 }
        });

        if (error) {
          console.warn("Failed to fetch token from Edge Function, falling back to null token (testing mode).");
        } else {
          token = data?.token || null;
          console.log("Successfully fetched Agora token");
        }
      } catch (err) {
        console.warn("Error invoking agora-token edge function, falling back to null token.");
      }

      const joinedUid = await this.client.join(this.appId, channelName, token, uid);

      // Create local audio track
      this.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();

      // Publish local audio
      await this.client.publish([this.localAudioTrack]);

      this.isConnected = true;
      return joinedUid;
    } catch (error) {
      console.error("Failed to join voice room.");
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
      console.error("Failed to leave voice room.");
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

  async toggleMute(muted: boolean): Promise<boolean> {
    if (this.localAudioTrack) {
      await this.localAudioTrack.setMuted(muted);
      return true;
    }
    return false;
  }

  async publishAudio() {
    if (this.client && this.localAudioTrack) {
      await this.client.publish([this.localAudioTrack]);
    }
  }
}

// Export a singleton instance
export const voiceRoomService = new VoiceRoomService();
