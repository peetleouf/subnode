"use strict";var subNode=angular.module("subNode",["ngResource","ngCookies","pascalprecht.translate","LocalStorageModule","ui.state","restangular","localytics.directives"]);subNode.config(["$stateProvider","$routeProvider","$locationProvider","$urlRouterProvider",function(e,o,n,t){return t.otherwise("/"),e.state("subNode",{views:{mainView:{}}}).state("index",{parent:"subNode",url:"/",views:{"mainView@":{templateUrl:"partials/home.html",controller:"HomeCtrl"}}}).state("show",{parent:"subNode",url:"/show/:showId",views:{"mainView@":{templateUrl:"partials/show.html",controller:"ShowCtrl"}}}),n.html5Mode(!1)}]),subNode.controller("ConfigCtrl",["$scope","$rootScope","$translate","$rest",function(e,o,n){e.params.lang=n.uses(),e.params.password2=e.params.password,e.selectLangChange=function(){n.uses(e.params.lang)},e.languages=[{id:"fr",name:"Français"},{id:"en",name:"English"}],e.saveParams=function(){e.params.post().then(function(o){o?e.error=o:window.location.reload()})}}]),subNode.controller("HomeCtrl",["$scope","$translate","Restangular","$loader",function(e,o,n,t){$("#selectedTVShow").val("").trigger("liszt:updated");var a=function(o){e.lastEpisodes=[],t.loading("home",!0),n.all("lastEpisodes/"+(o===!0)).getList().then(function(o){t.loading("home",!1),e.lastEpisodes=o})};a(),e.refresh=function(e){a(e)},e.copyright=o("COPYRIGHT")}]),subNode.controller("ShowCtrl",["$scope","$translate","Restangular","$stateParams","$loader","$timeout","$q",function(e,o,n,t,a,s,i){a.loading("app",!0),e.compact=!1,e.selectedEpisode={},e.subtitlesListShow=!1,e.showId=t.showId,e.filter=function(o){e.seasonFilter=o,e.expand()},e.unsubs=function(e){return _.filter(e,{subtitle:void 0}).length},e.refresh=function(){e.show=null,n.one("show/"+t.showId).get().then(function(o){a.loading("app",!1),e.show=o,o.length>0&&(e.seasonFilter=o[o.length-1].season),e.showList.then(function(e){$("#selectedTVShow").val(e.indexOf(t.showId)).trigger("liszt:updated")})})},e.searchSubs=function(o){a.loading("subtitles",!0),e.compact=!0,e.loadingDone=!1,e.selectedEpisode=this.ep,$(".episode.active").removeClass("active"),$(o.currentTarget).addClass("active"),s(function(){e.subtitlesListShow=!0},600),s(function(){$(".episodesList, .seasonsList").addClass("compacted")},750),e.subList=[];var l=[];if(-1!==e.params.providers.indexOf("addic7ed")){var r=n.one("addic7ed/"+t.showId+"/"+this.ep.name).get();r.then(function(o){o[0]&&o[0].content[0].episode===e.selectedEpisode.episode&&o[0].content[0].season===e.selectedEpisode.season&&(e.subList=e.subList.concat(o))}),l.push(r)}if(-1!==e.params.providers.indexOf("betaSeries")){var c=n.one("betaSeries/"+t.showId+"/"+this.ep.name).get();c.then(function(o){o[0]&&o[0].content[0].episode===e.selectedEpisode.episode&&o[0].content[0].season===e.selectedEpisode.season&&(e.subList=e.subList.concat(o))}),l.push(c)}i.all(l).then(function(){a.loading("subtitles",!1),e.loadingDone=!0})},e.downloadSub=function(o){a.loading("subtitles",!0),e.selectedEpisode.subtitle=this.sub,n.one("download").post("",{episode:e.selectedEpisode.file,url:this.subPack.url,subtitle:this.sub.file}).then(function(e){a.loading("subtitles",!1);var n=$(o.currentTarget).find(".name"),t=n.find("i");t.length>0&&t.remove(),e.success?(n.append(' <i class="success glyphicon glyphicon-ok"></i>'),$(".episode.active").addClass("alert-success")):n.append(' <i class="error glyphicon glyphicon-remove"></i>')})},e.expand=function(){a.loading("subtitles",!1),e.compact=!1,$(".episode.active").removeClass("active"),e.subtitlesListShow=!1,s(function(){$(".episodesList, .seasonsList").removeClass("compacted")},750)},e.refresh()}]),subNode.controller("SubnodeCtrl",["$scope","$state","Restangular","$timeout","$translate","$loader",function(e,o,n,t,a,s){e.safeApply=function(e){var o=this.$root.$$phase;"$apply"==o||"$digest"==o?e&&"function"==typeof e&&e():this.$apply(e)},n.one("params").get().then(function(o){e.params=o,"undefined"==typeof o.rootFolder&&e.openModal("partials/config.html")}),e.showList=n.all("showList").getList(),e.changeShow=function(){o.transitionTo("show",{showId:e.selectedTVShow})};var i=function(){n.one("checkUpdate").get().then(function(o){o.upToDate===!1?e.updateMsg=o:(e.updateMsg=!1,t(function(){i()},864e5))})};i(),e.updateApp=function(){s.loading("update",!0),confirm(a("UPDATE_CONFIRM"))&&n.one("update").get().then(function(e){e.success?t(function(){s.loading("update",!1),window.location.reload()},5e3):s.loading("update",!1)})}}]),subNode.directive("appVersion",["$version",function(e){return function(o,n){return n.text(e)}}]),subNode.directive("imageFallback",function(){return{link:function(e,o,n){o.bind("error",function(){o.replaceWith("<h1>"+n.imageFallback+"</h1>")})}}}),subNode.directive("loader",[function(){return{restrict:"E",replace:!0,template:['<div class="loader" ng-show="isLoading">','<span class="loader-block"></span>','<span class="loader-block"></span>','<span class="loader-block"></span>','<span class="loader-block"></span>','<span class="loader-block"></span>','<span class="loader-block"></span>','<span class="loader-block"></span>','<span class="loader-block"></span>','<span class="loader-block"></span>',"</div>"].join(""),link:function(e,o,n){e.isLoading=n.loaderActive,e.$on("loading."+n.loaderId,function(o,n){e.isLoading=n})}}}]).factory("$loader",["$rootScope",function(e){var o={loadCount:{},isLoading:{},checkExists:function(e){"undefined"==typeof o.loadCount[e]&&(o.loadCount[e]=0,o.isLoading[e]=!1)},loading:function(n,t){_.each(n.split(" "),function(n){o.checkExists(n),t?o.loadCount[n]++:o.loadCount[n]>0&&o.loadCount[n]--,o.loadCount[n]>0&&!o.isLoading[n]?(o.isLoading[n]=!0,e.$broadcast("loading."+n,!0)):0==o.loadCount[n]&&o.isLoading[n]&&(o.isLoading[n]=!1,e.$broadcast("loading."+n,!1))})},stopLoading:function(n){o.checkExists(n),o.loadCount[n]=0,o.isLoading[n]=!1,e.$broadcast("loading."+n,!1)}};return o}]),subNode.directive("modal",["$rootScope","$controller","$location","$timeout",function(e,o,n,t){return{restrict:"E",replace:!0,template:['<div class="modal-wrapper" ng-show="modalShow" ng-animate="{show: \'fade-in\', hide: \'\'}">','<div class="modal-backdrop fade in"></div>','<div role="dialog" tabindex="-1" class="modal fade in">','<div class="modal-dialog">','<div class="modal-content" ng-include="modalView"></div>',"</div>","</div>","</div>"].join(""),link:function(a){var s=document.body.style.overflow,i={},l=function(){"function"==typeof i.onClose&&i.onClose(),a.callbacksList=[],a.modalView=""};a.$watch("modalShow",function(e){e?(document.body.style.overflow="hidden","function"==typeof i.onOpen&&i.onOpen(),i.closeOnEsc!==!1&&kd.ESC.press(function(){kd.ESC.unbindPress(),a.$apply(function(){a.modalShow=!1})})):(document.body.style.overflow=s,l())}),e.openModal=function(s){if("string"==typeof s&&(s={url:s}),"object"==typeof i){if(a.modalShow===!0&&s.url===i.url&&i.path!==n.path())return l(),t(function(){e.openModal(s)}),void 0;i=s,i.path=n.path(),a.modalShow=!0;var r=a.$on("$includeContentLoaded",function(e){i.scope=e.targetScope,"string"==typeof i.controller&&o(i.controller,{$scope:e.targetScope}),r()});a.modalView=i.url,"function"==typeof callback&&a.callbacksList.push(callback)}},e.closeModal=function(){a.modalShow=!1}}}}]).directive("modalOpen",["$rootScope",function(e){return{restrict:"A",link:function(o,n,t){n.on("click",function(n){n.preventDefault(),"string"==typeof t.modalOpen&&o.$apply(function(){e.openModal({url:t.modalOpen,controller:t.modalCtrl})})})}}}]),subNode.directive("ngBlur",["$parse",function(e){return function(o,n,t){var a=e(t.ngBlur);n.bind("blur",function(e){o.$apply(function(){a(o,{$event:e})})})}}]),subNode.directive("ngFocus",["$parse",function(e){return function(o,n,t){var a=e(t.ngFocus);n.bind("focus",function(e){o.$apply(function(){a(o,{$event:e})})})}}]),subNode.directive("tooltip",["$parse",function(){return{restrict:"A",link:function(e,o,n){e.$watch(n,function(){n.title&&o.tooltip({title:n.title,placement:"top"})})}}}]),subNode.filter("decimalFormat",function(){return function(e){return isNaN(e)?e:10>e?"0"+e:e}}),subNode.filter("localDate",["$filter","$translate",function(e,o){return function(n){return e("date")(n,o("DATE_FORMAT"))+" "+o("AT")+" "+e("date")(n,o("TIME_FORMAT"))}}]),subNode.filter("qualitySort",function(){var e;return function(o){return o&&e!==o?e=o.sort(function(e,o){return e.quality==o.quality?_.max(o.content,"score").score-_.max(e.content,"score").score:o.quality-e.quality}):o}}),subNode.filter("seasonFilter",function(){return function(e,o){return o?[_.find(e,function(e){return e.season==o})]:e}}),subNode.factory("$rest",["Restangular",function(e){var o=e.withConfig(function(e){e.setResponseExtractor(function(e){var o=e;return angular.isArray(e)?angular.forEach(o,function(e,n){o[n].originalElement=angular.copy(e)}):o.originalElement=angular.copy(e),o})});return o.clean=function(e){return _.omit(e,_.functions(e),["originalElement","parentResource","restangularCollection","route"])},o}]),subNode.config(["$translateProvider",function(e){e.useStaticFilesLoader({prefix:"i18n/locale-",suffix:".json"}),e.useLocalStorage();var o=navigator.language;e.preferredLanguage(/(fr|en)/gi.test(o)?o:"en"),e.translations()}]);