import react, {useState, useEffect} from 'react'
import Cookies from 'js-cookie'



const PlayModule = props => {
    const [playerReady, setPlayerReady] = useState()
    const [trackName, setTrackName] = useState()
    
    // receive current artist object 
    const [elapsed, setElapsed] = useState()
    const [pauseStatus, setPauseStatus] = useState()
    const [artist, setArtist] = useState()
    const [deviceId, setDeviceId] = useState()
    //
    let playerApi;

    function transferPlaybackHere(id) {
        const token = props.accessToken
        // https://beta.developer.spotify.com/documentation/web-api/reference/player/transfer-a-users-playback/
        fetch("https://api.spotify.com/v1/me/player", {
          method: "PUT",
          headers: {
            authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            "device_ids": [ id ],
            // true: start playing music if it was paused on the other device
            // false: paused if paused on other device, start playing music otherwise
            "play": true,
          }),
        });
    }

    useEffect(() => {
    
        const checkForPlayer = () => {
            // if player exists, instantiate Player object 
            setPlayerReady(false)
            window.onSpotifyWebPlaybackSDKReady = () => {
                window.SpotifyReady = Spotify;
            
            if (window.SpotifyReady !== null) {
                 playerApi = new window.Spotify.Player({
                    name: "React Spotify Player",
                    getOAuthToken: cb => { cb( props.accessToken )}
            }); 

                // Error handling
                playerApi.addListener('account_error', ({ message }) => { console.error(message); });
                playerApi.addListener('playback_error', ({ message }) => { console.error(message); });

                // Ready
                playerApi.on('ready', ({ device_id }) => {
                    console.log('Ready with Device ID', device_id);
                    setDeviceId(device_id)
                    transferPlaybackHere(device_id)
                    setPlayerReady(true)
                });

                playerApi.on('player_state_changed', ({
                    paused, 
                    position,
                    track_window: {current_track}
                 }) => {
                     if (position && current_track.name){
                        console.log(`Playing ${current_track.name}: ${position}`)
                        setElapsed(parseFloat(position)/1000)
                     }
                    setTrackName(current_track.name)
                    const thisArtist = current_track.artists.map(artist => artist.name)
                    setArtist(thisArtist)
                    setPauseStatus(paused)
                });

                // Not Ready
                playerApi.on('not_ready', ({ device_id }) => {
                    console.log('Device ID has gone offline', device_id);
                });


            playerApi.connect()
                .then(success => {
                    (success) => console.log('Browser SDK connected to Spotify')
                }); 
            }
        }
        }
        checkForPlayer()
    }, [props.accessToken]) // should specifify prop dependencies 

    function togglePause() {
        playerApi = new window.Spotify.Player({
            name: "React Spotify Player",
            getOAuthToken: cb => { cb( props.accessToken )}
        }); 
        playerApi.togglePlay().then(() => {
            console.log('toggled')
            
        }) 
    }

    return (
        <div className='play_module'>
            {playerReady &&
            <div className='artist_info'>
                <p>{trackName} by {artist}</p>
                <button onClick={togglePause}>{pauseStatus ? "Play" : "Pause"}</button>                
            </div>

            }
        </div>
    );
}
export default PlayModule