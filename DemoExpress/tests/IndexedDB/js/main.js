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
        Yao,Yi <yix.yao@intel.com>

*/

var tablename = "objectstore";
var databaseName = "testDB";
var databaseVersion = 1;

var App = {};
App.db = null;
App.table = null;

App.init = function () {
    var request = indexedDB.open(databaseName,  databaseVersion);
    request.onsuccess = function (e) {
        App.db = e.target.result;
        App.query();
    };
    request.onupgradeneeded = function (e) {
        App.db = e.target.result;
        var db = App.db;
        if (db.objectStoreNames.contains(tablename)) {
            db.deleteObjectStore(tablename);
        }
        var store = db.createObjectStore(tablename, { keyPath: "key" });
    };
    request.onfailure = error;
}

App.query = function () {
    var trans = App.db.transaction([tablename], "readwrite");
    var store = trans.objectStore(tablename);

    var keyRange = IDBKeyRange.lowerBound(0);
    var cursorRequest = store.openCursor(keyRange);
    if (App.table){
        var table = App.table;
        var len = table.rows.length;
        for (var i = len-1; i >= 0; i--) {
            table.deleteRow(i);
        }
    }else{
        App.table = document.getElementsByTagName("table")[0];
    }
    var noRecord = true;
    document.getElementById("noRecord").innerHTML = "";
    $("#btnDelete").button("enable");
    cursorRequest.onsuccess = function (e) {
        var result = e.target.result;
        if (!result || !result.value){
            if(noRecord){
                document.getElementById("noRecord").innerHTML="No Record";
                $("#btnDelete").button("disable");
            }
            return false;
        }
        noRecord = false;
        render(result.value.key, result.value.value);
        result.continue();
    }
    cursorRequest.onerror = error;
}

App.insert = function () {
    var trans = App.db.transaction([tablename], "readwrite");
    var store = trans.objectStore(tablename);

    var key = $("#txtName").val();
    var name = $("#txtEmail").val();
    if (!key || !name)
        return ;
    var record = { key : key, value : name };
    var result = store.put(record);
    result.onsuccess =  App.query;
    result.onerror = error;
}

App.delete = function () {
    var trans = App.db.transaction([tablename], "readwrite");
    var store = trans.objectStore(tablename);

    var id = $("#txtID").val();
    if (!id) return ;
    var request = store.delete(id);
    request.onsuccess = App.query;
    request.onerror = error;
}

function error (e) {
    $("#error").html(e.name + ":" + e.message);
}

function render(key, value) {
    var contactTr = document.createElement("tr");
    var tdKey = document.createElement("td");
    var tdName = document.createElement("td");
    tdKey.innerHTML = key;
    tdName.innerHTML = value;
    contactTr.appendChild(tdKey);
    contactTr.appendChild(tdName);
    App.table.appendChild(contactTr);
}

$(function(){
    App.init();
    $("#btnAdd").click(function(){
        App.insert();
    });
    $("#btnDelete").click(function(){
        App.delete();
    });
});

