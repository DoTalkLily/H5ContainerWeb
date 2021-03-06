/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import Sequelize from 'sequelize';
import { db } from '../config';

const sequelize = new Sequelize(db.database, db.user, db.pw, {
    dialect: 'mysql',
    host: db.host,
    port: db.port
});

export default sequelize;
