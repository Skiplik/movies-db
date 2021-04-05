export default class MovieService {
    baseUrl = 'https://api.themoviedb.org';

    apiKey = 'f4aeda1b0b2427fbfef99b304986a9bd';

    guestSession = null;

    async getResponse(path, params = {}, isPost = false, isGuest) {
        const url = new URL(`/3${path}`, this.baseUrl);
        const options = {};

        url.searchParams.set('api_key', this.apiKey);

        if (isGuest && this.guestSession) {
            url.searchParams.set('guest_session_id', this.guestSession);
        }

        if (!isPost) {
            for (const key in params) {
                if (key in params && params[key] !== undefined) {
                    url.searchParams.set(key, params[key]);
                }
            }
        } else {
            options.method = 'POST';
            options.body = JSON.stringify(params);
            options.headers = {
                'Content-Type': 'application/json;charset=utf-8',
            };
        }

        const response = await fetch(url, options);

        if (!response.ok) {
            const { errors } = await response.json();

            throw new Error(errors);
        }

        const parseResponse = await response.json();

        return parseResponse;
    }

    searchMovies = async (query, page) => {
        const response = await this.getResponse('/search/movie', {
            query,
            page,
        });

        return response;
    };

    getGuestSession = async () => {
        const localSession = localStorage.getItem('session');

        if (localSession) {
            this.guestSession = localSession;

            return;
        }

        const { guest_session_id: guestSessionId = null } = await this.getResponse('/authentication/guest_session/new');

        if (guestSessionId) {
            this.guestSession = guestSessionId;
            localStorage.setItem('session', guestSessionId);
        }
    };

    getGenres = async () => {
        const response = await this.getResponse('/genre/movie/list');

        return response;
    };

    rateMovie = async (id, rate) => {
        const response = await this.getResponse(`/movie/${id}/rating`, { value: rate }, true, true);

        return response;
    };

    getRateMovies = async (page) => {
        const response = await this.getResponse(`/guest_session/${this.guestSession}/rated/movies`, {
            page,
        });

        return response;
    };
}
