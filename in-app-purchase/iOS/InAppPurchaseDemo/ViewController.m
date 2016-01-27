// Copyright (c) 2015 Intel Corporation. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

#import "ViewController.h"

#import <Foundation/Foundation.h>
#import <WebKit/WebKit.h>
#import <XWalkView/XWalkView.h>
#import <XWalkView/XWalkView-Swift.h>

@interface ViewController()

@property(nonatomic, strong) XWalkView* webView;

@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view, typically from a nib.
    NSString* startUrl = @"index.html";
    NSArray* extensions = nil;
    NSString* plistPath = [[NSBundle mainBundle] pathForResource:@"manifest"
                                                          ofType:@"plist"];
    NSDictionary* manifest =
        [NSDictionary dictionaryWithContentsOfFile:plistPath];
    startUrl = [manifest valueForKey:@"start_url"];
    extensions = [manifest valueForKey:@"xwalk_extensions"];

    WKWebViewConfiguration* configuration = [[WKWebViewConfiguration alloc] init];
    self.webView = [[XWalkView alloc] initWithFrame:self.view.frame
                                  configuration:configuration];
    self.webView.scrollView.bounces = false;
    [self.view addSubview:self.webView];

    for (NSString* extension in extensions) {
        id instance = [XWalkExtensionFactory createExtension:extension];
        [self.webView loadExtension:instance namespace:extension];
    }

    NSURL* root = [[NSBundle mainBundle].resourceURL
        URLByAppendingPathComponent:@"www"];
    NSURL* url = [root URLByAppendingPathComponent:startUrl];
    [self.webView loadFileURL:url allowingReadAccessToURL:root];
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

@end
