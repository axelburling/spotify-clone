import React, { FC } from 'react'

export interface Track {
  artist: string
  title: string
  uri: string
  albumURl: string
}

interface Props {
  track: Track
  chooseTrack: any
}

const Tracks: FC<Props> = ({ track, chooseTrack }: Props) => {
  const handlePlay = () => {
    chooseTrack(track)
  }

  return (
    <div
      className="d-flex m-2 align-items-center"
      style={{ cursor: 'pointer' }}
      onClick={handlePlay}
    >
      <img src={track.albumURl} style={{ height: '64px', width: '64px' }}  />
      <div className="ml-3">
        <div>{track.title}</div>
        <div className="text-muted">{track.artist}</div>
      </div>
    </div>
  )
}

export default Tracks
