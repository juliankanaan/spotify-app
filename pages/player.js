import { withRouter } from 'next/router';
import Layout from '../components/Layout.js';

const Spotify = require('spotify-web-api-node')
const spotify = new Spotify({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: 'https://localhost:3000/player'
});

const Player = withRouter(props => {
    const [accessToken, setAccessToken] = useState(null)
    const [refreshToken, setRefreshToken] = useState(null)
    const [user, setUser] = useState(null)

    useEffect(() => {
        const fetchToken = () => {
            // retrieve code param, swap with access token & refresh token
            spotify.authorizationCodeGrant(props.router.query.code)
                .then(data => {
                    const access = data.body['access_token']
                    const refresh = data.body['refresh_token']
                    setAccessToken(access)
                    setRefreshToken(refresh)
                    // attach to spotify object too 
                    spotify.setAccessToken(access)
                    spotify.setRefreshToken(refresh)

                    console.log(`Access: ${access}, Refresh: ${refresh}`)
                    
                })
                .then(userData => {
                    return spotify.getMe()
                })
                .then(data => {
                    // get user object 
                    setUser(data)
                    console.log(data)
                })
                .catch(err => console.log(err));
        } 
        fetchToken();
    }); // useEffect 

    // refresh token on any call 
    const refresh = () => {
        spotify.refreshAccessToken()
            .then(data => {
                setAccessToken(data.body['access_token'])
                // update the spotify object 
                spotify.setAccessToken(data.body['access_token'])
            })
            .catch(err => console.log(err));
    }
    // idea: maybe attach a 'ref' to components that make an api call
    // fire refresh() on each click of these 

    
    return (
        <Layout>
            <div>
                <p>Player here</p>
                <p>Token is: {props.router.query.code}</p>
            </div>
        </Layout>
    );
});
export default Player