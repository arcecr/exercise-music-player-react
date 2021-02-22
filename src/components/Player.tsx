import { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'

import { Song } from '../types/Song'
import { toHHMMSS } from '../utils'

interface Props {
    songs: Song[]
    currentSongId: number,
    onPlayNext: (songId: number) => void,
    onPlayPrev: (songId: number) => void
}

const Player = (props: Props) => {
    const [player, setPlayer] = useState(new Audio())
    const [playing, setPlaying] = useState<boolean>(false)
    const progressBarRef = useRef<HTMLDivElement>(null);

    const [shuffle, setShuffle] = useState<boolean>(false)
    const [loop, setLoop] = useState<boolean>(false)

    const [songId, setSongId] = useState<number>(0)
    const [totalDuration, setTotalDuration] = useState<number>(0)
    const [currentTime, setCurrentTime] = useState<number>(0)

    const onTimeUpdate = () => {
        setCurrentTime(player.currentTime);
        
        const progressBarWidth = progressBarRef.current?.offsetWidth || 0;

        const nowProgress = document.getElementsByClassName('now')[0] as HTMLElement 
        const handleProgress =  document.getElementsByClassName('handle')[0] as HTMLElement

        let calculated = parseFloat((player.currentTime / player.duration).toString()) * parseFloat(progressBarWidth.toString())

        nowProgress.style.width = (calculated).toString() + "px";
        handleProgress.style.left = (calculated).toString() + "px";
    }

    const onLoadMetaData = () => {
        setTotalDuration(Math.floor(player.duration))
    }

    const onEnded = () => loop ? handlePlay() : handleNextSong()

    useEffect(() => {
        setSongId(props.currentSongId)

        player.addEventListener("loadedmetadata", onLoadMetaData);
        player.addEventListener("timeupdate", onTimeUpdate)
        player.addEventListener("ended", onEnded)
        return () => {
            player.removeEventListener("timeupdate", onTimeUpdate)
            player.removeEventListener("loadedmetadata", onLoadMetaData)
            player.addEventListener("ended", onEnded)
        }
    }, [props.currentSongId, player])

    useEffect(() => {
        if (props.songs.length) {
            loadSong();
        }
    }, [props.songs, songId])

    const handlePlay = () => {
        setPlaying(true);
        player.play();
    }

    const handlePause = () => {
        setPlaying(false)
        player.pause();
    }

    const handleNextSong = () => {
        let nextSongId = songId + 1;

        if (shuffle) nextSongId = Math.floor(Math.random() * props.songs.length + 0);
        if (nextSongId >= props.songs.length) nextSongId = 0;

        props.onPlayNext(nextSongId)
        setSongId(nextSongId)
    }

    const handlePrevSong = () => {
        let prevSongId = songId - 1;

        if (shuffle) prevSongId = Math.floor(Math.random() * props.songs.length + 0);
        if (prevSongId < 0) prevSongId = props.songs.length - 1

        props.onPlayPrev(prevSongId)
        setSongId(prevSongId)
    }

    const toggleShuffle = () => setShuffle(!shuffle)
    const toggleLoop = () => setLoop(!loop)

    const loadSong = () => {
        const songUrl = "https://assets.breatheco.de/apis/sound/" + props.songs[songId].url;
            
        let clonePlayer = player;
        clonePlayer.src = player.src !== songUrl ? songUrl : player.src;
        clonePlayer.loop = loop;
        clonePlayer.currentTime = 0;
        clonePlayer.autoplay = true;

        setPlayer(clonePlayer)
        setPlaying(true)
    }
    
    return (
        <StyledPlayer>
            <div className="progress">
                <span className="start">{toHHMMSS(totalDuration)}</span>
                <div className="progressBar" ref={progressBarRef}>
                    <div className="now" />
                    <div className="handle" />
                </div>
                <span className="end">{toHHMMSS(currentTime)}</span>
            </div>

            <div className="controls">
                <button className={`controlBtn loop ${loop ? "active" : "disable"}`} onClick={toggleLoop} />
                <button className="controlBtn previous" onClick={handlePrevSong} />
                {playing 
                ? <button className="controlBtn pause" onClick={handlePause} />
                : <button className="controlBtn play" onClick={handlePlay} />
                }
                <button className="controlBtn next" onClick={handleNextSong} />
                <button className={`controlBtn shuffle ${shuffle ? "active" : "disable"}`} onClick={toggleShuffle} />
            </div>
        </StyledPlayer>
    )
}

const StyledPlayer = styled.div`
    align-items: center;
    background: white;
    border-top: 1px solid rgba(0, 0, 0, .1);
    bottom: 0;
    display: flex;
    height: 140px;
    flex-direction: column;
    left: 0;
    position: fixed;
    padding: 0 60px;
    margin: auto 0;
    width: 100%;

    .controls {
        margin: auto 0;
        height: 50px;
        display: flex;
    }

    .controlBtn {
        background: none;
        border: none;
        color: #343434;
        font-size: 27px;
        margin: 0 10px;
        padding: 5px;
        transition: 0.2s ease;

        &:hover {
            transform: scale(1.15);
        }

        &::before {
            font-family: 'FontAwesome'; 
            font-weight: 400; 
            vertical-align: middle;
        }

        &:focus {
            outline: none;
        }

        &.disable {
            opacity: .5;
        }

        &.active {
            opacity: 1
        }
        
        &.previous::before {
            content: "\f048";
        }

        &.play::before {
            content: "\f04b";
        }

        &.loading::before {
            content: ""
        }

        &.pause::before {
            content: "\f04c";
        }

        &.next::before {
            content: "\f051";
        }

        &.shuffle::before {
            content: "\f074";
        }

        &.loop::before {
            content: "\f2f9";
        }
    }

    .progress {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        height: 50px;
        margin: auto 0;
        cursor: pointer;

        .progressBar {
            flex-grow: 1;
            position: relative;
            height: 5px;
            border-radius: 2px;
            background-color: #eee;
            margin: auto 15px;

            .now {
                position: absolute;
                left: 0;
                height: 5px;
                background: #FF9630;
                border-radius: 2px;
                cursor: pointer;
            }

            .handle {
                margin-left: -5px;
                height: 15px;
                top: -5px;
                width: 15px;
                border-radius: 50%;
                background-color: white;
                position: absolute;
                -webkit-box-shadow: 0px 0.1px 1px 1px rgb(0 0 0 / 50%);
                0px 0.1px 1px 1px rgb(0 0 0 / 50%);
            }
        }
    }
`

export default Player
