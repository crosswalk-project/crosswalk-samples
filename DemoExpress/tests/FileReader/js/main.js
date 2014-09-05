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
        Li,Hao <haox.li@intel.com>

*/
$(document).ready(function(){
    $("#uploadButton").on("click", function() {
        if (document.createEvent) {
            var evt = document.createEvent("MouseEvents");
            evt.initEvent("click", true, true);
            $("#fileUpload")[0].dispatchEvent(evt);
        }
    });
    DisablePassButton();
});

function getFileList() {
    try{
        // get FileList through input element
        var filesList = document.getElementById("fileUpload").files;
        // FileList.length
        if(filesList && filesList.length > 0){
            $("#example").remove();
            $("#messageInfo").html("Upload: " + filesList.length + " file/s");
            var filesStr = "";
            for(var i= 0; i < filesList.length; i++) {
                // FileList.item() to get file items
                var file = filesList.item(i);
                // Blob.slice testing
                file.slice = file.slice || file.webkitSlice || file.mozSlice;
                var fileBlob = file.slice(0, file.size);
                // This fileBlob should be the same with the file
                if(fileBlob.size == file.size){
                    filesStr = filesStr + "<tr><td width='70%'><a href='javascript:startRead(" + i + ")'>" + file.name + "</a></td><td width='30%'>" + Math.round(file.size/1024) + "KB</td>" + "</tr>";
                }
            }
            $("#filesList").show();
            $("#filesList").html(filesStr);
        }
    } catch (err) {
        $("#messageInfo").addClass("errorMessage");
        $("#messageInfo").html("Error: " + err.code + " - " + err.message);
    }
}

var filetype = "";
function startRead(index) {

    var file = document.getElementById("fileUpload").files[index];
    if (file) {
        var reader = new FileReader();
        if(file.type.indexOf("text") >= 0) {
            // readAsText
            // Read file into memory as UTF-8
            reader.readAsText(file, "UTF-8");
            filetype = "text";
        } else if (file.type.indexOf("image") >= 0) {
            // readAsDataURL
            reader.readAsDataURL(file);
            filetype = "image";
        } else {
            try {
                //try to read other types of file as text.
                reader.readAsText(file, "UTF-8");
                filetype = "text";
            } catch(e) {
                $.mobile.hidePageLoadingMsg();
                $("#filePreview").html("Cannot pre-view this type of file!");
            }
        }
        EnablePassButton();
        // Handle progress, success, and errors
        reader.onloadstart = loadstart;
        reader.onload = loaded;
        reader.onloadend = loadend;
        reader.onerror = errorHandler;
    }
}
function loadstart(evt) {
    // loading
    $.mobile.showPageLoadingMsg();
}

function loaded(evt) {
    var reader = evt.target;
    if (reader && reader.result) {
        if(filetype == "text") {
            $("#filePreview").html(reader.result);
        } else if (filetype == "image") {
            $("#filePreview").html("<image src='" + reader.result + "'></image>");
        }
    }
}

function loadend(evt) {
    $.mobile.hidePageLoadingMsg();
}

function errorHandler(evt) {
   $("#messageInfo").addClass("errorMessage");
   $("#messageInfo").html(evt.target.error.name);
}
