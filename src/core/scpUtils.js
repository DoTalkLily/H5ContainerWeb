/**
 * Created by Seven on 17/3/8.
 * https://github.com/spmjs/node-scp2
 * copy resource to cdn
 */
import client from 'scp2';

const scpUtils = {
    scpTop: function (filePath) {
        client.scp(filePath, {
           //info hidden
        }, function(err) {
        })
    }
};

export default scpUtils;
