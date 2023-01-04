#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

@interface Env : NSObject <RCTBridgeModule>
@end


@implementation Env
RCT_EXPORT_MODULE();

+ (BOOL)requiresMainQueueSetup
{
    return NO;
}

- (NSDictionary *)constantsToExport {
  NSString *initialEnvName =  @"dev"; // [Env initialEnvName]
  NSString *envName = [[NSUserDefaults standardUserDefaults]
                       objectForKey:@"envName"];
  return @{
    @"envName": envName ?: initialEnvName
  };
}

RCT_EXPORT_METHOD(setEnv:(nonnull NSString *)name
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
  [[NSUserDefaults standardUserDefaults] setObject:(name ?: @"") forKey:@"envName"];
  [[NSUserDefaults standardUserDefaults] synchronize];
  resolve(nil);
}

@end