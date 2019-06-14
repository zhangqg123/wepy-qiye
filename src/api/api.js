import {
  wxRequest
} from '../utils/wxRequest';

let env = "-test" //-dev 或者 -test
const domain = 'https://hunchun.zqgzht.com'

//const domain = 'http://192.168.0.199:8080/jeecg'

//定义广告位全局变量，用于页面获取
const apiAdUpload =  domain + '/upload/img/cms/'

/**
 * 获取所有栏目信息
 * @param params
 * @returns {*}
 */
const getMenuList = (params) => wxRequest(params, domain + '/work/cms/menu.do');

/**
 * 根据ColumnId返回文章数据
 * @param params
 * @returns {*}
 */
const getArticlesList = (params) => wxRequest(params, domain + '/work/cms/articles.do?coulmnId=?');

/**
 * 根据文章ID返回文章数据对象
 * @param params
 * @returns {*}
 */
const queryOneArticles = (params) => wxRequest(params, domain + '/work/cms/queryOneArticles.do?articlesId=?');

/**
 * 返回所有广告位信息
 * @param params
 * @returns {*}
 */
const queryAllAdImages = (params) => wxRequest(params, domain + '/work/cms/queryAllAdImages.do');

/**
 * 返回站点信息接口
 * @param params
 * @returns {Promise<*>}
 */
const  querySiteInfo = (params) => wxRequest(params, domain + '/work/cms/querySiteInfo.do');

module.exports = {
  getMenuList,
  getArticlesList,
  queryOneArticles,
  queryAllAdImages,
  querySiteInfo,
  apiAdUpload
}

