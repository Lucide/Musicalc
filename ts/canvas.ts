let cvs: CanvasRenderingContext2D;
let pFontSize: CSSStyleDeclaration;
let pLoading: HTMLElement;
let pMainWrapper: [HTMLElement, /*left*/number, /*width*/number];
let pMain: HTMLElement;
let pBtnWrappers: [HTMLElement, /*left*/number, /*top*/number][];
let pButtons: HTMLElement[];
let pRoll: HTMLElement[];
let pLines: HTMLElement[];
let cnv: Tcnv;
let list: any[];

window.addEventListener("load", start);

//TYPES
type Tcnv = {
    width: number;   //canvas width in pixels
    height: number;  //canvas height in pixels
    w: number;       //canvas width in units
    h: number;       //canvas height in units
    uw: number;      //width unit in pixels
    uh: number;      //height unit in pixels
    ox: number       //-810 width unit offset in pixels
    oy: number       //-500 height unit offset in pixels
    //1620x1000
    // dt:number;
}

abstract class Base {
    public visible: boolean;
    public filled: boolean;
    protected low: number[];
    protected y: number;
    protected x: number;
    protected w: number;
    protected h: number;
    protected stroke: [string, number];
    protected fill: [string];

    constructor(x: number, y: number, w: number, h: number) {
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

    get getX(): number {
        return this.x;
    }

    get getY(): number {
        return this.y;
    }

    get getLow(): number[] {
        return this.low;
    }

    public setX(x: number): void {
        this.x = x;
        this.low[0] = calx(x - this.w / 2);
    }

    public setY(y: number): void {
        this.y = y;
        this.low[1] = caly(y + this.h / 2);
    }

    public setXY(x: number, y: number): void {
        this.x = x;
        this.y = y;
        this.low[0] = calx(x - this.w / 2);
        this.low[1] = caly(y + this.h / 2);
    }

    public setW(w: number): void {
        this.w = w;
        this.low[2] = calw(w);
    }

    public setH(h: number): void {
        this.h = h;
        this.low[3] = calh(h);
    }

    public setWH(w: number, h: number): void {
        this.w = w;
        this.h = h;
        this.low[2] = calw(w);
        this.low[3] = calh(h);
    }

    public setStroke(color: string, width: number): void;
    public setStroke(color: string): void;
    public setStroke(width: number): void;
    public setStroke(val1: string | number, val2?: number): void {
        if (typeof val1 == "string") {
            this.stroke[0] = val1;
        }
        else {
            this.stroke[1] = val1;
        }
        if (val2) {
            this.stroke[1] = val2;

        }
    }

    public setFill(color: string): void {
        this.fill = [color];
    }

    public cals(w: number, h: number, inside: boolean): void {
        let iw: number = this.w, ih: number = this.h;

        if (inside) {
            if (iw * h < ih * w) {
                this.w = (h * iw) / ih;
                this.h = h;
            } else {
                this.w = w;
                this.h = (w * ih) / iw;
            }
        } else {
            if (iw * h < ih * w) {
                this.w = w;
                this.h = (w * ih) / iw;
            } else {
                this.w = (h * iw) / ih;
                this.h = h;
            }
        }
    }

    public precalc(): void {
        this.low = [calx(this.x - this.w / 2), caly(this.y + this.h / 2), calw(this.w), calh(this.h)];
    }

    public abstract draw(): void;
}

class Rectangle extends Base {
    constructor(x: number, y: number, w: number, h: number) {
        super(x, y, w, h);
    }

    draw(): void {
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
    }
}

class Texture extends Base {
    public img: HTMLImageElement;

    constructor(img: string, x: number, y: number, w: number, h: number) {
        super(x, y, w, h);
        this.img = new Image();
        this.img.src = img;
    }

    draw(): void {
        if (this.visible) {
            cvs.drawImage(this.img, this.low[0], this.low[1], this.low[2], this.low[3]);
        }
    }
}

class Word extends Base {
    public text: string;
    public font: string;

    constructor(x: number, y: number, text: string, font: string, size: number) {
        super(x, y, size, 0);
        this.text = text;
        this.font = font;
    }

    setX(x: number): void {
        this.x = x;
        this.low[0] = calx(x);
    }

    setY(y: number): void {
        this.y = y;
        this.low[1] = caly(y);
    }

    setXY(x: number, y: number): void {
        this.x = x;
        this.y = y;
        this.low[0] = calx(x);
        this.low[1] = caly(y);
    }

    precalc() {
        this.low = [calx(this.x), caly(this.y), calh(this.w)];
    }

    draw(): void {
        if (this.visible) {
            cvs.beginPath();
            cvs.fillStyle = this.fill[0];
            cvs.font = this.low[2] + "px " + this.font;
            cvs.textBaseline = 'middle';
            cvs.textAlign = "center";
            cvs.fillText(this.text, this.low[0], this.low[1]);
        }
    }

}

class Circle extends Base {
    constructor(x: number, y: number, radiusX: number, radiusY: number) {
        super(x, y, radiusX * 2, radiusY * 2);
    }

    setX(x: number): void {
        this.x = x;
        this.low[0] = calx(x);
    }

    setY(y: number): void {
        this.y = y;
        this.low[1] = caly(y);
    }

    setXY(x: number, y: number): void {
        this.x = x;
        this.y = y;
        this.low[0] = calx(x);
        this.low[1] = caly(y);
    }

    precalc(): void {
        this.low = [calx(this.x), caly(this.y), calw(this.w) / 2, calh(this.h) / 2];
    }

    draw(): void {
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
    }
}

class Power extends Base {
    private step: number;

    constructor() {
        super(0, 0, 1, 1);
        this.step = 0;
    }

    precalc(): void {
        this.low = [calx(this.x), caly(this.y), calw(this.w) / 2 + 400];
    }

    draw(): void {
        let k: number = 1 - (2 * this.step / (181 + this.step)),
            grd: CanvasGradient = cvs.createRadialGradient(this.low[0], this.low[1], this.low[2] * k, this.low[0], this.low[1], (this.low[2] * k - 200 > 0) ? this.low[2] * k - 200 : 0);
        grd.addColorStop(0.000, "#1b1464");
        grd.addColorStop(0.500, "#2d75ff");//"#003ce3"
        grd.addColorStop(1.000, "#1b1464");
        cvs.beginPath();
        cvs.fillStyle = grd;
        cvs.fillRect(0, 0, cnv.width, cnv.height);
        this.step = (this.step + 1) % 181;
    }
}

class Drop {
    private radius: number;
    private drops: [/*x*/number, /*y*/number, /*start*/number][];

    constructor(radius: number) {
        this.radius = radius;
        this.drops = [];
    }

    public startDrop(x: number, y: number): void {
        this.drops.push([x, y, 0]);
        if (this.drops.length > 16) {
            this.drops.shift();
        }
    }

    draw(): void {
        let step: number;
        for (let i: number = 0; i < this.drops.length; i++) {
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
    }
}

class Roll {
    private low: number[];

    constructor() {
        this.low = new Array(31);
    }

    public precalc(): void {
        for (let i: number = 0; i < 31; i++) {
            let val = Math.round(cnv.width / 32 * (i + 1)) + 0.5;
            this.low[i] = val;
        }
    }

    public draw(): void {
        cvs.beginPath();
        cvs.strokeStyle = "rgba(255,255,255,0.1)";
        cvs.lineWidth = 1;
        for (let i: number = 0; i < 31; i++) {
            cvs.moveTo(this.low[i], 0);
            cvs.lineTo(this.low[i], cnv.height);
            cvs.stroke();
        }
    }
}

class Lines {
    private w1: Word;
    private w2: Word;

    constructor(w1: Word, w2: Word) {
        this.w1 = w1;
        this.w2 = w2;
    }

    draw(): void {
        if (this.w1.visible && this.w2.visible) {
            cvs.beginPath();
            cvs.strokeStyle = "rgba(255,255,255," + Math.abs(0.5 - (Math.max(Math.abs(this.w1.getY), Math.abs(this.w2.getY)) / (Note.limit * 2))) + ")";
            cvs.lineWidth = 1;
            cvs.moveTo(this.w1.getLow[0], this.w1.getLow[1]);
            cvs.lineTo(this.w2.getLow[0], this.w2.getLow[1]);
            cvs.stroke();
        }
    }
}

class Note {
    public static limit: number;
    private score: [/*note*/Word, /*position*/number, /*height*/number, /*wait*/number, /*stall*/number, /*phase*/number, /*step*/number][];
    private lines: Lines[];
    private transitionTime: number = 60;
    private offset: number;

    constructor() {
        this.score = new Array(16);
        this.lines = new Array(120);
        for (let i: number = 0; i < 16; i++) {
            this.score[i] = [new Word(0, 0, "", "arame", 20), 0, 0, 0, 0, 0, 0];
            this.score[i][0].setFill("#ffffff");
        }
        for (let i: number = 0, k: number = 1, j: number = 0; i < 120; i++, j++) {
            if (j == k) {
                j = 0;
                k++;
            }
            this.lines[i] = new Lines(this.score[k][0], this.score[j][0]);
        }
    }

    precalc(): void {
        Note.limit = cnv.h / 2 + 50;
        this.offset = cnv.w / 64;
        for (let i: number = 0; i < 16; i++) {
            this.score[i][0].precalc();
            this.score[i][0].setX(this.offset * this.score[i][1]);
        }
    }

    draw(): void {
        for (let i: number = 0; i < 16; i++) {
            let note: Word = this.score[i][0];
            switch (this.score[i][5]) {
                case 0:
                    this.score[i][1] = ((Math.random() * (30 + 30 + 1)) | 0) - 30;//da -30 a 30
                    this.score[i][2] = ((Math.random() * (500 + 500 + 1)) | 0) - 500;//da -500 a 500
                    this.score[i][3] = ((Math.random() * (200 - 50 + 1)) | 0) + 50;//da 50 a 200
                    this.score[i][4] = ((Math.random() * (150 - 50 + 1)) | 0) + 50;//da 50 a 150
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
        for (let i: number = 0; i < 120; i++) {
            this.lines[i].draw();
        }
    }
}

//CALCULATE
function calc(): void {
    cvs.canvas.width = cvs.canvas.clientWidth;
    cvs.canvas.height = cvs.canvas.clientHeight;

    cnv.width = cvs.canvas.width;
    cnv.height = cvs.canvas.height;

    let iw: number = 81, ih: number = 50;
    let w: number = cnv.width, h: number = cnv.height;
    if (iw * h < ih * w) {
        iw = (h * iw) / ih;
        cnv.ox = (w - iw) / 2;
        cnv.oy = 0;
        cnv.uw = iw / 1620;
        cnv.uh = h / 1000;
    } else {
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
    for (let t of pBtnWrappers) {
        t[1] = coords(t[0]).left;
        t[2] = coords(t[0]).top;
    }

    list[0].cals(cnv.w, cnv.h, false);
    list[1].cals(cnv.w, cnv.h, false);

    for (let i: number = list.length - 2; i > -1; i--) {
        list[i].precalc();
    }
}

function calx(x: number): number {
    return (x + 810) * cnv.uw + cnv.ox;
}

function caly(y: number): number {
    return (-y + 500) * cnv.uh + cnv.oy;
}

function calw(w: number): number {
    return w * cnv.uw;
}

function calh(h: number): number {
    return h * cnv.uh;
}

function coords(element: HTMLElement) {
    let box = element.getBoundingClientRect();
    return {
        top: box.top + pageYOffset,
        left: box.left + pageXOffset
    };
}

function refresh(): void {
    requestAnimationFrame(refresh);
    /*!!!!!!!!!!*/
    cvs.clearRect(0, 0, cnv.width, cnv.height)
    for (let i: number = 0, max: number = list.length; i < max; i++) {
        list[i].draw();
    }
}

let EasingFunctions = {
    // no easing, no acceleration
    linear: function (t) {
        return t
    },
    // accelerating from zero velocity
    easeInQuad: function (t) {
        return t * t
    },
    // decelerating to zero velocity
    easeOutQuad: function (t) {
        return t * (2 - t)
    },
    // acceleration until halfway, then deceleration
    easeInOutQuad: function (t) {
        return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t
    },
    // accelerating from zero velocity
    easeInCubic: function (t) {
        return t * t * t
    },
    // decelerating to zero velocity
    easeOutCubic: function (t) {
        return (--t) * t * t + 1
    },
    // acceleration until halfway, then deceleration
    easeInOutCubic: function (t) {
        return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
    },
    // accelerating from zero velocity
    easeInQuart: function (t) {
        return t * t * t * t
    },
    // decelerating to zero velocity
    easeOutQuart: function (t) {
        return 1 - (--t) * t * t * t
    },
    // acceleration until halfway, then deceleration
    easeInOutQuart: function (t) {
        return t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t
    },
    // accelerating from zero velocity
    easeInQuint: function (t) {
        return t * t * t * t * t
    },
    // decelerating to zero velocity
    easeOutQuint: function (t) {
        return 1 + (--t) * t * t * t * t
    },
    // acceleration until halfway, then deceleration
    easeInOutQuint: function (t) {
        return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t
    }
};

//EVENTS
function start(): void {
    cvs = (document.getElementsByClassName("bck")[0] as HTMLCanvasElement).getContext("2d");
    pFontSize = document.documentElement.style;
    pLoading = (document.getElementsByClassName("loading")[0] as HTMLElement);
    pMainWrapper = [(document.getElementsByClassName("mainWrapper")[0] as HTMLElement), 0, 0];
    pMain = (document.getElementsByTagName("main")[0] as HTMLElement);
    pButtons = Array.prototype.slice.call(pMain.getElementsByClassName("rollTab")[0].getElementsByTagName("button"));
    pRoll = Array.prototype.slice.call(pMain.getElementsByClassName("roll")[0].children);
    pLines = Array.prototype.slice.call(pMain.getElementsByClassName("rollTab")[0].getElementsByClassName("bar"));
    pBtnWrappers = [];
    for (let array: HTMLElement[] = Array.prototype.slice.call(pMain.getElementsByClassName("rollTab")[0].getElementsByClassName("btn-wrap")), i: number = array.length - 1; i > -1; i--) {
        pBtnWrappers[i] = [array[i], 0, 0];
    }

    cnv = {} as Tcnv;
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
    for (let t of pButtons) {
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

function move(e: MouseEvent) {
    let v: number = (e.clientX - pMainWrapper[1]) / pMainWrapper[2], x: number, y: number,
        width: number = 30, gradientSize: number = 25, darkColor: string = "rgb(25,25,25)",
        lightColor: string = "rgb(125,125,125)";

    pMainWrapper[0].style.background = "linear-gradient(to bottom right,transparent " +
        (v * (100 + width) - width) + "%,rgba(255,255,255,.75) " +
        (v * (100 + width) - width / 2) + "%,transparent " +
        (v * (100 + width)) + "%)";

    for (let i: number = pBtnWrappers.length - 1; i > -1; i--) {
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

function click(e: MouseEvent): void {
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

function rollTab(e: MouseEvent, init: boolean = false) {
    let source: string, i: number, y1: number, y2: number, y3: number;
    if (init) {
        source = "lead"
    }
    else {
        source = this.classList[0];
    }
    for (let t of pButtons) {
        t.removeAttribute("style");
    }
    for (let t of pRoll) {
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

function loadingDone(e: TransitionEvent): void {
    if (e.propertyName == "opacity") {
        pLoading.style.animationPlayState = "paused";
        pLoading.style.display = "none";
        pLoading.removeEventListener("transitioned", loadingDone);
    }
}
