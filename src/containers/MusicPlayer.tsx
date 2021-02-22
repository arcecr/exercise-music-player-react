import { useEffect, useState  } from 'react'
import Player from '../components/Player';
import Playlist from '../components/Playlist';

import { Song } from '../types/Song'

import './MusicPlayer.css';

const MusicPlayer = () => {
    const [songs, setSongs] = useState<Song[]>([]);
    const [currentSongId, setCurrentSongId] = useState(0)

    const onSelectSong = (songId: number) => setCurrentSongId(songId)

    const onPlayNextSong = (e: number) => setCurrentSongId(e)
    const onPlayBackSong = (e: number) => setCurrentSongId(e)

    useEffect(() => {
        const fetchSongs = async () => {
            const response = await fetch("https://assets.breatheco.de/apis/sound/songs");
            const data = await response.json();
            setSongs(data);
        }

        fetchSongs();
    }, [])

    return (
        <>
            <Playlist songs={songs} currentSongId={currentSongId} onSelectSong={onSelectSong} />
            <Player songs={songs} currentSongId={currentSongId} onPlayNext={onPlayNextSong} onPlayPrev={onPlayBackSong} />
        </>
    )
    
}

export default MusicPlayer
