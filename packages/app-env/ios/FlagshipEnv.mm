#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(FlagshipEnv, NSObject)

RCT_EXTERN_METHOD(setEnv:(NSString *)name
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end