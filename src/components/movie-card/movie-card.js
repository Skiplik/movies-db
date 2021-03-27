import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { Card, Image, Tag, Space } from 'antd';
import { format } from 'date-fns';

import './movie-card.css';

const { Meta } = Card;

export default class MovieCard extends Component {
    static propTypes = {
        movie: PropTypes.shape({
            title: PropTypes.string,
            poster_path: PropTypes.string,
            release_date: PropTypes.string,
            genre_ids: PropTypes.arrayOf(PropTypes.number),
            overview: PropTypes.string,
        }).isRequired,
    };

    constructor(props) {
        super(props);

        this.descRef = React.createRef();
        this.descBoxRef = React.createRef();
    }

    componentDidMount() {
        this.cropText();
    }

    cropText = () => {
        const descBox = this.descBoxRef.current;
        const desc = this.descRef.current;

        while (descBox.clientHeight < desc.clientHeight) {
            const descArr = desc.textContent.split(' ');

            desc.textContent = `${descArr.slice(0, descArr.length - 2).join(' ')} ...`;
        }
    };

    getImageSrc = () => {
        const {
            movie: { poster_path: poster = null },
        } = this.props;

        return poster ? `https://image.tmdb.org/t/p/w500${poster}` : '';
    };

    tagsList = () => {
        const {
            movie: { genre_ids: tagsId = [] },
        } = this.props;

        return tagsId.map((id) => <Tag key={id}>Action</Tag>);
    };

    render() {
        const {
            movie: { title = '', release_date: date = null, overview: desc = '' },
        } = this.props;

        const formatDate = date ? format(new Date(date), 'MMMM d, uuuu') : 'Release date not specified';

        return (
            <Card className="movie-card">
                <Image className="movie-card__img" src={this.getImageSrc()} />
                <Meta
                    className="movie-card__meta"
                    title={title}
                    description={
                        <Space direction="vertical" size={[7]}>
                            <p className="movie-card__date">{formatDate}</p>
                            <Space size={[8, 6]} className="movie-card__tags" wrap>
                                {this.tagsList()}
                            </Space>
                            <div ref={this.descBoxRef} className="movie-card__desc">
                                <p ref={this.descRef}>{desc}</p>
                            </div>
                        </Space>
                    }
                />
            </Card>
        );
    }
}
