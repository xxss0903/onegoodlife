# 一好生活

一好生活是一个专为记录宝宝日常生活而设计的移动应用。它允许家庭成员共同记录和查看宝宝的各种活动，如喝奶、换尿布等，方便家人及时照顾和了解宝宝的状况。

## 功能特点

1. 生活记录：记录宝宝的日常活动，如喝奶、换尿布、睡眠等。
2. 数据统计：提供各种统计图表，包括喝奶量、体重、身高、黄疸等。
3. 生长曲线：展示宝宝的生长曲线，包括体重和身高。
4. 多人协作：家庭成员可以共同记录和查看宝宝的信息。
5. 实时更新：及时反馈宝宝的状态，方便家人照顾。

## 技术栈

- React Native
- TypeScript
- SQLite (通过 react-native-sqlite-storage)
- react-native-gifted-charts (用于图表展示)
- Native Base (UI组件库)

## 版本特性

### V1版本

- 基本记录功能：喝奶、换尿布、睡眠等
- 简单的数据统计和展示

### V2版本

- 性别特定的配色方案
- 自定义记录类型
- 更丰富的统计图表，包括：
  - 奶粉和母乳统计
  - 体重和身高统计
  - 黄疸指数统计
  - 生长曲线对比

## 安装

1. 克隆仓库：
   ```bash
   git clone https://github.com/xxss0903/onegoodlife.git
   ```
2. 安装依赖：
   ```bash
   cd onegoodlife
   npm install
   ```
3. 运行应用：
   - iOS: `npx react-native run-ios`
   - Android: `npx react-native run-android`<br>
`注意：Android的安装因为网络问题使用了下载的本地的gradle-8.3-all.zip文件，放在gradle/wrapper文件夹下面，因为这个文件比较大没有上传上来，所以需要自行下载这个文件，然后放在gradle/wrapper文件夹下面`
<br>
   - gradle-8.3-all下载地址[gradle-8.3-all.zip](https://services.gradle.org/distributions/gradle-8.3-all.zip)
## 使用说明

[这里可以添加一些基本的使用说明或链接到更详细的文档]

## 贡献指南

我们欢迎任何形式的贡献，包括但不限于：

- 报告bug
- 提出新功能建议
- 改进文档
- 提交代码修复或新功能

请fork本仓库并创建pull request来提交您的贡献。

## 未来计划

1. 添加多语言支持
2. 实现云同步功能，方便多设备使用
3. 增加更多的数据分析和预测功能
4. 优化用户界面，提高用户体验
5. 添加提醒功能，如定时喂奶提醒等

## 许可证

本项目采用 Apache 2.0 许可证。详情请见 [LICENSE](LICENSE) 文件。

## 联系方式

如有任何问题或建议，请通过以下方式联系我们：

- 邮箱：[xxss0903@example.com]
- 项目Issues：[GitHub Issues链接](https://github.com/xxss0903/onegoodlife/issues)
