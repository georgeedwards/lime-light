export interface ISpotifyUser {
    displayName: string;
    emailAddress: string;
    uri: string;
    product: number;
}
export interface ISpotifyTrackMetadata {
    albumName?: string;
    albumUri?: string;
    artistName?: string;
    artistUri?: string;
    trackDuration?: string;
    trackName?: string;
    trackUri?: string;
}
export interface ISpotifyTrack {
    id: string;
    name: string;
    artist: any;
    duration: number;
    album: any;
    playing: boolean;
}
export interface ISpotifyPlaylist {
    uri: string;
    name: string;
    tracks: any;
    playing: boolean;
}
export declare class TNSSpotifyConstants {
    static CLIENT_ID: string;
    static NOTIFY_AUTH_LOGIN_CHANGE: string;
    static NOTIFY_LOGIN_CHECK: string;
    static NOTIFY_LOGIN_SUCCESS: string;
    static NOTIFY_LOGIN_ERROR: string;
    static NOTIFY_PLAYER_READY: string;
    static KEY_STORE_SESSION: string;
}
export declare class Utils {
    static alert(msg: string): Promise<any>;
    static openModal(page: any, view: string, closeCallback: Function, fullscreen: boolean): void;
    static closeModal(page: any): void;
}
