import React from 'react';

import CONSTS from '../../config/consts';

import {connect} from 'react-redux';

import '../../static/style/common.scss';

import { message,Modal } from 'antd';
import COMMON from '../../function/common';

import { sendCoinAction, cancelAlert } from '../../actions/topNav';
import LangJS from '../../config/lang';

class Send extends React.Component {

    constructor(props) {
        super(props);

        this.__sendCoin = this.__sendCoin.bind(this);

        this.state = {
            targetAddress:"",
            moneyAmount:"",
            remarks:"",
            inputPassword:"",
        }

    }

    __sendCoin() {

        this.setState({
            showPasswordDialog:false,
            inputPassword:''
        });

        let {lang} = this.props;
        let token = COMMON.getToken();
        if(!token){
            message.error(LangJS.tokenKeyMiss[lang]);
            return;
        }

        let password = COMMON.getPassword();
        if( !password || (password != this.state.inputPassword) ){
            message.error(LangJS.inputPasswordError[lang]);
            return;
        }

        
        let { sendCoin, coinName } = this.props;
        let { targetAddress, moneyAmount } = this.state;
        sendCoin && sendCoin(COMMON.getLang(), token,
             coinName,targetAddress,moneyAmount);
        

    }

    componentDidUpdate(){

        let {cancelAlert,updateWallet, alertMsg, alertStatus = 0} = this.props;
        if(alertStatus == 1){
            message.success(alertMsg);
            cancelAlert && cancelAlert();
            updateWallet && updateWallet();
        }else if( alertStatus == 0){
            //  cancelAlert && cancelAlert();
        }else {
            message.error(alertMsg);
            cancelAlert && cancelAlert();
        }

    }

    render() {
    
        let {lang} = this.props;
        let balance = this.props.balance || 0;
        let uncomfimedBalance = this.props.balanceUnable || 0;
        let coinName = this.props.coinName || CONFIG.defaultCoin;

        let balanceUnableCom = uncomfimedBalance > 0 ? " \("+ uncomfimedBalance +"\) " : "";
        

       return <div className='bodycontent'>
                <div className='homeinfo'>
                    <div className='coinItem'>
                        <span>{LangJS.balance[lang]}</span>
                        <i>{balance+balanceUnableCom}</i>
                        <b>{coinName}</b>
                    </div>
                </div>
                <div className="send">
                    <div className="inputItem">
                        <label>{LangJS.receiver[lang]}</label>
                        <input onChange={(e)=>{
                            this.setState({
                                targetAddress:e.target.value
                            });
                            }} 
                        />
                    </div>
                    <div className="inputItem">
                        <label>{LangJS.amount[lang]}</label>
                        <input 
                            onChange={ (e)=>{
                            this.setState({
                                moneyAmount:e.target.value
                            });
                            }} 
                        />
                    </div>
                    <div className="inputItem">
                        <label>{LangJS.remarks[lang]}</label>
                        <input onChange={(e)=>{
                            this.setState({
                                remarks:e.target.value
                            });
                            }} 
                            />
                    </div>
                        <p style={{color:'red'}}>{LangJS.sendWarning[lang]}</p>
                        <button onClick={()=>{
                            if(this.state.targetAddress == ""){
                                message.info(LangJS.pleaseInputAddress[lang]);
                                return;
                            }
                            if(this.state.moneyAmount == ""){
                                message.info(LangJS.pleaseInputAmount[lang]);
                                return;
                            }
                            
                            this.setState({showPasswordDialog:true})
                        }}>{LangJS.send[lang]}</button>
                    <Modal
                        title={LangJS.pleaseInputPassword[lang]}
                        visible={this.state.showPasswordDialog}
                        okText={LangJS.ok[lang]}
                        cancelText={LangJS.cancel[lang]}
                        onOk={this.__sendCoin}
                        onCancel={(()=>{this.setState({showPasswordDialog:false,inputPassword:''})})}
                    >
                    <input type="password" autoFocus 
                      style={{height:30,lineHeight:30,width:"96%"}} 
                      placeholder={LangJS.pleaseInputPassword[lang]} 
                      
                      onChange={((e)=>{
                        this.setState({inputPassword:e.target.value})
                        }).bind(this)} 
                     />
                    </Modal>
                </div>
                
           </div>
    }
}

const mapStateToProps = (state) => {
    
        return {
            balance:state.topNav.balance,
            balanceUnable:state.topNav.balanceUnable,
            coinName:state.topNav.coinName,
            lang:state.topNav.lang,
            alertStatus:state.topNav.alertStatus,
            alertMsg:state.topNav.alertMsg,
        };
}
    
const mapDispatchToProps = (dispatch) => {
    return {
        sendCoin:(lang,token,coinName,target,value) => {
            dispatch(sendCoinAction(lang,token,coinName,target,value))
        },
        cancelAlert:()=>{
            dispatch(cancelAlert())
        }
    }
}

export default connect( mapStateToProps, mapDispatchToProps )(Send);
