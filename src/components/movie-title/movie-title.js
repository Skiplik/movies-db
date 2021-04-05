import React from 'react';

import PropTypes from 'prop-types';

import './movie-title.css';

const MovieTitle = (props) => {
    const { title, voteAverage } = props;

    const className = ['movie-card__title'];

    if (voteAverage <= 3) className.push('movie-card__title--lvl1');
    if (voteAverage > 3 && voteAverage <= 5) className.push('movie-card__title--lvl2');
    if (voteAverage > 5 && voteAverage <= 7) className.push('movie-card__title--lvl3');
    if (voteAverage > 7) className.push('movie-card__title--lvl4');

    return (
        <div className={className.join(' ')} data-vote-average={voteAverage}>
            {title}
        </div>
    );
};

MovieTitle.propTypes = {
    title: PropTypes.string.isRequired,
    voteAverage: PropTypes.number.isRequired,
};

export default MovieTitle;
