import styled from 'styled-components'

const StyledPlaylistItem = styled.li<{ index: number, isCurrent: boolean }>`
    background-color: ${props => (props.isCurrent ? '#4181f3' : '#f5f5f5')};
    color: ${props => (props.isCurrent ? '#ffffff' : '#343434')};
    cursor: pointer;
    padding: 20px 15px;
    position: relative;
    transition: 0.2s ease;

    :hover {
        background-color: ${props => (!props.isCurrent && 'rgba(0, 0, 0, .1)')};
    }

    &::before {
        content: "${props => `${props.index}`}";
        position: absolute;
        color: ${props => (props.isCurrent ? '#ffffff' : '#969696')};
    }

    .title {
        margin-left: 45px;
    }
`

interface Props {
    index: number,
    title: string,
    isCurrent: boolean,
    onSelectSong: (songId: number) => void
}

const PlaylistItem = ({ index, title, isCurrent, onSelectSong }: Props) => {
    return (
        <StyledPlaylistItem index={index} isCurrent={isCurrent} onClick={() => onSelectSong(index)}>
            <span className="title">{ title }</span>
        </StyledPlaylistItem>
    )
}

export default PlaylistItem
