import { ISpotifyPlaylist } from '../common';
export declare class TNSSpotifyPlaylist {
    static CURRENT_LIST: any;
    static MINE(offset?: number): Promise<any>;
    static FOR_USER(user: string): Promise<any>;
    static PLAYLISTS_FROM_RESULTS(results: any): Promise<any>;
    static GET_TRACKS(trackList: any, playlist: ISpotifyPlaylist): Promise<any>;
}
