export declare class TNSSpotifyNotificationObserver extends NSObject {
    private _onReceiveCallback;
    static new(): TNSSpotifyNotificationObserver;
    initWithCallback(onReceiveCallback: (notification: NSNotification) => void): TNSSpotifyNotificationObserver;
    onReceive(notification: NSNotification): void;
    static ObjCExposedMethods: {
        "onReceive": {
            returns: any;
            params: typeof NSNotification[];
        };
    };
}
