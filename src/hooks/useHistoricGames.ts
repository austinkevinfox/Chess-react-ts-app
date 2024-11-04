import games from '../data/historic-games';

const useHistoricGames = () => ({
    data: games,
    isLoading: false,
    error: null,
});

export default useHistoricGames;
