'use strict';

import React from 'react';
import axios from 'axios';

import ImageGallery from '../components/ImageGallery';

let Gallery = React.createClass({

    getInitialState() {
        return {images: []};
    },

    componentDidMount() {
        axios.get('/api/gallery').then(function(response) {
            this.setState({
                images: response.data
            });
        }.bind(this)).catch(function(response) {
            console.error(response);
        });
    },

    render() {
          return (
            <ImageGallery
              items={this.state.images}
              autoPlay={true}
              slideInterval={4000}/>
          );
      }
});

export default Gallery;


