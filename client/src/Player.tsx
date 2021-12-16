import React, { FC, useEffect, useState } from 'react'
import SpotifyPlayer from 'react-spotify-web-playback'

interface Props {
  accessToken: string
  trackUri?: any
}

const Player: FC<Props> = ({ accessToken, trackUri }: Props) => {
  const [play, setPlay] = useState(false)

  useEffect(() => setPlay(true), [trackUri])

  if (!accessToken) return null
  return (
    <SpotifyPlayer
      token={accessToken}
      showSaveIcon
      persistDeviceSelection
      callback={state => {
        if (!state.isPlaying) setPlay(false)
      }}
      name="Spotify"
      autoPlay={true}
      syncExternalDevice
      play={true}
      uris={trackUri ? [trackUri] : []}
      initialVolume={0.5}
      styles={{
        sliderColor: '#1cb954',
      }}
    />
  )
}

export default Player
