/**
 * Created by Seven on 17/3/9.
 */

const dateUtils = {
    getDate(delta, date){
        let d = date || new Date();
        return d.setDate(d.getDate() + delta);
    }
};

export default dateUtils;