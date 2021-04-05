import React, { useState, useEffect } from 'react';

import { Tabs } from 'antd';
import MovieService from '../../services/movie-service';
import AppNotice from '../app-notice';
import Search from '../search';
import GenresContext from '../../genres-context';

import './app.css';
import Rated from '../rated';

const { TabPane } = Tabs;

const { getGenres, getGuestSession, searchMovies, rateMovie, getRateMovies } = new MovieService();

const App = () => {
    const [tab, setTab] = useState(1);
    const [notice, setNotice] = useState(null);
    const [genres, setGenres] = useState([]);

    useEffect(() => {
        async function initApp() {
            const { genres: genresList } = await getGenres();

            await getGuestSession();

            return genresList;
        }

        initApp()
            .then((genresList) => {
                setGenres(genresList);
            })
            .catch(({ message }) => {
                setNotice({
                    type: 'error',
                    message,
                });
            });
    }, []);

    return (
        <GenresContext.Provider value={genres}>
            <Tabs className="app__container" activeKey={`${tab}`} onChange={setTab} centered>
                <TabPane tab="Search" key="1">
                    <Search
                        searchMovies={(...args) => searchMovies(...args)}
                        rateMovie={rateMovie}
                        setNotice={setNotice}
                    />
                </TabPane>
                <TabPane tab="Rated" key="2">
                    <Rated visible={tab === '2'} getRateMovies={getRateMovies} setNotice={setNotice} />
                </TabPane>
            </Tabs>
            <AppNotice notice={notice} />
        </GenresContext.Provider>
    );
};

export default App;
