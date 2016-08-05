/*
Copyright (c) 2012 Intel Corporation.

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

var db;

function createTable() {
    var status = document.querySelector('#status');
    try {
        var dbname = "db02";
        db = openDatabase(dbname, '1.0', 'websql test', 1024);
        db.transaction(function (tx) {
            tx.executeSql("CREATE TABLE people(name, age);");
            status.innerHTML = 'database opened';
        }, function (e) {
            //status.innerHTML = e.name + ": " + e.message;
       });
    } catch (e) {
        status.innerHTML = e.name + ": " + e.message;
    }
}

function onAdd() {
    var name = $("#name").val();
    var age = $("#age").val();
    // both name and age must not be null
    if (!name && !age)
        return;
    $("#tableList").empty();
    var status = document.querySelector('#status');
    try {
        db.transaction(function (tx) {
            tx.executeSql("INSERT INTO people VALUES ('"+ name +"' , '"+ age +"');");
            querySql(tx, "SELECT * FROM people", status);
            status.innerHTML = 'data inserted';
        });
    } catch (e) {
        status.innerHTML = e.name + ": " + e.message;
    }
}

function onQuery() {
    $("#tableList").empty();
    var status = document.querySelector('#status');

    var name = $("#name").val();
    var age = $("#age").val();
    var sql = "";
    if (name && age){
        sql = "SELECT * FROM people WHERE name = '" + name +"' AND age = '" + age + "'";
    }else if (name){
        sql = "SELECT * FROM people WHERE name = '" + name +"'";
    }else if (age){
        sql = "SELECT * FROM people WHERE age = '" + age + "'";
    }else{
        sql = "SELECT * FROM people";
    }
    db.transaction(function (tx) {
       querySql(tx, sql, status);
       status.innerHTML = 'data queried';
    });
}

function onDelete() {
    $("#tableList").empty();
    var status = document.querySelector('#status');
    status.innerHTML = 'data deleted';

    var name = $("#name").val();
    var age = $("#age").val();
    var sql = "";
    if(name && age){
       sql = "DELETE FROM people WHERE name = '" + name +"' AND age = '" + age + "'";
    }else if (name){
       sql = "DELETE FROM people WHERE name = '" + name +"'";
    }else if (age){
       sql = "DELETE FROM people WHERE age = '" + age + "'";
    }else{
       sql = "DELETE FROM people";
    }
    db.transaction(function (tx) {
       tx.executeSql(sql);
       querySql(tx,"SELECT * FROM people", status);
    });
}

function querySql(tx, sql, status) {
    tx.executeSql(sql, [], function (tx, results) {
        if (results.rows && results.rows.length) {
            var table = document.getElementsByTagName("table");
            for (i = 0; i < results.rows.length; i++) {
               var contactTr = document.createElement("tr");
               var tdName = document.createElement("td");
               var tdAge = document.createElement("td");

               tdName.innerHTML = results.rows.item(i)["name"];
               tdAge.innerHTML = results.rows.item(i)["age"];
               contactTr.appendChild(tdName);
               contactTr.appendChild(tdAge);
               table[0].appendChild(contactTr);
           }
        }
      }, function (e) {
          status.innerHTML = e.name + ": " + e.message;
    });
}

$(document).ready(function () {
    createTable();
    $("#add").click(onAdd);
    $("#query").click(onQuery);
    $("#delete").click(onDelete);
});
