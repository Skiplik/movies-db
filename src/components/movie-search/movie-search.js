import React from 'react';

import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import { Input } from 'antd';

import './movie-search.css';

const MovieSearch = (props) => {
    const { setSearch, className = '' } = props;

    const delayUpdate = debounce(setSearch, 1000);

    return (
        <Input
            className={`search-input ${className}`}
            placeholder="Type to search..."
            onChange={({ target: { value } }) => delayUpdate(value)}
        />
    );
};

MovieSearch.propTypes = {
    setSearch: PropTypes.func.isRequired,
    className: PropTypes.string,
};

MovieSearch.defaultProps = {
    className: '',
};

export default MovieSearch;
