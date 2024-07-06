/**
 * 日志帮助类
 */

const TAG_I = 'level-i ====>';
const TAG_E = 'level-e ====>';
const showLog = true;

/**
 * 输出日志-i级别
 * @param msg
 * @param data
 */
export const logi = (msg, data = null) => {
  if (showLog) {
    logimpl(TAG_I, msg, data);
  }
};

/**
 * 输入日志-e级别
 * @param msg
 * @param data
 */
export const loge = (msg, data = null) => {
  logimpl(TAG_E, msg, data);
};

const logimpl = (tag, msg, data = null) => {
  function getMsgString(msg) {
    if (msg instanceof String) {
      return msg;
    } else {
      try {
        return JSON.stringify(msg);
      } catch (e) {
        console.log(tag + e.message);
        console.log(tag, msg);
        return null;
      }
    }
  }

  if (data) {
    console.log(tag + ' # ' + msg, data);

    if (tag === TAG_E) {
    }
  } else {
    const msgStr = getMsgString(msg);
    if (msgStr) {
      console.log(tag + msgStr);
    }

    if (tag === TAG_E) {
    }
  }
};
