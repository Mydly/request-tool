/**
 * Created by Administrator on 2017/4/14.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import commonCss from '../../static/style/common.scss';
import navCss from '../../static/style/nav-css.scss';
import TopNavItem from './TopNavItem';

export default class TopNav extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            activeIndex:0,
        }
        this.handleClickItem = this.handleClickItem.bind(this);
    }

    handleClickItem(index){
        this.setState({activeIndex:index});
    }

    render(){

        var itemsNode = this.props.navList.map( (val,index )=>{

            var result = this.state.activeIndex == index ?
                <TopNavItem key={index} title={val} index={index} active="1" handleClick={this.handleClickItem}/> :
                <TopNavItem key={index} title={val} index={index} active="0" handleClick={this.handleClickItem}/>;

            return result;
        });

        return (<div className="topNavContent">
            <ul className="topNavList">
                {itemsNode}
            </ul>
        </div>);
    }
}

module.exports = TopNav;
