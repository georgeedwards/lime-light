import {Observable, EventData} from 'data/observable';
import {Page} from 'ui/page';
import {topmost} from 'ui/frame';
import {AnimationCurve} from 'ui/enums';
import {isIOS, isAndroid} from 'platform';
import {LoadingIndicator} from 'nativescript-loading-indicator';
import {
  TNSSpotifyConstants,
  TNSSpotifyAuth,
  TNSSpotifyPlayer,
  TNSSpotifyPlaylist,
  TNSSpotifyRequest,
  ISpotifyTrackMetadata,
  Utils
} from 'nativescript-spotify';

export class SpotifyDemo extends Observable {

  // UI  
  public playBtnTxt: string;
  public loggedIn: boolean = false;
  public accountName: string;
  public albumUrl: string;
  public trackInfo: string;
  public playing: boolean = false;
  public trackLoaded: boolean = false;
  public currentAlbumUrl: string;
  public albumName: string;
  public albumUri: string;
  public artistName: string;
  public artistUri: string;
  public trackDuration: string;
  public trackName: string;
  public trackUri: string;
  public playlistItems: Array<any>;
  public metadataBtnTxt: string;
  public accountInfoBtnTxt: string;
  public playlistNSActive: string;
  public playlistTRActive: string;
  public volumeValue: number;

  // State  
  private _spotify: TNSSpotifyPlayer;
  private _metadataVisible: boolean = false;
  private _chevronDown: string = `\uf13a`;
  private _chevronUp: string = `\uf139`;
  private _accountInfoVisible: boolean = false;
  private _userIcon: string = `\uf007`;
  private _userIconClose: string = `\uf235`;
  private _currentTrack: string;
  private _playlistOpen: boolean = false;
  private _playlistItemPlayingIndex: number = -1;
  private _loader: any;

  constructor() {
    super();

    this._loader = new LoadingIndicator();
    // init player
    this._loader.show();
    this._spotify = new TNSSpotifyPlayer();
    this._spotify.initPlayer(true);
    this.setupEvents();

    this.playBtnTxt = `\uf144`;
    this.currentAlbumUrl = `~/assets/logo.jpg`;
    this.metadataBtnTxt = this._chevronDown;
    this.accountInfoBtnTxt = this._userIcon;
    this.playlistNSActive = this.playlistTRActive = '#ffffff';
    this.set('volumeValue', 100);
    this.on(Observable.propertyChangeEvent, (data: any) => {
      // for (let key in data) {
      //   console.log(`key: ${key}`, data[key]);
      // }
      if (data.propertyName === 'volumeValue') {
        this._spotify.setVolume(data.value * .01);
      }
      
    });
  }

  public login() {
    TNSSpotifyAuth.LOGIN();
  }

  public logout() {
    if (this.playing) {
      this.togglePlay();
      this.toggleAccountInfo(null, false);
      this.set(`currentAlbumUrl`, `~/assets/logo.jpg`);
    }
    TNSSpotifyAuth.LOGOUT();
  }

  public togglePlay(args?: EventData, trackUri?: string) {
    this._loader.show();

    if (!this._currentTrack && !trackUri) {
      // first play if not using playlist right away is a surprise :)
      trackUri = 'spotify:track:58s6EuEYJdlb0kO7awm3Vp';
    }

    // only set current track if there's a track coming in
    if (trackUri) this._currentTrack = trackUri;

    this._spotify.togglePlay(this._currentTrack).then((isPlaying: boolean) => {
      this._loader.hide();
      this.set(`trackLoaded`, true);
      this.set(`playing`, isPlaying);
      this.toggleBtn();
      this.togglePlaylist(false);
    }, (error) => {
      this._loader.hide();
      this.set(`trackLoaded`, false);
      this.set(`playing`, false);
      this.toggleBtn();
      if (error === 'login') {
        this.set(`loggedIn`, false);
      }
    });
  }

  public updateTrackInfo(trackInfo: any) {
    // let metadata: ISpotifyTrackMetadata = trackInfo || this._spotify.currentTrackMetadata();
    this.set(`albumName`, `Album: ${trackInfo.albumName}`);
    this.set(`albumUri`, `Album URI: ${trackInfo.albumUri}`);
    this.set(`artistName`, `Artist: ${trackInfo.artistName}`);
    this.set(`artistUri`, `Artist URI: ${trackInfo.artistUri}`);
    this.set(`trackDuration`, `Duration: ${trackInfo.durationMs}`);
    this.set(`trackName`, `Track: ${trackInfo.name}`);
    this.set(`trackUri`, `Track URI: ${trackInfo.uri}`);
  }

  public viewPlaylist(args: EventData, uri?: string) {
    if (!this._playlistOpen) {
      this._loader.show();
      if (uri) {
        this.set('playlistTRActive', '#A6CE40');
        this.set('playlistNSActive', '#ffffff');
      } else {
        this.set('playlistTRActive', '#ffffff');
        this.set('playlistNSActive', '#A6CE40');
      }
      TNSSpotifyRequest.ITEM(uri || 'spotify:user:burkeholland:playlist:6kWBeWiaRT7zjINBJJtxJb').then((item) => {
        this._loader.hide();
        console.log(item); // SPTPlaylistList
        let tracks = TNSSpotifyRequest.TRACKS_FROM_PLAYLIST(item);
        this.set(`playlistItems`, tracks);
        this.togglePlaylist();
      });
    } else {
      this.togglePlaylist();
    }
  }




  public getPlayerState() {
    if (isAndroid) {
      try {
        (<any>this._spotify).getPlayerState().then((resp) => {
          console.log('PLAYER STATE: ' + JSON.stringify(resp));
        });
      } catch (err) {
        console.log(err);
      }
    }
  }




  public viewThoughtram(args: EventData) {
    this.viewPlaylist(args, 'spotify:user:pascalprecht:playlist:6tTtJJTxkrp9Qnz5afZzpz');
  }

  public playlistItemTap(args: any) {
    if (this._playlistItemPlayingIndex === args.index) {
      // pause track
      this.playlistItems[this._playlistItemPlayingIndex].playing = false;
      let id = this.playlistItems[this._playlistItemPlayingIndex].identifier;
      console.log(id);
      this.togglePlay(null, `spotify:track:${id}`);
    } else {
      this._playlistItemPlayingIndex = args.index;
      for (let item of this.playlistItems) {
        item.playing = false;
      }
      this.playlistItems[this._playlistItemPlayingIndex].playing = true;
      let id = this.playlistItems[this._playlistItemPlayingIndex].identifier;
      console.log(id);
      this.togglePlay(null, `spotify:track:${id}`);
    }
    this.set(`playlistItems`, this.playlistItems);
  }

  public toggleMetadata(args: EventData, force?: boolean) {
    let toggleOther = true;
    if (typeof force !== 'undefined') {
      toggleOther = false;
      this._metadataVisible = force;
    } else {
      this._metadataVisible = !this._metadataVisible;
    }
    let page = topmost().currentPage;
    let metadata: any = page.getViewById('metadata');
    metadata.animate({
      translate: { x: 30, y: this._metadataVisible ? 200 : -300 },
      opacity: this._metadataVisible ? .8 : 0,
      duration: 300
    });
    this.set(`metadataBtnTxt`, this._metadataVisible ? this._chevronUp : this._chevronDown);
    if (toggleOther) this.toggleAccountInfo(null, false);
  }

  public toggleAccountInfo(args: EventData, force?: boolean) {
    let toggleOther = true;
    if (typeof force !== 'undefined') {
      toggleOther = false;
      this._accountInfoVisible = force;
    } else {
      this._accountInfoVisible = !this._accountInfoVisible;
    }
    let page = topmost().currentPage;
    let accountInfo: any = page.getViewById('account-info');
    accountInfo.animate({
      translate: { x: 30, y: this._accountInfoVisible ? 0 : -300 },
      opacity: this._accountInfoVisible ? .8 : 0,
      duration: 300
    });
    this.set(`accountInfoBtnTxt`, this._accountInfoVisible ? this._userIconClose : this._userIcon);
    if (toggleOther) this.toggleMetadata(null, false);
  }

  public viewSearch() {
    topmost().navigate('search');
  }

  private playNextTrack() {
    if (this.playlistItems) {
      if (this._playlistItemPlayingIndex + 1 < this.playlistItems.length) {
        this.playlistItemTap({ index: this._playlistItemPlayingIndex + 1 });
      } else {
        this.playlistItemTap({ index: 0 });
      }
    }
  }

  private toggleBtn() {
    this.set(`playBtnTxt`, this.playing ? '\uf28b' : '\uf144');
  }

  private togglePlaylist(force?: boolean) {
    // EXPERIMENTATION
    // this._playlistOpen = typeof force !== 'undefined' ? force : !this._playlistOpen;
    // let page = topmost().currentPage;
    // let albumArt = page.getViewById('album-art');
    // let playlistView = page.getViewById('playlist');
    // let scale = this._playlistOpen ? .5 : 1;
    // let yVal = this._playlistOpen ? -100 : 0;
    // let yPLVal = this._playlistOpen ? -200 : 0;
    // albumArt.animate({
    //   translate: { x: 0, y: yVal },
    //   scale: { x: scale, y: scale },
    //   duration: 400,
    //   curve: AnimationCurve.easeOut
    // });
    // playlistView.animate({
    //   translate: { x: 0, y: yPLVal },
    //   duration: 400,
    //   curve: AnimationCurve.easeOut
    // });
  }

  private updateAlbumArt(url: string) {
    this.set(`currentAlbumUrl`, url);
    // this.updateTrackInfo();
  }

  private updateLogin(status: boolean) {
    this.set(`loggedIn`, status);
    this.setUsername();
  }

  private loginCheck() {
    this._loader.show();
  }

  private loginSuccess() {
    this.set(`loggedIn`, true);
    console.log(`loginSuccess!`);
    this._loader.hide();
    this.setUsername();
  }

  private loginError(error: any) {
    this.set(`loggedIn`, false);
    console.log(`loginError!`);
    console.log(error);
    this._loader.hide();
  }

  private playerReady() {
    this._loader.hide();
  }

  private setUsername() {
    TNSSpotifyAuth.CURRENT_USER().then((user) => {
      console.log(`current_user`, user);
      if (user) {
        this.set(`accountName`, user.displayName);

        if (isIOS) {
          // test out playlist results
          TNSSpotifyPlaylist.MINE().then((result: any) => {
            console.log('fetch all playlists:');
            console.log(result.playlists);
            console.log(result.playlists.length);
          });
        }
      }
    }, () => {
      this.set(`accountName`, '');
    })
  }

  private changedPlaybackState(e: any) {
    console.log('changedPlaybackState...');
    if (e && e.currentTrack) {
      // for (let key in e.currentTrack) {
      //   console.log(`key: ${key}`);
      //   console.log(e.currentTrack[key]);
      // }
        this.updateTrackInfo(e.currentTrack);
    }
  }

  private setupEvents() {
    this._spotify.events.on('albumArtChange', (eventData: any) => {
      this.updateAlbumArt(eventData.data.url);
    });
    this._spotify.events.on('playerReady', (eventData: any) => {
      this.playerReady();
    });
    this._spotify.events.on('changedPlaybackStatus', (eventData: any) => {
      this.playNextTrack();
    });
    this._spotify.events.on('changedPlaybackState', (eventData: any) => {
      this.changedPlaybackState(eventData.data.state);
    });
    
    this._spotify.events.on('stoppedPlayingTrack', (eventData: any) => {
      console.log('stoppedPlayingTrack');
    });
    this._spotify.auth.events.on('authLoginChange', (eventData: any) => {
      this.updateLogin(eventData.data.status);
    });
    this._spotify.auth.events.on('authLoginCheck', (eventData: any) => {
      this.loginCheck();
    });
    this._spotify.auth.events.on('authLoginSuccess', (eventData: any) => {
      this.loginSuccess();
    });
    this._spotify.auth.events.on('authLoginError', (eventData: any) => {
      this.loginError(eventData.data);
    });
  }
}