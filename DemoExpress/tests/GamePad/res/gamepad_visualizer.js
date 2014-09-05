"use strict";

// --------------------------------------
// StandardGamepadVisualizer
// --------------------------------------
function StandardGamepadVisualizer(pad) {
    this.pad = pad;
    this.index = pad.index;
    this.containerElemId = "gp" + this.index + "Cell";
    this.leftThumbVisualizer = new AxisVisualizer("gp" + this.index + "leftThumb");
    this.rightThumbVisualizer = new AxisVisualizer("gp" + this.index + "rightThumb");
    this.leftTriggerVisualizer = new AnalogButtonVisualizer("gp" + this.index + "LT");
    this.rightTriggerVisualizer = new AnalogButtonVisualizer("gp" + this.index + "RT");
    this.retired = false;

    this.UpdateView = function StandardGamepadVisualizer_UpdateView() {
        var pad = this.pad;
        var containerElem = document.getElementById(this.containerElemId);

        if (pad && !this.retired) {
            if (pad.mapping === "standard") {
                var templateStr = starndardGamepadVisualizerTemplate.replace(/gp\[#\]/g, "gp" + this.index);
                containerElem.innerHTML = templateStr;

                this.leftThumbVisualizer.setXAxisValue(pad.axes[0]);
                this.leftThumbVisualizer.setYAxisValue(pad.axes[1]);

                this.rightThumbVisualizer.setXAxisValue(pad.axes[2]);
                this.rightThumbVisualizer.setYAxisValue(pad.axes[3]);

                var buttonLeftTrigger = pad.buttons[6];
                var buttonRightTrigger = pad.buttons[7];

                this.leftTriggerVisualizer.setValue(buttonLeftTrigger.value, buttonLeftTrigger.pressed);
                this.rightTriggerVisualizer.setValue(buttonRightTrigger.value, buttonRightTrigger.pressed);

                this.UpdateButtons(pad);

                UpdateGamepadStateTable(pad, pad.index);
                containerElem.classList.remove("gpTableCellUnConnected");
            }
        } else {
            containerElem.innerHTML = "<div class='gpNotConnectedText'>Gamepad not connected.</div>";
            ClearGamepadStateTableRow(this.index);
            containerElem.classList.add("gpTableCellUnConnected");
        }
    }

    this.buttonMap = [
      { buttonIndex: 0,  elemIdTemplate: "gp[#]BtnA" },
      { buttonIndex: 1,  elemIdTemplate: "gp[#]BtnB" },
      { buttonIndex: 2,  elemIdTemplate: "gp[#]BtnX" },
      { buttonIndex: 3,  elemIdTemplate: "gp[#]BtnY" },
      { buttonIndex: 4,  elemIdTemplate: "gp[#]BtnLB" },
      { buttonIndex: 5,  elemIdTemplate: "gp[#]BtnRB" },
      { buttonIndex: 8,  elemIdTemplate: "gp[#]BtnSelect" },
      { buttonIndex: 9,  elemIdTemplate: "gp[#]BtnStart" },
      { buttonIndex: 10, elemIdTemplate: "gp[#]BtnLThumb" },
      { buttonIndex: 11, elemIdTemplate: "gp[#]BtnRThumb" },
      { buttonIndex: 12, elemIdTemplate: "gp[#]BtnDU" },
      { buttonIndex: 13, elemIdTemplate: "gp[#]BtnDD" },
      { buttonIndex: 14, elemIdTemplate: "gp[#]BtnDL" },
      { buttonIndex: 15, elemIdTemplate: "gp[#]BtnDR" }
    ];

    this.UpdateButtons = function StandardGamepadVisualizer_UpdateButtons(pad) {
        for (var i = 0; i < this.buttonMap.length; i++) {
            var visualizer = this.buttonMap[i].visualizer;
            if (this.buttonMap[i].buttonIndex < pad.buttons.length) {
                var index = this.buttonMap[i].buttonIndex;
                var button = pad.buttons[index];
                visualizer.setValue(button.value, button.pressed);
            }
        }
    }

    this.Init = function _Init() {
        for (var i = 0; i < this.buttonMap.length; i++) {
            var elemId = this.buttonMap[i].elemIdTemplate.replace(/\[#\]/g, this.index);
            this.buttonMap[i].visualizer = new DigitalButtonVisualizer(elemId);
        }
    }
    this.Init();
}


// --------------------------------------
// GenericGamepadVisualizer
// --------------------------------------
function GenericGamepadVisualizer(pad) {
    this.pad = pad;
    this.index = pad.index;
    this.containerElemId = "gp" + this.index + "Cell";
    this.retired = false;

    this.Init = function GenericGamepadVisualizer_Init(pad) {
        var containerElem = document.getElementById(this.containerElemId);
        var strInject = "";

        var buttonTemplateStr = '<div id="gp[#]" class="AnalogButtonVisualizer VisualizerGeneric" style="">[BTN#]<div id="val"></div></div>';
        for (var index = 0; index < pad.buttons.length; index++) {
            var elemId = "gp" + this.index + "Btn" + index;
            var buttonStr = buttonTemplateStr.replace(/gp\[#\]/g, elemId);
            buttonStr = buttonStr.replace(/\[BTN#\]/g, "B" + index);
            strInject += buttonStr;
        }
        strInject += "<br>";

        var axisTemplateStr = '<div id="gp[#]" class="AxisVisualizer VisualizerGeneric"><div id="val"></div></div>';
        for (var index = 0; index < pad.axes.length; index += 2) {
            var elemId = "gp" + this.index + "Axis" + index;
            var axisStr = axisTemplateStr.replace(/gp\[#\]/g, elemId);
            strInject += axisStr;
        }

        containerElem.innerHTML = strInject;
    }

    this.UpdateView = function GenericGamepadVisualizer_UpdateView() {
        var pad = this.pad;
        var containerElem = document.getElementById(this.containerElemId);
        if (pad && !this.retired) {
            if (pad.mapping === "" /* Firefox doesn't use the "standard" mapping. */) {
                for (var index = 0; index < pad.buttons.length; index++) {
                    var elemId = "gp" + this.index + "Btn" + index;
                    var visualizer = new AnalogButtonVisualizer(elemId);
                    var button = pad.buttons[index];
                    visualizer.setValue(button.value, button.pressed);
                }

                for (var index = 0; index < pad.axes.length; index += 2) {
                    var elemId = "gp" + this.index + "Axis" + index;
                    var visualizer = new AxisVisualizer(elemId);
                    visualizer.setXAxisValue(pad.axes[index]);
                    if (pad.axes[index + 1]) {
                        visualizer.setYAxisValue(pad.axes[index + 1]);
                    }
                }

                UpdateGamepadStateTable(pad, pad.index);
                containerElem.classList.remove("gpTableCellUnConnected");
            }
        } else {
            containerElem.innerHTML = "<div class='gpNotConnectedText'>Gamepad not connected.</div>";
            ClearGamepadStateTableRow(this.index);
            containerElem.classList.add("gpTableCellUnConnected");
        }
    }
    this.Init(pad);
}

// --------------------------------------
// AxisVisualizer
// --------------------------------------
function AxisVisualizer(elemId) {
    this.XAxisValue = 0.0;
    this.YAxisValue = 0.0;
    this.elemId = elemId;
    this.cxCursor = 11;

    this.setElemStyles = function AxisVisualizer_setElemStyles(elem) {
        var cxImage = 100 + (this.cxCursor - 1);
        var cxOffset = (this.cxCursor - 1) / 2;
        elem.style.width = cxImage + "px";
        elem.style.height = cxImage + "px";
        var xAxisLeft = Math.round((this.XAxisValue + 1.0) * 50);
        var yAxisRight = Math.round((this.YAxisValue + 1.0) * 50);
        elem.style.backgroundPosition = xAxisLeft + "px " + yAxisRight + "px, " + cxOffset + "px " + cxOffset + "px";

        if (this.value > 1.0 || this.value < -1.0) { alert('Invalid Value!') };
        var childNodes = elem.childNodes;
        var lastChild = childNodes[childNodes.length - 1];
        lastChild.innerHTML = FloatValueAsString(this.XAxisValue) + ',' + FloatValueAsString(this.YAxisValue);
    }

    this.setXAxisValue = function AxisVisualizer_setXAxisValue(val) {
        if (val < -1.0) {
            val = -1.0;
        }
        else if (val > 1.0) {
            val = 1.0;
        }
        this.XAxisValue = val;
        this.onValueChange();
    }

    this.setYAxisValue = function AxisVisualizer_setYAxisValue(val) {
        if (val < -1.0) {
            val = -1.0;
        }
        else if (val > 1.0) {
            val = 1.0;
        }
        this.YAxisValue = val;
        this.onValueChange();
    }

    this.onValueChange = function AxisVisualizer_onValueChange() {
        var elem = document.getElementById(this.elemId);
        this.setElemStyles(elem);
    }
}

// --------------------------------------
// AnalogButtonVisualizer
// --------------------------------------
function AnalogButtonVisualizer(elemId) {
    this.elemId = elemId;
    this.value = 0;
    this.fIsPressed = false;

    this.setElemStyles = function AnalogButtonVisualizer_setElemStyles(elem) {
        var cxHeight = Math.round(this.value * 98);
        var top = 100 - cxHeight - 1
        elem.style.backgroundPosition = "1px " + top + "px, 0px 0px";
        elem.style.backgroundSize = "28px " + cxHeight + "px, 30px 100px";
        if (this.fIsPressed) {
            elem.style.color = "salmon";
        }
        else {
            elem.style.color = "black";
        }

        if (this.value > 1.0 || this.value < 0) { alert('oops!') };
        var childNodes = elem.childNodes;
        var lastChild = childNodes[childNodes.length - 1];
        lastChild.innerHTML = FloatValueAsString(this.value);
    }

    this.setValue = function AnalogButtonVisualizer_setValue(val, fIsPressed) {
        if (val < -1.0) {
            val = -1.0;
        }
        else if (val > 1.0) {
            val = 1.0;
        }
        this.value = val;
        this.fIsPressed = fIsPressed;

        var elem = document.getElementById(this.elemId);
        this.setElemStyles(elem);
    }
}

// --------------------------------------
// DigitalButtonVisualizer
// --------------------------------------
function DigitalButtonVisualizer(elemId) {
    this.elemId = elemId;
    this.value = 0;
    this.fIsPressed = false;

    this.setElemStyles = function DigitalButtonVisualizer_setElemStyles(elem) {
        if (this.value === 1.0) {
            elem.style.backgroundColor = "#8AFF59";
        } else {
            elem.style.backgroundColor = "transparent";
        }

        if (this.fIsPressed) {
            elem.style.color = "salmon";
        }
        else {
            elem.style.color = "black";
        }
    }

    this.setValue = function DigitalButtonVisualizer_setValue(val, fIsPressed) {
        this.value = val;
        this.fIsPressed = fIsPressed;
        var elem = document.getElementById(this.elemId);
        this.setElemStyles(elem);
    }
}

var starndardGamepadVisualizerTemplate = '\
  <table class="gamepadVisualizer">\
    <tr>\
      <th></th>\
      <td colspan="3"><div id="gp[#]BtnLB" class="oval && bumper">LB</div></td>\
      <td colspan="2"></td>\
      <td id="gp[#]BtnRB" colspan="3"><div class="oval && bumper">RB</div></td>\
      <th></th>\
    </tr>\
    <tr>\
      <td rowspan="3"><div id="gp[#]LT" class="AnalogButtonVisualizer">LT<div id="val"></div></div></td>\
      <td colspan="3" rowspan="3"><div class="DPad" id="DPad1"><div class="btnDU" id="gp[#]BtnDU"></div><div class="btnDL" id="gp[#]BtnDL"></div><div class="btnDR" id="gp[#]BtnDR"></div><div class="btnDD" id="gp[#]BtnDD"></div></div></td>\
      <td colspan="3"></td>\
      <td><div id="gp[#]BtnY" class="circle">Y</div></td>\
      <td></td>\
      <td rowspan="3"><div id="gp[#]RT" class="AnalogButtonVisualizer">RT<div id="val"></div></div></td>\
    </tr>\
    <tr>\
      <td><div id="gp[#]BtnSelect" class="oval && selOrStart">Select</div></td>\
      <td><div id="gp[#]BtnStart" class="oval && selOrStart">Start</div></td>\
      <td><div id="gp[#]BtnX" class="circle">X</div></td>\
      <td></td>\
      <td><div id="gp[#]BtnB" class="circle">B</div></td>\
    </tr>\
    <tr><td colspan="3"></td><td><div id="gp[#]BtnA" class="circle">A</div></td></tr>\
    <tr>\
      <td></td>\
      <td colspan="4"><div id="gp[#]BtnLThumb" class="oval">Left Thumb</div></td>\
      <td colspan="4"><div id="gp[#]BtnRThumb" class="oval">Right Thumb</div></td>\
    </tr>\
    <tr>\
      <td></td>\
      <td colspan="4"><div id="gp[#]leftThumb" class="AxisVisualizer"><div id="val"></div></div></td>\
      <td colspan="4"><div id="gp[#]rightThumb" class="AxisVisualizer"><div id="val"></div></div></td>\
    </tr>\
  </table>\
';