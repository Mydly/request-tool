const Alert = require('../config/consts');
export default function alert(state = {alert:false}, action) {
    switch (action.type){
        case Alert.errorAlert:
        case Alert.warningAlert:
        case Alert.infoAlert:
        case Alert.successAlert:
        {
            return Object.assign({}, state, {
                alert:true,
                msg:action.obj.msg,
                type:action.type,
            });
        }
        case Alert.cancelAlert:
            return Object.assign({}, state,{
                alert:false
            });
        default:
            return state;
    }
}