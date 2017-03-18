/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */
import path from 'path';
import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import expressJwt from 'express-jwt';
import React from 'react';
import fs from 'fs';
import ReactDOM from 'react-dom/server';
import UniversalRouter from 'universal-router';
import PrettyError from 'pretty-error';
import morgan from 'morgan';
import fileStreamRotator from 'file-stream-rotator';
import App from './components/App';
import Html from './components/Html';
import {ErrorPageWithoutStyle} from './routes/error/ErrorPage';
import errorPageStyle from './routes/error/ErrorPage.css';
import models from './data/models';
import routes from './routes';
import uploader from './core/multerUploader';
import scpUtils from './core/scpUtils';
import dateUtils from './core/dateUtils';
import assets from './assets.json'; // eslint-disable-line import/no-unresolved
import configureStore from './store/configureStore';
import {setRuntimeVariable} from './actions/runtime';
import {port, auth} from './config';
import Resource from './data/models/Resource';
import {cdn} from './config';
import * as Consts from './constants';

const app = express();

if (app.get('env') == 'production') {
    var logDir = path.join(__dirname, 'logs');
    fs.existsSync(logDir) || fs.mkdirSync(logDir);
    var accessLogStream = fileStreamRotator.getStream({
        date_format: 'YYYYMMDD',
        filename: path.join(logDir, 'access-%DATE%.log'),
        frequency: 'daily',
        verbose: true
    });

    app.use(morgan('combined', {stream: accessLogStream}));
} else {
    app.use(morgan('dev'));
}


//
// Tell any CSS tooling (such as Material UI) to use all vendor prefixes if the
// user agent is not known.
// -----------------------------------------------------------------------------
global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'all';

//
// Register Node.js middleware
// -----------------------------------------------------------------------------
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//
// Authentication
// -----------------------------------------------------------------------------
app.use(expressJwt({
    secret: auth.jwt.secret,
    credentialsRequired: false,
    getToken: req => req.cookies.id_token,
}));

if (__DEV__) {
    app.enable('trust proxy');
}

/**
 *
 * 创建新资源
 { fieldname: 'file',
  originalname: 'bao.zip',
  encoding: '7bit',
  mimetype: 'application/zip',
  destination: './uploads/',
  filename: 'c15e07307438ac80b6a022c2468b6248.zip',
  path: 'uploads/c15e07307438ac80b6a022c2468b6248.zip',
  size: 2029 }
 */
app.post('/resource-upload', uploader, function (req, res) {
    res.send('success');

    let file = req.file;
    let params = req.body;
    //copy to cdn
    scpUtils.scpTop(req.file.path, function (err) {
        if (err) return;
        fs.unlink(file.path, err => {
            if (err) return console.error(err)
        })
    });

    Resource.create({
        status: 1,
        name: file.originalname,
        host: params.resourceHost || cdn.host,
        path: params.resourcePath || cdn.path + file.originalname,
        md5: file.filename.substring(0, file.filename.indexOf('.')),
        version: params.version || '0.0.1',
        expires: params.expireDate || dateUtils.getDate(7),
        description: params.description,
        application_package: params.applicationPackage || 'com.github.lzyzsd.jsbridge.example' //mock
    })
        .then(function (result) {
            console.log(result);
        }).catch(function (error) {
        console.error(error);
    })
});

//get resource record
app.get('/resource', uploader, function (req, res) {
    if (!req.query.applicationPackage) {
        return res.send(error(Consts.PARAM_ERROR_CODE, Consts.PARAM_ERROR_MSG));
    }
    Resource.findAll({
        where: {
            application_package: req.query.applicationPackage
        }
    }).then(function (result) {
        res.send(ok(result));
    }).catch(function (error) {
        console.log(error);
        res.send(error());
    })
});

//
// page related
// -----------------------------------------------------------------------------
app.get('/*', async(req, res, next) => {
    try {
        const store = configureStore({
            user: req.user || null,
        }, {
            cookie: req.headers.cookie,
        });

        store.dispatch(setRuntimeVariable({
            name: 'initialNow',
            value: Date.now(),
        }));

        const css = new Set();

        // Global (context) variables that can be easily accessed from any React component
        // https://facebook.github.io/react/docs/context.html
        const context = {
            // Enables critical path CSS rendering
            // https://github.com/kriasoft/isomorphic-style-loader
            insertCss: (...styles) => {
                // eslint-disable-next-line no-underscore-dangle
                styles.forEach(style => css.add(style._getCss()));
            },
            // Initialize a new Redux store
            // http://redux.js.org/docs/basics/UsageWithReact.html
            store,
        };

        const route = await UniversalRouter.resolve(routes, {
            ...context,
            path: req.path,
            query: req.query,
        });

        if (route.redirect) {
            res.redirect(route.status || 302, route.redirect);
            return;
        }

        const data = {...route};
        data.children = ReactDOM.renderToString(<App context={context}>{route.component}</App>);
        data.styles = [
            {id: 'css', cssText: [...css].join('')},
        ];
        data.scripts = [
            assets.vendor.js,
            assets.client.js,
        ];
        data.state = context.store.getState();
        if (assets[route.chunk]) {
            data.scripts.push(assets[route.chunk].js);
        }

        const html = ReactDOM.renderToStaticMarkup(<Html {...data} />);
        res.status(route.status || 200);
        res.send(`<!doctype html>${html}`);
    } catch (err) {
        next(err);
    }
});

//
// Error handling
// -----------------------------------------------------------------------------
const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');

app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
    console.log(pe.render(err)); // eslint-disable-line no-console
    const html = ReactDOM.renderToStaticMarkup(
        <Html
            title="Internal Server Error"
            description={err.message}
            styles={[{id: 'css', cssText: errorPageStyle._getCss()}]} // eslint-disable-line no-underscore-dangle
        >
        {ReactDOM.renderToString(<ErrorPageWithoutStyle error={err}/>)}
        </Html>,
    );
    res.status(err.status || 500);
    res.send(`<!doctype html>${html}`);
});

function ok(data) {
    return {
        data: data,
        errCode: 0,
        errMsg: ''
    }
}

function error(errCode, errMsg, data){
    return {
        data: data,
        errCode: errCode || -1,
        errMsg: errMsg || 'service error'
    }
}
//
// Launch the server
// -----------------------------------------------------------------------------
/* eslint-disable no-console */
models.sync().catch(err => console.error(err.stack)).then(() => {
    app.listen(port, () => {
        console.log(`The server is running at http://localhost:${port}/`);
    });
});
/* eslint-enable no-console */
