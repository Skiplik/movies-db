import React, { Component } from 'react';

import { Pagination, Space, Spin } from 'antd';
import MovieCard from '../movie-card';
import MovieSearch from '../movie-search';
import MovieService from '../../services/movie-service';
import AppNotice from '../app-notice';

import './app.css';

export default class App extends Component {
    service = new MovieService();

    state = {
        search: '',
        movies: [],

        pagination: {
            page: 1,
            totalResults: 0,
        },

        loading: false,
        notice: null,
    };

    componentDidUpdate(prevProps, { search: prevSearch }) {
        const { search } = this.state;

        if (search !== prevSearch) this.onChangeSearch();
    }

    onChangeSearch = () => {
        const { search } = this.state;

        const pagination = {
            page: 1,
            totalResults: 0,
        };

        if (!search) {
            this.setState({
                movies: [],
                pagination,
            });
            return;
        }

        this.getMovies({ search });
    };

    onError = ({ message = 'Something went wrong!' }) => {
        const notice = {
            type: 'error',
            message,
        };

        const pagination = {
            page: 1,
            totalResults: 0,
        };

        this.setState({
            notice,
            pagination,
            loading: false,
        });
    };

    getMovies({ search, page = 1 }) {
        this.setState({ loading: true });

        this.service
            .searchMovies(search, page)
            .then(({ results: data = [], page: currentPage, total_results: totalResults }) => {
                const pagination = {
                    page: currentPage,
                    totalResults,
                };

                this.setState({
                    movies: data,
                    pagination,
                    loading: false,
                });
            })
            .catch(this.onError);
    }

    setSearch = (search) => this.setState({ search });

    renderMovies = (movies, show) => {
        if (!show) return null;

        if (show && !movies.length) return 'No results ...';

        return movies.map(({ id, ...movie }) => {
            return <MovieCard key={id} movie={movie} />;
        });
    };

    onChangePage = (page) => {
        const { search } = this.state;

        this.getMovies({ search, page });
    };

    checkMoviesState() {
        const { notice, search, loading, movies } = this.state;

        if ((loading && !movies.length) || !search || Boolean(notice)) return false;

        return true;
    }

    render() {
        const {
            loading,
            notice,
            movies,
            pagination: { page, totalResults: total },
        } = this.state;

        const showMovies = this.checkMoviesState();

        const movieBox = this.renderMovies(movies, showMovies);

        const pagination = !total ? null : (
            <Pagination
                current={page}
                size="small"
                total={total}
                defaultPageSize={20}
                showSizeChanger={false}
                onChange={this.onChangePage}
            />
        );

        return (
            <>
                <MovieSearch className="app__search-input" setSearch={this.setSearch} />
                <div className="app__content">
                    <Spin wrapperClassName="app__loader" size="large" spinning={loading} tip="Loading...">
                        <div className="app__space">
                            <Space size={[32, 32]} wrap>
                                {movieBox}
                            </Space>
                        </div>
                        <div className="app__pagination">{pagination}</div>
                    </Spin>
                </div>
                <AppNotice notice={notice} />
            </>
        );
    }
}
