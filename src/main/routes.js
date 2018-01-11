
import { connect } from 'react-redux';
import React from 'react';
import querystring from 'querystring';

import '../static/style/common.scss';

import Nav from '../component/view/Nav';

import Index from '../component/view/Index';
import Send from '../component/view/Send';
import Receive from '../component/view/Receive';
import Setting from '../component/view/Setting';
import Start from '../component/view/Start';

const electron = require('electron');
const app = electron.app || electron.remote.app;

import CONSTS from '../config/consts';
import { getWalletInfo } from '../actions/topNav';
import COMMON from '../function/common';

import { message, Form } from 'antd';


import Config from '../config/config';

import Request from './requests';

import Test from '../component/view/Test';

const assert = require('assert');

class RouteList extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            running:false, 
            url:'',
            loopTime:0,
            requestMethod:'GET',
            paramCom:[],
            paramData:{},
            html:null
        };

        this.requestData = this.requestData.bind(this);
        this.__inputUrl = this.__inputUrl.bind(this);
        this.__inputTime = this.__inputTime.bind(this);
        this.__addParamItem = this.__addParamItem.bind(this);
        this.__delParamItem = this.__delParamItem.bind(this);
        this.__inputParam = this.__inputParam.bind(this);
        this.__start_stop = this.__start_stop.bind(this);


    }

    requestData(force){
        if(!this.state.running && !force){
            COMMON.alog('运行开关未打开');
            return;
        }
        else {
            // COMMON.alog('运行中....');
        }

        // 获取参数
        let {url,paramData} = this.state;
        if(url == ''){
            COMMON.alog('请求地址不能为空');
            return;
        }
        let getParam = {};
        let postParam = {};
        let headers = {};
        let putParam = {};
        for (var key in paramData) {
            // COMMON.alog(key);
            // COMMON.alog(paramData[key]);
            var par = paramData[key];
            var parKey = par['key'];
            var parValue = par['value'];
            if( parKey && parValue){
                // 有参数
                if( par['sel'] == 'Header' ){
                    headers[parKey] = parValue;
                }
                else if( par['sel'] == "PUT"){
                    putParam[parKey] = parValue;
                }
                else if( par['sel'] == 'POST' ){
                    postParam[parKey] = parValue; 
                }
                else {
                    getParam[parKey] = parValue;
                }
            }
        }

        // 处理url
        url = url.indexOf("http") >= 0 ? url : "http://"+url;
                     
        let option = {
            url:url,
            method:this.state.requestMethod,
            data:postParam,
            header:headers
        };
        Request(option,(res)=>{
            
                            if(COMMON.isJsonOfString(res)){
                                COMMON.alog(JSON.parse(res));
                                this.setState({
                                    html:null
                                })
                            }else {
                                COMMON.alog(res);
                                this.setState({
                                    html:url
                                })
                            }
                        });

        
                
    }

    //组件初始化
    componentDidMount(){
        
    }

    //组件将更新
    componentWillUpdate(){
       
    }

    //组件已经更新
    componentDidUpdate(){
        // COMMON.alog('router com update');
       
    }

    handleLogin(e){
        e.preventDefault();
        console.log(e);
        const {change} = this.props;
        change(PageKey.login.key);
    }


    __addParamItem(){
        
        let paramCom = this.state.paramCom || [];

        let keyIndex = paramCom.length+1;
        let newParam = 
            <div key={"param_"+keyIndex} name={"param_"+keyIndex} >
                <select name={"sel_"+keyIndex} 
                    style={{margin:"5px 20px"}}
                    defaultValue={this.state.requestMethod || "GET"}
                    onChange={this.__inputParam}
                    >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="Header">Header</option>
                </select>
                <input name={"key_"+keyIndex}
                 style={{width:80}} onChange={this.__inputParam} />
                <input name={"value_"+keyIndex} 
                    onChange={this.__inputParam} />
                <button name={"btn_"+keyIndex} 
                    style={{padding:"2px 5px"}} 
                    onClick={this.__delParamItem}
                    >删除</button>
            </div>
        paramCom.push(newParam);
        this.setState({
            paramCom:paramCom
        })
    }

    __delParamItem(event){

        
        let paramCom = this.state.paramCom || [];
        if(!paramCom) return;
        let paramData = this.state.paramData || {};

        let name = event.target.name;
        let keyIndex = name.split('_')[1];
        assert.notEqual(typeof keyIndex,'undefined','组件name索引错误');
        let key = "param_"+keyIndex;
        paramData[key] && delete paramData[key];
        
        paramCom[keyIndex-1] &&  delete paramCom[keyIndex-1];

        this.setState({
            paramCom:paramCom
        });



    }

    __inputParam(event){
        
        let name = event.target.name;
        let value = event.target.value;
        let keyIndex = name.split('_')[1];
        let keyType = name.split('_')[0];
        if (keyType == "sel") {
            this.setState({
                requestMethod:value
            });
        }
        
        assert.notEqual(typeof keyIndex,'undefined','组件name索引错误');
        let paramData = this.state.paramData;
        let key = "param_"+keyIndex;
        if( paramData[key] ){
            let oldObj = paramData[key];
            oldObj[keyType] = value;
        }
        else {
            let newObj = {};
            newObj[keyType] = value;
            paramData[key] = newObj;
        }

        // console.log(this.state.paramData);
        
    }

    __inputUrl(event){
        this.setState({
            url:event.target.value
        });
    }

    __inputTime(event){
        let time = event.target.value
        this.setState({
            loopTime:time*1000
        });
    }

    __start_stop(){
        let running = this.state.running;
        if(running){
            clearInterval(this.state.timerId);
            this.setState({
                running:false,
                timerId:0
            })
        }else{
            if(this.state.loopTime <= 0){
                this.requestData(1);
            }else{
                assert.equal( isNaN(this.state.loopTime) , false , "循环次数必须是数字" )
                let timerId = setInterval(this.requestData,this.state.loopTime);
                this.setState({
                    running:true,
                    timerId:timerId
                })
                this.requestData(1);
            } 
        }
        
    }

    render(){

        
        let paramComponent = this.state.paramCom || [];
        let width = window.innerWidth;
        

        return (
            <div>
                <div style={{float:"left",width:400}}>
                    <div style={{margin:"20px 20px"}}>
                        <div>地址</div>
                        <input contentEditable={!this.state.running} onChange={this.__inputUrl} placeholder="请输入地址" style={{width:320}} />
                    </div>
                    <div style={{margin:"20px 20px"}}>
                        <div>循环时间间隔</div>
                        <input onChange={this.__inputTime} placeholder="单位:秒,默认执行一次" style={{width:320}} />
                    </div>
                    <div style={{margin:"20px 20px"}}>
                        <button onClick={this.__addParamItem} 
                        style={{marginLeft:0,padding:"10px 20px"}}
                        >添加参数</button>
                        <span style={{marginLeft:0,padding:"10px 20px"}}><input name="Curl" type="checkbox" value="Curl" /> Curl</span>
                        
                       <span style={{marginLeft:0}}> 
                        <select name={"sel_"} 
                                style={{margin:"5px 10px"}}
                                defaultValue={this.state.requestMethod || "GET"}
                                onChange={(e)=>{this.setState({requestMethod:e.target.value})}}
                                >
                                <option value="GET">GET</option>
                                <option value="POST">POST</option>
                                <option value="PUT">PUT</option>
                            </select>
                        </span>
                        <button onClick={this.__start_stop} 
                        style={ Object.assign({},{marginLeft:20,padding:"10px 20px",color:"white"},
                                this.state.running?
                                {backgroundColor:"#09a800"}:
                                {backgroundColor:"#E74E19"})}
                        >{this.state.running? "暂停" : "开始"}</button>
                    </div>
                    {paramComponent}
                </div>
                <div style={{position:"absolute",left:400,height:"100vh",borderLeft:"solid 1px #999"}}>
                    { this.state.html ? React.createElement("iframe",{src:this.state.html,allowFullScreen:true,height:"100%",width:width}) : null }
                </div>

            </div>
        );
    }
}

function mapStateToProps(state) {

    return {
        tabBar: state.topNav.tabBar,
        lastBar:state.topNav.lastBar,
        alert:state.alert,
        userinfo:state.topNav.userinfo,
        haveToken:state.topNav.haveToken || false
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(RouteList);
