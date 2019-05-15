//
//  NativeConstants.m
//  flagship
//
//  Created by Sky Eckstrom on 3/22/18.
//  Copyright © 2018 Branding Brand. All rights reserved.
//

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
    @"installed": @YES
    // [NativeConstants Inject]
  };
}

@end
