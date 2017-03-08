/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Layout from '../../components/Layout';
import Page from '../../components/Page';

export default {

  path: '/about',

  async action() {
    const data = await require.ensure([], require => require('./about.md'), 'about');

    return {
      title: data.title,
      chunk: 'about',
      component: <Layout><Page {...data} /></Layout>,
    };
  },

};
