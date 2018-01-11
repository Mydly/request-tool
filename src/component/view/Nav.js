import React from 'react'
import '../../static/style/common.scss';
import '../../static/style/nav-css.scss';
import { connect } from 'react-redux';
import { changeTab, tabChangeAction } from '../../actions/topNav';
import CONSTS  from  '../../config/consts';
import * as FA from 'react-icons/lib/fa';
import COMMON from '../../function/common';
import LangJS from '../../config/lang';




class Nav extends React.Component {

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);

        console.log(props);

    }

    handleClick(key) {

            const {change} = this.props;
            change(key);

    }

    render() {


        let tabBar = this.props.tabBar;

        let {lang} = this.props;
        lang = lang || COMMON.getLang();

        const DaoHang = [
        {key:'index',title:LangJS.navHome[lang] ,img:<FA.FaHome className='navMenuIcon'/>},
        {key:'trade',title:LangJS.navSend[lang],img:<FA.FaMailForward className='navMenuIcon'/>},
        {key:'finan',title:LangJS.navRecevive[lang],img:<FA.FaMailReply className='navMenuIcon'/>},
        {key:'safe',title:LangJS.navSet[lang],img:<FA.FaCog className='navMenuIcon'/>}
    ];

        let menuList = DaoHang.map((item)=>{
            return <div
                    className={ item.key == tabBar ? "menuItem active" : "menuItem"}
                    onClick={this.handleClick.bind(this,item.key)}
                    key={item.key}
                    >
                    {item.img}
                    {item.title}
                    </div>
        });

        return (
                <div className="NavMenu">
                    <div className="menu">
                        {menuList}
                    </div>
                </div>
        );
    }
}

const stateMaptoProps = (state) =>{
    return {
        tabBar:state.topNav.tabBar,
        lang:state.topNav.lang
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        change:(tab) => {
        dispatch(tabChangeAction(tab))
    }}
}

export default connect(stateMaptoProps,mapDispatchToProps)(Nav);