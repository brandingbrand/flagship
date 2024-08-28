#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

@interface EnvSwitcher : NSObject <RCTBridgeModule>
@end


@implementation EnvSwitcher
RCT_EXPORT_MODULE();

+ (BOOL)requiresMainQueueSetup
{
    return NO;
}

- (NSDictionary *)constantsToExport {
  NSString *initialEnvName =  @"prod";
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
