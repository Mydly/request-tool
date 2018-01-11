
import Common from '../function/common';
import myCheck from 'mydly-check';
import myReq from 'mydly-request';

/*
  @param
  url,
  method,
  datas,
  callBack,
*/
export default (options,callBack) => {

    let {url,
        method="GET",
        data,
        header={}
    } = options;

   var params2 = {
       url:url,
       method:method,
       data:data,
       header:header
   }

   myReq.send(params2,function (err,res,body){
    if(err) throw err;
    // console.log(body); 
//    callBack && callBack( Common.isString(body) ? JSON.parse(body) : body );

    
    callBack && callBack( body );
});
   
}


