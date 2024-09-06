//
//  NativeModel.h
//  OneGoodLife
//
//  Created by mac on 2024/7/28.
//

#import "RCTEventEmitter.h"

NS_ASSUME_NONNULL_BEGIN

@interface NativeModel : RCTEventEmitter<RCTBridgeModule>
+ (instancetype)shareInstance;
@end



NS_ASSUME_NONNULL_END
