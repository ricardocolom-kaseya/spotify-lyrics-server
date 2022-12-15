const express = require('express')

const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const cors = require('cors')
app.use(cors())

const SpotifyWebApi = require('spotify-web-api-node')

let lastCode = "";

app.post("/login", (req, res) => {
    const code = req.body.code;

    if (code == lastCode) {
        return res.sendStatus(200)
    }
    else {
        lastCode = code
    }

    const spotifyApi = new SpotifyWebApi({
        clientId: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
        redirectUri: process.env.REDIRECT_URI
    })

    spotifyApi.authorizationCodeGrant(code).then(data => {
        console.log(data.body)
        res.json(
            {
                accessToken: data.body.access_token,
                refreshToken: data.body.refresh_token,
                expiresIn: data.body.expires_in,
            }
        )
    }).catch((err) => {
        console.log(err)
        res.sendStatus(400)
    })
})

app.listen('4000', () => {
    console.log("Server started on port 4000...")
})