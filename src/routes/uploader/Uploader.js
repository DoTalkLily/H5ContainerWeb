/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, {PropTypes, Component} from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Uploader.css';
import fetch from '../../core/fetch';


var Dropzone = require('react-dropzone');

class Uploader extends Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            file: '',
            uploading: false
        };
    }

    onDrop(acceptedFiles, rejectedFiles) {
        if (!acceptedFiles) return;

        this.setState({
            uploading: true,
            file: acceptedFiles[0]
        });

        this.uploadFile(acceptedFiles[0]);
    }

    async uploadFile(file) {
        const form = new FormData();
        form.append('file', file);
        const resp = await fetch('/resource-upload', {
            method: 'post',
            body: form,
            credentials: 'include',
        });
        let data = await resp.json();
    }

    render() {
        let tips = this.state.uploading && this.state.file
                      ? 'Uploading' + this.state.file.name
                      : 'Update Accomplished!';
        return (
            <div className={s.root}>
                <div className={s.container}>
                    <h1>{this.props.title}</h1>
                    <div>
                        {
                            this.state.file
                                ? <div>{ tips }</div>
                                : <Dropzone onDrop={this.onDrop.bind(this)} accept={'application/zip'}>
                                <div>Try dropping some files here, or click to select files to upload.</div>
                            </Dropzone>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default withStyles(s)(Uploader);
