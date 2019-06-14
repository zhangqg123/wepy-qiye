import base from './base';
import wepy from 'wepy';
import Page from '../utils/Page';
import Lang from '../utils/Lang';
const rand = require('../utils/random.js');
const sign = require('../utils/sign.js');
var appId=wepy.$instance.globalData.appId;
var xcxId=wepy.$instance.globalData.xcxId;

export default class ask extends base {
  static async queryAnswer (openId,examId) {
    const url = `${this.baseUrl2}/work/exam/queryAnswer.do?openId=${openId}&examId=${examId}`;
    const data=await this.get(url);
    return data;
  }

  static  collectFormIds (formId) { 
      let formIds = wepy.$instance.globalData.globalFormIds;  // 获取全局推送码数组
      if (!formIds)
          formIds = [];
      let data = {
          formId: formId,
          expireTime: new Date().getTime() + 604800000
      }
      formIds.push(data);
      wepy.$instance.globalData.globalFormIds = formIds;
  }

  static scoreList(openId) {
    const url = `${this.baseUrl2}/work/exam/scoreList.do?openId=${openId}`;
    console.info("url",url);
//    const data=await this.get(url);
//    return data;

    return new Page(url, this._processScoreList.bind(this));
  }

  static _processScoreList(item) {
  }

  static async queryScore (openId,examId) {
    const url = `${this.baseUrl2}/work/exam/queryScore.do?openId=${openId}&examId=${examId}`;
    const data=await this.get(url);
     return data;
  }
  static async queryAllAdImages () {
    const url = `${this.baseUrl2}/work/cms/queryAllAdImages.do?xcxId=${xcxId}`;
    const data=await this.get(url);
    return data.obj;
  }
  static async getMenuList () {
    const url = `${this.baseUrl2}/work/cms/lstMenu.do?xcxId=${xcxId}`;
    const data=await this.get(url);
    return data;
  }
  static async getArticlesList (columnId) {
    const url = `${this.baseUrl2}/work/cms/articles.do?columnId=${columnId}`;
    const data=await this.get(url);
    return data;
  }
  static async queryOneArticles (articleId) {
    const url = `${this.baseUrl2}/work/cms/queryOneArticles.do?articleId=${articleId}`;
    const data=await this.get(url);
    return data;
  }
  static articleList(columnId) {
    console.info('columnId',columnId);
    const url = `${this.baseUrl2}/work/cms/articleList.do?columnId=${columnId}&xcxId=${xcxId}`;
    return new Page(url, this._processNoList.bind(this));
  }
  static _processNoList(item) {
  }
  static assignList() {
    var createBy=wepy.$instance.globalData.createBy;
    const url = `${this.baseUrl2}/work/exam/assignList.do?createBy=${createBy}`;
    return new Page(url, this._processNoList.bind(this));
  }
  
  static examList(categories) {
    var createBy=wepy.$instance.globalData.createBy;
    const url = `${this.baseUrl2}/work/exam/examList.do?createBy=${createBy}`;
    return new Page(url, this._processExamList.bind(this,categories));
  }
  
  static askList(categories) {
//    var createBy=wepy.$instance.globalData.createBy;
    const url = `${this.baseUrl2}/work/lst/askList.do`;
    return new Page(url, this._processAskList.bind(this,categories));
//    return new Page(url, this._processNoList.bind(this));

  }

  static _processAskList(categories,item) {
    if(categories!=null){
      const id=item.categoryId;
      item.categoryName = categories.find(item => item.id == id).columnName;
    }
    switch (item.askStatus) {
      case 11 : item.statusName = '提问待审核';
        break;
      case 12 : item.statusName = '提问已审核';
        break;
      case 13 : item.statusName = '提问未通过';
        break;
      case 21 : item.statusName = '提问已翻译';
        break;
      case 31 : item.statusName = '回答待审核';
        break;
      case 32 : item.statusName = '回答已审核';
        break;
      case 33 : item.statusName = '回答未通过';
        break;
      case 41 : item.statusName = '回答已翻译';
        break;
    }
  }

  static async queryOneAsk (askId) {
    const url = `${this.baseUrl2}/work/lst/queryOneAsk.do?askId=${askId}`;
    const data=await this.get(url);
    return data.obj;
  }
  
  static async upload(filePath,existFile) {
    var openId=wepy.$instance.globalData.auth["openId"];

    const url = `${this.baseUrl2}/rest/lhs/lhSRestAsk/doUpload?openId=${openId}&existFile=${existFile}`;
    const param = {
      url,
      filePath,
      name: 'image'
    };
    return await wepy.uploadFile(param);
  }
  static async createAsk(ask) {
    const url = `${this.baseUrl2}/rest/lhs/lhSRestAsk/createAsk?xcxId=${xcxId}`;
    return await this.post(url, ask);
  }

  static async updateAsk(ask) {
    const url = `${this.baseUrl2}/rest/lhs/lhSRestAsk/updateAsk?xcxId=${xcxId}`;
    return await this.post(url, ask);
  }


  static async columnList () {
//    var createBy=wepy.$instance.globalData.createBy;
    var nonce_str = rand.getRand();//随机数
    var postParams=[];
    postParams[0]=["nonce_str",nonce_str];
    postParams[1]=["status","columnList"];
//    postParams[2]=["createBy",createBy];
    var signVal=sign.createSign(postParams,appId);
    const url = `${this.baseUrl2}/work/lst/columnList.do?nonce_str=${nonce_str}&sign=${signVal}&status=columnList`;
    var data=await this.get(url);
    return data;
  }
  static async uploadFormIds(formIds){
    var openId=wepy.$instance.globalData.auth["openId"];
//    var nonce_str = rand.getRand();//随机数
//    var postParams=[];
//    postParams[0]=["nonce_str",nonce_str];
//    postParams[1]=["status","uploadFormIds"];
//    postParams[2]=["formIds",formIds];
//    postParams[3]=["openId",openId];
//    var signVal=sign.createSign(postParams,appId);
//    const url = `${this.baseUrl2}/api/main/exam/uploadFormIds.do?nonce_str=${nonce_str}&sign=${signVal}&status=uploadFormIds&openId=${openId}&formIds=${formIds}`;
    const url = `${this.baseUrl2}/rest/lhs/main/uploadFormIds?openId=${openId}&formIds=${formIds}`;
    const data=await this.get(url);
    return data;

  }


  /**
   * 获取试题
   */
  static async questionList (examId) {
    var nonce_str = rand.getRand();//随机数
    var postParams=[];
    postParams[0]=["nonce_str",nonce_str];
    postParams[1]=["status","questionList"];
    postParams[2]=["examId",examId];
    var signVal=sign.createSign(postParams,appId);
    const url = `${this.baseUrl2}/api/exam/questionList.do?nonce_str=${nonce_str}&sign=${signVal}&status=questionList&examId=${examId}`;
    const data=await this.get(url);
    return data;
  }
  
  /**
   * 查询部门分类
   */
  static examList2 () {
    var nonce_str = rand.getRand();//随机数
    var postParams=[];
    postParams[0]=["nonce_str",nonce_str];
    postParams[1]=["status","examList"];
    var signVal=sign.createSign(postParams,appId);

    const url = `${this.baseUrl2}/api/exam/examList.do?nonce_str=${nonce_str}&sign=${signVal}&status=examList`;
    console.info("url====",url);
    return this.get(url).then(data => this._createExamList(data));
  }

  static _createExamList (data) {
    const list = [];
    if (data != null) {
      list.push(...data.map(item => {
        return {
          id: item.id,
          examName: item.examName,
          score: item.score
        };
      }));
    }
    return {
      list: list,
      selectedId: null,
      scroll: false
    };
  }


  static async subChoose(param,openId,examId,startTime) {
    var nonce_str = rand.getRand();//随机数
    var postParams=[];
    postParams[0]=["nonce_str",nonce_str];
    postParams[1]=["status","subChoose"];
    postParams[2]=["param",param];
    postParams[3]=["openId",openId];
    postParams[4]=["examId",examId];
    postParams[5]=["xcxId",xcxId];
    postParams[6]=["startTime",startTime];
    var signVal=sign.createSign(postParams,appId);

    const url = `${this.baseUrl2}/api/main/exam/subChoose.do?nonce_str=${nonce_str}&sign=${signVal}&status=subChoose&param=${param}&openId=${openId}&examId=${examId}&xcxId=${xcxId}&startTime=${startTime}`;
//    var data= await this.get(url);
    return this.get(url).then(data => this._createExamScore(data));

  }
  
  static _createExamScore (data) {
    var sum=0;
    let answerList;
    answerList = data.map(item => {
      var rightValue=null;
      switch (item.rightAnswer) {
        case '1' : rightValue = 'A';
          break;
        case '2' : rightValue = 'B';
          break;
        case '3' : rightValue = 'C';
          break;
        case '4' : rightValue = 'D';
          break;
      }
      if(item.right=="1"){
        sum++;
      }
      var id = item.id;
      var right = item.right;
      return {id, rightValue, right};
      
    });
    console.info("sum",sum);
    return {
      list: answerList,
      score: sum
    };
  }
}
