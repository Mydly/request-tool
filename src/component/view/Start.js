import React from 'react';
import { connect } from 'react-redux';

import wordsList from '../../lib/wordlist_english';
import Common from '../../function/common';
import Cons from '../../config/consts';

import FS from 'fs';
import os from 'os';
import path from 'path';

import { message,Modal } from 'antd';

import crypto from 'crypto';
import NodeRSA from 'node-rsa';

import {ipcRenderer} from 'electron';
const settings = require('electron-settings');

import Request from '../../main/requests';

import {newseed} from '../../actions/topNav';
import LangJS from '../../config/lang';


class Start extends React.Component {

    constructor(props) {
        super(props);

        this.__changeWords = this.__changeWords.bind(this);
        this.__saveWords = this.__saveWords.bind(this);
        this.__saveRSAKeys = this.__saveRSAKeys.bind(this);
        this.__toCreateKey = this.__toCreateKey.bind(this);
        this.createRSAKeys = this.createRSAKeys.bind(this);
        this.__inputPassword = this.__inputPassword.bind(this);
        this.__startUseWallet = this.__startUseWallet.bind(this);
        this.__recoverWallet = this.__recoverWallet.bind(this);
        
        let words = this.initOneWords();

        this.state = {
            words: words,
            sureword:false,
            inputPass:0,
            password:"",
            showForRecover:false, // 恢复助记词界面是否显示
            forRecoverInputWord:"",
          };
        
    }

    initOneWords() {
        return Common.makeWords(wordsList,18);
    }

    __changeWords(){
        let words = this.initOneWords();
        console.log(words);
        this.setState({
            words:words
        });
    }

    createRSAKeys(){
        var nodeRsa = new NodeRSA();
        var res = nodeRsa.generateKeyPair(1024);
        const privateKey = nodeRsa.exportKey();
        const publicKey = nodeRsa.exportKey('pkcs8-public'); 

        this.setState({
            privateKey:privateKey,
            publicKey:publicKey,
        });

        this.nodeRsa = nodeRsa;

    }

    __saveWords(){

        let {lang = Common.getLang()} = this.props;
        let that = this;
        let filepath = path.resolve(os.homedir(),'Downloads/walletCoinWord.txt');
        FS.writeFile(filepath, that.state.words, {'encoding':'utf8'},function(err){
            if (err) throw err;
            message.success(LangJS.saveSuccess[lang]);
        });

    
    }

    __toCreateKey(){

        this.setState({
            sureword:true
        });

        this.createRSAKeys();
    }

    __saveRSAKeys(){

        let {lang = Common.getLang()} = this.props;
        let filepath = path.resolve(os.homedir(),'Downloads/walletRSAKeys.txt');
        FS.writeFile(filepath, this.state.privateKey+'\n'+this.state.publicKey,
         {'encoding':'utf8'},function(err){
            if (err) throw err;
            message.success(LangJS.saveSuccess[lang]);
        });

    }

    __inputPassword(event){
        
        // console.log(event.target.value);
        this.setState({
            password:event.target.value
        });
    }

    __recoverWallet(){
        let keyWord = this.state.forRecoverInputWord;
        let base64_words = (new Buffer(keyWord)).toString('base64');

        let that = this;
        Request({
            url:'/wallet/?action=findSeed',
            method:'post',
            datas:{
                lang:'en',
                seed:base64_words,
            },
            callBack:(res)=>{
                if( res && res.status == 1){
                    that.setState({
                        words: keyWord,
                        sureword:true
                    });
                    that.createRSAKeys();
                }
            }
        });

    }

    __startUseWallet(){

        let {lang = Common.getLang()} = this.props;
        if(this.state.password == ""){
            message.error(LangJS.pleaseInputPassword[lang]);
            return;
        }

        const base64_words = (new Buffer(this.state.words)).toString('base64');
        const base64_private_key = (new Buffer(this.state.privateKey)).toString('base64');
        const base64_public_key = (new Buffer(this.state.publicKey)).toString('base64');
        
        const thisOS = os.networkInterfaces();
        const appid = Common.isArray(thisOS.en0) ? thisOS.en0[0].mac : thisOS.en0.mac ;

        let that = this;

        // 缓存密码,公钥,私钥
        Common.settingSet( 
            Cons.cacheName.secret,
            {
                password:that.state.password,
                privateKey:that.state.privateKey,
                publicKey:that.state.publicKey
            });
        

        if( Common.settingHas( Cons.cacheName.secret ) ){
            // 请求生成新钱包
            Request({
                url:'/wallet/?action=newseed',
                method:'post',
                datas:{
                    appid:appid,
                    seed:base64_words,
                    pubkey:base64_public_key
                },
                callBack:(res)=>{
                    if(res.status == 1){

                        Common.settingSet(Cons.cacheName.token
                            ,res.msg.token);
                        if( Common.settingHas(Cons.cacheName.token) ){
                            
                            that.props.newseed();
                        }
                    }else{
                        message.error(LangJS.requestNewAddressError[lang]);
                    }
                }
            });
        }

    }

    render() {

        let {lang = Common.getLang()} = this.props;

        if(this.state.sureword){
            return (<div className="startContent">
            <div>
                <div className="keyHead">
                        <span>{LangJS.rasKey[lang]}</span>
                </div>
                <div className="keyBody">
                    <div className="content_top">
                    <div className="right">
                        <label>Private Key</label>
                        <textarea type="textarea" id="textarea" disabled="true" 
                                value={this.state.privateKey || ''}
                                ></textarea>
                    </div>
                    <div className="right">
                        <label>Public Key</label>
                        <textarea type="textarea" id="textarea" disabled="true" 
                                value={this.state.publicKey || ''}
                                ></textarea>
                        <p style={{color:'red'}}>
                        {LangJS.rasDescr[lang]}
                        </p>
                    </div>
                    </div>
                    <div className="aButton" onClick={this.createRSAKeys}  style={{width:200}}>{LangJS.changeAnotherOne[lang]}</div>
                    <button onClick={(()=>{this.setState({inputPass:1})}).bind(this)}>{LangJS.ok[lang]}</button>
                    <Modal
                        title={LangJS.setPassword[lang]}
                        visible={this.state.inputPass}
                        onOk={this.__startUseWallet}
                        onCancel={(()=>{this.setState({inputPass:0})}).bind(this)}
                    >
                        <input type="password" style={{height:30,lineHeight:30,width:"96%"}} 
                            placeholder={LangJS.pleaseInputPassword[lang]} onChange={this.__inputPassword}/>
                    </Modal>
                    <button className="sButton" onClick={this.__saveRSAKeys}>{LangJS.downloadToTheLocal[lang]}</button>
                </div>
            </div>
        </div>);
        }

        return (<div className="startContent">
        <div>
            <div className="keyHead">
                    <span>{LangJS.makeMainPassword[lang]}</span>
            </div>
            <div className="keyBody"  style={{position:"relative"}}>
                <div className="content_top">
                <div className="right">
                    <label>{LangJS.mainPassword[lang]}</label>
                    <textarea type="textarea" id="textarea" disabled="true" 
                            value={this.state.words}
                            ></textarea>
                    <p>{LangJS.keepInMindWords[lang]}</p>
                </div>
                </div>
                <div className="aButton" onClick={this.__changeWords} style={{width:200}}>{LangJS.changeAnotherOne[lang]}</div>
                <div className="aButton" style={{
                    float: "right",
                    width: 180,
                    position: "absolute",
                    top:215,
                    right: -5,
                    textAlign: "right"
                }} onClick={()=>{this.setState({showForRecover:true})}}>{LangJS.importExistingKey[lang]}</div>
                <Modal
                    title={LangJS.recoverWallet[lang]}
                    visible={this.state.showForRecover}
                    onOk={this.__recoverWallet}
                    onCancel={(()=>{this.setState({showForRecover:false})}).bind(this)}
                >
                <input autoFocus style={{height:30,lineHeight:30,width:"96%"}} 
                    placeholder={LangJS.pleaseInputYourKey[lang]} 
                    onChange={((e)=>{
                        this.setState({forRecoverInputWord:e.target.value})
                        }).bind(this)} 
                    />
                </Modal>
                <button onClick={this.__toCreateKey}>{LangJS.ok[lang]}</button>
                <button className="sButton" onClick={this.__saveWords}>{LangJS.downloadToTheLocal[lang]}</button>
            </div>
        </div>
    </div>);

    }
}

const mapStateToProps = (state) => {
    
        return {
            
        };
    }

const mapDispatchToProps = (dispatch) => {
    return {
        newseed:(i) => {
            dispatch(newseed(i))
        }}
}

export default connect(mapStateToProps,mapDispatchToProps)(Start);