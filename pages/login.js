// page to login a user 
import react, {useEffect, useState} from 'react'
import Link from 'next/link';
import fetch from 'node-fetch'

var Spotify = require('spotify-web-api-js');
const spotify = new Spotify();
// retrieve authURL from backend
const host = 'https://obscure-scrubland-51083.herokuapp.com/' 


const Login = () => {
    const [authURL, setAuthURL] = useState('')
    useEffect(() => {
      const getUrl = () => {
        fetch(`${host}api/login`)
          .then(response => response.text())
          .then(data => {
            setAuthURL(data)
            console.log(data)
          })
          .catch(err => console.log(err))
      }
      getUrl()
    }, [])


    return (
          <div>
            <p>Auth page</p>
            <Link href={authURL}>
            <a>Login</a>
            </Link>
          </div>
          )
};
  
  export default Login;