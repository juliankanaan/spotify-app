import { withRouter } from 'next/router';
import react, {useEffect, useState} from 'react'
import Router from 'next/router'
import Layout from '../components/Layout.js';
// call header component to manipulate this page's header 
import Head from 'next/head'
import UserDetails from '../components/UserDetails'
import PlayModule from '../components/PlayModule'
import fetch from 'node-fetch'
import Cookies from 'js-cookie'

var SpotifyWebApi = require('spotify-web-api-js');
const spotify = new SpotifyWebApi();
const host = 'https://obscure-scrubland-51083.herokuapp.com/'

const Player = withRouter(props => {

    const [user, setUser] = useState([])
    const [accessToken, setAccessToken] = useState(null)
    const [refreshToken, setRefreshToken]  = useState(null)
    const [ready, setReady] = useState(false)

    useEffect(() => {
        // url param from spotify 
        
        const fetchToken = () => {
                    const code = props.router.query.code || null
                    fetch(`${host}api/capture?code=${code}`)
                        .then(response => response.json())
                        .then(data => {
                            // set cookies 
                            const inOneHour = 1/24
                            Cookies.set('access_token', data.credentials.access_token , {
                                expires: inOneHour
                            })
                            Cookies.set('refresh_token', data.credentials.refresh_token)
                            setAccessToken(data.credentials.access_token)
                            setRefreshToken(data.credentials.refresh_token)

                        })
                        .catch(err => console.log(err))
        }
        const fetchUser = () => {
            spotify.getMe()
                        .then(response => {
                            setUser(response)
                            setReady(true)
                        })
                        //.then(data => console.log(data))
                        .catch(err => console.log(err))
        }
        
        const refreshToken = () => {
            const refreshToken = Cookies.get('refresh_token')
            if (!refreshToken) console.log('No refresh token exists!')
        
            fetch(`${host}refresh?refresh_token=${refreshToken}`)
                .then(response => response.json())
                .then(data => {
                    console.log(data)
                    // set cookies 
                    const inOneHour = 1/24
                    Cookies.set('access_token', data.credentials.access_token , {
                        expires: inOneHour
                    })
                    Cookies.set('refresh_token', data.credentials.refresh_token)
                    setAccessToken(data.credentials.access_token)
                    setRefreshToken(data.credentials.refresh_token)

                })
                .catch(err => console.error(err))
        
        }

        // accessToken exists?
        if (Cookies.get('access_token')) {
            spotify.setAccessToken(Cookies.get('access_token'))
            fetchUser()
        
        // token expired? Get a new one
        } else if (Cookies.get('refresh_token')) {
            refreshToken(); 
            fetchUser()
        // no credentials? Push to login page 
        }  else if (props.router.query.code) {
            fetchToken()
            fetchUser()
        } else {
            Router.push('/login')
        }
         
    }, [ready, user]); // useEffect 
    
    return (
        <>
            {ready && 
            <Layout>
                <div className='player'>
                    <UserDetails displayName={user.display_name} userId={user.id} />
                    <PlayModule accessToken={Cookies.get('access_token')} />
                </div>
            </Layout>
            }
        </>
    );
})
export default Player