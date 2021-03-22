import React, { Component } from 'react';

import { Space, Spin, Alert } from 'antd';
import MovieCard from '../movie-card';
import MovieService from '../../services/movie-service';

import './app.css';

export default class App extends Component {
    service = new MovieService();

    state = {
        loading: false,
        error: false,
        searchString: 'return',
        movies: [],
    };

    componentDidMount() {
        this.setState({ loading: true });

        setTimeout(() => {
            this.getMovies();
        }, 5000);
    }

    onError = (error) => {
        this.setState({
            error: error.message,
            loading: false,
        });
    };

    getMovies() {
        const { searchString } = this.state;

        this.setState({ loading: true });

        this.service
            .searchMovies(searchString)
            .then(({ results: data = [], ...args }) => {
                this.setState({
                    movies: data,
                    ...args,
                    loading: false,
                });
            })
            .catch(this.onError);
    }

    renderMovies = () => {
        const { movies } = this.state;

        if (!movies.length) return null;

        return movies.map(({ id, ...movie }) => {
            return <MovieCard key={id} movie={movie} />;
        });
    };

    renderError() {
        const { error } = this.state;

        if (!error) return null;

        return <Alert className="app__error" message="Error!" description={error} type="error" showIcon closable />;
    }

    render() {
        const { loading } = this.state;
        const error = this.renderError();
        const movies = this.renderMovies();

        return (
            <>
                <Spin className="app__loader" size="large" spinning={loading} tip="Loading...">
                    <Space size={[32, 32]} wrap>
                        {movies}
                    </Space>
                </Spin>
                {error}
            </>
        );
    }
}
