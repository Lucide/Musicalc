var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var cvs;
var pFontSize;
var pLoading;
var pMainWrapper;
var pMain;
var pBtnWrappers;
var pButtons;
var pRoll;
var pLines;
var cnv;
var list;
window.addEventListener("load", start);
var Base = /** @class */ (function () {
    function Base(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.stroke = ["#000000", 1];
        this.fill = ["#000000"];
        this.visible = true;
        this.filled = false;
        // this.low=[];
    }
    Object.defineProperty(Base.prototype, "getX", {
        get: function () {
            return this.x;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Base.prototype, "getY", {
        get: function () {
            return this.y;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Base.prototype, "getLow", {
        get: function () {
            return this.low;
        },
        enumerable: true,
        configurable: true
    });
    Base.prototype.setX = function (x) {
        this.x = x;
        this.low[0] = calx(x - this.w / 2);
    };
    Base.prototype.setY = function (y) {
        this.y = y;
        this.low[1] = caly(y + this.h / 2);
    };
    Base.prototype.setXY = function (x, y) {
        this.x = x;
        this.y = y;
        this.low[0] = calx(x - this.w / 2);
        this.low[1] = caly(y + this.h / 2);
    };
    Base.prototype.setW = function (w) {
        this.w = w;
        this.low[2] = calw(w);
    };
    Base.prototype.setH = function (h) {
        this.h = h;
        this.low[3] = calh(h);
    };
    Base.prototype.setWH = function (w, h) {
        this.w = w;
        this.h = h;
        this.low[2] = calw(w);
        this.low[3] = calh(h);
    };
    Base.prototype.setStroke = function (val1, val2) {
        if (typeof val1 == "string") {
            this.stroke[0] = val1;
        }
        else {
            this.stroke[1] = val1;
        }
        if (val2) {
            this.stroke[1] = val2;
        }
    };
    Base.prototype.setFill = function (color) {
        this.fill = [color];
    };
    Base.prototype.cals = function (w, h, inside) {
        var iw = this.w, ih = this.h;
        if (inside) {
            if (iw * h < ih * w) {
                this.w = (h * iw) / ih;
                this.h = h;
            }
            else {
                this.w = w;
                this.h = (w * ih) / iw;
            }
        }
        else {
            if (iw * h < ih * w) {
                this.w = w;
                this.h = (w * ih) / iw;
            }
            else {
                this.w = (h * iw) / ih;
                this.h = h;
            }
        }
    };
    Base.prototype.precalc = function () {
        this.low = [calx(this.x - this.w / 2), caly(this.y + this.h / 2), calw(this.w), calh(this.h)];
    };
    return Base;
}());
var Rectangle = /** @class */ (function (_super) {
    __extends(Rectangle, _super);
    function Rectangle(x, y, w, h) {
        return _super.call(this, x, y, w, h) || this;
    }
    Rectangle.prototype.draw = function () {
        if (this.visible) {
            cvs.beginPath();
            cvs.strokeStyle = this.stroke[0];
            cvs.lineWidth = this.stroke[1];
            cvs.rect(this.low[0], this.low[1], this.low[2], this.low[3]);
            cvs.stroke();
            if (this.filled) {
                cvs.fillStyle = this.fill[0];
                cvs.fill();
            }
        }
    };
    return Rectangle;
}(Base));
var Texture = /** @class */ (function (_super) {
    __extends(Texture, _super);
    function Texture(img, x, y, w, h) {
        var _this = _super.call(this, x, y, w, h) || this;
        _this.img = new Image();
        _this.img.src = img;
        return _this;
    }
    Texture.prototype.draw = function () {
        if (this.visible) {
            cvs.drawImage(this.img, this.low[0], this.low[1], this.low[2], this.low[3]);
        }
    };
    return Texture;
}(Base));
var Word = /** @class */ (function (_super) {
    __extends(Word, _super);
    function Word(x, y, text, font, size) {
        var _this = _super.call(this, x, y, size, 0) || this;
        _this.text = text;
        _this.font = font;
        return _this;
    }
    Word.prototype.setX = function (x) {
        this.x = x;
        this.low[0] = calx(x);
    };
    Word.prototype.setY = function (y) {
        this.y = y;
        this.low[1] = caly(y);
    };
    Word.prototype.setXY = function (x, y) {
        this.x = x;
        this.y = y;
        this.low[0] = calx(x);
        this.low[1] = caly(y);
    };
    Word.prototype.precalc = function () {
        this.low = [calx(this.x), caly(this.y), calh(this.w)];
    };
    Word.prototype.draw = function () {
        if (this.visible) {
            cvs.beginPath();
            cvs.fillStyle = this.fill[0];
            cvs.font = this.low[2] + "px " + this.font;
            cvs.textBaseline = 'middle';
            cvs.textAlign = "center";
            cvs.fillText(this.text, this.low[0], this.low[1]);
        }
    };
    return Word;
}(Base));
var Circle = /** @class */ (function (_super) {
    __extends(Circle, _super);
    function Circle(x, y, radiusX, radiusY) {
        return _super.call(this, x, y, radiusX * 2, radiusY * 2) || this;
    }
    Circle.prototype.setX = function (x) {
        this.x = x;
        this.low[0] = calx(x);
    };
    Circle.prototype.setY = function (y) {
        this.y = y;
        this.low[1] = caly(y);
    };
    Circle.prototype.setXY = function (x, y) {
        this.x = x;
        this.y = y;
        this.low[0] = calx(x);
        this.low[1] = caly(y);
    };
    Circle.prototype.precalc = function () {
        this.low = [calx(this.x), caly(this.y), calw(this.w) / 2, calh(this.h) / 2];
    };
    Circle.prototype.draw = function () {
        if (this.visible) {
            cvs.beginPath();
            cvs.strokeStyle = this.stroke[0];
            cvs.lineWidth = this.stroke[1];
            cvs.ellipse(this.low[0], this.low[1], this.low[2], this.low[3], 0, 0, 2 * Math.PI);
            cvs.stroke();
            if (this.filled) {
                cvs.fillStyle = this.fill[0];
                cvs.fill();
            }
        }
    };
    return Circle;
}(Base));
var Power = /** @class */ (function (_super) {
    __extends(Power, _super);
    function Power() {
        var _this = _super.call(this, 0, 0, 1, 1) || this;
        _this.step = 0;
        return _this;
    }
    Power.prototype.precalc = function () {
        this.low = [calx(this.x), caly(this.y), calw(this.w) / 2 + 400];
    };
    Power.prototype.draw = function () {
        var k = 1 - (2 * this.step / (181 + this.step)), grd = cvs.createRadialGradient(this.low[0], this.low[1], this.low[2] * k, this.low[0], this.low[1], (this.low[2] * k - 200 > 0) ? this.low[2] * k - 200 : 0);
        grd.addColorStop(0.000, "#1b1464");
        grd.addColorStop(0.500, "#2d75ff"); //"#003ce3"
        grd.addColorStop(1.000, "#1b1464");
        cvs.beginPath();
        cvs.fillStyle = grd;
        cvs.fillRect(0, 0, cnv.width, cnv.height);
        this.step = (this.step + 1) % 181;
    };
    return Power;
}(Base));
var Drop = /** @class */ (function () {
    function Drop(radius) {
        this.radius = radius;
        this.drops = [];
    }
    Drop.prototype.startDrop = function (x, y) {
        this.drops.push([x, y, 0]);
        if (this.drops.length > 16) {
            this.drops.shift();
        }
    };
    Drop.prototype.draw = function () {
        var step;
        for (var i = 0; i < this.drops.length; i++) {
            step = this.drops[i][2];
            this.drops[i][2]++;
            if (step < 401) {
                step = 2 * step / (400 + step);
                cvs.beginPath();
                cvs.strokeStyle = "rgba(239,239,239," + (1 - step) + ")";
                cvs.lineWidth = 2;
                cvs.arc(this.drops[i][0], this.drops[i][1], this.radius * step, 0, 2 * Math.PI);
                cvs.stroke();
            }
            else {
                this.drops.shift();
            }
        }
    };
    return Drop;
}());
var Roll = /** @class */ (function () {
    function Roll() {
        this.low = new Array(31);
    }
    Roll.prototype.precalc = function () {
        for (var i = 0; i < 31; i++) {
            var val = Math.round(cnv.width / 32 * (i + 1)) + 0.5;
            this.low[i] = val;
        }
    };
    Roll.prototype.draw = function () {
        cvs.beginPath();
        cvs.strokeStyle = "rgba(255,255,255,0.1)";
        cvs.lineWidth = 1;
        for (var i = 0; i < 31; i++) {
            cvs.moveTo(this.low[i], 0);
            cvs.lineTo(this.low[i], cnv.height);
            cvs.stroke();
        }
    };
    return Roll;
}());
var Lines = /** @class */ (function () {
    function Lines(w1, w2) {
        this.w1 = w1;
        this.w2 = w2;
    }
    Lines.prototype.draw = function () {
        if (this.w1.visible && this.w2.visible) {
            cvs.beginPath();
            cvs.strokeStyle = "rgba(255,255,255," + Math.abs(0.5 - (Math.max(Math.abs(this.w1.getY), Math.abs(this.w2.getY)) / (Note.limit * 2))) + ")";
            cvs.lineWidth = 1;
            cvs.moveTo(this.w1.getLow[0], this.w1.getLow[1]);
            cvs.lineTo(this.w2.getLow[0], this.w2.getLow[1]);
            cvs.stroke();
        }
    };
    return Lines;
}());
var Note = /** @class */ (function () {
    function Note() {
        this.transitionTime = 60;
        this.score = new Array(16);
        this.lines = new Array(120);
        for (var i = 0; i < 16; i++) {
            this.score[i] = [new Word(0, 0, "", "arame", 20), 0, 0, 0, 0, 0, 0];
            this.score[i][0].setFill("#ffffff");
        }
        for (var i = 0, k = 1, j = 0; i < 120; i++, j++) {
            if (j == k) {
                j = 0;
                k++;
            }
            this.lines[i] = new Lines(this.score[k][0], this.score[j][0]);
        }
    }
    Note.prototype.precalc = function () {
        Note.limit = cnv.h / 2 + 50;
        this.offset = cnv.w / 64;
        for (var i = 0; i < 16; i++) {
            this.score[i][0].precalc();
            this.score[i][0].setX(this.offset * this.score[i][1]);
        }
    };
    Note.prototype.draw = function () {
        for (var i = 0; i < 16; i++) {
            var note = this.score[i][0];
            switch (this.score[i][5]) {
                case 0:
                    this.score[i][1] = ((Math.random() * (30 + 30 + 1)) | 0) - 30; //da -30 a 30
                    this.score[i][2] = ((Math.random() * (500 + 500 + 1)) | 0) - 500; //da -500 a 500
                    this.score[i][3] = ((Math.random() * (200 - 50 + 1)) | 0) + 50; //da 50 a 200
                    this.score[i][4] = ((Math.random() * (150 - 50 + 1)) | 0) + 50; //da 50 a 150
                    switch ((this.score[i][1] + 30 + 6) % 7) {
                        case 0:
                            note.text = "do";
                            break;
                        case 1:
                            note.text = "re";
                            break;
                        case 2:
                            note.text = "mi";
                            break;
                        case 3:
                            note.text = "fa";
                            break;
                        case 4:
                            note.text = "sol";
                            break;
                        case 5:
                            note.text = "la";
                            break;
                        case 6:
                            note.text = "si";
                            break;
                    }
                    note.setX(this.offset * this.score[i][1]);
                    note.setY(-Note.limit);
                    note.visible = false;
                    this.score[i][5]++;
                    this.score[i][6] = 0;
                    break;
                case 1:
                    if (this.score[i][6] < this.score[i][3]) {
                        this.score[i][6]++;
                    }
                    else {
                        note.visible = true;
                        this.score[i][5]++;
                        this.score[i][6] = 0;
                    }
                    break;
                case 2:
                    if (this.score[i][6] < this.transitionTime) {
                        note.setY((EasingFunctions.easeInOutCubic(this.score[i][6] / this.transitionTime) * (this.score[i][2] + Note.limit + 1)) - Note.limit);
                        this.score[i][6]++;
                    }
                    else {
                        this.score[i][5]++;
                        this.score[i][6] = 0;
                    }
                    break;
                case 3:
                    if (this.score[i][6] < this.score[i][4]) {
                        this.score[i][6]++;
                    }
                    else {
                        this.score[i][5]++;
                        this.score[i][6] = 0;
                    }
                    break;
                case 4:
                    if (this.score[i][6] < this.transitionTime) {
                        note.setY((EasingFunctions.easeInOutCubic(this.score[i][6] / this.transitionTime) * (Note.limit - this.score[i][2] + 1)) + this.score[i][2]);
                        this.score[i][6]++;
                    }
                    else {
                        this.score[i][5] = 0;
                        this.score[i][6] = 0;
                    }
                    break;
            }
            note.draw();
        }
        for (var i = 0; i < 120; i++) {
            this.lines[i].draw();
        }
    };
    return Note;
}());
//CALCULATE
function calc() {
    cvs.canvas.width = cvs.canvas.clientWidth;
    cvs.canvas.height = cvs.canvas.clientHeight;
    cnv.width = cvs.canvas.width;
    cnv.height = cvs.canvas.height;
    var iw = 81, ih = 50;
    var w = cnv.width, h = cnv.height;
    if (iw * h < ih * w) {
        iw = (h * iw) / ih;
        cnv.ox = (w - iw) / 2;
        cnv.oy = 0;
        cnv.uw = iw / 1620;
        cnv.uh = h / 1000;
    }
    else {
        ih = (w * ih) / iw;
        cnv.ox = 0;
        cnv.oy = (h - ih) / 2;
        cnv.uw = w / 1620;
        cnv.uh = ih / 1000;
    }
    cnv.w = cnv.width / cnv.uw;
    cnv.h = cnv.height / cnv.uh;
    pFontSize.fontSize = calw(16) + "px";
    pMainWrapper[0].style.left = cnv.ox + "px";
    pMainWrapper[0].style.top = cnv.oy + "px";
    pMainWrapper[0].style.width = calw(1620) + "px";
    pMainWrapper[0].style.height = calw(1000) + "px";
    pMainWrapper[1] = cnv.ox;
    pMainWrapper[2] = calw(1620);
    for (var _i = 0, pBtnWrappers_1 = pBtnWrappers; _i < pBtnWrappers_1.length; _i++) {
        var t = pBtnWrappers_1[_i];
        t[1] = coords(t[0]).left;
        t[2] = coords(t[0]).top;
    }
    list[0].cals(cnv.w, cnv.h, false);
    list[1].cals(cnv.w, cnv.h, false);
    for (var i = list.length - 2; i > -1; i--) {
        list[i].precalc();
    }
}
function calx(x) {
    return (x + 810) * cnv.uw + cnv.ox;
}
function caly(y) {
    return (-y + 500) * cnv.uh + cnv.oy;
}
function calw(w) {
    return w * cnv.uw;
}
function calh(h) {
    return h * cnv.uh;
}
function coords(element) {
    var box = element.getBoundingClientRect();
    return {
        top: box.top + pageYOffset,
        left: box.left + pageXOffset
    };
}
function refresh() {
    requestAnimationFrame(refresh);
    /*!!!!!!!!!!*/
    cvs.clearRect(0, 0, cnv.width, cnv.height);
    for (var i = 0, max = list.length; i < max; i++) {
        list[i].draw();
    }
}
var EasingFunctions = {
    // no easing, no acceleration
    linear: function (t) {
        return t;
    },
    // accelerating from zero velocity
    easeInQuad: function (t) {
        return t * t;
    },
    // decelerating to zero velocity
    easeOutQuad: function (t) {
        return t * (2 - t);
    },
    // acceleration until halfway, then deceleration
    easeInOutQuad: function (t) {
        return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    },
    // accelerating from zero velocity
    easeInCubic: function (t) {
        return t * t * t;
    },
    // decelerating to zero velocity
    easeOutCubic: function (t) {
        return (--t) * t * t + 1;
    },
    // acceleration until halfway, then deceleration
    easeInOutCubic: function (t) {
        return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    },
    // accelerating from zero velocity
    easeInQuart: function (t) {
        return t * t * t * t;
    },
    // decelerating to zero velocity
    easeOutQuart: function (t) {
        return 1 - (--t) * t * t * t;
    },
    // acceleration until halfway, then deceleration
    easeInOutQuart: function (t) {
        return t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
    },
    // accelerating from zero velocity
    easeInQuint: function (t) {
        return t * t * t * t * t;
    },
    // decelerating to zero velocity
    easeOutQuint: function (t) {
        return 1 + (--t) * t * t * t * t;
    },
    // acceleration until halfway, then deceleration
    easeInOutQuint: function (t) {
        return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t;
    }
};
//EVENTS
function start() {
    cvs = document.getElementsByClassName("bck")[0].getContext("2d");
    pFontSize = document.documentElement.style;
    pLoading = document.getElementsByClassName("loading")[0];
    pMainWrapper = [document.getElementsByClassName("mainWrapper")[0], 0, 0];
    pMain = document.getElementsByTagName("main")[0];
    pButtons = Array.prototype.slice.call(pMain.getElementsByClassName("rollTab")[0].getElementsByTagName("button"));
    pRoll = Array.prototype.slice.call(pMain.getElementsByClassName("roll")[0].children);
    pLines = Array.prototype.slice.call(pMain.getElementsByClassName("rollTab")[0].getElementsByClassName("bar"));
    pBtnWrappers = [];
    for (var array = Array.prototype.slice.call(pMain.getElementsByClassName("rollTab")[0].getElementsByClassName("btn-wrap")), i = array.length - 1; i > -1; i--) {
        pBtnWrappers[i] = [array[i], 0, 0];
    }
    cnv = {};
    list = [
        new Power(),
        new Texture("/assets/bck/bck.png", 0, 0, 16, 9),
        new Roll(),
        new Note(),
        // new Rectangle(0, 0, 1620, 1000),
        // new Circle(0,-155,50,5),
        // new Rectangle(0,-192,47,70),
        // new Word(0,0,"space 1966","arame",50),
        new Drop(300)
    ];
    // list[4].setStroke("rgba(0,0,0,0)", 0);
    // list[4].filled = true;
    // list[4].setFill("rgba(0,255,14,0.5)");
    calc();
    rollTab(null, true);
    window.addEventListener("resize", calc);
    window.addEventListener("mousemove", move);
    window.addEventListener("mousedown", click);
    pLoading.addEventListener("transitionend", loadingDone);
    for (var _i = 0, pButtons_1 = pButtons; _i < pButtons_1.length; _i++) {
        var t = pButtons_1[_i];
        t.addEventListener("click", rollTab);
    }
    pLoading.style.transition = "left 1s ease, top 1s ease, width 1s ease, height 1s ease, opacity .5s ease 1s";
    pLoading.style.left = cnv.ox + "px";
    pLoading.style.top = cnv.oy + "px";
    pLoading.style.width = calw(1620) + "px";
    pLoading.style.height = calw(1000) + "px";
    pLoading.style.opacity = "0";
    refresh();
}
function move(e) {
    var v = (e.clientX - pMainWrapper[1]) / pMainWrapper[2], x, y, width = 30, gradientSize = 25, darkColor = "rgb(25,25,25)", lightColor = "rgb(125,125,125)";
    pMainWrapper[0].style.background = "linear-gradient(to bottom right,transparent " +
        (v * (100 + width) - width) + "%,rgba(255,255,255,.75) " +
        (v * (100 + width) - width / 2) + "%,transparent " +
        (v * (100 + width)) + "%)";
    for (var i = pBtnWrappers.length - 1; i > -1; i--) {
        x = e.pageX - pBtnWrappers[i][1];
        y = e.pageY - pBtnWrappers[i][2];
        pBtnWrappers[i][0].style.background = "radial-gradient(" +
            gradientSize +
            "rem at " +
            x +
            "px " +
            y +
            "px" +
            ", " +
            lightColor +
            ", " +
            darkColor +
            ")";
    }
}
function click(e) {
    list[list.length - 1].startDrop(e.clientX, e.clientY);
    // domtoimage.toPng(document.getElementsByClassName("mainWrapper")[0])
    //     .then(function (dataUrl) {
    //         var link = document.createElement("a");
    //         link.setAttribute("href", dataUrl);
    //         link.setAttribute("download", "image.png");
    //         link.click();
    //     })
    //     .catch(function (error) {
    //         console.error('oops, something went wrong!', error);
    //     });
}
function rollTab(e, init) {
    if (init === void 0) { init = false; }
    var source, i, y1, y2, y3;
    if (init) {
        source = "lead";
    }
    else {
        source = this.classList[0];
    }
    for (var _i = 0, pButtons_2 = pButtons; _i < pButtons_2.length; _i++) {
        var t = pButtons_2[_i];
        t.removeAttribute("style");
    }
    for (var _a = 0, pRoll_1 = pRoll; _a < pRoll_1.length; _a++) {
        var t = pRoll_1[_a];
        t.style.display = "none";
    }
    switch (source) {
        case "lead":
            i = 0;
            y1 = 25;
            y2 = 50;
            y3 = 75;
            break;
        case "pad":
            i = 1;
            y1 = 0;
            y2 = 50;
            y3 = 75;
            break;
        case "bass":
            i = 2;
            y1 = 0;
            y2 = 25;
            y3 = 75;
            break;
        case "drum":
            i = 3;
            y1 = 0;
            y2 = 25;
            y3 = 50;
            break;
    }
    pButtons[i].style.background = "linear-gradient(to right,rgba(125, 125, 125, .7) 60%,rgb(25, 25, 25))";
    pRoll[i].style.display = "block";
    pLines[0].style.top = y1 + "%";
    pLines[1].style.top = y2 + "%";
    pLines[2].style.top = y3 + "%";
}
function loadingDone(e) {
    if (e.propertyName == "opacity") {
        pLoading.style.animationPlayState = "paused";
        pLoading.style.display = "none";
        pLoading.removeEventListener("transitioned", loadingDone);
    }
}
//# sourceMappingURL=canvas.js.map