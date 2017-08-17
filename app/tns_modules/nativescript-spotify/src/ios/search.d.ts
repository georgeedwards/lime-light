import { ISpotifyTrack } from '../common';
export declare class TNSSpotifySearch {
    static CURRENT_LIST: any;
    static CURRENT_SEARCH_QUERY: string;
    static QUERY(query: string, queryType: string, offset?: number): Promise<any>;
    static TRACKS_FROM_RESULTS(results: any): Array<ISpotifyTrack>;
}
