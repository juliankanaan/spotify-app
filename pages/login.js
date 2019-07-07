// page to login a user 
import Link from 'next/link';

const Spotify = require('spotify-web-api-node')
const spotify = new Spotify({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: 'https://localhost:3000/player'
});
// required scopes 
const scopes = ['streaming', 'user-read-email', 'user-modify-playback-state', 'user-read-playback-state']
const spotifyState = ''
// build auth URL 
const authURL = spotify.createAuthorizeURL(scopes)
console.log(authURL);


const Login = () => (
    <div>
      <p>Auth page</p>
      <Link href={authURL}>
        <a>Login</a>
      </Link>
    </div>
  );
  
  export default Login;