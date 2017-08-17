let application = require ('application');
import { AndroidActivityResultEventData } from "application";
import { isAndroid, isIOS } from "platform";
import {TNSSpotifyConstants, TNSSpotifyAuth} from 'nativescript-spotify';

// Setup spotify dev app
TNSSpotifyConstants.CLIENT_ID = 'c2bf68f1ae5847dca1a6714b3e3734bf';
TNSSpotifyAuth.REDIRECT_URL = 'https://limelightsounds.co.uk/spotify';

/// iOS
if (isIOS) {
  class MyDelegate extends UIResponder {
    public static ObjCProtocols = [UIApplicationDelegate];

    public applicationDidFinishLaunchingWithOptions(application: UIApplication, launchOptions: NSDictionary<any, any>): boolean {
      return true;
    }

    public applicationOpenURLSourceApplicationAnnotation(application, url, sourceApplication, annotation) {
      return TNSSpotifyAuth.HANDLE_AUTH_CALLBACK(url);
    }
  }
  application.ios.delegate = MyDelegate;
}

application.mainModule = "main-page";
application.cssFile = "./app.css";
application.start({ moduleName: 'main-page' });