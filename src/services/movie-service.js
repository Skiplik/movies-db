export default class MovieService {
    baseUrl = 'https://api.themoviedb.org/3';

    paramKey = 'api_key=f4aeda1b0b2427fbfef99b304986a9bd';

    searchMovies = async (searchString) => {
        const url = `${this.baseUrl}/search/movie?${this.paramKey}&query=${searchString}`;

        try {
            const response = await fetch(url);

            const parseResponse = await response.json();

            return parseResponse;
        } catch (error) {
            // eslint-disable-next-line no-console
            console.log(error);

            return [];
        }
    };
}
