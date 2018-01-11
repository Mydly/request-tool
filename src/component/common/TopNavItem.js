/**
 * Created by Administrator on 2017/4/14.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import commonCss from '../../static/style/common.scss';
import navCss from '../../static/style/nav-css.scss';


export default class TopNavItem extends React.Component {
    constructor(props){
        super(props);
    }

    handleClick(e){
        console.log("点击菜单");
        console.log(e);
        this.props.handleClick(this.props.index);
    }

    render(){
        var cls = this.props.active == 1 ? "topNavlistItem active" : "topNavlistItem";
        return <li className={cls}
                   onClick={this.handleClick.bind(this)}>
            {this.props.title}
        </li>;
    }
}

module.exports = TopNavItem;