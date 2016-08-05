/*
Copyright (c) 2013 Intel Corporation.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

* Redistributions of works must retain the original copyright notice, this list
  of conditions and the following disclaimer.
* Redistributions in binary form must reproduce the original copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.
* Neither the name of Intel Corporation nor the names of its contributors
  may be used to endorse or promote products derived from this work without
  specific prior written permission.

THIS SOFTWARE IS PROVIDED BY INTEL CORPORATION "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
ARE DISCLAIMED. IN NO EVENT SHALL INTEL CORPORATION BE LIABLE FOR ANY DIRECT,
INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

Authors:
        Wang, Jing J <jing.j.wang@intel.com>
        Fan, Yugang <yugang.fan@intel.com>
        Jiazhen, Shentu <jiazhenx.shentu@intel.com>

*/

var sstorage = window.sessionStorage;
var applist;

function getVersion() {
  var version = "";
  $.ajax({
    async : false,
    type : "GET",
    url : "config.xml",
    dataType : "xml",
    success : function(xml){
      $(xml).find("widget").each(function(){version = $(this).attr("version");});
    }
  });
  return version;
}

function getApps() {
  var tests = "";
  $.ajax({
    async : false,
    type : "GET",
    url : "tests.xml",
    dataType : "xml",
    success : function(xml){tests = xml;}
  });
  return tests;
}

function updateList() {
  $("#mylist").empty();
  $(applist).find("set").each(function(){
    $("#mylist").append("<li data-role=\"list-divider\">"+$(this).attr("name")+"</li>");
    $(this).find("testcase").each(function(){
      var url = "tests/" + $(this).attr("id") + "/index.html?test_name="+$(this).attr("purpose");
      var appLine = "<li class=\"app\" id=\"" + $(this).attr("id") + "\">"
                  + "<a href=\"" + url + "\">" + "<h2>" + $(this).attr("purpose") + "</h2></a></li>";
      $("#mylist").append(appLine);
    });
  });

  for(var i=0; i<sstorage.length; i++){
    var name = sstorage.key(i);
    var item = sstorage.getItem(name);
    var node = $("h2:contains('"+ name + "')").parent().parent();
    if (item == "PASS") {
      node.attr("data-theme", "g");
      node.append("<img src='css/images/pass.png' class='ui-li-thumb'>");
      node.append("<span class='ui-li-count' style='color:green;'>PASS</span>");
      node.find("a h2").css("padding-left", "20px");
    } else if (item == "FAIL"){
      node.attr("data-theme", "r");
      node.append("<img src='css/images/fail.png' class='ui-li-thumb'>");
      node.append("<span class='ui-li-count' style='color:red;'>FAIL</span>");
      node.find("a h2").css("padding-left", "20px");
    } else {
      resultnum = item.split(",");
      if (resultnum[3] == "PASS") {
        node.attr("data-theme", "g");
        node.append("<img src='css/images/pass.png' class='ui-li-thumb'>");
        node.append("<span class='ui-li-count' style='color:green;'>"  + resultnum[0] + "</span>");
        node.append("<span class='ui-li-count' style='color:red;'>"  + resultnum[1] + "</span>");
        node.append("<span class='ui-li-count' style='color:gray;'>"  + resultnum[2] + "</span>");
        node.find("a h2").css("padding-left", "20px");
      } else if (resultnum[3] == "FAIL"){
        node.attr("data-theme", "r");
        node.append("<img src='css/images/fail.png' class='ui-li-thumb'>");
        node.append("<span class='ui-li-count' style='color:green;'>"  + resultnum[0] + "</span>");
        node.append("<span class='ui-li-count' style='color:red;'>"  + resultnum[1] + "</span>");
        node.append("<span class='ui-li-count' style='color:gray;'>"  + resultnum[2] + "</span>");
        node.find("a h2").css("padding-left", "20px");
      }
    }
  }
  $("#mylist").listview("refresh");
  $(".ui-li-has-count").each(function() {
    var childs = $(this).find(".ui-li-count");
    if (childs.length == 3) {
      $(childs[0]).css("min-width","10px");
      $(childs[1]).css("min-width","10px");
      $(childs[2]).css("min-width","10px");
      var shiftSecond = ($(childs[2]).position().left - $(childs[1]).outerWidth());
      var shiftFirst = (shiftSecond - 23);
      $(childs[0]).css("left", shiftFirst).css("right","auto");
      $(childs[1]).css("left", shiftSecond).css("right","auto");
    }
  });
}

function updateFooter() {
  $(':jqmData(role=footer)').find(':jqmData(role=button) > span:first-child').css('padding', '15px 10px 15px 30px');
  $("#popup_info").popup( "option", "theme", "a");
  var maxHeight = $(window).height() - 100 + "px";
  $("#popup_info").css("max-height", maxHeight);
  $("#popup_info").css("margin-bottom", "30px");
}

function launchMain(node) {
  if ($("#home_ui").find("div").length > 0) {
    updateList();
    $.mobile.changePage("#home_ui", {
      'allowSamePageTransition' : true,
      'transition' : 'slide',
      'reverse' : true
    });
    if (node != "") {
      $("html,body").animate({
        scrollTop:$("h2:contains(" + node +")").offset().top - 25
      }, 500);
    }
  } else {
    $.mobile.changePage("#main", {
      'allowSamePageTransition' : true,
      'transition' : 'slide',
      'reverse' : true
    });
  }
  $("#test_frame").attr("src", "");
}

function runApp(url) {
  $.mobile.changePage("#test_ui", {
    'allowSamePageTransition' : true,
    'transition' : 'slide',
    'changeHash' : false
  });
  $("#test_frame").attr("height", $(window).height());
  $("#test_frame").attr("src", url);
}

$("#home_ui").live("pagebeforecreate", function () {
  $("#version").text(getVersion());
});

$("#home_ui").live("pageshow", function () {
  applist = getApps();
  updateList();
  updateFooter();
});

$("#exit").live("click", function () {
  window.open('', '_self');
  window.close();
});

$("#reset").live("click", function (event) {
  sstorage.clear();
  updateList();
  return false;
});

$(".app").live("click", function () {
  runApp($(this).find("div div a").attr("href"));
  return false;
});

$('#main').live('pageshow',function(){
  for(var i=0;i<sstorage.length;i++){
    var key = sstorage.key(i);
    var str = "h2:contains("+ key +")";
    var node = $(str);
    var item = sstorage.getItem(key);
    if (item == "PASS") {
      node.attr('style', 'color:green;');
    } else if (item == "FAIL"){
      node.attr('style', 'color:red;');
    }
  }
  updateFooter();
});
