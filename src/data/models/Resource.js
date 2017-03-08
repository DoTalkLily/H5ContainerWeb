/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import DataType from 'sequelize';
import Model from '../sequelize';

const Resource = Model.define('resource', {

    id: {
        type: DataType.INTEGER,
        primaryKey: true,
    },

    name: {
        type: DataType.STRING(100),
        allowNull: false
    },

    version: {
        type: DataType.STRING(100),
        allowNull: false
    },

    url: {
        type: DataType.TEXT,
        allowNull: false
    },

    description: {
        type: DataType.TEXT
    },

    gmt_create: {
        type: DataType.DATE,
        allowNull: false,
        defaultValue: DataType.NOW
    },

    gmt_modified: {
        type: DataType.DATE,
        allowNull: false,
        defaultValue: DataType.NOW
    },

    md5: {
        type: DataType.STRING(32),
        allowNull: false
    }

});

export default Resource;
