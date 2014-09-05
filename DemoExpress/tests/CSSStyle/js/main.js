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

var testFlag={
        Mulcolumn: false,
        Transparency: false,
        Color: false,
        Align: false,
        Transform: false,
        TextShadow: false,
        BoxShadow: false,
        Outline: false,
        Border: false,
        Decoration: false,
        Break: false
    };

function status(){
    if(testFlag.Mulcolumn && testFlag.Transparency && testFlag.Color && testFlag.Align && testFlag.Transform && testFlag.TextShadow && testFlag.BoxShadow && testFlag.Outline && testFlag.Border && testFlag.Decoration && testFlag.Break)
        EnablePassButton();
}

$(document).ready(function(){
    DisablePassButton();
    /** CSS Multicolumn */
    $("#on").click(function(){
        $("#off").removeClass("text-on");
        $("#on").addClass("text-on");
        $("#p").addClass("text-multi");
        $("#h").addClass("text-h");
        testFlag.Mulcolumn = true;
        status();
    });
    $("#off").click(function(){
        $("#on").removeClass("text-on");
        $("#off").addClass("text-on");
        $("#p").removeClass("text-multi");
        $("#h").removeClass("text-h");
        testFlag.Mulcolumn = true;
        status();
    });

    /** CSS Color */
    $("#red").click(function(){
        var $p = $("#p");
        $("#green").removeClass("text-on");
        $("#blue").removeClass("text-on");
        $("#red").toggleClass("text-on");
        // remove text-green and text-blue style
        if($p.hasClass("text-green")) $p.removeClass("text-green");
        if($p.hasClass("text-blue")) $p.removeClass("text-blue");
        // add/remove text-red style
        $p.toggleClass("text-red");
        testFlag.Color = true;
        status();
    });
    $("#green").click(function(){
        var $p = $("#p");
        $("#red").removeClass("text-on");
        $("#blue").removeClass("text-on");
        $("#green").toggleClass("text-on");
        // remove text-red and text-blue style
        if($p.hasClass("text-red")) $p.removeClass("text-red");
        if($p.hasClass("text-blue")) $p.removeClass("text-blue");
        // add/remove text-green style
        $p.toggleClass("text-green");
        testFlag.Color = true;
        status();
    });
    $("#blue").click(function(){
        var $p = $("#p");
        $("#green").removeClass("text-on");
        $("#red").removeClass("text-on");
        $("#blue").toggleClass("text-on");
        // remove text-red and text-green style
        if($p.hasClass("text-red")) $p.removeClass("text-red");
        if($p.hasClass("text-green")) $p.removeClass("text-green");
        // add/remove text-blue style
        $p.toggleClass("text-blue");
        testFlag.Color = true;
        status();
    });

    /** CSS Text Align */
    $("#left").click(function(){
        $("#right").removeClass("text-on");
        $("#left").toggleClass("text-on");
        $("#p").removeClass("text-right");
        $("#p").toggleClass("text-left");
        testFlag.Align = true;
        status();
    });
    $("#right").click(function(){
        $("#left").removeClass("text-on");
        $("#right").toggleClass("text-on");
        $("#p").removeClass("text-left");
        $("#p").toggleClass("text-right");
        testFlag.Align = true;
        status();
    });

    /** CSS Text Transform */
    $("#upper").click(function(){
        $("#lower").removeClass("text-on");
        $("#upper").toggleClass("text-on");
        $("#p").removeClass("text-lower");
        $("#p").toggleClass("text-upper");
        testFlag.Transform = true;
        status();
    });
    $("#lower").click(function(){
        $("#upper").removeClass("text-on");
        $("#lower").toggleClass("text-on");
        $("#p").removeClass("text-upper");
        $("#p").toggleClass("text-lower");
        testFlag.Transform = true;
        status();
    });

    /** CSS Text Shadow */
    $("#shadow1").click(function(){
        $("#shadow2").removeClass("text-on");
        $("#shadow1").toggleClass("text-on");
        $("#p").removeClass("text-shadow2");
        $("#p").toggleClass("text-shadow1");
        testFlag.TextShadow = true;
        status();
    });
    $("#shadow2").click(function(){
        $("#shadow1").removeClass("text-on");
        $("#shadow2").toggleClass("text-on");
        $("#p").removeClass("text-shadow1");
        $("#p").toggleClass("text-shadow2");
        testFlag.TextShadow = true;
        status();
    });

    /** CSS Box Shadow */
    $("#box-shadow1").click(function(){
        $("#box-shadow2").removeClass("text-on");
        $("#box-shadow1").toggleClass("text-on");
        $("#text-div").removeClass("box-shadow2");
        $("#text-div").toggleClass("box-shadow1");
        testFlag.BoxShadow = true;
        status();
    });
    $("#box-shadow2").click(function(){
        $("#box-shadow1").removeClass("text-on");
        $("#box-shadow2").toggleClass("text-on");
        $("#text-div").removeClass("box-shadow1");
        $("#text-div").toggleClass("box-shadow2");
        testFlag.BoxShadow = true;
        status();
    });

    /** CSS Border */
    $("#border1").click(function(){
        $("#border2").removeClass("text-on");
        $("#border1").toggleClass("text-on");
        $("#text-div").removeClass("border2");
        $("#text-div").toggleClass("border1");
        testFlag.Border = true;
        status();
    });
    $("#border2").click(function(){
        $("#border1").removeClass("text-on");
        $("#border2").toggleClass("text-on");
        $("#text-div").removeClass("border1");
        $("#text-div").toggleClass("border2");
        testFlag.Border = true;
        status();
    });

    /** CSS Break Word */
    $("#break1").click(function(){
        $("#break2").removeClass("text-on");
        $("#break1").toggleClass("text-on");
        $("#text-div").removeClass("break2");
        $("#text-div").toggleClass("break1");
        testFlag.Break = true;
        status();
    });
    $("#break2").click(function(){
        $("#break1").removeClass("text-on");
        $("#break2").toggleClass("text-on");
        $("#text-div").removeClass("break1");
        $("#text-div").toggleClass("break2");
        testFlag.Break = true;
        status();
    });

    /** CSS Text Decoration */
    $("#decoration1").click(function(){
        var $p = $("#p");
        $("#decoration2").removeClass("text-on");
        $("#decoration3").removeClass("text-on");
        $("#decoration1").toggleClass("text-on");
        // remove decoration2 and decoration3 style
        if($p.hasClass("decoration2")) $p.removeClass("decoration2");
        if($p.hasClass("decoration3")) $p.removeClass("decoration3");
        // add decoration1 style
        $p.toggleClass("decoration1");
        testFlag.Decoration = true;
        status();
    });
    $("#decoration2").click(function(){
        var $p = $("#p");
        $("#decoration1").removeClass("text-on");
        $("#decoration3").removeClass("text-on");
        $("#decoration2").toggleClass("text-on");
        // remove decoration1 and decoration3 style
        if($p.hasClass("decoration1")) $p.removeClass("decoration1");
        if($p.hasClass("decoration3")) $p.removeClass("decoration3");
        // add decoration2 style
        $p.toggleClass("decoration2");
        testFlag.Decoration = true;
        status();
    });
    $("#decoration3").click(function(){
        var $p = $("#p");
        $("#decoration2").removeClass("text-on");
        $("#decoration1").removeClass("text-on");
        $("#decoration3").toggleClass("text-on");
        // remove decoration1 and decoration2 style
        if($p.hasClass("decoration1")) $p.removeClass("decoration1");
        if($p.hasClass("decoration2")) $p.removeClass("decoration2");
        // add decoration3 style
        $p.toggleClass("decoration3");
        testFlag.Decoration = true;
        status();
    });

    /* Hide input*/
    $("#slider-1").hide();
    $("#slider-2").hide();
});
