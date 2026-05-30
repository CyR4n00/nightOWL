/**
 * Placeholder for Agora RTC integration.
 * Once Agora is configured, you'll need the `agora-rtc-sdk-ng` package.
 * npm install agora-rtc-sdk-ng
 */

// import AgoraRTC, { IAgoraRTCClient, IMicrophoneAudioTrack } from "agora-rtc-sdk-ng";

export interface VoiceRoomServiceConfig {
    appId: string;
    token: string | null;
    channel: string;
    uid: string | number | null;
}

export class VoiceRoomService {
    // private client: IAgoraRTCClient;
    // private localAudioTrack: IMicrophoneAudioTrack | null = null;

    constructor() {
        // this.client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
        console.log("VoiceRoomService skeleton initialized.");
    }

    async joinRoom(config: VoiceRoomServiceConfig) {
        console.log(`Joining Voice Room: ${config.channel}...`);
        // await this.client.join(config.appId, config.channel, config.token, config.uid);

        // Listeners setup
        // this.client.on("user-published", async (user, mediaType) => {
        //     await this.client.subscribe(user, mediaType);
        //     if (mediaType === "audio") {
        //         user.audioTrack?.play();
        //     }
        // });
        return true;
    }

    async publishAudio() {
        console.log("Requesting microphone and publishing audio...");
        // this.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
        // await this.client.publish([this.localAudioTrack]);
    }

    async leaveRoom() {
        console.log("Leaving voice room...");
        // this.localAudioTrack?.close();
        // await this.client.leave();
    }
}

export const voiceRoomService = new VoiceRoomService();
