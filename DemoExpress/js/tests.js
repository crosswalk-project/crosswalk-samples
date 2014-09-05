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
        Li, Hao <haox.li@intel.com>
        Fan, Yugang <yugang.fan@intel.com>
        Jiazhen, Shentu <jiazhenx.shentu@intel.com>

*/

function EnablePassButton(){
  $('#pass_button').removeClass("ui-disabled");
}

function DisablePassButton(){
  $('#pass_button').addClass("ui-disabled");
}

function getAppName() {
  var lpath = window.parent._appURL;
  var from = lpath.lastIndexOf("tests/") + 6;
  var to = lpath.lastIndexOf("/");
  return lpath.substring(from, to);
}

function backAppsHome() {
  if (document.getElementById("wgt_name")) {
    test = $("#wgt_name").attr("value");
  } else {
    test = document.title;
  }
  window.parent.launchMain(test);
}

function reportResult(res) {
  if (document.getElementById("wgt_name")) {
    test = $("#wgt_name").attr("value");
  } else if (document.getElementById("sub_test")) {
    var length = $("a h2").length;
    var pass_num = 0;
    var fail_num = 0;
    $("a h2").each(function () {
      var color = $(this).css("color");
      if (color == "rgb(0, 128, 0)") {
        pass_num++;
      } else if (color == "rgb(255, 0, 0)") {
        fail_num++;
      }
    });
    res = [pass_num,fail_num,length-pass_num-fail_num, res];
    test = document.title;
  } else {
    test = document.title;
  }
  window.sessionStorage.setItem(test, res);
  backAppsHome();
}

function getParms() {
  var parms = new Array();
  var str = location.search.substring(1);
  var items = str.split('&');
  for ( var i = 0; i < items.length; i++) {
    var pos = items[i].indexOf('=');
    if (pos > 0) {
      var key = items[i].substring(0, pos);
      var val = items[i].substring(pos + 1);
      if (!parms[key]) {
        var rawVal = decodeURI(val);
        if (rawVal.indexOf(',') < 0)
          parms[key] = rawVal;
        else
          parms[key] = rawVal.split(',');
      }
    }
  }
  return parms["test_name"];
}

$(document).ready(function(){
  var testname = getParms();
  document.title = testname;
  $("#main_page_title").text(testname);
});

$(document).bind('pagecreate', function () {
  var footbar = $(':jqmData(role=footer)');
  footbar.empty();
  footbar.attr("data-tap-toggle", "false");
  footbar.append("<div data-role=\"controlgroup\" data-type=\"horizontal\" align=\"center\">" +
      "<a href=\"#popup_info\" data-icon=\"info\" data-role=\"button\" data-rel=\"popup\" data-transition=\"pop\">Help</a>" +
      "<a href=\"javascript:backAppsHome();\" data-role=\"button\" data-rel=\"popup\" data-icon=\"home\">Back</a></div>");
  footbar.trigger("create");
  $(':jqmData(role=footer)').find(':jqmData(role=button) > span:first-child').css('padding', '15px 10px 15px 30px');
  $("#popup_info").popup( "option", "theme", "a");
  var maxHeight = $(window).height() - 100 + "px";
  $("#popup_info").css("max-height", maxHeight);
  $("#popup_info").css("margin-bottom", "30px");
  $("#popup_info").css("overflow-y", "auto");
});
