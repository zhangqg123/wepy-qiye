import base from './base'
import wepy from 'wepy';
const en = require('../utils/aes.js');
const rand = require('../utils/random.js');
const sign = require('../utils/sign.js');
var aesKey=wepy.$instance.globalData.aesKey;
var ivKey= wepy.$instance.globalData.ivKey;
var appId=wepy.$instance.globalData.appId;
var xcxId=wepy.$instance.globalData.xcxId;
var usertype=wepy.$instance.globalData.usertype;

export default class auth extends base {

  static async changeDept(deptid) {
    var nonce_str = rand.getRand();//随机数
    var postParams=[];
    postParams[0]=["nonce_str",nonce_str];
    postParams[1]=["status","dept"];
    postParams[2]=["deptid",deptid];
    var signVal=sign.createSign(postParams,appId);//签名
    const url = `${this.baseUrl2}/api/exam/changeDept.do?nonce_str=` + nonce_str + `&sign=` + signVal+ `&status=dept&deptid=${deptid}`;
    const data = await this.get(url);
    return data;
  }
  static async userPhone(phone) {
    var nonce_str = rand.getRand();//随机数
    var postParams=[];
    postParams[0]=["nonce_str",nonce_str];
    postParams[1]=["status","phone"];
    postParams[2]=["phone",phone];
    postParams[3]=["xcxId",xcxId];
    var signVal=sign.createSign(postParams,appId);//签名
    const url = `${this.baseUrl2}/api/exam/userPhone.do?nonce_str=` + nonce_str + `&sign=` + signVal+ `&status=phone&phone=${phone}&xcxId=${xcxId}`;
    const data = await this.get(url);
    return data;
  }

  static async userList(deptid) {
    var nonce_str = rand.getRand();//随机数
    var postParams=[];
    postParams[0]=["nonce_str",nonce_str];
    postParams[1]=["status","dept"];
    postParams[2]=["deptid",deptid];
    postParams[3]=["xcxId",xcxId];
    var signVal=sign.createSign(postParams,appId);//签名
    const url = `${this.baseUrl2}/api/exam/userList.do?nonce_str=` + nonce_str + `&sign=` + signVal+ `&status=dept&deptid=${deptid}&xcxId=${xcxId}`;
    console.info("url",url);
    const data = await this.get(url);
    return data;
  }

  static async dept() {
    var nonce_str = rand.getRand();//随机数
    var postParams=[];
    postParams[0]=["nonce_str",nonce_str];
    postParams[1]=["status","dept"];
    var signVal=sign.createSign(postParams,appId);//签名
    const url = `${this.baseUrl2}/api/exam/dept.do?nonce_str=` + nonce_str + `&sign=` + signVal+ `&status=dept`;
    const data = await this.get(url);
    return data.obj;
  }
  
  static async jscode2session () {
    const res = await wepy.login();
    var nonce_str = rand.getRand();//随机数
    var postParams=[];
    postParams[0]=["nonce_str",nonce_str];
    postParams[1]=["status","jscode2session"];
    postParams[2]=["jscode",res.code];
    postParams[3]=["xcxId",xcxId];
    var signVal=sign.createSign(postParams,appId);//签名
    const url = `${this.baseUrl2}/api/lhs/getOpenid.do?jscode=${res.code}&xcxId=${xcxId}&nonce_str=${nonce_str}&sign=${signVal}&status=jscode2session`;
    return await this.get(url).then(data => {
      return data == null ? [] : data;
    });

  }
  /**
   * 检查登录状态
   */
  static async isLogin() {

//    const loginCode = this.getConfig('login_code');
    const token = this.getConfig('token');
    console.info("token",token);

    var result=false;
    if(token!=null){
      console.info("expireTime",new Date().getTime() - token.expireTime);

      if(token.expireTime < new Date().getTime()){

          const url = `${this.baseUrl2}/rest/tokens/check?token=${token.value}`;
          var data= await this.post(url, null);
          console.info("data.success",data.success);
          let newtoken = {
              value: token.value,
              expireTime: new Date().getTime() + 6800000
          }
          await this.removeConfig('token');
          await this.setConfig('token', newtoken);
          result=data.success;
        
      }else{
        console.info("no need",true);
        result=true;
      }
    }
    return result;
  }
  /**
   * 登录
   */
  static async login(param) {
    var aesPassword = en.encrypt(param.password,aesKey,ivKey);//aes密码
    var username=param.username;

    const url = `${this.baseUrl2}/rest/tokens?username=${username}&password=${aesPassword}&xcxId=${xcxId}`;

    const data= await this.post(url, param);
    return data;
  }
  /**
  * 用户注册
  */
  static async userRegister(param) {
    var nonce_str = rand.getRand();//随机数
    var postParams=[];
    postParams[0]=["nonce_str",nonce_str];
    postParams[1]=["status","userRegister"];
    var signVal=sign.createSign(postParams,appId);//签名

    const url = `${this.baseUrl2}/api/lhs/userRegister.do?nonce_str=` + nonce_str + `&sign=` + signVal+ `&status=userRegister`;
    const data= await this.post(url, param);
    return data.attributes;
  }
  /**
   * 注册状态
   */
  static async registerCode() {
    var nonce_str = rand.getRand();//随机数
    var postParams=[];
    postParams[0]=["nonce_str",nonce_str];
    postParams[1]=["status","registerCode"];
    var signVal=sign.createSign(postParams,appId);//签名
    const url = `${this.baseUrl2}/api/exam/registerCode.do?nonce_str=` + nonce_str + `&sign=` + signVal+ `&status=registerCode`;
    const data = await this.get(url);
    return data.attributes;
  }
  /**
   * 用户信息
   */
  static async userInfo() {
    const loginCode = this.getConfig('login_code');
    const url = `${this.baseUrl2}/rest/jeecg/lhSRestUser/${loginCode}`;
    return await this.get(url);
  }
  /**
   * 用户关注
   */
  static async userFollow() {
    var openId=wepy.$instance.globalData.auth["openId"];
    var nonce_str = rand.getRand();//随机数
    var postParams=[];
    postParams[0]=["nonce_str",nonce_str];
    postParams[1]=["status","userFollow"];
    postParams[2]=["openId",openId];
    var signVal=sign.createSign(postParams,appId);//签名
    const url = `${this.baseUrl2}/api/exam/userFollow.do?nonce_str=` + nonce_str + `&sign=` + signVal+ `&status=userFollow&openId=${openId}`;
    console.info("url",url);
    const data = await this.get(url);
    return data;
  }

  /**
   * 短信验证码登录
   */
  static async smsCodeLogin(phone, code) {
    var openId=wepy.$instance.globalData.auth["openId"];
    console.info("openId",openId);
    var nonce_str = rand.getRand();//随机数
    var postParams=[];
    postParams[0]=["nonce_str",nonce_str];
    postParams[1]=["status","smsCode"];
    postParams[2]=["phone",phone];
    postParams[3]=["userkey",code];
    postParams[4]=["openId",openId];
    postParams[5]=["usertype",usertype];
    postParams[6]=["xcxId",xcxId];
    var signVal=sign.createSign(postParams,appId);//签名
    const url = `${this.baseUrl2}/api/lhs/smsCodeLogin.do?phone=${phone}&userkey=${code}&openId=${openId}&xcxId=${xcxId}&usertype=${usertype}&nonce_str=` + nonce_str + `&sign=` + signVal+ `&status=smsCode`;
    console.info("url",url);
    const data = await this.get(url);
    return data;
  }
  /**
   * 短信验证码登录
   */
  static async follow(phone, code) {
    var openId=wepy.$instance.globalData.auth["openId"];
    console.info("openId",openId);
    var nonce_str = rand.getRand();//随机数
    var postParams=[];
    postParams[0]=["nonce_str",nonce_str];
    postParams[1]=["status","follow"];
    postParams[2]=["phone",phone];
    postParams[3]=["userkey",code];
    postParams[4]=["openId",openId];
    postParams[5]=["usertype",usertype];
    var signVal=sign.createSign(postParams,appId);//签名
    const url = `${this.baseUrl2}/api/exam/follow.do?phone=${phone}&userkey=${code}&openId=${openId}&usertype=${usertype}&nonce_str=` + nonce_str + `&sign=` + signVal+ `&status=follow`;
    console.info("url",url);
    const data = await this.get(url);
    return data;
  }

  static async followCancel(soid,poid){
    var nonce_str = rand.getRand();//随机数
    var postParams=[];
    postParams[0]=["nonce_str",nonce_str];
    postParams[1]=["status","followCancel"];
    postParams[2]=["soid",soid];
    postParams[3]=["poid",poid];
    postParams[4]=["usertype",usertype];
    var signVal=sign.createSign(postParams,appId);
    const url = `${this.baseUrl2}/api/exam/followCancel.do?nonce_str=${nonce_str}&sign=${signVal}&status=followCancel&soid=${soid}&poid=${poid}&usertype=${usertype}`;
    const data=await this.get(url);
    return data;

  }

  /**
   * 短信验证码
   */
  static async smsCode (phone,status) {
    var nonce_str = rand.getRand();//随机数
    var postParams=[];
    postParams[0]=["nonce_str",nonce_str];
    postParams[1]=["status",status];
    postParams[2]=["phone",phone];
    postParams[3]=["usertype",usertype];
    postParams[4]=["xcxId",xcxId];
    var signVal=sign.createSign(postParams,appId);//签名
    const url = `${this.baseUrl2}/api/txsms/smsCode.do?phone=${phone}&usertype=${usertype}&xcxId=${xcxId}&nonce_str=` + nonce_str + `&sign=` + signVal+ `&status=${status}`;
    const data = await this.get(url);
    return data;
  }
  /**
   * 身份证验证登录
   */
  static async idCardLogin(realname,idcard){
    var nonce_str = rand.getRand();//随机数
    var postParams=[];
    postParams[0]=["nonce_str",nonce_str];
    postParams[1]=["status","idcard"];
    postParams[2]=["idcard",idcard];
    postParams[3]=["usertype",usertype];
    var signVal=sign.createSign(postParams,appId);//签名
    const url = `${this.baseUrl2}/api/exam/idCardLogin.do?idcard=${idcard}&usertype=${usertype}&`+encodeURI(encodeURI(`realname=${realname}`))+`&nonce_str=` + nonce_str + `&sign=` + signVal+ `&status=idcard`;
    console.info("url:",url);
    const data = await this.get(url);
    return data;
  }
  /**
   * 检查登录情况
   */
  static async check(loginCode) {
    const url = `${this.baseUrl}/auth/check?login_code=${loginCode}`;
    const data = await this.get(url);
    return data.result;
  }

  /**
   * 设置权限值
   */
  static getConfig(key) {
    return wepy.$instance.globalData.auth[key];
  }

  /**
   * 读取权限值
   */
  static async setConfig(key, value) {
    await wepy.setStorage({key: key, data: value});
    wepy.$instance.globalData.auth[key] = value;
  }

  /**
   * 删除权限值
   */
  static async removeConfig(key) {
    wepy.$instance.globalData.auth[key] = null;
    await wepy.removeStorage({key: key});
  }
}
