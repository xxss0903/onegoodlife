// 常用的按钮列表，比如牛奶、拉屎、撒尿等快捷添加
import moment from 'moment';
import {Image} from 'react-native';
import {Component, createElement} from 'react';
import {Colors} from './colors';

export const milkTags = ['纯奶粉', '母乳', '混合喂养']; // 牛奶类型
export const poopTags = [
  '黄色',
  '褐色',
  '胎便',
  '墨绿色',
  '奶瓣',
  '稀便',
  '干便',
  '正常',
]; // 拉屎类型
export const peeTags = ['少量', '中量', '多量', '黄色', '白色']; // 撒尿类型
export const jaundiceTags = ['正常', '生理性', '病理性']; // 黄疸类型
export const spitMilkTags = ['少量', '中量', '多量']; // 吐奶类型
export const heightTags = ['正常', '偏高', '偏矮']; // 身高类型
export const weightTags = ['正常', '偏重', '偏轻']; // 体重类型
export const diaperTags = ['涂药膏', '肚脐消毒']; // 尿布类型

// 内置的常用类型，不可更改和删除
export const commonTypeList = [
  {
    id: 1,
    name: '喝奶',
    value: 'type_1',
    text: '牛奶',
    position: 0,
    icon: require('./assets/ic_milk.png'),
    bgColor: Colors.primary4,
  },
  {
    id: 2,
    name: '拉屎',
    value: 'type_2',
    text: '拉屎',
    position: 1,
    icon: require('./assets/ic_poop.png'),
    bgColor: Colors.primary5,
  },
  {
    id: 3,
    name: '撒尿',
    value: 'type_3',
    text: '撒尿',
    position: 2,
    icon: require('./assets/ic_pee.png'),
    bgColor: Colors.primary6,
  },
  {
    id: 4,
    name: '测黄疸',
    value: 'type_4',
    text: '测黄疸',
    position: 3,
    icon: require('./assets/ic_jaundice.png'),
    bgColor: Colors.primary1,
  },
  {
    id: 5,
    name: '吐奶',
    value: 'type_5',
    text: '吐奶',
    position: 4,
    icon: require('./assets/ic_spitting.png'),
    bgColor: Colors.primary2,
  },
  {
    id: 6,
    name: '其他',
    value: 'type_6',
    text: '其他',
    position: 5,
    icon: require('./assets/ic_other.png'),
    bgColor: Colors.primary3,
  },
  {
    id: 7,
    name: '身高',
    value: 'type_7',
    text: '身高',
    position: 6,
    icon: require('./assets/ic_height.png'),
    bgColor: Colors.primary4,
  },
  {
    id: 8,
    name: '体重',
    value: 'type_8',
    text: '体重',
    position: 7,
    icon: require('./assets/ic_weight.png'),
    bgColor: Colors.primary5,
  },
  {
    id: 9,
    name: '换尿布',
    value: 'type_9',
    text: '换尿布',
    position: 8,
    icon: require('./assets/ic_pee_wrapper.png'),
    bgColor: Colors.primary6,
  },
];

// 全局数据，包括用户信息等需要全局使用的
export const mainData = {
  typeMapList: commonTypeList, // 类型列表，可以用来保存用户自己的类型数据
  commonActions: [commonTypeList[0], commonTypeList[1], commonTypeList[2]], // 常用类型
  userInfo: {
    userName: '', // 登录用户名
    userId: '', // 用户ID
  }, // 用户信息
  babies: [
    {
      name: 'Jack', // 姓名
      nickname: '小明', // 小名
      birthDay: moment().valueOf(), // 出生日期
      avatar:
        'https://hbimg.huabanimg.com/5bc47fcdeb5023b5473735b3489e146d362512a422ed2-3smjNx_fw658', // 头像
      babyId: 1,
    },
    {
      name: 'Zack', // 姓名
      nickname: '辣椒', // 小名
      birthDay: moment().valueOf(), // 出生日期
      avatar:
        'https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80', // 头像
      babyId: 2,
    },
  ], // 可以添加多个宝宝，比如双胞胎等
  babyInfo: {
    name: '', // 姓名
    nickname: '', // 小名
    birthDay: moment().valueOf(), // 出生日期
    avatar: '', // 头像
  }, // 婴儿信息
  appConfigs: {
    showStatics: true, // 默认首页显示统计信息
  }, // app默认设置
  oldData: {
    oldMilkData: null,
    oldPeeData: null,
    oldPoopData: null,
  },
};

// 常用按钮
export const commonActions = [
  commonTypeList[0],
  commonTypeList[1],
  commonTypeList[2],
  {
    id: 6,
    name: '全部',
    value: 'type_6',
    text: '全部',
    position: 6,
    icon: require('./assets/ic_all.png'),
  },
];

// 牛奶的模板数据
// 喝牛奶的模板数据
export const milkTemplateData = {
  name: mainData.typeMapList[0].name,
  typeId: mainData.typeMapList[0].id, // 1:吃奶；2：拉屎；3：撒尿；根据typeMap来进行获取
  time: moment().valueOf(), // 时间戳
  key: moment().valueOf(),
  remark: '', // 备注
  tags: milkTags, // 细分类型：比如吃奶的混合奶，纯奶，奶粉等
  selectedTags: [milkTags[0]], // 选中的类型
  dose: 30, // 剂量，母乳多少毫升
  pictures: [
    {
      time: moment().valueOf(), // 时间戳
      name: '', // 名称：使用类型和时间戳来标记
      url: '', // 图片在地址/远程地址
    },
  ], // 图片
};
// 拉屎的模板数据
export const poopTemplateData = {
  name: mainData.typeMapList[1].name,
  typeId: mainData.typeMapList[1].id, // 1:吃奶；2：拉屎；3：撒尿；根据typeMap来进行获取
  time: moment().valueOf(), // 时间戳
  remark: '', // 备注
  tags: poopTags, // 细分类型：比如吃奶的混合奶，纯奶，奶粉等
  selectedTags: [], // 选中的类型
  dose: 0, // 剂量，母乳多少毫升
  pictures: [
    {
      time: moment().valueOf(), // 时间戳
      name: '', // 名称：使用类型和时间戳来标记
      url: '', // 图片在地址/远程地址
    },
  ], // 图片
};
// 撒尿的模板
export const peeTemplateData = {
  name: mainData.typeMapList[2].name,
  typeId: mainData.typeMapList[2].id, // 1:吃奶；2：拉屎；3：撒尿；根据typeMap来进行获取
  time: moment().valueOf(), // 时间戳
  remark: '', // 备注
  tags: peeTags, // 细分类型：比如吃奶的混合奶，纯奶，奶粉等
  selectedTags: [], // 选中的类型
  dose: 0, // 剂量，母乳多少毫升
  pictures: [
    {
      time: moment().valueOf(), // 时间戳
      name: '', // 名称：使用类型和时间戳来标记
      url: '', // 图片在地址/远程地址
    },
  ], // 图片
};
// 黄疸模板
export const jaundiceTemplateData = {
  name: mainData.typeMapList[3].name,
  typeId: mainData.typeMapList[3].id, // 1:吃奶；2：拉屎；3：撒尿；根据typeMap来进行获取
  time: moment().valueOf(), // 时间戳
  remark: '', // 备注
  tags: jaundiceTags, // 细分类型：比如吃奶的混合奶，纯奶，奶粉等
  selectedTags: [jaundiceTags[1]], // 选中的类型
  dose: 0, // 剂量，母乳多少毫升
  pictures: [
    {
      time: moment().valueOf(), // 时间戳
      name: '', // 名称：使用类型和时间戳来标记
      url: '', // 图片在地址/远程地址
    },
  ], // 图片
  jaundiceValue: {
    header: 0, // 头的黄疸
    chest: 0, // 胸的黄疸
  },
};
// 吐奶模板
export const spitMilkTemplateData = {
  name: mainData.typeMapList[4].name,
  typeId: mainData.typeMapList[4].id, // 1:吃奶；2：拉屎；3：撒尿；根据typeMap来进行获取
  time: moment().valueOf(), // 时间戳
  remark: '', // 备注
  tags: spitMilkTags, // 细分类型：比如吃奶的混合奶，纯奶，奶粉等
  selectedTags: [spitMilkTags[0]], // 选中的类型
  dose: 0, // 剂量，母乳多少毫升
  pictures: [
    {
      time: moment().valueOf(), // 时间戳
      name: '', // 名称：使用类型和时间戳来标记
      url: '', // 图片在地址/远程地址
    },
  ], // 图片
};
// 其他记录模板，比如其他的一些记录
export const otherTemplateData = {
  name: mainData.typeMapList[5].name,
  typeId: mainData.typeMapList[5].id, // 1:吃奶；2：拉屎；3：撒尿；根据typeMap来进行获取
  time: moment().valueOf(), // 时间戳
  remark: '', // 备注
  tags: [], // 细分类型：比如吃奶的混合奶，纯奶，奶粉等
  selectedTags: [], // 选中的类型
  dose: 0, // 剂量，母乳多少毫升
  pictures: [
    {
      time: moment().valueOf(), // 时间戳
      name: '', // 名称：使用类型和时间戳来标记
      url: '', // 图片在地址/远程地址
    },
  ], // 图片
};
// 身高模板
export const heightTemplateData = {
  name: mainData.typeMapList[6].name,
  typeId: mainData.typeMapList[6].id, // 1:吃奶；2：拉屎；3：撒尿；根据typeMap来进行获取
  time: moment().valueOf(), // 时间戳
  remark: '', // 备注
  tags: heightTags, // 细分类型：比如吃奶的混合奶，纯奶，奶粉等
  selectedTags: [heightTags[0]], // 选中的类型
  height: 0, // 身高
  weight: 0, // 体重
  pictures: [
    {
      time: moment().valueOf(), // 时间戳
      name: '', // 名称：使用类型和时间戳来标记
      url: '', // 图片在地址/远程地址
    },
  ], // 图片
};
// 体重模板
export const weightTemplateData = {
  name: mainData.typeMapList[7].name,
  typeId: mainData.typeMapList[7].id, // 1:吃奶；2：拉屎；3：撒尿；根据typeMap来进行获取
  time: moment().valueOf(), // 时间戳
  remark: '', // 备注
  tags: weightTags, // 细分类型：比如吃奶的混合奶，纯奶，奶粉等
  selectedTags: [weightTags[0]], // 选中的类型
  height: 0, // 身高
  weight: 0, // 体重
  pictures: [
    {
      time: moment().valueOf(), // 时间戳
      name: '', // 名称：使用类型和时间戳来标记
      url: '', // 图片在地址/远程地址
    },
  ], // 图片
};

export const diaperTemplateData = {
  name: mainData.typeMapList[7].name,
  typeId: mainData.typeMapList[7].id, // 1:吃奶；2：拉屎；3：撒尿；根据typeMap来进行获取
  time: moment().valueOf(), // 时间戳
  remark: '', // 备注
  tags: diaperTags, // 细分类型：比如吃奶的混合奶，纯奶，奶粉等
  selectedTags: [], // 选中的类型
  height: 0, // 身高
  weight: 0, // 体重
  pictures: [
    {
      time: moment().valueOf(), // 时间戳
      name: '', // 名称：使用类型和时间戳来标记
      url: '', // 图片在地址/远程地址
    },
  ], // 图片
};
