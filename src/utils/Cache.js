import ask from '../api/ask';
import auth from '../api/auth';

export default class Cache {
  static cache = new Map();
  static _debug = false;

  static async menuList() {
    const KEY = 'MENU';
    if (this.isExpired(KEY)) {
      const info = await ask.getMenuList();
      this.set(KEY, info);
    }
    return this.cache.get(KEY);
  }
  static async queryAd() {
    const KEY = 'AD';
    if (this.isExpired(KEY)) {
      const info = await ask.queryAllAdImages();
      this.set(KEY, info);
    }
    return this.cache.get(KEY);
  }

  static async dept() {
    const KEY = 'DEPT';
    if (this.isExpired(KEY)) {
      const info = await auth.dept();
      this.set(KEY, info);
    }
    return this.cache.get(KEY);
  }
  /**
   * 获取考试分类
   */
  static async columnList() {
    const KEY = 'COLUMN';
    if (this.isExpired(KEY)) {
      const info = await ask.columnList();
      this.set(KEY, info);
    }
    return this.cache.get(KEY);
  }
  /**
   * 获取考试列表
   */
  static async examList() {
    const KEY = 'EXAM';
    if (this.isExpired(KEY)) {
      const info = await exam.examList();
      this.set(KEY, info);
    }
    return this.cache.get(KEY);
  }
  /**
   * 获取指南
   */
  static async guideIdName() {
    const KEY = 'GUIDENAME';
    if (this.isExpired(KEY)) {
      const info = await zwzx.guideIdName();
      this.set(KEY, info);
    }
    return this.cache.get(KEY);
  }
  /**
   * 判断是否过期
   */
  static isExpired(key, minute = 5) {
    const value = this.cache.get(key);
    if (value == null) {
      this.log(`[cache]${key} not exists`);
      return true;
    }
    const interval = new Date().getTime() - value._lastupdate;
    const isExpired = interval > minute * 60 * 1000;
    if (isExpired) {
      this.log(`[cache]${key} expired, interval=${interval}`);
      this.cache.delete(key);
    } else {
      this.log(`[cache]${key} exists, interval=${interval}`);
    }
    return isExpired;
  }
  /**
   * 删除缓存对象
   */
  static remove(key) {
    if (key == null) {
      return;
    }
    this.cache.delete(key);
  }

  /**
   * 设置缓存
   */
  static set(key, value) {
    if (key == null) {
      return;
    }
    value._lastupdate = new Date().getTime();
    this.cache.set(key, value);
  }
  static log(text) {
    if (this._debug) {
      console.info(text);
    }
  }
}
