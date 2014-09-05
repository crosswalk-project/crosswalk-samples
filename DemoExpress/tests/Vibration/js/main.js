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
        Liu, Xin <xinx.liu@intel.com>

*/

var vibration_time, vibration_periods, vibration_number;

jQuery(document).ready(function() {
  DisablePassButton();
  // style setting
  $(':jqmData(role=content)').css("text-align", "center");
  $(':jqmData(role=content)').find(':jqmData(role=button) > span:first-child').css('padding', '15px 30px');

  vibration_time = Number($("#slider-1").val())*1000;
  vibration_periods = Number($("#slider-2").val())*1000;
  vibration_number = $("#slider-3").val();
  /* Hide input*/
  $("#slider-1").hide();
  $("#slider-2").hide();
  $("#slider-3").hide();

  $("#on").click(function() {
    $("#off").removeClass("text-on");
    $("#on").addClass("text-on");
    $("#p").addClass("text-multi");
    $("#h").addClass("text-h");

    var pattern = [];
    for(var i=0; i<2*vibration_number ;i++){
       if(i%2==0){
           pattern.push(vibration_time-0);
       } else {
           pattern.push(vibration_periods-0);
       }
    }
    navigator.vibrate(pattern);
    EnablePassButton();
  });

  $("#off").click(function() {
    $("#on").removeClass("text-on");
    $("#off").addClass("text-on");
    $("#p").removeClass("text-multi");
    $("#h").removeClass("text-h");

    navigator.vibrate(0);
  });

});

