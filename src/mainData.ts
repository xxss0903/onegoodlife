// 常用的按钮列表，比如牛奶、拉屎、撒尿等快捷添加
import moment from "moment";

export const milkTags = ["纯奶粉", "母乳", "混合喂养"] // 牛奶类型
export const poopTags = ["黄色", "褐色", "胎便", "墨绿色", "奶瓣", "稀便", "干便", "正常"] // 拉屎类型
export const peeTags = ["少量", "中量", "多量", "黄色", "白色"] // 撒尿类型
export const jaundiceTags = ["正常", "生理性", "病理性"] // 黄疸类型
export const spitMilkTags = ["少量", "中量", "多量"] // 吐奶类型


// 内置的常用类型，不可更改和删除
export const commonTypeList = [
    {id: 1, name: "喝奶", value: "type_1", text: "牛奶", position: 1},
    {
        id: 2,
        name: "拉屎",
        value: "type_2", text: "拉屎", position: 2
    }, {
        id: 3,
        name: "撒尿",
        value: "type_3", text: "撒尿", position: 3
    }, {
        id: 4,
        name: "测黄疸",
        value: "type_4", text: "测黄疸", position: 4
    }, {
        id: 5,
        name: "吐奶",
        value: "type_5", text: "吐奶", position: 5
    }, {
        id: 6,
        name: "其他",
        value: "type_6", text: "其他", position: 6
    }, {
        id: 7,
        name: "身高",
        value: "type_7", text: "身高", position: 7
    }, {
        id: 8,
        name: "体重",
        value: "type_8", text: "体重", position: 8
    }]

// 全局数据，包括用户信息等需要全局使用的
export const mainData = {
    typeMapList: commonTypeList, // 类型列表，可以用来保存用户自己的类型数据
    commonActions: [commonTypeList[0], commonTypeList[1], commonTypeList[2], commonTypeList[5]], // 常用类型
    userInfo: {
        userName: "", // 登录用户名
        userId: "", // 用户ID
    }, // 用户信息
    babyInfo: {
        name: "", // 姓名
        nickname: "", // 小名
        birthDay: 0 // 出生日期
    }, // 婴儿信息
    appConfigs: {
        showStatics: true, // 默认首页显示统计信息
    }, // app默认设置
    oldData: {
        oldMilkData: null,
        oldPeeData: null,
        oldPoopData: null
    }
}


// 牛奶的模板数据
// 喝牛奶的模板数据
export const milkTemplateData = {
    name: mainData.typeMapList[0].name,
    typeId: mainData.typeMapList[0].id, // 1:吃奶；2：拉屎；3：撒尿；根据typeMap来进行获取
    time: moment().valueOf(), // 时间戳
    key: moment().valueOf(),
    remark: "", // 备注
    tags: milkTags, // 细分类型：比如吃奶的混合奶，纯奶，奶粉等
    selectedTags: [milkTags[0]], // 选中的类型
    dose: 30, // 剂量，母乳多少毫升
    pictures: [{
        time: moment().valueOf(), // 时间戳
        name: "", // 名称：使用类型和时间戳来标记
        url: "" // 图片在地址/远程地址
    }], // 图片
}
// 拉屎的模板数据
export const poopTemplateData = {
    name: mainData.typeMapList[1].name,
    typeId: mainData.typeMapList[1].id, // 1:吃奶；2：拉屎；3：撒尿；根据typeMap来进行获取
    time: moment().valueOf(), // 时间戳
    remark: "", // 备注
    tags: poopTags, // 细分类型：比如吃奶的混合奶，纯奶，奶粉等
    selectedTags: [], // 选中的类型
    dose: 0, // 剂量，母乳多少毫升
    pictures: [{
        time: moment().valueOf(), // 时间戳
        name: "", // 名称：使用类型和时间戳来标记
        url: "" // 图片在地址/远程地址
    }], // 图片
}
// 撒尿的模板
export const peeTemplateData = {
    name: mainData.typeMapList[2].name,
    typeId: mainData.typeMapList[2].id, // 1:吃奶；2：拉屎；3：撒尿；根据typeMap来进行获取
    time: moment().valueOf(), // 时间戳
    remark: "", // 备注
    tags: peeTags, // 细分类型：比如吃奶的混合奶，纯奶，奶粉等
    selectedTags: [], // 选中的类型
    dose: 0, // 剂量，母乳多少毫升
    pictures: [{
        time: moment().valueOf(), // 时间戳
        name: "", // 名称：使用类型和时间戳来标记
        url: "" // 图片在地址/远程地址
    }], // 图片
}
// 黄疸模板
export const jaundiceTemplateData = {
    name: mainData.typeMapList[3].name,
    typeId: mainData.typeMapList[3].id, // 1:吃奶；2：拉屎；3：撒尿；根据typeMap来进行获取
    time: moment().valueOf(), // 时间戳
    remark: "", // 备注
    tags: jaundiceTags, // 细分类型：比如吃奶的混合奶，纯奶，奶粉等
    selectedTags: [jaundiceTags[1]], // 选中的类型
    dose: 0, // 剂量，母乳多少毫升
    pictures: [{
        time: moment().valueOf(), // 时间戳
        name: "", // 名称：使用类型和时间戳来标记
        url: "" // 图片在地址/远程地址
    }], // 图片
    jaundiceValue: {
        header: 0, // 头的黄疸
        chest: 0 // 胸的黄疸
    }
}
// 吐奶模板
export const spitMilkTemplateData = {
    name: mainData.typeMapList[4].name,
    typeId: mainData.typeMapList[4].id, // 1:吃奶；2：拉屎；3：撒尿；根据typeMap来进行获取
    time: moment().valueOf(), // 时间戳
    remark: "", // 备注
    tags: spitMilkTags, // 细分类型：比如吃奶的混合奶，纯奶，奶粉等
    selectedTags: [spitMilkTags[0]], // 选中的类型
    dose: 0, // 剂量，母乳多少毫升
    pictures: [{
        time: moment().valueOf(), // 时间戳
        name: "", // 名称：使用类型和时间戳来标记
        url: "" // 图片在地址/远程地址
    }], // 图片
}
// 其他记录模板，比如其他的一些记录
export const otherTemplateData = {
    name: mainData.typeMapList[5].name,
    typeId: mainData.typeMapList[5].id, // 1:吃奶；2：拉屎；3：撒尿；根据typeMap来进行获取
    time: moment().valueOf(), // 时间戳
    remark: "", // 备注
    tags: [], // 细分类型：比如吃奶的混合奶，纯奶，奶粉等
    selectedTags: [], // 选中的类型
    dose: 0, // 剂量，母乳多少毫升
    pictures: [{
        time: moment().valueOf(), // 时间戳
        name: "", // 名称：使用类型和时间戳来标记
        url: "" // 图片在地址/远程地址
    }], // 图片
}