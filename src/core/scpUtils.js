/**
 * Created by Seven on 17/3/8.
 * https://github.com/spmjs/node-scp2
 * copy resource to cdn
 */
import client from 'scp2';
import { cdn } from '../config';

const scpUtils = {
    scpTop: function (fileName,callback) {
        client.scp(fileName, {
            host: cdn.host,
            username: cdn.user,
            password: cdn.pw,
            path: cdn.path
        }, function(err) {
            callback(err);
        });
    }
};

export default scpUtils;
