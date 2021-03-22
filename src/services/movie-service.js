export default class MovieService {
    baseUrl = 'https://api.themoviedb.org';

    apiKey = 'f4aeda1b0b2427fbfef99b304986a9bd';

    async getResponse(path, params = {}) {
        const url = new URL(`/3${path}`, this.baseUrl);

        url.searchParams.set('api_key', this.apiKey);

        for (const key in params) {
            if (key in params && params[key] !== undefined) {
                url.searchParams.set(key, params[key]);
            }
        }

        const response = await fetch(url);

        if (!response.ok) {
            const { errors } = await response.json();

            throw new Error(errors);
        }

        const parseResponse = await response.json();

        return parseResponse;
    }

    async searchMovies(searchString) {
        const response = await this.getResponse('/search/movie', {
            query: searchString,
        });

        return response;
    }
}
