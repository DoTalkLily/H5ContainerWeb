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

const Resource = Model.define('resources', {

    id: {
        type: DataType.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },

    name: {
        type: DataType.STRING(100),
        allowNull: false,
        comment:'资源包名'
    },

    version: {
        type: DataType.STRING(100),
        allowNull: false,
        defaultValue: '0.0.1',
        comment: '资源版本号'
    },

    host: {
        type: DataType.TEXT,
        allowNull: false,
        comment: '资源存放cdn地址'
    },

    path: {
        type: DataType.TEXT,
        allowNull: false,
        comment: '服务器上的存放目录'
    },

    description: {
        type: DataType.TEXT,
        comment: '资源描述'
    },

    create: {
        type: DataType.DATE,
        allowNull: false,
        defaultValue: DataType.NOW,
        comment: '创建时间'
    },

    modified: {
        type: DataType.DATE,
        allowNull: false,
        defaultValue: DataType.NOW,
        comment: '修改时间'
    },

    md5: {
        type: DataType.STRING(32),
        allowNull: false,
        comment: '资源md5'
    },

    expires: {
        type: DataType.DATE,
        allowNull: false,
        comment: '过期时间'
    },

    status: {
        type: DataType.INTEGER,
        allowNull: false,
        comment: '资源包状态 可用：1 异常：2'
    }

});

export default Resource;
