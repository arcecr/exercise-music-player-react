import styled from 'styled-components'
import { Song } from '../types/Song';
import PlaylistItem from './PlaylistItem';

const StyledPlaylist = styled.ul`
    overflow-y: auto;
    max-height: calc(100vh - 140px);
`

interface Props {
    songs: Song[],
    currentSongId: number,
    onSelectSong: (SongId: number) => void
}

const Playlist = ({ songs, currentSongId, onSelectSong }: Props) => {
    return (
        <>
            <StyledPlaylist>
                {songs.map((song, i) => {
                    return <PlaylistItem key={i} index={i} title={song.name} isCurrent={currentSongId === i} onSelectSong={onSelectSong} />
                })}
            </StyledPlaylist>
        </>
    )
}

export default Playlist
