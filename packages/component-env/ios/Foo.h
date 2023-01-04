
#ifdef RCT_NEW_ARCH_ENABLED
#import "RNFooSpec.h"

@interface Foo : NSObject <NativeFooSpec>
#else
#import <React/RCTBridgeModule.h>

@interface Foo : NSObject <RCTBridgeModule>
#endif

@end
