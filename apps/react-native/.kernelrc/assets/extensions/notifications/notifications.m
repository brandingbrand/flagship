#import "NotificationService.h"

@interface NotificationService ()

@property (nonatomic, strong) void (^contentHandler)(UNNotificationContent *contentToDeliver);
@property (nonatomic, strong) UNMutableNotificationContent *bestAttemptContent;

@end

@implementation NotificationService

- (void)didReceiveNotificationRequest:(UNNotificationRequest *)request withContentHandler:(void (^)(UNNotificationContent * _Nonnull))contentHandler {
    self.contentHandler = contentHandler;
    self.bestAttemptContent = [request.content mutableCopy];
    NSDictionary *userInfo = request.content.userInfo;
    // LP_URL is the key that is used from Leanplum to
    // send the image URL in the payload.
    //
    // If there is no LP_URL in the payload than
    // the code will still show the push notification.
    if (userInfo == nil || userInfo[@"LP_URL"] == nil) {
        self.contentHandler(self.bestAttemptContent);
        return;
    }

    NSString *attachmentMedia = userInfo[@"LP_URL"];

    // If there is an image in the payload, this part
    // will handle the downloading and displaying of the image.
    if (attachmentMedia) {
        NSURL *URL = [NSURL URLWithString:attachmentMedia];
        NSURLSession *LPSession = [NSURLSession sessionWithConfiguration:
                                   [NSURLSessionConfiguration defaultSessionConfiguration]];
        [[LPSession downloadTaskWithURL:URL completionHandler: ^(NSURL *temporaryLocation, NSURLResponse *response, NSError *error) {
            if (error) {
                NSLog(@"Leanplum: Error with downloading rich push: %@",
                      [error localizedDescription]);
                self.contentHandler(self.bestAttemptContent);
                return;
            }

            NSString *fileType = [self determineType: [response MIMEType]];
            NSString *fileName = [[temporaryLocation.path lastPathComponent] stringByAppendingString:fileType];
            NSString *temporaryDirectory = [NSTemporaryDirectory() stringByAppendingPathComponent:fileName];
            [[NSFileManager defaultManager] moveItemAtPath:temporaryLocation.path toPath:temporaryDirectory error:&error];

            NSError *attachmentError = nil;
            UNNotificationAttachment *attachment =
            [UNNotificationAttachment attachmentWithIdentifier:@""
                                                           URL:[NSURL fileURLWithPath:temporaryDirectory]
                                                       options:nil
                                                         error:&attachmentError];
            if (attachmentError != NULL) {
                NSLog(@"Leanplum: Error with the rich push attachment: %@",
                      [attachmentError localizedDescription]);
                self.contentHandler(self.bestAttemptContent);
                return;
            }
            self.bestAttemptContent.attachments = @[attachment];
            self.contentHandler(self.bestAttemptContent);
            [[NSFileManager defaultManager] removeItemAtPath:temporaryDirectory error:&error];
        }] resume];
    }
}

- (NSString*)determineType:(NSString *) fileType {
    // Determines the file type of the attachment to append to NSURL.
    if ([fileType isEqualToString:@"image/jpeg"]){
        return @".jpg";
    }
    if ([fileType isEqualToString:@"image/gif"]) {
        return @".gif";
    }
    if ([fileType isEqualToString:@"image/png"]) {
        return @".png";
    } else {
        return @".tmp";
    }
}

- (void)serviceExtensionTimeWillExpire {
    // Called just before the extension will be terminated by the system.
    // Use this as an opportunity to deliver your "best attempt" at modified content, otherwise the original push payload will be used.
    self.contentHandler(self.bestAttemptContent);
}

@end
