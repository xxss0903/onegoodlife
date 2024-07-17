import {PixelRatio, StyleSheet} from 'react-native';
import {Colors} from './colors';
import {Font} from './font';
import {Margin, Size, Style} from './space';
import {screenH, screenW} from './utils/until';

// 创建页面item的行两边间距margin
export const SPACE_ROW_HORIZONTAL = 12;
// 向右的icon的大小
export const ICON_FONT_SIZE = 15;
// 顶部的间距
export const SPACE_ROW_TOP = 10;
// tab的横向空隙
export const SPACE_TAB_HORIZONTAL = 20;
// tab的垂直空隙
export const SPACE_TAB_VERTICAL = 8;
// 带高的输入框的高度
export const HEIGHT_INPUT_AREA = 200;
// 通用行的高度
export const HEIGHT_ROW = 50;
// 下划线的高度
export const HEIGHT_LINE = 0.5;
// 加粗的分隔线
export const HEIGHT_LINE_BOLD = 10;
// 底部tab高度
export const HEIGHT_BOTTOM = 48;
// 下划线颜色
export const COLOR_LINE = '#D9D9D9';
// 个人信息背景色
export const USER_BKC = Colors.background;
// 第一级的tab颜色
export const COLOR_FIRST_TAB_BG = '#FEF1EF';
// 文字主要显示颜色
export const COLOR_MAIN_THEME = '#D0261E';
export const COLOR_HEADER_RIGHT = '#ffffff';
export const COLOR_PROGRESSBAR_BG = '#dddddd';
// 下面footer的文字颜色
export const COLOR_FOOTER_TEXT = '#fff';
export const FONT_HEADER_RIGHT = 24;
// 首页页面的header的title大小
export const FONT_HEADER_TITLE = 20;
// 评议项的背景色
export const COLOR_PYX_BACKGROUND = '#F5F5F9';
// 输入框的颜色
export const COLOR_INPUT_BORDER = COLOR_MAIN_THEME;
// 行的字体大小
export const FONT_SIZE_ROW = 17;
// 第一级的tab的文字大小-大
export const FONT_FIRST_TAB_BIGGER = 20;
// 第一级的tab的文字大小-小
export const FONT_FIRST_TAB_SMALL = 14;
// 第二级的文字大小
export const FONT_SECOND_TAB = 16;
// 行的标题宽度
export const WIDTH_ROW_TITLE = 110;
// 边框width
export const BORDER_WIDTH = 0.5;
// 边框颜色
export const BORDER_COLOR = '#c8c8c8';
// 外边框的宽度
export const WIDTH_BORDER = 0.5;
export const COLOR_BLACK = '#000';
// 页面的header的title颜色
export const COLOR_HEADER_TITLE = '#ffffff';
// 标题栏的logo的大小
export const SIZE_TITLE_LOGO = 23.5;
// 标题栏的icon按钮的大小
export const SIZE_TITLE_ICON = 7.5;
// 底部点赞的大小
export const SIZE_FOOTER_ZAN = 20;
// 字间距
export const LETTER_SPACING = 5;
// 字体20的行间距
export const LINE_HEIGHT_FONT_SIZE_20 = 30;

// 列表行的时间字体大小
export const FONT_LIST_ROW_TIME = 12;
// 列表行的按钮的文字大小
export const FONT_LIST_ROW_BUTTON = 15;
// 列表行的count大小
export const FONT_LIST_ROW_COUNT = 12;
// 列表行的子标题大小
export const FONT_LIST_ROW_SUB_TITLE = 16;
// 列表行的标题大小
export const FONT_LIST_ROW_TITLE = 14;
// 列表行的icon的大小
export const FONT_LIST_ROW_ICON = 20;
// filter的按钮字体
export const FONT_FILTER_BUTTON = 14;
// filter界面的标题字体
export const FONT_FILTER_ROW_TITLE = 14;
// filter界面的icon大小
export const FONT_FILTER_ROW_ICON = 18;
// filter界面的值字体
export const FONT_FILTER_ROW_VALUE = 14;
// 列表行的下面tag大小
export const FONT_LIST_ROW_TAG = 16;
// 列表行下面的status大小
export const FONT_LIST_ROW_STATUS = 12;
// 列表行的内容大小
export const FONT_LIST_ROW_CONTENT = 18;
// 行列表-在线考试的联系按钮字体
export const FONT_LIST_ROW_LIANXI = 18;
// 行列表的section的标题大小
export const FONT_LIST_ROW_SECTION_TITLE = 14;
// 行列表的section的更多大小
export const FONT_LIST_ROW_SECTION_MORE = 12;
// 行列表的部门大小
export const FONT_LIST_ROW_DEPARTMENT = 14;
// 我的消息的content字体大小
export const FONT_MESSAGE_LIST_CONTENT = 15;
// 一级的tab大小
export const FONT_TAB_FIRST = 14;
// 二级的tab的大小
export const FONT_TAB_SECONT = 12;
// 详细页面字体大小
export const FONT_DEFAULT = 16;
// 登录页面的登录字体大小
export const FONT_LOGIN_BUTTON = 19;
// 登录页面的小号字体，指纹登录
export const FONT_LOGIN_SMALL = 13;
// section列表分割的title大小
export const FONT_SECTION_TITLE = 20;

// 占位高度
export const BLOCK_HEIGHT = 70;
// 轮播的高度
export const HEIGHT_SWIPER_LUNBO = 220;
// 默认头像大小
export const SIZE_AVATAR_DEFAULT = 30;
// 统一的图片的边角圆
export const SIZE_IMG_RADIUS = 4;
// 活动为开始颜色
export const COLOR_BEFORE_START = '#f6b331';
// 活动进行中
export const COLOR_PROCESSING = '#3BCA76';
// 活动已结束
export const COLOR_END = '#000000';
// 已拒绝状态颜色
export const COLOR_DENY = '#FF0000';
// 面包屑
export const COLOR_ORG = '#B3B3B3';

// timePicker 定制边框和文字
export const dateInput = {
  justifyContent: 'center',
  alignItems: 'flex-end',
  margin: 0,
  paddingRight: 0,
  backgroundColor: '#fff',
  borderColor: 'transparent',
  fontSize: FONT_SIZE_ROW,
};

// dateText 定制边框和文字
export const dateText = {
  justifyContent: 'center',
  alignItems: 'flex-end',
  margin: 0,
  paddingRight: 0,
  backgroundColor: '#fff',
  borderColor: 'transparent',
  fontSize: FONT_LIST_ROW_CONTENT,
  color: Colors.primary,
};

export const commonStyles = StyleSheet.create({
  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
  },
  bottomContainer: {
    height: 60,
    display: 'flex',
    flexDirection: 'row',
    position: 'absolute',
    bottom: Margin.vertical,
    left: Margin.horizontal,
    width: screenW - Margin.horizontal * 2,
    backgroundColor: Colors.white,
  },
  fullScreen: {
    width: screenW,
    height: screenH,
  },
  modal: {
    height: screenH,
    width: screenW,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalProgressContainer: {
    width: 300,
    marginHorizontal: 60,
    borderRadius: 10,
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  detailPageFooterBtnContainer: {
    flex: 1,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    width: '96%',
    borderRadius: 25,
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: '2%',
  },
  detailPageFooterBtnText: {
    color: Colors.white,
    fontSize: FONT_LIST_ROW_TITLE,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    color: Colors.white,
    fontSize: 28,
  },
  avatarSize: {
    width: Size.avatarSize,
    height: Size.avatarSize,
  },
  roundBtnText: {
    color: Colors.primary,
    fontSize: Font.cell.smalBtnText,
    fontWeight: Style.bold,
  },
  roundBtnContainer: {
    fontWeight: 'bold',
    borderWidth: 0.5,
    borderStyle: 'solid',
    borderColor: Colors.background,
    paddingVertical: 4,
    borderRadius: 20,
    paddingHorizontal: Margin.horizontal,
  },
  tabSubContainer: {},
  tabSubText: {},
  tabSubActie: {},
  tabContainer: {
    flex: 1,
    elevation: 3,
  },
  tabBarUnderline: {
    backgroundColor: Colors.primary,
  },
  customListContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Margin.horizontal,
    paddingVertical: Margin.cellSmallTop,
  },
  statusTextContainer: {
    borderRadius: 10,
    height: 20,
    alignSelf: Style.center,
    justifyContent: Style.center,
    alignItems: Style.center,
    paddingHorizontal: Margin.midHorizontal,
    marginRight: Margin.horizontal,
  },
  statusTextContainer2: {
    borderRadius: 10,
    height: 20,
    alignSelf: Style.flex_end,
    justifyContent: Style.center,
    alignItems: Style.center,
  },
  statusText: {
    textAlign: 'center',
    color: Colors.white,
    fontSize: Font.cell.status,
    alignSelf: 'center',
  },
  anotherStatusText: {
    textAlign: 'center',
    color: Colors.fab,
    fontSize: Font.cell.status,
    alignSelf: 'center',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightArrow: {
    color: COLOR_MAIN_THEME,
    fontSize: FONT_LIST_ROW_ICON,
  },
  navbar: {
    flexDirection: 'row',
    borderBottomColor: '#000000',
    borderBottomWidth: 1 / PixelRatio.get(),
    backgroundColor: COLOR_MAIN_THEME,
  },
  zan: {
    width: SIZE_FOOTER_ZAN,
    height: SIZE_FOOTER_ZAN,
    marginRight: SPACE_ROW_HORIZONTAL,
  },
  zeroHeader: {
    height: 0,
    backgroundColor: COLOR_MAIN_THEME,
  },
  badgeTabBar: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLOR_MAIN_THEME,
    position: 'absolute',
    bottom: 32,
    right: 12,
  },
  badge: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLOR_MAIN_THEME,
  },
  line: {
    height: HEIGHT_LINE,
    backgroundColor: COLOR_LINE,
  },
  lineBold: {
    height: HEIGHT_LINE_BOLD,
    backgroundColor: '#f5f5f9',
  },
  footerTab: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginVertical: 10,
    marginHorizontal: '5%',
    height: 30,
  },
  footerTabText: {
    color: '#ffffff',
  },
  loadingView: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  loadingView2: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 9999,
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: screenH,
    width: screenW,
  },

  commonRowItemText: {
    fontSize: FONT_SIZE_ROW,
    color: Colors.black333,
  },
  // 详情显示内容的样式
  commonContentArea: {
    paddingHorizontal: SPACE_ROW_HORIZONTAL,
    paddingVertical: SPACE_ROW_TOP,
    borderWidth: WIDTH_BORDER,
    borderColor: COLOR_INPUT_BORDER,
    fontSize: FONT_SIZE_ROW,
    color: COLOR_MAIN_THEME,
    marginTop: SPACE_ROW_TOP,
  },
  // 行的内容view
  commonRowItemContentView: {
    marginLeft: 20,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  commonRowItemContentView2: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  // 行的标题显示view
  commonRowItemTitleView: {
    width: WIDTH_ROW_TITLE,
  },
  // 通用两边的间距
  commonRowHorizonMargin: {
    marginHorizontal: Margin.horizontal,
  },
  // 带两边间距的下划线
  lineWithMargin: {
    height: HEIGHT_LINE,
    backgroundColor: COLOR_LINE,
    marginHorizontal: SPACE_ROW_HORIZONTAL,
  },
  // 创建的行样式
  commonRowItem: {
    marginHorizontal: SPACE_ROW_HORIZONTAL,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  commonRowItemMinHeight: {
    marginHorizontal: SPACE_ROW_HORIZONTAL,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',

    flexDirection: 'row',
  },
  // 行的标题text样式
  rowTitleText: {
    fontSize: FONT_SIZE_ROW,
    color: COLOR_MAIN_THEME,
  },
  // 行的内容text样式
  rowContentText: {
    fontSize: FONT_SIZE_ROW,
    color: COLOR_MAIN_THEME,
  },
  // 通用的普通文本样式
  commonContentText: {
    fontSize: 16,
    color: Colors.black333,
  },
  // 字体样式，不带宽度
  commonTextStyle: {
    fontSize: FONT_SIZE_ROW,
    color: COLOR_MAIN_THEME,
  },
  // 输入框默认样式
  commonTextInputStyle: {
    fontSize: 16,
    flex: 1,
    textAlign: 'left',
    paddingVertical: Margin.vertical,
    paddingHorizontal: Margin.midHorizontal,
  },
  // 输入框的外框
  commonTextInputBorder: {
    borderWidth: WIDTH_BORDER,
    borderColor: COLOR_INPUT_BORDER,
  },
  // 按钮的外框
  commonButtonBorder: {
    borderWidth: WIDTH_BORDER,
    borderColor: COLOR_INPUT_BORDER,
  },
  commonFooterButton: {
    backgroundColor: COLOR_MAIN_THEME,
    justifyContent: 'center',
    borderRadius: 25,
    alignItems: 'center',
    marginVertical: SPACE_ROW_TOP,
    flex: 1,
    marginHorizontal: '2%',
    flexDirection: 'row',
  },
  commonFooterButtonText: {
    color: COLOR_FOOTER_TEXT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commonFooterButtonTextB: {
    color: COLOR_MAIN_THEME,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commonFooterButtonTextWhite: {
    color: COLOR_HEADER_RIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightIcon: {
    color: COLOR_MAIN_THEME,
    fontSize: ICON_FONT_SIZE,
    marginLeft: SPACE_ROW_HORIZONTAL,
    alignSelf: 'center',
  },
  // 内容输入框样式
  textInputArea: {
    marginTop: SPACE_ROW_TOP,
    height: 140,
    fontSize: FONT_SIZE_ROW,
    borderWidth: BORDER_WIDTH,
    borderColor: BORDER_COLOR,
    textAlignVertical: 'top',
  },
  timePicker: {
    fontSize: FONT_SIZE_ROW,
    // marginRight: SPACE_ROW_HORIZONTAL,
  },
  // 跳转新页面最后面的右箭头
  arrowRight: {
    fontSize: FONT_SIZE_ROW,
    marginLeft: 5,
  },
  // tab页面的img
  homeImge: {
    height: 50,
  },
  // 选择评议人分为删除和编辑标签，点击标签进行操作
});

// 考试
export const examStyles = StyleSheet.create({
  submitAnswerContainer: {
    flex: 1,
    marginTop: SPACE_ROW_TOP,
    backgroundColor: COLOR_MAIN_THEME,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    height: 40,
  },
  submitAnswerText: {
    color: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginVertical: 5,
    borderRadius: 5,
  },
  selectCell: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
    backgroundColor: '#fff',
  },
  selectContainer: {
    marginHorizontal: 15,
    marginVertical: 5,
    borderRadius: 5,
  },
  selectCellTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 20,
    marginBottom: 5,
    backgroundColor: '#fff',
  },
  gapContainer: {
    marginHorizontal: 15,
    marginVertical: 5,
    borderRadius: 5,
    backgroundColor: '#fff',
    flexDirection: 'column',
  },
  titleContainer: {
    marginHorizontal: 15,
    marginVertical: 5,
    borderRadius: 5,
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  pointCell: {
    marginHorizontal: 5,
    marginVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    paddingHorizontal: 5,
    paddingVertical: 10,
    borderColor: '#f5f5f9',
  },
  point: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondNum: {
    fontSize: 16,
    color: '#9d9d9d',
  },
  titleCell: {
    marginHorizontal: 5,
    marginBottom: 5,
    flexDirection: 'row',
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 5,
    flex: 1,
  },
  title: {
    fontSize: 20,
    letterSpacing: LETTER_SPACING,
    lineHeight: LINE_HEIGHT_FONT_SIZE_20,
    flex: 1,
  },
  gapTitle: {
    fontSize: 20,
    paddingLeft: 10,
    width: WIDTH_ROW_TITLE,
  },
  input: {
    fontSize: 20,
    flex: 1,
    paddingTop: 0,
  },
  subjectivity: {
    marginVertical: 5,
    flexDirection: 'column',
    marginHorizontal: 10,
  },
  subjectivityInput: {
    textAlignVertical: 'top',
    height: 280,
    flex: 1,
    fontSize: 21,
  },
  subjectivityTitle: {
    fontSize: 20,
  },
  rightCell: {
    marginVertical: 5,
    borderRadius: 5,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
  },
  answerContainer: {
    marginVertical: SPACE_ROW_HORIZONTAL,
    borderRadius: 5,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightText: {
    fontSize: 20,
    paddingHorizontal: 10,
    marginVertical: SPACE_ROW_HORIZONTAL,
  },
  detailContainer: {
    backgroundColor: '#f5f5f9',
  },
  detailImage: {
    height: 150,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  detialContent: {
    position: 'relative',
    top: -120,
  },
  detailTimeCell: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.7)',
    marginHorizontal: 15,
  },
  detailTime: {
    flexDirection: 'row',
    paddingLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  answerCell: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginVertical: 5,
    borderRadius: 5,
    marginHorizontal: 15,
  },
  answer: {
    color: '#D32720',
    fontSize: 12,
  },
  detailFooter: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailButton: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#D0261E',
    marginHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 15,
  },
  detailButtonDisable: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#9D9D9D',
    marginHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 15,
  },
  detailButtonTitle: {color: 'white'},
  detailMenu: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#D0261E',
    marginHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 15,
  },
});

// 标题栏的样式
export const titleBarStyles = StyleSheet.create({
  leftLogo: {
    width: SIZE_TITLE_LOGO,
    height: SIZE_TITLE_LOGO,
  },
  rightIcon: {
    width: SIZE_TITLE_ICON,
    height: SIZE_TITLE_ICON,
  },
});

// 页面中tab的样式
export const tabStyles = StyleSheet.create({
  firstTabBg: {
    backgroundColor: COLOR_FIRST_TAB_BG,
    flexDirection: 'row',
    height: 40,
    paddingHorizontal: SPACE_ROW_HORIZONTAL,
  },
  firstTabTextNormal: {
    flexDirection: 'row',
    height: 40,
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  firstTabTextActive: {
    flexDirection: 'row',
    height: 40,
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  firstTabTitleFirst: {
    fontSize: FONT_FIRST_TAB_BIGGER,
  },
  firstTabTitleOthers: {
    fontSize: FONT_FIRST_TAB_SMALL,
  },
  firstTabTitleBottomLine: {
    height: 1,
    backgroundColor: COLOR_MAIN_THEME,
    marginTop: 4,
  },
  secondTabBg: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    height: 50,
  },
  secondTabBgActive: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
    backgroundColor: '#fff',
  },
  secondtabBgNormal: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
    backgroundColor: '#fff',
  },
  secondTabTextNormal: {
    fontSize: FONT_SECOND_TAB,
    color: COLOR_BLACK,
    paddingHorizontal: SPACE_ROW_TOP,
    paddingVertical: 6,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    textAlign: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 4,
  },
  secondTabTextActive: {
    fontSize: FONT_SECOND_TAB,
    textAlign: 'center',
    color: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: COLOR_MAIN_THEME,
    borderRadius: 4,
  },
});

// 个人中心样式
export const ucenterSytles = StyleSheet.create({
  header: {
    height: 214,
    borderBottomEndRadius: 100,
  },
  headerTitle: {
    backgroundColor: Colors.white,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 165,
    borderRadius: 4,
    height: 30,
    marginHorizontal: SPACE_ROW_HORIZONTAL,
  },
  title: {
    fontSize: Font.cell.userName,
    color: Colors.white,
  },
  secondBGI: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  roleNames: {
    marginTop: 5,
    fontSize: FONT_SIZE_ROW,
  },
  pointRuleTitle: {
    fontSize: FONT_LIST_ROW_TAG,
  },
  content: {
    fontSize: Font.cell.content,
    color: Colors.yearColor,
  },
});
