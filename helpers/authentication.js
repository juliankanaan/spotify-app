import react, {useEffect, useState} from 'react'
var Spotify = require('spotify-web-api-js');
const spotify = new Spotify();

export const fetchUser = () => {
    spotify.getMe()
                .then(response => setUser(response))
                //.then(data => console.log(data))
                .catch(err => console.log(err))
}

export const refreshToken = () => {
    const refreshToken = Cookies.get('refresh_token')
    if (!refreshToken) console.log('No refresh token exists!')

    fetch(`${host}/refresh?refresh_token=${refreshToken}`)
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