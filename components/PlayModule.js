import React, {Component} from 'react'
import Cookies from 'js-cookie'
import AlbumCover from '../components/AlbumCover'

import SpotifyWebApi from 'spotify-web-api-js'
const spotify = new SpotifyWebApi();

class PlayModule extends Component {
    constructor(){
        super(); 
        const token = Cookies.get('access_token')
        spotify.setAccessToken(token)
        this.state = {
            playerReady: false,
            nowPlaying: {trackName: '', trackid: '', artists: [], albumName: '', albumImgSrc: ''},
            deviceId: '',
            playerStatus: {playing: null, position: null, duration: null},
            error: {status: false, message: null}
        }
    }
    componentDidMount(){

        window.onSpotifyWebPlaybackSDKReady = () => {
            window.SpotifyReady = Spotify;
            this.checkForPlayer();
        }
        
    }
    componentWillUnmount(){
        this.player.disconnect() 
        this.setState({playerReady: false})
    }

    transferPlaybackHere() {
        // https://beta.developer.spotify.com/documentation/web-api/reference/player/transfer-a-users-playback/
    fetch("https://api.spotify.com/v1/me/player", {
        method: "PUT",
        headers: {
          authorization: `Bearer ${this.props.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "device_ids": [ this.state.deviceId ],
          // true: start playing music if it was paused on the other device
          // false: paused if paused on other device, start playing music otherwise
          "play": true,
        }),
      });
    }

    checkForPlayer() {
        // if player exists, instantiate Player object 
        this.setState({playerReady: false})
        if (window.SpotifyReady) {
              this.player = new window.Spotify.Player({
                name: "React Spotify Player",
                getOAuthToken: cb => { cb( this.props.accessToken )}
        }); 
        }
        this.createEventHandlers()   
        this.player.connect()
            .then(success => {
                console.log('Browser SDK connected to Spotify')
                
            }); 
    }

    componentDidUpdate(prevProps, prevState){
        if (this.state.nowPlaying.trackid  !== prevState.nowPlaying.trackid){
            const songId = this.state.nowPlaying.trackid 
            console.log(`Song changed: ${this.state.nowPlaying.trackid}`)
            fetch(`https://api.spotify.com/v1/audio-features/${songId}`, {
                headers: {
                    authorization: `Bearer ${this.props.accessToken}`,
                    "Content-Type": "application/json",
                }
            })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(e => console.error(e))
        }
    }

    handlePlayerChange(state){
        
        if (state){
            const {
                current_track: currentTrack,
                position,
                duration, 
            } = state.track_window
            const trackName = currentTrack.name
            const trackid = currentTrack.id
            const albumName = currentTrack.album.name
            const albumImgSrc = currentTrack.album.images[0].url
            const artistName = currentTrack.artists
                .map(artist => artist.name).join(", ")
            const playing = !state.paused
            this.setState({
                playerStatus: {
                    duration,
                    position,
                    playing
                },
                nowPlaying: {
                    trackName,
                    trackid,
                    artists: artistName,
                    albumName,
                    albumImgSrc
                }
            })
        } else {
            console.log('no state change detected')
        }
    }

    createEventHandlers() {
        // problem setting up the player
        this.player.on('initialization_error', e => { console.error(e); });
        // problem authenticating the user.
        // either the token was invalid in the first place,
        // or it expired (it lasts one hour)
        this.player.on('authentication_error', e => {
          console.error(e);
          this.setState({ error: {status: true, message: "Authentication error. Try logging in again"} });
        });
        // currently only premium accounts can use the API
        this.player.on('account_error', e => {
            console.error(e)
            this.setState({ error: {status: true, message: "Only premium Spotify accounts can use this player"} });
        });
        // loading/playing the track failed for some reason
        this.player.on('playback_error', e => { 
            console.error(e); 
            this.setState({ error: {status: true, message: "Playback error. Spotify API may be down"} });
        });
      
        // Playback status updates
        this.player.on('player_state_changed', state => this.handlePlayerChange(state));
      
        // Ready
        this.player.on('ready', async data => {
          let { device_id } = data;
          console.log("Let the music play on!");
          // set the deviceId variable, then let's try
          // to swap music playback to *our* player!
          await this.setState({ deviceId: device_id });
          this.transferPlaybackHere();
          this.setState({playerReady: true})
        });
      }
    togglePlay(){
        this.player.togglePlay()
            .then(() => {
                console.log('toggle')
            })
    }
    forwards(){
        this.player.nextTrack();
    }
    back(){
        this.player.previousTrack()
    }

    render() {
        const playing = this.state.playerStatus.playing
        const artist = this.state.nowPlaying.artists
        const track = this.state.nowPlaying.trackName
        const src = this.state.nowPlaying.albumImgSrc
        return (
            <div className='play_module'>
               {this.state.error.status &&
                    (<div className='error'>{this.state.error.status}</div>)
                }
                <div className='artist-info'>
                    <AlbumCover src={src} />
                    <h3>{track}</h3>
                    <h4>{artist}</h4>
                </div>
                <div className='controls'>
                    <button className='btn btn-secondary' onClick={()=> this.back()}>Prev</button>
                    <button className='btn btn-secondary' onClick={()=> this.togglePlay()}>{playing ? ("Pause" ): ("Play")}</button>
                    <button className='btn btn-secondary' onClick={()=> this.forwards()}>Next</button>
                </div>
                
            </div>
        );
    }
}
export default PlayModule