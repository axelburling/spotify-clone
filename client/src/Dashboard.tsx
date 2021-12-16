import axios from 'axios'
import React, { FC, useEffect, useState } from 'react'
import { Container, Form } from 'react-bootstrap'
import SpotifyWebApi from 'spotify-web-api-node'
import styled from 'styled-components'
import Player from './Player'
import Tracks, { Track } from './Tracks'
import useAuth from './useAuth'

interface Props {
  code: string
}

const spotify = new SpotifyWebApi({
  clientId: '303e28955749442f86f8d5fece8ec021',
})

const Bottom = styled.footer`
  width: 90%;
  position: fixed;
  bottom: 0;
  margin-bottom: 5px;
  align-items: center;
  justify-content: center;
`

const Dashboard: FC<Props> = ({ code }: Props) => {
  const [search, setSearch] = useState<string>('')
  const [searchRes, setSearchRes] = useState<any[]>([])
  const [playingTrack, setplayingTrack] = useState<Track>({
    artist: '',
    title: '',
    uri: '',
    albumURl: ',',
  })
  const [lyrics, setLyrics] = useState('')
  const accessToken = useAuth(code)
  console.log(searchRes)

  const chooseTrack = (track: Track) => {
    setplayingTrack(track)
    setSearch('')
    setLyrics('')
  }

  useEffect(() => {
    if (!playingTrack) return

    axios
      .get('http://localhost:8080/lyrics', {
        params: {
          track: playingTrack.title,
          artist: playingTrack.artist,
        },
      })
      .then(res => {
        setLyrics(res.data.lyrics)
      })
  }, [playingTrack])

  useEffect(() => {
    if (!accessToken) return
    spotify.setAccessToken(accessToken)
  }, [accessToken])

  useEffect((): any => {
    if (!search) return setSearchRes([])
    if (!accessToken) return

    let cancel: boolean = false
    spotify.searchTracks(search).then(res => {
      if (cancel) return
      if (res.body.tracks) {
        setSearchRes(
          res.body.tracks.items.map(track => {
            const smallestAlbumImage = track.album.images.reduce((smallest: any, image: any) => {
              if (image.height < smallest.height) return image
              return smallest
            }, track.album.images[0])
            return {
              artist: track.artists[0].name,
              title: track.name,
              uri: track.uri,
              albumURl: smallestAlbumImage.url,
            }
          }),
        )
      }
    })

    return () => (cancel = true)
  }, [search, accessToken])

  return (
    <Container className="d-flex flex-column py-2" style={{ height: '100vh' }}>
      <Form.Control
        type="search"
        placeholder="Search Songs/Artist"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      {searchRes.map(track => (
        <Tracks track={track} key={track.uri} chooseTrack={chooseTrack} />
      ))}
      {searchRes.length === 0 && (
        <div className="text-center" style={{ whiteSpace: 'pre' }}>
          {lyrics}
        </div>
      )}
      <Bottom>
        <Player accessToken={accessToken} trackUri={playingTrack.uri} />
      </Bottom>
    </Container>
  )
}

export default Dashboard
