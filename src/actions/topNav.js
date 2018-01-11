import CONSTS, {Login, CacheName, API, AlertType } from '../config/consts';
//import fetch from 'isomorphic-fetch';
import { req } from '../main/requests';
import COMMON,{ mem, alog } from '../function/common';
import Request from '../main/requests';


export const newseed = ()=> {
    return {
        type:CONSTS.action.newseed
    }  
}

export const getWalletInfo = (token,lang,coinname)=> {
    return (dispatch,getState)=>{

        Request({
            url:'/wallet/?action=info',
            method:'post',
            datas:{
                lang:lang,
                token:token,
                coinName:coinname
            },
            callBack:(res)=>{
                COMMON.alog('request ====== ');
                COMMON.alog(res);
                if(res && res.status == 1){
                    let coin = res.msg.coin;
                    dispatch({
                        type:CONSTS.action.getinfo,
                        item:{
                            coinName:coin.coinname,
                            balance:{ 
                                num:coin.num,
                                numd:coin.numd
                            }
                        }
                    });
                    let trans_log = res.msg.trans_list;
                    trans_log && dispatch({
                        type:CONSTS.action.getTrans,
                        item:trans_log
                    });
                }
            }
        });
    }
}

export const getWalletAddress = (token,lang,coinname)=> {
    return (dispatch)=>{

        Request({
            url:'/wallet/?action=listAddr',
            method:'post',
            datas:{
                lang:lang,
                token:token,
                coinName:coinname
            },
            callBack:(res)=>{
                
                if(res && res.status == 1){
                    COMMON.alog(res);
                    let addrList = res.msg;
                    dispatch({
                        type:CONSTS.action.getAddressList,
                        item:addrList,
                    });
                }
            }
        });
    }
}

export const createNewAddress = (token,lang,coinname,mark)=> {
    return (dispatch,getState)=>{

        Request({
            url:'/wallet/?action=newAddr',
            method:'post',
            datas:{
                lang:lang,
                token:token,
                coinName:coinname,
                mark:mark
            },
            callBack:(res)=>{
                
                if(res){
                    if(res.status == 1){
                        dispatch({
                            type:CONSTS.action.createNewAddressSuccess,
                            item:res
                        });
                        // getWalletAddress(token,lang,coinname)(dispatch);
                        // cancelAlertStatus(dispatch);
                    }else {
                        dispatch({
                            type:CONSTS.action.createNewAddressFail,
                            item:res
                        });
                        // cancelAlertStatus(dispatch);
                    }
                    
                }
            }
        });
    }
}

export const requestCoinList = (token,lang,curcoin='')=> {
    return (dispatch,getState)=>{

        Request({
            url:'/wallet/?action=coinlist',
            method:'post',
            datas:{
                lang:lang,
                token:token,
                curcoin:curcoin,
            },
            callBack:(res)=>{
                
                if(res){

                    console.log(res);
                    dispatch({
                        type:CONSTS.action.requestCoinList,
                        item:res
                    });
                }
            }
        });
    }
}

export const sendCoinAction = (lang,token,coinName,target,value) => {
    return (dispatch)=>{
        
                Request({
                    url:'/wallet/?action=sendTrans',
                    method:'post',
                    datas:{
                        lang:lang,
                        token:token,
                        coinName:coinName,
                        target:target,
                        value:value
                    },
                    callBack:(res)=>{
                        if(res){
                            COMMON.alog(res);
                            dispatch({
                                type:CONSTS.action.transDone,
                                item: res
                            });
                        }
                    }
                });
            }
}

export const selectCoin = (coinName) => {
    return {
        type:CONSTS.action.selectCoin,
        coinName:coinName
    }
}

export const selectLang = (lang) => {
    return (dispatch) => {
        dispatch( {
            type:CONSTS.action.selectLang,
            lang:lang
        });
    }
}

export const sendAlert = (text) => {
    return {
        type:CONSTS.action.sendAlert,
        text:text
    }
}

export const cancelAlert = () => {
    return {
        type:CONSTS.action.cancelAlert
    }
}


// 取消 请求地址列表的状态
export const cancelAlertStatus = () => {

    COMMON.alog('run cancelAlert status');
    return {
        type:CONSTS.action.cancelAlertStatus
    }
}




export const tabChangeAction = i => ({
    type: CONSTS.type.changeTab,
    item: i,
  });

export const alertAction = (type, msg) => {
    return {
        type: type,
        msg: msg,
    }
};

export const changeTab = (i) =>{
    return (dispatch) => {
      dispatch( tabChangeAction(i) );
    };
}

export const fun_change = (key) => {
    return (dispatch) => (dispatch) => {
        dispatch( tabChangeAction(key) );
    };
}

export const loginAction = (username, password) => {
    return (dispatch) => {
        dispatch({type:Login.logining});
        art("登录中",AlertType.infoAlert)(dispatch);
        return req('app/login/submit','post',{
            "username":username,
            "password":password
        },(data)=>{
            if( data.status == 1 ){
                mem(CacheName.userid,data.info.ID);
                mem(CacheName.userToken,data.info.TOKEN);
                dispatch({type:Login.loginSuc,res:data.info});

                alog('get user info');
                dispatch({type:API.startGetUserInfo});
                art("获取用户信息中...")(dispatch);
                req("app/user/userinfo","get",{},(data2)=>{
                    if(data2.status == 1){
                        return dispatch({type:API.successGetUserInfo,res:data2.info.baseinfo})
                    }
                    else{

                        return dispatch({type:API.failGetUserInfo,res:data2.info});
                    }
                },true);
            }
            else {
               return dispatch({type:Login.loginFail,res:data.info});
            }
        });
    }
}

export const getUserInfo = () => {
    alog('get user info start');
    return (dispatch) => {
        alog('get user info');
        dispatch({type:API.startGetUserInfo});
        req("app/user/userinfo","get",{},(data2)=>{
            if(data2.status == 1){
                return dispatch({type:API.successGetUserInfo,res:data2.info})
            }
            else{

                return dispatch({type:API.failGetUserInfo,res:data2.info});
            }
        },true);
    };
}

export const art = ( msg, type = AlertType.infoAlert, time = 3000 ) =>{
    return (dispatch) =>{
        setTimeout(()=>{
            dispatch({
                type:AlertType.cancelAlert
            })
        },time);
        return dispatch({
            type:type,
            obj:{msg:msg,time:time}
        });
    }
}

export const getMyfinan = () => {

    return (dispatch) => {
        req("app/user/finan","post",{},(data)=>{
            if(data.status == 1){
                return dispatch({type:CONSTS.api.successGetMyFinan,res:data.info})
            }
            else{
                return dispatch({type:CONSTS.api.failGetMyFinan,res:data.info});
            }
        },true)
    }
}

export const changeFinanChargeTab = (tabIndex) => {
    return {
        type:CONSTS.chageTabFinan.charge,
        item:tabIndex
    }
}



export default {
    art:art,
    changeTab:changeTab,
    changeFinanChargeTab:changeFinanChargeTab,
    getWalletInfo:getWalletInfo
};