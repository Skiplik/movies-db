import React, { useContext } from 'react';

import { Tag } from 'antd';
import PropTypes from 'prop-types';
import GenresContext from '../../genres-context';

import './movie-genres.css';

const MovieGenres = (props) => {
    const { genreIds } = props;

    const genres = useContext(GenresContext);

    return genreIds.map((id) => {
        const genreData = genres.filter((genre) => genre.id === id);

        if (genreData.length) {
            return (
                <Tag className="movie-card__tag" key={id}>
                    {genreData[0].name}
                </Tag>
            );
        }

        return null;
    });
};

MovieGenres.propTypes = {
    genreIds: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default MovieGenres;
