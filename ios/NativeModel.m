//
//  NativeModel.m
//  OneGoodLife
//
//  Created by mac on 2024/7/28.
//

#import "NativeModel.h"
#import <React/RCTEventDispatcher.h>
#import <React/RCTBridge.h>
#import "RNTEventManager.h"
#import <UMCommon/UMCommon.h>


@implementation NativeModel
RCT_EXPORT_MODULE(NativeModel);

static NativeModel *_instance = nil;

+ (instancetype)shareInstance{
   if (_instance == nil) {
         _instance = [[super allocWithZone:NULL] init];
     }
     return _instance;
}



- (NSArray<NSString *> *)supportedEvents {
  return @[@"SigngnetModel"];
}


RCT_EXPORT_METHOD(initPrivacy:(RCTResponseSenderBlock)callback)
{
  // 调用umeng的初始
  [UMConfigure initWithAppkey:@"66a3b8accac2a664de794a58" channel:@"AppStore"];
  callback(@[]);
}



@end
