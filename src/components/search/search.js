import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { Pagination, Spin } from 'antd';
import MovieCard from '../movie-card';
import MovieSearch from '../movie-search';

import './search.css';

export default class Search extends Component {
    static propTypes = {
        searchMovies: PropTypes.func.isRequired,
        rateMovie: PropTypes.func.isRequired,
        setNotice: PropTypes.func.isRequired,
    };

    state = {
        search: '',
        movies: [],
        pagination: {
            page: 1,
            totalResults: 0,
        },
        loading: false,
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
        const { setNotice } = this.props;

        setNotice({
            type: 'error',
            message,
        });

        const pagination = {
            page: 1,
            totalResults: 0,
        };

        this.setState({
            pagination,
            loading: false,
        });
    };

    onChangePage = (page) => {
        const { search } = this.state;

        this.getMovies({ search, page });
    };

    getMovies({ search, page = 1 }) {
        const { searchMovies } = this.props;

        this.setState({ loading: true });

        searchMovies(search, page)
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

        const { setNotice, rateMovie } = this.props;

        return movies.map((movie) => {
            return <MovieCard rateMovie={rateMovie} setNotice={setNotice} key={movie.id} movie={movie} />;
        });
    };

    checkMoviesState() {
        const { notice, search, loading, movies } = this.state;

        if ((loading && !movies.length) || !search || Boolean(notice)) return false;

        return true;
    }

    render() {
        const {
            loading,
            movies,
            pagination: { page, totalResults: total },
        } = this.state;

        const showMovies = this.checkMoviesState();

        const movieBox = this.renderMovies(movies, showMovies);

        const pagination =
            total <= 20 ? null : (
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
            <section className="search">
                <MovieSearch className="search__input" setSearch={this.setSearch} />
                <div className="search__content">
                    <Spin wrapperClassName="search__loader" size="large" spinning={loading} tip="Loading...">
                        <div className="search__space">{movieBox}</div>
                        <div className="search__pagination">{pagination}</div>
                    </Spin>
                </div>
            </section>
        );
    }
}
