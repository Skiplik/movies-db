import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { Pagination, Spin } from 'antd';
import MovieCard from '../movie-card';

import './rated.css';

export default class Rated extends Component {
    static propTypes = {
        getRateMovies: PropTypes.func.isRequired,
        setNotice: PropTypes.func.isRequired,
        visible: PropTypes.bool.isRequired,
    };

    state = {
        movies: [],
        pagination: {
            page: 1,
            totalResults: 0,
        },
        loading: false,
    };

    componentDidMount() {
        this.getMovies();
    }

    componentDidUpdate(prevProps) {
        const { visible: prevVisible } = prevProps;
        const { visible } = this.props;

        if (!prevVisible && visible) this.getMovies();
    }

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
        this.getMovies(page);
    };

    getMovies(page = 1) {
        const { getRateMovies } = this.props;

        this.setState({ loading: true });

        getRateMovies(page)
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

    renderMovies = (movies, show) => {
        if (!show) return null;

        if (show && !movies.length) return "You haven't scored a single movie yet";

        const { setNotice } = this.props;

        return movies.map((movie) => {
            return <MovieCard rateMovieEnable={false} setNotice={setNotice} key={movie.id} movie={movie} />;
        });
    };

    checkMoviesState() {
        const { notice, loading, movies } = this.state;

        if ((loading && !movies.length) || Boolean(notice)) return false;

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
            <section className="rated">
                <div className="rated__content">
                    <Spin wrapperClassName="rated__loader" size="large" spinning={loading} tip="Loading...">
                        <div className="rated__space">{movieBox}</div>
                        <div className="rated__pagination">{pagination}</div>
                    </Spin>
                </div>
            </section>
        );
    }
}
