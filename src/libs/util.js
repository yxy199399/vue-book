import axios from 'axios';

// 基本配置
const Util = {
    imgPath: 'http://192.168.124.3:8011/img/',
    apiPath: 'http://192.168.124.3:8010/'
};

// 通用配置
Util.ajax = axios.create({
    baseURL: Util.apiPath
});

//添加响应拦截器
Util.ajax.interceptors.response.use(res => {
    return res.data;
});

Util.getTodayTime = function(){
    const date = new Date();
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date.getTime();
}

Util.getPrevDay = function(timestamp = (new Date()).getTime()){
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = date.getMonth() + 1 < 10
     ? '0' + (date.getMonth() + 1)
     : date.getMonth() + 1;
     const day = date.getDate() < 10 
     ? '0' + (date.getDate() + 1)
     : date.getDate() + 1;
     return  year.toString()  + month.toString()  + day.toString() ;
}

 
export default Util;
