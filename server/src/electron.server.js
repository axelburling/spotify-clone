const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression")
const lyricsFinder = require("lyrics-finder")
require("dotenv").config()

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(helmet());
app.use(compression())

app.get("/", (_, res) => {
  res.send("It works");
});

app.post("/login", (req, res) => {

  try {
    const {code} = req.body
    const spotify = new SpotifyWeApi({
      redirectUri: 'http://localhost:1212',
      clientId: '303e28955749442f86f8d5fece8ec021',
      clientSecret: '9e5361379af4438587d34d0afa6d3c6a'
    })

    spotify.authorizationCodeGrant(code).then(data => {

      res.json({
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
        expiresIn: data.body.expires_in
      })
    }).catch(err => {
      res.json(err)
    })

  } catch (error) {
    res.status(500).json({msg: "Server problems"})
  }
});

app.post("/refresh", (req, res) => {
  try {
    const {refreshToken} = req.body
    console.log("hi")
    const spotify = new SpotifyWeApi({
      redirectUri: 'http://localhost:1212',
      clientId: '303e28955749442f86f8d5fece8ec021',
      clientSecret: '9e5361379af4438587d34d0afa6d3c6a',
      refreshToken: refreshToken
    })

    spotify.refreshAccessToken().then(data => {
      console.log(data.body)
      res.json({
        accessToken: data.body.access_token,
        expiresIn: data.body.expires_in
      })
  
    }).catch(err => res.json(err))
  } catch (err) {
    res.status(500).json(err)
  }
})

app.post("/volume", (req, res) => {
  try {
    const {volume} = req.body
    const spotify = new SpotifyWeApi({
      redirectUri: 'http://localhost:1212',
      clientId: '303e28955749442f86f8d5fece8ec021',
      clientSecret: '9e5361379af4438587d34d0afa6d3c6a'
    })

    spotify.setVolume(volume).then(() => {
      res.json(volume)
    }).catch(err => {
      res.json(err)
    })

  } catch (err) {
    res.status(500).json(err)
  }
})

app.get("/lyrics", async (req, res) => {
  const lyrics = await lyricsFinder(req.query.artist, req.query.track) || "No Lyrics Found"
  res.json({lyrics})
})

const port = process.env.PORT || 1000;
app.listen(port, () => console.log(`Running on http://localhost:${port}`));
