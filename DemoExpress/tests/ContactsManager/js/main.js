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
        Xu, Kang <kangx.xu@intel.com>

*/

var contacts = navigator.contacts || xwalk.experimental.contacts;

var usrFamilyName;

var usrGivenName;

var usrNumber;

var usrQueryName;

var testFlag = {
    save: false,
    clear: false,
    query: false
};

function status() {
    if (testFlag.save && testFlag.clear && testFlag.query) {
        EnablePassButton();
    }
}

function onError(e) {
    alert("Error: " + e.message);
}

function queryInit() {
    usrQueryName = $("#queryName").val();
}

function saveInit() {
    usrFamilyName = $("#familyName").val();
    usrGivenName = $("#givenName").val();
    usrNumber = $("#number").val();
}

function tableSave() {
    var table = document.getElementsByTagName("table");
    var contactTr = document.createElement("tr");
    var tdGivenName = document.createElement("td");
    var tdFamilyName = document.createElement("td");
    var tdNumber = document.createElement("td");
    tdGivenName.innerHTML = usrGivenName;
    tdFamilyName.innerHTML = usrFamilyName;
    tdNumber.innerHTML = usrNumber;
    contactTr.appendChild(tdFamilyName);
    contactTr.appendChild(tdGivenName);
    contactTr.appendChild(tdNumber);
    table[0].appendChild(contactTr);
}

function tableQuery() {
    var trList = document.getElementsByTagName("tr");
    for (var i = 0; i < trList.length; i++) {
        var trChilds = trList[i].childNodes;
        if (trChilds[0].innerHTML == usrQueryName) {
            trList[i].style.color = "red";
        } else {
            continue;
        }
    }
}

function tableClear() {
    var table = document.getElementById("tableList");
    var trList = document.getElementsByTagName("tr");
    for (var i = 0; i < trList.length; i++) {
        table.removeChild(trList[i]);
    }
}

function onClear() {
    testFlag.clear = true;
    contacts.clear().then(function () {
        $("#tableList").empty();
    }, onError);
    status();
}

function onSave() {
    testFlag.save = true;
    saveInit();
    var contactName = new ContactName({
        givenNames: [usrGivenName],
        familyNames: [usrFamilyName]
    });
    var contactPhone = new ContactTelField({value: usrNumber});
    var contact = new Contact({
        name: contactName,
        phoneNumbers: [contactPhone]
    });
    contacts.save(contact).then(tableSave, onError);
    status();
}

function onQuery() {
    testFlag.query = true;
    queryInit();
    contacts.find({fields: ["familyNames"], operator: "is", value: usrQueryName}).then(tableQuery, onError);
    status();
}

$(document).ready(function () {
    DisablePassButton();
    $("#save").click(onSave);
    $("#query").click(onQuery);
    $("#clear").click(onClear);
});
