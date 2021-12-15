//
//  EnvSwitcher.m
//  FLAGSHIP
//
//  Created by Guanxiong Ding on 4/11/18.
//  Copyright © 2018 Branding Brand. All rights reserved.
//

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
  NSString *initialEnvName =  @""; // [EnvSwitcher initialEnvName]
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
