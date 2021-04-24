import { createContext, useState, ReactNode } from 'react';

type Episode = {
  title: string;
  members: string;
  thumbnail: string;
  duration: string;
  url: string;
}

type PlayerContextData = {
  episodeList: Episode[];
  currentEpisodeIndex: number;
  play: (episode: Episode) => void;
  isPlaying: boolean;
  togglePlay: () => void;
  setPlayingState: (state: boolean) => void;
  playList: (list: Episode[], index: number) => void;
  playNext: () => void;
  playPrevious: () => void;
};

type PlayerContextProviderProps = {
  children: ReactNode
}

export const PlayerContext = createContext({} as PlayerContextData);

export function PlayerContextProvider({ children }: PlayerContextProviderProps) {

  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const play = (episode: Episode) => {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }

  const playList = (list: Episode[], index: number) => {
    setEpisodeList(list);
    setCurrentEpisodeIndex(index);
    setIsPlaying(true);
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  }

  const setPlayingState = (state: boolean) => {
    setIsPlaying(state)
  }

  const playNext = () => {
    const nextEpisodeIndex = currentEpisodeIndex + 1;

    if (nextEpisodeIndex < episodeList.length) {
      setCurrentEpisodeIndex(nextEpisodeIndex);
    }
  }

  const playPrevious = () => {
    const previousEpisodeIndex = currentEpisodeIndex - 1;

    if (previousEpisodeIndex >= 0) {
      setCurrentEpisodeIndex(currentEpisodeIndex - 1);
    }

  }

  return (
    <PlayerContext.Provider
      value={{
        episodeList,
        currentEpisodeIndex,
        play,
        isPlaying,
        togglePlay,
        setPlayingState,
        playList,
        playNext,
        playPrevious
      }}>
      {children}
    </PlayerContext.Provider>
  )
}
