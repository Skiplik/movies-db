import React, { Component } from 'react';

import { Space } from 'antd';
import MovieCard from '../movie-card';
import MovieService from '../../services/movie-service';

import './app.css';

export default class App extends Component {
    service = new MovieService();

    state = {
        movies: [],
    };

    componentDidMount() {
        this.service.searchMovies('return').then(({ results: data = [], ...args }) => {
            this.setState({
                movies: data,
                ...args,
            });
        });
    }

    renderMovies = () => {
        const { movies } = this.state;

        return movies.map(({ id, ...movie }) => {
            return <MovieCard key={id} movie={movie} />;
        });
    };

    render() {
        return (
            <>
                <Space size={[32, 32]} wrap>
                    {this.renderMovies()}
                </Space>
            </>
        );
    }
}
