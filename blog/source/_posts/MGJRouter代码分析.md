title: MGJRouter代码分析
date: 2018-01-07 17:21:00
categories: coder
tags: [iOS, modularization]
-----------


今天来聊聊组件化，之前一直听说大厂在搞，什么淘宝架构，什么蘑菇街，既然谈到了架构的问题，那必属重中之重。接下来分析一下蘑菇街开源的代码，自己做个总结。

### 引入

类书本的文章个人感觉还是写不来的，再搬到自己写的东西这来也不合适，所以直接上一链接，通过链接文章大致可了解下它的前身后世，产生原因，以及整体宏观架构设计，而我接下来要做的是细化，以及转化，便于自己吸收  
---------> [组件化架构漫谈][1]

1. 话不多说，先看入口：

![image_1c25qj3m5ejq111g1v5lvkgjek9.png-7.7kB][2]
```
@interface MGJRouter ()
/**
 *  保存了所有已注册的 URL
 *  结构类似 @{@"beauty": @{@":id": {@"_", [block copy]}}}
 */
@property (nonatomic) NSMutableDictionary *routes;
@end

+ (instancetype)sharedInstance
{
    static MGJRouter *instance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        instance = [[self alloc] init];
    });
    return instance;
}
```
很明显，蘑菇街架构（以下简称MGJ）通过该单例作管理，统一进行调配，而该单例仅有一个变量，就是**routes**，实际上它仅仅是管理了一个字典的结构，具体字典内有哪些内容，我们慢慢看；

2. 回调Block的定义

```
/**
 *  routerParameters 里内置的几个参数会用到上面定义的 string
 */
typedef void (^MGJRouterHandler)(NSDictionary *routerParameters);

/**
 *  需要返回一个 object，配合 objectForURL: 使用
 */
typedef id (^MGJRouterObjectHandler)(NSDictionary *routerParameters);
```
上面这两个block定义是MGJ注册URL的回调，一个带返回值，另一个不带，在这里我们说一下**带返回值的block用法**；如下举例 ------>
![WX20180107-134538@2x.png-37.5kB][3]
```
//声明
typedef UIViewController *(^ViewControllerHandler)();

//作参数
@interface DemoListViewController : UIViewController
+ (void)registerWithTitle:(NSString *)title handler:(ViewControllerHandler)handler;
@end

//定义
@implementation DemoListViewController
+ (void)registerWithTitle:(NSString *)title handler:(ViewControllerHandler)handler
{
    UIViewController* vc = handler()
}
@end

//在别处调用
@implementation DemoDetailViewController
[DemoListViewController registerWithTitle:@"基本使用" handler:^UIViewController *{
        return DemoDetailViewController();
}];
@end
```
如上，我们把`ViewControllerHandler`的运行延迟到了实际调用的时刻，并且我们可以在这个handler的实现中带入很多信息；

3. MGJ数据结构管理

```
extern NSString *const MGJRouterParameterURL;
extern NSString *const MGJRouterParameterCompletion;
extern NSString *const MGJRouterParameterUserInfo;
//*************************************************
static NSString * const MGJ_ROUTER_WILDCARD_CHARACTER = @"~";  //这是一个占位符
static NSString *specialCharacters = @"/?&.";

NSString *const MGJRouterParameterURL = @"MGJRouterParameterURL";
NSString *const MGJRouterParameterCompletion = @"MGJRouterParameterCompletion";
NSString *const MGJRouterParameterUserInfo = @"MGJRouterParameterUserInfo";
```
从这里我们可以看出，MGJ的路由管理，实际上是一个解析url以及对应的管理，我们举几个URL来看一下：
```
@"mgj://"
@"mgj://foo/bar/none/exists"
@"mgj://foo/bar" 
@"mgj://category/家居"
@"mgj://category/travel"
@"mgj://search/:query"
@"mgj://detail"
@"mgj://search/:keyword"
@"mgj://search_top_bar"
```
通过上面的URL我们可以看出，路由的管理实际上就是url的解析过程，下面我们来具体看一下解析过程；

4. URL解析

- route url

![WX20180107-150437@2x.png-59.1kB][4]
```
- (NSArray*)pathComponentsFromURL:(NSString*)URL
{
    NSMutableArray *pathComponents = [NSMutableArray array];
    if ([URL rangeOfString:@"://"].location != NSNotFound) {
        NSArray *pathSegments = [URL componentsSeparatedByString:@"://"];
        // 如果 URL 包含协议，那么把协议作为第一个元素放进去
        [pathComponents addObject:pathSegments[0]];
        
        // 如果只有协议，那么放一个占位符
        URL = pathSegments.lastObject;
        if (!URL.length) {
            [pathComponents addObject:MGJ_ROUTER_WILDCARD_CHARACTER];
        }
    }

    for (NSString *pathComponent in [[NSURL URLWithString:URL] pathComponents]) {
        if ([pathComponent isEqualToString:@"/"]) continue;
        if ([[pathComponent substringToIndex:1] isEqualToString:@"?"]) break;
        [pathComponents addObject:pathComponent];
    }
    return [pathComponents copy];
}
```

- key-value
![WX20180107-151956@2x.png-111.8kB][5]
```
- (NSMutableDictionary *)addURLPattern:(NSString *)URLPattern
{
    NSArray *pathComponents = [self pathComponentsFromURL:URLPattern];

    NSMutableDictionary* subRoutes = self.routes;
    
    for (NSString* pathComponent in pathComponents) {
        if (![subRoutes objectForKey:pathComponent]) {
            subRoutes[pathComponent] = [[NSMutableDictionary alloc] init];
        }
        subRoutes = subRoutes[pathComponent];
    }
    return subRoutes;
}
```
- 核心url解析

![WX20180107-160319@2x.png-147.8kB][6]
```
- (NSMutableDictionary *)extractParametersFromURL:(NSString *)url
{
    NSMutableDictionary* parameters = [NSMutableDictionary dictionary];
    
    parameters[MGJRouterParameterURL] = url;
    
    NSMutableDictionary* subRoutes = self.routes;
    NSArray* pathComponents = [self pathComponentsFromURL:url];
    
    BOOL found = NO;
    // borrowed from HHRouter(https://github.com/Huohua/HHRouter)
    for (NSString* pathComponent in pathComponents) {
        
        // 对 key 进行排序，这样可以把 ~ 放到最后
        NSArray *subRoutesKeys =[subRoutes.allKeys sortedArrayUsingComparator:^NSComparisonResult(NSString *obj1, NSString *obj2) {
            return [obj1 compare:obj2];
        }];
        
        for (NSString* key in subRoutesKeys) {
            if ([key isEqualToString:pathComponent] || [key isEqualToString:MGJ_ROUTER_WILDCARD_CHARACTER]) {
                found = YES;
                subRoutes = subRoutes[key];
                break;
            } else if ([key hasPrefix:@":"]) {
                found = YES;
                subRoutes = subRoutes[key];
                NSString *newKey = [key substringFromIndex:1];
                NSString *newPathComponent = pathComponent;
                // 再做一下特殊处理，比如 :id.html -> :id
                if ([self.class checkIfContainsSpecialCharacter:key]) {
                    NSCharacterSet *specialCharacterSet = [NSCharacterSet characterSetWithCharactersInString:specialCharacters];
                    NSRange range = [key rangeOfCharacterFromSet:specialCharacterSet];
                    if (range.location != NSNotFound) {
                        // 把 pathComponent 后面的部分也去掉
                        newKey = [newKey substringToIndex:range.location - 1];
                        NSString *suffixToStrip = [key substringFromIndex:range.location];
                        newPathComponent = [newPathComponent stringByReplacingOccurrencesOfString:suffixToStrip withString:@""];
                    }
                }
                parameters[newKey] = newPathComponent;
                break;
            }
        }
        
        // 如果没有找到该 pathComponent 对应的 handler，则以上一层的 handler 作为 fallback
        if (!found && !subRoutes[@"_"]) {
            return nil;
        }
    }
    
    // Extract Params From Query.
    NSArray<NSURLQueryItem *> *queryItems = [[NSURLComponents alloc] initWithURL:[[NSURL alloc] initWithString:url] resolvingAgainstBaseURL:false].queryItems;
    
    for (NSURLQueryItem *item in queryItems) {
        parameters[item.name] = item.value;
    }

    if (subRoutes[@"_"]) {
        parameters[@"block"] = [subRoutes[@"_"] copy];
    }
    
    return parameters;
}
```

```
+ (void)openURL:(NSString *)URL withUserInfo:(NSDictionary *)userInfo completion:(void (^)(id result))completion
{
    URL = [URL stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
    NSMutableDictionary *parameters = [[self sharedInstance] extractParametersFromURL:URL];
    
    [parameters enumerateKeysAndObjectsUsingBlock:^(id key, NSString *obj, BOOL *stop) {
        if ([obj isKindOfClass:[NSString class]]) {
            parameters[key] = [obj stringByReplacingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
        }
    }];
    
    if (parameters) {
        MGJRouterHandler handler = parameters[@"block"];
        if (completion) {
            parameters[MGJRouterParameterCompletion] = completion;
        }
        if (userInfo) {
            parameters[MGJRouterParameterUserInfo] = userInfo;
        }
        //所以注册路由时的回调是在这里才调用到的
        //也就是openURL响应了register的回调
        if (handler) {
            [parameters removeObjectForKey:@"block"];
            handler(parameters);
        }
    }
}
```

5. 后续？


[1]: https://www.jianshu.com/p/67a6004f6930
[2]: http://static.zybuluo.com/usiege/f0dci325k3jmmrh2l9uy51s4/image_1c25qj3m5ejq111g1v5lvkgjek9.png
[3]: http://static.zybuluo.com/usiege/xn1r7ergmr6xr6msy2p5tyrh/WX20180107-134538@2x.png
[4]: http://static.zybuluo.com/usiege/wr5j4jwfcaov7yfmx3u82nyk/WX20180107-150437@2x.png
[5]: http://static.zybuluo.com/usiege/j23e7t541u0wcoohza0ktqmb/WX20180107-151956@2x.png
[6]: http://static.zybuluo.com/usiege/cbn7v2xkwlfy3c19m322o7mg/WX20180107-160319@2x.png