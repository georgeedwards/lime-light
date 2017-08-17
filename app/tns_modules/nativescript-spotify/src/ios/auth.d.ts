import { Observable } from 'data/observable';
import { ISpotifyUser } from '../common';
export declare class TNSSpotifyAuth extends NSObject {
    static REDIRECT_URL: string;
    static TOKEN_REFRESH_ENDPOINT: string;
    static SESSION: any;
    static CLEAR_COOKIES: boolean;
    static AUTH_VIEW_SHOWING: boolean;
    static PREMIUM_MSG: string;
    events: Observable;
    private _observers;
    private _authLoginCheck;
    private _authLoginSuccess;
    private _authLoginError;
    private _authLoginChange;
    setupEvents(): void;
    static LOGIN(): void;
    static LOGOUT(): void;
    static HANDLE_AUTH_CALLBACK(url: any): void;
    static LOGIN_WITH_SESSION(session: any): void;
    static VERIFY_SESSION(session?: any): Promise<any>;
    static SAVE_SESSION(session: any): void;
    static GET_STORED_SESSION(): any;
    static RENEW_SESSION(session: any): Promise<any>;
    static CURRENT_USER(): Promise<ISpotifyUser>;
    static CHECK_PREMIUM(): Promise<any>;
    private setupNotifications();
    private addNotificationObserver(notificationName, onReceiveCallback);
}
