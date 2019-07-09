import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../style.css'
import Head from 'next/head'

const Layout = props => (
    <div>
        <Head>
            <title>Spotify React</title>
            <script src='https://sdk.scdn.co/spotify-player.js'></script>
            
        </Head>
        <div className='main'>
            {props.children}
        </div>
    </div>
)
export default Layout