angular.module('Reader').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('app/CategoryList/CategoryList.html',
    "<div class=\"row\"><ul class=\"list-group\"><li class=\"list-group-item toolbar\"><div class=\"col-xs-2\"><button class=\"btn\" ng-click=\"action.logout()\">Logout</button></div><div class=\"col-xs-8 text-center\">Home</div><div class=\"col-xs-2\"></div></li><li class=\"list-group-item item\" ng-show=\"summary.recent\"><a href=\"/category/0/entry\">Recent Entries <span class=\"badge\">{{summary.recent}}</span></a></li><li class=\"list-group-item item\" ng-repeat=\"category in summary.categories\"><a ng-show=\"category.categoryId == 10\" class=\"pull-left\" ng-href=\"/category/{{category.categoryId}}/entry/image-scroller\" style=\"padding-right: 15px\">#</a> <a class=\"pull-right\" ng-href=\"/category/{{category.categoryId}}/entry\">All</a> <a class=\"\" ng-href=\"/category/{{category.categoryId}}/feed\">{{category.title}} <span class=\"badge\">{{category.unreadCount}}</span></a></li><li class=\"list-group-item item\"><a href=\"/category/10/entry/random\">Marked Hedonism</a></li></ul></div>"
  );


  $templateCache.put('app/EntryList/EntryList.html',
    "<div class=\"row\"><ul class=\"list-group\"><li class=\"list-group-item toolbar\"><div class=\"col-xs-2\"><a class=\"btn\" ng-href=\"{{backButton.url}}\">{{backButton.title}}</a></div><div class=\"col-xs-8 text-center\">{{pageTitle}}</div><div class=\"col-xs-2\"></div></li><li class=\"list-group-item item\" ng-repeat=\"entry in entries\"><a ng-click=\"action.seek($index)\" ng-href=\"/entry/{{entry.entryId}}?categoryId={{categoryId}}{{feedId?'&feedId='+feedId:''}}\">{{entry.title}} <small ng-show=\"showFeed\">{{entry.feed}}</small></a></li></ul></div>"
  );


  $templateCache.put('app/EntryView/EntryView.html',
    "<div class=\"row\"><ul class=\"list-group\"><li class=\"list-group-item toolbar\"><div class=\"col-xs-2\"><a class=\"btn\" ng-href=\"{{backButton.url}}\">{{backButton.title}}</a></div><div class=\"col-xs-8 text-center\">{{pageTitle}}</div><div class=\"col-xs-2\"></div></li><li class=\"list-group-item pane-bar text-center clearfix\"><button class=\"btn btn-sm btn-default pull-left\" ng-click=\"action.goPrevious()\">Previous</button> <button class=\"btn btn-sm btn-default pull-right\" ng-click=\"action.goNext()\">Next</button> <a style=\"font-size: 15px\" ng-href=\"{{entry.url}}\">{{entry.title}}</a></li></ul><div class=\"article-content\" ng-bind-html=\"entry.content | sanitize\"></div><div style=\"padding: 3px\"><ul class=\"list-group pane-bars\"><li class=\"list-group-item text-center clearfix\"><button class=\"btn btn-sm btn-default pull-left\" ng-click=\"action.goPrevious()\">Previous</button> <button class=\"btn btn-sm btn-default pull-right\" ng-click=\"action.goNext()\">Next</button> Navigation</li><li class=\"list-group-item clearfix\"><button class=\"btn btn-sm btn-default pull-right\" ng-click=\"action.toggleMarked()\">{{entry.isMarked ? 'Yes' : 'No'}}</button> Starred</li><li class=\"list-group-item clearfix\"><button class=\"btn btn-sm btn-default pull-right\" ng-click=\"action.toggleRead()\">{{entry.isRead ? 'No' : 'Yes'}}</button> Unread</li></ul></div></div>"
  );


  $templateCache.put('app/FeedList/FeedList.html',
    "<div class=\"row\"><ul class=\"list-group\"><li class=\"list-group-item toolbar\"><div class=\"col-xs-2\"><a class=\"btn\" href=\"/\">Home</a></div><div class=\"col-xs-8 text-center\">{{category.title}}</div><div class=\"col-xs-2\"></div></li><li class=\"list-group-item item\" ng-repeat=\"feed in feeds\"><a ng-href=\"/feed/{{feed.feedId}}/entry?categoryId={{categoryId}}\">{{feed.title}} <span class=\"badge\">{{feed.unreadCount}}</span></a></li></ul></div>"
  );


  $templateCache.put('app/ImageScrollerView/ImageScrollerView.html',
    "<div id=\"grid-layout\"><div id=\"grid-loader\" class=\"col-xs-2\" ng-click=\"action.loadMore()\">+</div><div ng-repeat=\"entry in entries\" ng-mouseenter=\"action.setHoverEntry(entry)\" ng-mouseleave=\"action.clearHoverEntry()\" ng-class=\"{'starred': entry.isMarked}\" ng-click=\"action.markEntry(entry)\"><img ng-repeat=\"image in entry.images\" ng-src=\"{{image.src}}\"></div></div>"
  );


  $templateCache.put('app/Login/Login.html',
    "<div class=\"row\"><ul class=\"list-group\"><li class=\"list-group-item toolbar\"><div class=\"col-xs-2\"></div><div class=\"col-xs-8 text-center\">Login</div><div class=\"col-xs-2\"><button class=\"btn\" type=\"submit\" ng-click=\"action.login(credentials)\">Login</button></div></li><li class=\"list-group-item\"><label for=\"username\" class=\"sr-only\">Username</label><input style=\"background-color: #CCC\" id=\"username\" name=\"username\" class=\"form-control\" placeholder=\"Username\" required autofocus ng-model=\"credentials.username\"></li><li class=\"list-group-item\"><label for=\"password\" class=\"sr-only\">Password</label><input style=\"background-color: #CCC\" id=\"password\" name=\"password\" type=\"password\" class=\"form-control\" placeholder=\"Password\" required ng-model=\"credentials.password\"></li></ul></div>"
  );

}]);
