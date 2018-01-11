import React from 'react';
import {Carousel,Tabs,Tab,Table} from 'react-bootstrap';
import CONSTS from '../../config/consts';
import CONFIG from '../../config/config';
import COMMON from '../../function/common';
//import {Tabs, Tab} from 'material-ui/Tabs';

import {connect} from 'react-redux';
import { Select, Modal, Tooltip, message } from 'antd';
const Option = Select.Option;

import {getWalletAddress, createNewAddress,
    cancelAlertStatus, newseed,
    sendAlert,cancelAlert,selectLang
} from '../../actions/topNav';

import '../../static/style/common.scss';
import LangJS from '../../config/lang';

var QRCode = require('qrcode.react');

class Receive extends React.Component {

    constructor(props) {
        super(props);

        this.handleSelect = this.handleSelect.bind(this);
        this.requestAddress = this.requestAddress.bind(this);
        this.__newAddress = this.__newAddress.bind(this);
        this.__copyAddress = this.__copyAddress.bind(this);

        COMMON.alog('constructor');


        this.state = {
            addrIndex:0,
            showInputAddressName:false,
            addressNameValue:"",
            lang:''
        }

    }

    componentDidMount(){
        
        COMMON.alog('did mount');
        this.requestAddress();
        console.log(this.props);

    }

    componentWillUpdate(){
        COMMON.alog('will update');
        COMMON.alog(this.props);
        
    }

    componentDidUpdate(){
        COMMON.alog('did update');
        COMMON.alog(this.props);

        if(this.props.newAddressStatus == 1){
            message.success(this.props.newAddressMsg);
            this.cancelRequestAlert();
            this.requestAddress();
        }else if(this.props.newAddressStatus == 2){
            message.info(this.props.newAddressMsg);
            this.cancelRequestAlert();
        }

        if(this.props.alertStatus == 1){
            message.success(this.props.alertMsg);
            this.cancelAlert();
        }else {
            this.cancelAlert();
        }

    }

    cancelAlert(){
        let cancel = this.props.cancelAlert;
        cancel && cancel();
    }

    cancelRequestAlert(){
        let cancelReqStatus = this.props.cancelRequestStatus;
        cancelReqStatus && cancelReqStatus();
    }

    requestAddress(){


        let {lang} = this.props;
        let token = COMMON.getToken();
        let coinname = COMMON.getCoinName();
        if(!token){
            message.error(LangJS.tokenKeyMiss[lang]);
            return;
        }
        
        let  requestWalletAddress = this.props.getWalletAddress;
        requestWalletAddress(token,lang,coinname);
        
    }

    handleSelect(value) {
        
        COMMON.alog(value);
        this.setState({
            addrIndex: value-1,
        });
    }

    __copyAddress(){

        let {lang} = this.props;
        const {clipboard} = require('electron');
        // COMMON.alog(this.props);
        let text = this.props.addrList[this.state.addrIndex]['addr'];
        let res = clipboard.writeText(text);
        let sendMsg = this.props.sendAlert;
        sendMsg && sendMsg(LangJS.copySuccess[lang]);
    }

    __inputAddressName(event){
        this.setState({
            addressNameValue:event.target.value
        });
    }

    __newAddress(){

        let {lang} = this.props;
        this.setState({showInputAddressName:false})

        COMMON.alog(this.state.addressNameValue);
        
        let mark = this.state.addressNameValue;
        if( !mark || (mark == "") ){
            message.error('请输入新建地址标签');
            return
        }
        let token = COMMON.getToken();
        if(!token){
            message.error(LangJS.tokenKeyMiss[lang]);
            return;
        }
        let requestNewAddress = this.props.createNewAddress;
        requestNewAddress(token,COMMON.getLang(),COMMON.getCoinName(),mark);
    }

    render() {

        let {lang} = this.props;
        let balance = this.props.balance || 0;
        let uncomfimedBalance = this.props.balanceUnable || 0;
        let coinName = this.props.coinName || CONFIG.defaultCoin;

        let balanceUnableCom = uncomfimedBalance > 0 ? " ("+ uncomfimedBalance +") " : "";
        
        
        let addrList = this.props.addrList || [];
        let addrOptions = [];
        for(let i = 0; i < addrList.length;i++)
        {
            addrOptions.push(<Option key={'addr'+i} value={i+1}>{addrList[i]['mark']}</Option>);
        }

        let currentAddress = addrList.length > this.state.addrIndex ? addrList[this.state.addrIndex].addr : "" ;
        COMMON.alog(currentAddress);
        let qcodeVisableStyle = currentAddress == "" ? {visibility:"hidden"} : {} ;
       return <div className='bodycontent'>
       <div className="baseInfo_text">

       <div className="sum_text text_row">
            <span>{LangJS.selectAddress[lang]} : </span>
            <Select
            size={'large'}
            defaultValue="default"
            onChange={this.handleSelect}
            style={{ width: 200,top:-3 }}
          >
            {addrOptions}
          </Select>
          <span className="button" 
            onClick={()=>{this.setState({showInputAddressName:true})}}
            >{LangJS.makeAddress[lang]}</span>
          <Modal
                title={LangJS.makeAddress[lang]}
                visible={this.state.showInputAddressName}
                okText={LangJS.ok[lang]}
                cancelText={LangJS.cancel[lang]}
                onOk={this.__newAddress}
                onCancel={(()=>{this.setState({showInputAddressName:false})}).bind(this)}
            >
          <input type="text" autoFocus style={{height:30,lineHeight:30,width:"96%"}} 
              placeholder={LangJS.pleaseInputNewAddressTag[lang]} onChange={this.__inputAddressName.bind(this)} defaultValue={this.state.password} />
            </Modal>
       </div>
       <div className="sum_text text_row">
           <span>{LangJS.totalBalance[lang]} : </span>
           <span className="important_text"> {balance+balanceUnableCom}</span>
           <span>{coinName}</span>
       </div>
       
       <div className="summary_text text_row ng-binding">
           <span className="greyFont ng-binding">{LangJS.address[lang]} : </span> 
           <span className="main_text">{currentAddress}</span>
           <span className="button" onClick={this.__copyAddress} 
            style={qcodeVisableStyle}>{LangJS.copy[lang]}</span>
       </div>

       <div className="sum_text text_row">
            <span id="qcodeTitle">{LangJS.addressQCode[lang]}: 
            {/*<Tooltip title="点击保存到本地" style={qcodeVisableStyle}>*/}
                <div onClick={()=>{}} style={qcodeVisableStyle}>
                    <QRCode size={256} value={currentAddress} />
                </div>
            {/*</Tooltip>*/}
            
            </span>
        </div>
       
        </div>
        </div>
    }
}

const mapStateToProps = (state) => {
        COMMON.alog(' ===== Receive  map state to props ====== ');
    
        return {
            balance:state.topNav.balance,
            balanceUnable:state.topNav.balanceUnable,
            coinName:state.topNav.coinName,
            addrList:state.topNav.addrList,
            newAddressStatus:state.topNav.newAddressStatus,
            newAddressMsg:state.topNav.newAddressMsg,
            alertStatus:state.topNav.alertStatus,
            alertMsg:state.topNav.alertMsg,
            lang:state.topNav.lang,
        };
}
    
const mapDispatchToProps = (dispatch) => {
    return {
        getWalletAddress:(token,lang,coinname) => {
            dispatch(getWalletAddress(token,lang,coinname));
        },
        createNewAddress:(token,lang,coinname,mark) => {
            dispatch(createNewAddress(token,lang,coinname,mark));
        },
        cancelRequestStatus:()=>{
            dispatch(cancelAlertStatus());
        },
        newseeds:()=>{
            dispatch(newseed());
        },
        sendAlert:(text)=>{
            dispatch(sendAlert(text));
        },
        cancelAlert:()=>{
            dispatch(cancelAlert());
        },
        selectLang:(lang)=>{
            dispatch(selectLang(lang));
        }
    }
}

export default connect( mapStateToProps, mapDispatchToProps )(Receive);

