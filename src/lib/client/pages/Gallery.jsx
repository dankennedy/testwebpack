'use strict';

import React from 'react';
import axios from 'axios';

import ImageGallery from '../components/ImageGallery';

export default class Gallery extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            images: []
        };
    }

    componentDidMount() {
        axios.get('/api/gallery').then(function(response) {
            this.setState({
                images: response.data
            });
        }.bind(this)).catch(function(response) {
            console.error(response);
        });
    }

    render() {
        return (
            <ImageGallery items={this.state.images} autoPlay={true} slideInterval={4000}/>
        );
    }
};
