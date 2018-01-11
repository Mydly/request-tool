import React from 'react';
import {Carousel,Tabs,Tab,Table} from 'react-bootstrap';
//import {Tabs, Tab} from 'material-ui/Tabs';
import { connect } from 'react-redux';

import Request from '../../main/requests';
import COMMON from '../../function/common';
import CONSTS from '../../config/consts';
import CONFIG from '../../config/config';
import { getWalletInfo, tabChangeAction} from '../../actions/topNav';

import { message,Modal } from 'antd';

import '../../static/style/common.scss';
import LangJS from '../../config/lang';

class Index extends React.Component {

    constructor(props) {
        super(props);

        this.requestInfo = this.requestInfo.bind(this);

    }

    __changeTradeArea(selectIndex,e){

    }

    componentDidMount(){
        
        this.requestInfo();
         
    }

    componentWillUnmount(){

    }

    requestInfo(){
        let {lang} = this.props;

        let token = COMMON.getToken();
        let coinname = COMMON.getCoinName();
        if(!token){
            message.error(LangJS.tokenKeyMiss[lang]);
            return;
        }
        
        let  walletInfo = this.props.getWalletInfo;
        walletInfo(token,COMMON.getLang(),coinname);
        
    }

    render() {
    
        let {lang} = this.props;

        console.log(this.props);
        let balance = this.props.balance || 0;
        let uncomfimedBalance = this.props.balanceUnable || 0;
        let coinName = this.props.coinName || CONFIG.defaultCoin;


        let {trans_log} = this.props;
        let transLogCom = (trans_log || []).map(function(item,index){
            return <tr key={index} >
                    <td style={{width:40}}>{item.type}</td>
                    <td>{item.target}</td>
                    <td  style={{width:40}}>{item.addtime}</td>
                    <td>{item.value}</td>
                    <td  style={{width:40}}>{item.confirms}</td>
                </tr>
        });

        let balanceUnableCom = uncomfimedBalance > 0 ? " \("+uncomfimedBalance+"\) " : "";

       return <div className='bodycontent'>
                <div className='homeinfo'>
                    <div className='coinItem'>
                        <span>{LangJS.balance[lang]}</span>
                        <i>{balance+balanceUnableCom}</i>
                        <b>{coinName}</b>
                    </div>
                    <div className='coinItem'>
                        <span>{LangJS.version[lang]}</span>
                        <i>1.0</i>
                        <b>2017.11.11</b>
                    </div>
                </div>
                <div className="tradeLogHeader">
                    <div className="header">
                    {LangJS.myTrade[lang]}
                    </div>
                </div>
                <table className="table">
                    <thead>
                        <tr>
                            <th></th>
                        </tr>
                    </thead>
                    
                    <tbody>
                        <tr>
                            {/*<td>ID</td>*/}
                            <td style={{width:40}}>{LangJS.type[lang]}</td>
                            <td>{LangJS.otherSideAddr[lang]}</td>
                            <td style={{width:40}}>{LangJS.date[lang]}</td>
                            <td>{LangJS.amount[lang]}</td>
                            <td style={{width:40}}>{LangJS.confirmTimes[lang]}</td>
                        </tr>
                        {transLogCom}
                    </tbody>
                    
                </table>
           </div>
    }
}

const mapStateToProps = (state) => {

    return {
        balance:state.topNav.balance,
        balanceUnable:state.topNav.balanceUnable,
        coinName:state.topNav.coinName,
        trans_log:state.topNav.trans_log,
        lang:state.topNav.lang,
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        getWalletInfo:(token,lang,coinname) => {
            dispatch(getWalletInfo(token,lang,coinname))
        }
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Index);
