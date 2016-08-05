"use strict";

function Init() {
    if (navigator.getGamepads === undefined) {
        document.getElementById("gamepadSupportedDiv").style.display = "block";
        document.getElementById("gamepadDisplayDiv").style.display = "none";
    } else {
        window.requestAnimationFrame(runAnimation);
    }
}

// --------------------------------------
// Animation loop
// --------------------------------------
var buttonPressedOnAnyGamepadEver = false;
var gamepadVisualizers = [];
function runAnimation() {
    // Get the latest gamepad state.
    var gamepads = navigator.getGamepads();
    for (var i = 0; i < gamepads.length; i++) {
        var pad = gamepads[i];
        if (pad) {
            // Gamepads physically plugged into the system will not be visible to JavaScript until
            // the user has pressed a button on a gamepad. Note that each browser has slightly different
            // behavior for which buttons need to be pressed.
            if (!buttonPressedOnAnyGamepadEver) {
                document.getElementById("buttonNeverPressedDiv").style.display = "none";
                document.getElementById("buttonPressedDiv").style.display = "block";
                buttonPressedOnAnyGamepadEver = true;
            }

            var usingStandardMapping = (pad.mapping && pad.mapping === "standard");
            var gamepadVisualizer = usingStandardMapping ? new StandardGamepadVisualizer(pad) : new GenericGamepadVisualizer(pad);
            gamepadVisualizers[i] = gamepadVisualizer;
        } else {
            if (gamepadVisualizers[i]) {
                gamepadVisualizers[i].retired = true;
            }
        }
    }

    for (var i = 0; i < gamepadVisualizers.length; i++) {
        var gamepadVisualizer = gamepadVisualizers[i];
        if (gamepadVisualizers[i]) {
            gamepadVisualizer.UpdateView();
        }
    }

    window.requestAnimationFrame(runAnimation);
}

// --------------------------------------
// Misc.
// --------------------------------------
function FloatValueAsString(flValue) {
    var strVal = flValue.toString();
    strVal = strVal.substring(0, 4);
    return strVal;
}

var stateTableRowTemplate = '\
  <td><div>gpIndex</div></td>\
  <td><div>gpTimestamp</div></td>\
  <td><div>gpMapping</div></td>\
  <td><div>gpConnected</div></td>\
  <td><div>gpId</div></td>\
';

function UpdateGamepadStateTable(gamepad, index) {
    var connectedStr = "N/A";
    var indexStr = "N/A";
    var timestampStr = "N/A";
    var mappingStr = "N/A";
    var idStr = "N/A";
    if (gamepad) {
        idStr = (gamepad.id !== undefined) ? gamepad.id : "undefined";
        mappingStr = (gamepad.mapping !== undefined) ? gamepad.mapping : "undefined";
        indexStr = (gamepad.index !== undefined) ? gamepad.index : "undefined";
        connectedStr = (gamepad.connected !== undefined) ? gamepad.connected : "undefined";
        timestampStr = (gamepad.timestamp !== undefined) ? (gamepad.timestamp / 1000) + "s" : "undefined";
    }

    var newRow = stateTableRowTemplate;
    newRow = newRow.replace(/gpIndex/g, indexStr);
    newRow = newRow.replace(/gpTimestamp/g, timestampStr);
    newRow = newRow.replace(/gpMapping/g, mappingStr);
    newRow = newRow.replace(/gpConnected/g, connectedStr);
    newRow = newRow.replace(/gpId/g, idStr);
    var containerElem = document.getElementById("gpStateTableRow" + index);
    containerElem.innerHTML = newRow.replace(/\[#\]/g, index);
}

function ClearGamepadStateTableRow(index) {
    var containerElem = document.getElementById("gpStateTableRow" + index);
    containerElem.innerHTML = "";
}