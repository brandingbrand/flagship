#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

@interface NativeConstants : NSObject <RCTBridgeModule>
@end


@implementation NativeConstants
RCT_EXPORT_MODULE();

+ (BOOL)requiresMainQueueSetup
{
    return NO;
}

- (NSDictionary *)constantsToExport {
  return @{
    @"ShowDevMenu": @"true"
  };
}

@end
