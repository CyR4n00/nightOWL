import AgoraRTC from "agora-rtc-sdk-ng";
import type { IAgoraRTCClient, IMicrophoneAudioTrack } from "agora-rtc-sdk-ng";

export interface VoiceRoomServiceConfig {
    appId: string;
    token: string | null;
    channel: string;
    uid: string | number | null;
}

export class VoiceRoomService {
    private client: IAgoraRTCClient;
    private localAudioTrack: IMicrophoneAudioTrack | null = null;

    constructor() {
        this.client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
    }

    async joinRoom(config: VoiceRoomServiceConfig) {
        console.log(`Joining Voice Room: ${config.channel}...`);

        // Listeners setup
        this.client.on("user-published", async (user, mediaType) => {
            await this.client.subscribe(user, mediaType);
            if (mediaType === "audio") {
                user.audioTrack?.play();
            }
        });

        this.client.on("user-unpublished", (user) => {
            console.log("User unpublished", user);
        });

        await this.client.join(config.appId, config.channel, config.token, config.uid);
        return true;
    }

    async publishAudio() {
        console.log("Requesting microphone and publishing audio...");
        try {
            this.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
            await this.client.publish([this.localAudioTrack]);
            return true;
        } catch (error) {
            console.error("Failed to publish audio", error);
            return false;
        }
    }

    async toggleMute(mute: boolean) {
        if (this.localAudioTrack) {
            await this.localAudioTrack.setMuted(mute);
            return true;
        }
        return false;
    }

    async leaveRoom() {
        console.log("Leaving voice room...");
        if (this.localAudioTrack) {
            this.localAudioTrack.stop();
            this.localAudioTrack.close();
            this.localAudioTrack = null;
        }
        await this.client.leave();
    }
}

export const voiceRoomService = new VoiceRoomService();
