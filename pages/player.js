import { withRouter } from 'next/router';
import react, {useEffect, useState} from 'react'
import Router from 'next/router'
import Layout from '../components/Layout.js';
import fetch from 'node-fetch'
import Cookies from 'js-cookie'

var Spotify = require('spotify-web-api-js');
const spotify = new Spotify();

const host = 'https://obscure-scrubland-51083.herokuapp.com/'

const Player = withRouter(props => {

    const [user, setUser] = useState([])
    const [loading, setLoading] = useState(false)


    useEffect(() => {

        const fetchUser = () => {
            spotify.getMe()
                .then(response => setUser(response))
                //.then(data => console.log(data))
                .catch(err => console.log(err))
        }
        const fetchToken = () => {
            const code = props.router.query.code 
            // send 'code' url param to backend /capture 
            fetch(`${host}api/capture?code=${code}`)
                .then(response => response.json())
                .then(data => {
                    console.log(data)
                    // set cookies 
                    const inOneHour = 1/24
                    Cookies.set('access_token', data.credentials.access_token , {
                        expires: inOneHour
                    })
                    Cookies.set('refresh_token', data.credentials.access_token)
                })
                .catch(err => console.log(err))
        }
        // accessToken stored yet? If not, ask backend for it
        if (Cookies.get('access_token')) {
            spotify.setAccessToken(Cookies.get('access_token'))
            fetchUser()
        
            // token expired? Get a new one
        } else if (Cookies.get('refresh_token')) {
            return fetchToken(); 

            // user completely unknown
        } else {
            Router.push('/login')
        }  
    }, []); // useEffect 
    
    return (
        <Layout>
            <div className='player'>
                <h2>Hi, {user.display_name}</h2>
                <p>{user.id}</p>
            </div>
        </Layout>
    );
})
export default Player