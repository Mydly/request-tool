import React from 'react';
import {connect} from 'react-redux';
const electron = require('electron');
const app = electron.app || electron.remote.app;

import CONSTS from '../../config/consts';
import COMMON from '../../function/common';

import { Select, Modal, Tooltip, message } from 'antd';

import '../../static/style/common.scss';

import { Radio } from 'antd';
const RadioGroup = Radio.Group;

import { Tabs } from 'antd';
const TabPane = Tabs.TabPane;
import LangJS from '../../config/lang';

import {
    requestCoinList,
    selectCoin,
    selectLang
} from '../../actions/topNav';


class Setting extends React.Component {

    constructor(props) {
        super(props);

        
        this.__requestCoinlist = this.__requestCoinlist.bind(this);
        this.__selectLang = this.__selectLang.bind(this);
        this.__selectCoin = this.__selectCoin.bind(this);
        this.__seePublicKey = this.__seePublicKey.bind(this);
        this.__seePrivateKey = this.__seePrivateKey.bind(this);
        this.__changePassword = this.__changePassword.bind(this);

        this.state = {
            
            lang:COMMON.getLang(),
            selecedCoin:"",
            encodeWords:'********************',
            privatekey:'********************',
            showPublicKeyDialog:false,
            showPublicKey:false,
            showPrivateKeyDialog:false,
            showPrivateKey:false,
            showOldPasswordDialog:false,
            showNewPasswordDialog:false,
            seePublicInputPassword:"",
            seePrivateInputPassword:"",
            oldPasswordInputPassword:"",
            newPasswordInputPassword:"",
            showClearDeviceDialog:false,
            clearDeviceInputPassword:""
        }

    }


    handleSelect(selectedIndex, e) {
        
        this.setState({
            index: selectedIndex,
        });
    }

    copyText( text ){
        const {lang = 'en'} = this.props;
        const {clipboard} = require('electron');
        let err = null;
        try {
            clipboard && clipboard.writeText(text);
        } catch (error) {
            err = 1;
        }

        if(err){
            message.error(LangJS.copyFail[lang]);
        }else{
            message.error(LangJS.copySuccess[lang]);
        }
    }

    __copyPublicKey(){
        this.copyText(COMMON.getPublicKey());
        this.setState({
            showPublicKey:false
        });
    }
    __copyPrivateKey(){
        this.copyText(COMMON.getPrivateKey());
        this.setState({
            showPrivateKey:false
        });
    }

    __selectLang(e){
        
        console.log('select lang function run');

        let {selectLangAction} = this.props;
        let newLang = e.target.value;
        selectLangAction && selectLangAction(newLang);
        COMMON.setLang(newLang);
        this.setState({lang:newLang});
        this.__requestCoinlist();

    }

    __selectCoin(e){

        let {selCoin} = this.props;
        let coinName = e.target.value;
        selCoin && selCoin(coinName);

        this.setState({
            selecedCoin:coinName
        });

        COMMON.setCoinName(coinName);
    }

    __requestCoinlist(){

        let {lang:thatLang = 'en'} = this.props; 
        let token = COMMON.getToken();
        if(!token){
            message.info(thatLang);
        }

        let lang = COMMON.getLang();
        let {reqCoinList} = this.props;
        reqCoinList && reqCoinList(token,lang);
    }

    __seePublicKey(){
        let {lang = 'en'} = this.props; 
        this.setState({
            showPublicKeyDialog:false
        });

        let password = COMMON.getPassword();
        if(!password){
            message.error(LangJS.inputPasswordError[lang]);
            return;
        }
        if(password != this.state.seePublicInputPassword){
            message.info(LangJS.inputPasswordError[lang]);
            return;
        }else {
            this.setState({
                showPublicKey:true
            });
        }

        
    }

    __seePrivateKey(){
        let {lang = 'en'} = this.props; 
        this.setState({
            showPrivateKeyDialog:false
        });

        let password = COMMON.getPassword();
        if(!password){
            message.error(LangJS.inputPasswordError[lang]);
            return;
        }
        if(password != this.state.seePrivateInputPassword){
            message.info(LangJS.inputPasswordError[lang]);
            return;
        }else {
            this.setState({
                showPrivateKey:true
            });
        }
    }


    __checkOldPassword(){
        let {lang = 'en'} = this.props; 
        this.setState({
            showOldPasswordDialog:false
        });

        let password = COMMON.getPassword();
        if(!password){
            message.error(LangJS.inputPasswordError[lang]);
            return;
        }

        if(password != this.state.oldPasswordInputPassword){
            message.info(LangJS.inputPasswordError[lang]);
            return;
        }

        this.setState({
            showNewPasswordDialog:true
        })

        
    }

    __changePassword(){
        let {lang = 'en'} = this.props; 
        let newPassword = this.state.newPasswordInputPassword;
        if( !newPassword || (newPassword == "") ){
            message.info(LangJS.pleaseInputNewPassword[lang]);
            return;
        }

        this.setState({
            showNewPasswordDialog:false
        });
        
        let secret = COMMON.getSecret();
        if( secret ){
            // 缓存密码,公钥,私钥
            COMMON.settingSet( 
                CONSTS.cacheName.secret,
                Object.assign({},secret,{password:newPassword}));
            message.success(LangJS.changingPasswordSuccess[lang]);
        }else {
            message.error(LangJS.walletError[lang]);
            return;
        }
        
    }

    __clearDevice(){

        this.setState({showClearDeviceDialog:false});
        let password = COMMON.getPassword();
        if( !password || (password != this.state.clearDeviceInputPassword) ){
            message.info(LangJS.inputPasswordError[lang]);
            return;
        }

        COMMON.clearStore();
        app.relaunch();
        app.quit(); 
    }

    componentDidMount (){
       this.__requestCoinlist();
    }

    componentWillUpdate(){

        // COMMON.alog('===== 组件将更新 ===== ');
        // COMMON.alog(this.props);
    }

    componentDidUpdate(){
        // COMMON.alog('====== 组件已经更新 =======');
        // COMMON.alog(this.props);
        
    }

    componentWillUnmount(){

    }

    render() {

        console.log(' render =============');
        console.log(this.state.lang);

        let { coinList = [],lang = COMMON.getLang() } = this.props;

        lang = this.state.lang;

        let coinCom = [];
        for(let i = 0; i < coinList.length; i++ ){
            coinCom.push(<Radio className="option" key={i}
                 value={coinList[i]['ename']} checked={ i==0 ? true : false} >{coinList[i]['cname']}</Radio>);
        }
        
       return <div className='bodycontent'>
                <div className="setting">
                    <div className="text_row">
                        <span className="title">{LangJS.selectLang[lang]}:</span>
                        <RadioGroup size="large" onChange={this.__selectLang} value={this.state.lang}>
                            <Radio className="option" value={'en'}>English</Radio>
                            <Radio className="option" value={'cn'}>简体汉语</Radio>
                            {/*<Radio className="option" value={'hk'}>繁體中文</Radio>*/}
                            {/*<Radio className="option" value={'jp'}>日本語</Radio>*/}
                            {/*<Radio className="option" value={'kr'}>한국어</Radio>*/}
                        </RadioGroup>
                    </div>
                    <div className="text_row">
                        <span className="title">{LangJS.publicKey[lang]}:</span>
                        <span >{this.state.encodeWords}</span>
                        <span className="button button2 right" 
                            onClick={()=>{this.setState({
                                showPublicKeyDialog:true
                            })}}
                            >{LangJS.lookOver[lang]}</span>
                        <Modal
                            title={LangJS.checkPublicKey[lang]}
                            visible={this.state.showPublicKeyDialog}
                            okText={LangJS.ok[lang]}
                            cancelText={LangJS.cancel[lang]}
                            onOk={this.__seePublicKey}
                            onCancel={(()=>{this.setState({showPublicKeyDialog:false,password:""})}).bind(this)}
                        >
                        <input type="password" autoFocus style={{height:30,lineHeight:30,width:"96%"}} 
                          placeholder={LangJS.pleaseInputPassword[lang]} 
                          onChange={((e)=>{
                            this.setState({seePublicInputPassword:e.target.value})
                            }).bind(this)} 
                          defaultValue={this.state.password} />
                        </Modal>
                        <Modal
                            title={LangJS.publicKey[lang]}
                            visible={this.state.showPublicKey}
                            okText={LangJS.copyToClipboard[lang]}
                            cancelText={LangJS.close[lang]}
                            onOk={this.__copyPublicKey.bind(this)}
                            onCancel={
                                ()=>{this.setState({showPublicKey:false,password:""})}
                            }
                            >
                            <p>{COMMON.getPublicKey()}</p>
                        </Modal>
                    </div>
                    <div className="text_row">
                        <span className="title">{LangJS.privateKey[lang]}:</span>
                        <span >{this.state.encodeWords}</span>
                        <span className="button button2 right"
                            onClick={()=>{
                                this.setState({showPrivateKeyDialog:true});
                            }}
                            >{LangJS.lookOver[lang]}</span>
                        <Modal
                            title={LangJS.checkPrivateKey[lang]}
                            visible={this.state.showPrivateKeyDialog}
                            okText={LangJS.ok[lang]}
                            cancelText={LangJS.cancel[lang]}
                            onOk={this.__seePrivateKey}
                            onCancel={(()=>{this.setState({showPrivateKeyDialog:false,password:""})}).bind(this)}
                        >
                        <input type="password" autoFocus style={{height:30,lineHeight:30,width:"96%"}} 
                          placeholder={LangJS.pleaseInputPassword[lang]} 
                          onChange={((e)=>{
                            this.setState({seePrivateInputPassword:e.target.value})
                            }).bind(this)} 
                          defaultValue={this.state.password} />
                        </Modal>
                        <Modal
                            title={LangJS.privateKey[lang]}
                            visible={this.state.showPrivateKey}
                            okText={LangJS.copyToClipboard[lang]}
                            cancelText={LangJS.close[lang]}
                            onOk={this.__copyPrivateKey.bind(this)}
                            onCancel={(()=>{this.setState({showPrivateKey:false,password:""})}).bind(this)}
                            >
                            <p>{COMMON.getPrivateKey()}</p>
                        </Modal>
                    </div>
                    <div className="text_row">
                        <span className="title">{LangJS.chooseCoin[lang]}:</span>
                        <RadioGroup size="large" onChange={this.__onChange}
                         >
                            {coinCom}
                        </RadioGroup>
                    </div>
                    <div className="text_row">
                        <span className="title">{LangJS.changePassword[lang]}:</span>
                        <span >{this.state.encodeWords}</span>
                        <span className="button button2 right" 
                            onClick={()=>{this.setState({showOldPasswordDialog:true})}}
                            >{LangJS.change[lang]}</span>
                        <Modal
                            title={LangJS.changePassword[lang]}
                            visible={this.state.showOldPasswordDialog}
                            okText={LangJS.ok[lang]}
                            cancelText={LangJS.cancel[lang]}
                            onOk={this.__checkOldPassword.bind(this)}
                            onCancel={(()=>{this.setState({showOldPasswordDialog:false})}).bind(this)}
                        >
                        <input type="password" autoFocus style={{height:30,lineHeight:30,width:"96%"}} 
                          placeholder={LangJS.pleaseInputOldPassword[lang]} 
                          onChange={((e)=>{
                            this.setState({oldPasswordInputPassword:e.target.value})
                            }).bind(this)} 
                           />
                        </Modal>
                        <Modal
                            title={LangJS.changePassword[lang]}
                            visible={this.state.showNewPasswordDialog}
                            okText={LangJS.ok[lang]}
                            cancelText={LangJS.cancel[lang]}
                            onOk={this.__changePassword}
                            onCancel={(()=>{this.setState({showNewPasswordDialog:false})})}
                        >
                        <input type="password" autoFocus style={{height:30,lineHeight:30,width:"96%"}} 
                            placeholder={LangJS.pleaseInputNewPassword[lang]} 
                            onChange={((e)=>{
                                this.setState({newPasswordInputPassword:e.target.value})
                                }).bind(this)} 
                            />
                        </Modal>
                    </div>
                    <div className="button" onClick={()=>{this.setState({showClearDeviceDialog:true})}}
                         style={{marginTop:20,width:'200'}}>{LangJS.clearDevice[lang]}</div>
                    <Modal
                        title={LangJS.clearDevice[lang]}
                        visible={this.state.showClearDeviceDialog}
                        okText={LangJS.ok[lang]}
                        cancelText={LangJS.cancel[lang]}
                        onOk={this.__clearDevice.bind(this)}
                        onCancel={(()=>{this.setState({showClearDeviceDialog:false})})}
                    >
                        <input type="password" autoFocus style={{height:30,lineHeight:30,width:"96%"}} 
                            placeholder={LangJS.pleaseInputPassword[lang]} 
                            onChange={((e)=>{
                                this.setState({clearDeviceInputPassword:e.target.value})
                                }).bind(this)} 
                            />
                        </Modal>
                    </div>
           </div>
    }
}

const mapStateToProps = (state) => {

    COMMON.alog('map state ');

    return {
        coinName:state.topNav.coinName,
        addrList:state.topNav.addrList,
        alertStatus:state.topNav.alertStatus,
        alertMsg:state.topNav.alertMsg,
        coinList:state.topNav.coinList,
        lang:state.topNav.lang,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        reqCoinList:(token,lang,coinname) => {
            dispatch(requestCoinList(token,lang,coinname));
        },
        selCoin:(coinName) => {
            dispatch(selectCoin(coinName));
        },
        selectLangAction:(lang) => {
            dispatch(selectLang(lang));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps )(Setting);
