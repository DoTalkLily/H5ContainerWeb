/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import path from 'path';
import fetch from 'node-fetch';
import { spawn } from './lib/cp';
import { makeDir } from './lib/fs';
import run from './run';

// GitHub Pages
const remote = {
  name: 'github',
  url: 'https://github.com/<user>/<repo>.git',
  branch: 'gh-pages',
  website: 'https://<user>.github.io/<repo>/',
  static: true,
};

// Azure Web Apps
// const remote = {
//   name: 'azure',
//   url: 'https://<user>@<app>.scm.azurewebsites.net:443/<app>.git',
//   branch: 'master',
//   website: `http://<app>.azurewebsites.net`,
// };

const options = {
  cwd: path.resolve(__dirname, '../build', remote.static ? 'public' : ''),
  stdio: ['ignore', 'inherit', 'inherit'],
};

/**
 * Deploy the contents of the `/build` folder to a remote server via Git.
 */
async function deploy() {
  // Initialize a new repository
  await makeDir('build/public');
  await spawn('git', ['init', '--quiet'], options);

  // Changing a remote's URL
  let isRemoteExists = false;
  try {
    await spawn('git', ['config', '--get', `remote.${remote.name}.url`], options);
    isRemoteExists = true;
  } catch (error) {
    /* skip */
  }
  await spawn('git', ['remote', isRemoteExists ? 'set-url' : 'add', remote.name, remote.url], options);

  // Fetch the remote repository if it exists
  let isRefExists = false;
  try {
    await spawn('git', ['ls-remote', '--exit-code', remote.url, remote.branch], options);
    isRefExists = true;
  } catch (error) {
    /* skip */
  }
  if (isRefExists) {
    await spawn('git', ['fetch', remote.name], options);
    await spawn('git', ['reset', `${remote.name}/${remote.branch}`, '--hard'], options);
    await spawn('git', ['clean', '--force'], options);
  }

  // Build the project in RELEASE mode which
  // generates optimized and minimized bundles
  process.argv.push('--release');
  if (remote.static) process.argv.push('--static');
  await run(require('./build').default);

  // Push the contents of the build folder to the remote server via Git
  await spawn('git', ['add', '.', '--all'], options);
  await spawn('git', ['commit', '--message', `Update ${new Date().toISOString()}`], options);
  await spawn('git', ['push', remote.name, `master:${remote.branch}`, '--force', '--set-upstream'], options);

  // Check if the site was successfully deployed
  const response = await fetch(remote.website);
  console.log(`${remote.website} => ${response.status} ${response.statusText}`);
}

export default deploy;
