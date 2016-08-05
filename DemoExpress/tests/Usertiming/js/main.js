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
        Cui,Jieqiong <jieqiongx.cui@intel.com>

*/

$(document).ready(function() {
  $("#test").css("border", "1px solid black");
  document.getElementById("result").innerHTML = "No Reuslt.";
  $("#compute").click(function(){
    try {
      var task1 = 1;
      var n1 = document.getElementById("number1").value;
      var n2 = document.getElementById("number2").value;
      window.performance.mark("startTask1");
      for(var i = Number(n1); i <= Number(n2); i++) {
        task1 = task1 * i;
      }
      window.performance.mark("endTask1");
      window.performance.measure("measure", "startTask1","endTask1");
      measurePerf(task1);
    }catch(e) {
      $("#result").css("color", "red");
      document.getElementById("result").innerHTML = "Error: " + e.message;
    }
  });
});

function measurePerf(result) {
  var perfEntries = performance.getEntriesByType("measure");
  $("#result").css("color", "black");
  for (var j = 0; j < perfEntries.length; j++) {
    document.getElementById("result").innerHTML = "Result: " + result;
    document.getElementById("start").innerHTML = "Start Time: " + Math.round(perfEntries[j].startTime) + "ms";
    document.getElementById("duration").innerHTML = "Duration Time: " + Math.round(perfEntries[j].duration) + "ms";
  }
}
