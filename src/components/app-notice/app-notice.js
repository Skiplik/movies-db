import React from 'react';
import { Alert } from 'antd';
import PropTypes from 'prop-types';

const AppNotice = ({ notice }) => {
    if (!notice) return null;

    const { type, message } = notice;

    return (
        <Alert
            className="app__error"
            message={`${type[0].toUpperCase() + type.slice(1)}!`}
            description={message}
            type={type}
            showIcon
            closable
        />
    );
};

AppNotice.defaultProps = {
    notice: null,
};

AppNotice.propTypes = {
    notice: PropTypes.objectOf(PropTypes.string),
};

export default AppNotice;
