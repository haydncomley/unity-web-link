var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { BehaviorSubject, filter, firstValueFrom, map, ReplaySubject, Subject } from "rxjs";
var UnityWebLink = /** @class */ (function () {
    function UnityWebLink(options) {
        // Observables
        this.$ready = new ReplaySubject(1);
        this.$progress = new BehaviorSubject(0);
        this.$event = new Subject();
        this.options = options;
        this.init();
    }
    UnityWebLink.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.initUnity();
                return [2 /*return*/];
            });
        });
    };
    UnityWebLink.prototype.initUnity = function () {
        return __awaiter(this, void 0, void 0, function () {
            var loaderExists, script;
            var _this = this;
            return __generator(this, function (_a) {
                this.listenForEvents();
                loaderExists = document.querySelector("script[src=\"".concat(this.options.loaderUrl, "\"]"));
                if (loaderExists) {
                    this.loadCanvas();
                    return [2 /*return*/];
                }
                script = document.createElement('script');
                script.src = this.options.loaderUrl;
                document.body.appendChild(script);
                script.onload = function () { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        this.loadCanvas();
                        return [2 /*return*/];
                    });
                }); };
                return [2 /*return*/];
            });
        });
    };
    UnityWebLink.prototype.loadCanvas = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var _b, _c;
            var _this = this;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (this.options.canvasId)
                            this.canvas = document.querySelector("#".concat(this.options.canvasId));
                        this.canvas = this.canvas || document.createElement('canvas');
                        this.canvas.id = ((_a = this.options) === null || _a === void 0 ? void 0 : _a.canvasId) || "unity-web-link-".concat(Math.floor(Math.random() * 100000));
                        if (this.options.startInvisible)
                            this.canvas.style.display = 'none';
                        document.body.appendChild(this.canvas);
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 3, , 4]);
                        _b = this;
                        return [4 /*yield*/, createUnityInstance(this.canvas, this.options, function (progress) {
                                _this.$progress.next(progress);
                            })];
                    case 2:
                        _b.unity = _d.sent();
                        this.$ready.next(true);
                        return [3 /*break*/, 4];
                    case 3:
                        _c = _d.sent();
                        this.$ready.next(false);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    UnityWebLink.prototype.listenForEvents = function () {
        var _this = this;
        document.addEventListener('onUnityMessage', function (event) {
            _this.$event.next({
                action: event.detail.action,
                data: event.detail.data
            });
        });
    };
    UnityWebLink.prototype.onReady = function () {
        return firstValueFrom(this.$ready.pipe(filter(function (x) { return x; })));
    };
    UnityWebLink.prototype.onError = function () {
        return firstValueFrom(this.$ready.pipe(filter(function (x) { return !x; })));
    };
    UnityWebLink.prototype.onProgress = function () {
        return this.$progress.asObservable();
    };
    UnityWebLink.prototype.Quit = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.unity.Quit()];
                    case 1:
                        _a.sent();
                        this.canvas.remove();
                        return [2 /*return*/];
                }
            });
        });
    };
    UnityWebLink.prototype.SetFullscreen = function (fullscreen) {
        this.unity.SetFullscreen(fullscreen);
    };
    UnityWebLink.prototype.Send = function (action, data) {
        if (!this.unity)
            return;
        this.unity.SendMessage('UnityJS', 'SendToUnity', JSON.stringify({
            action: action,
            data: JSON.stringify(data)
        }));
    };
    UnityWebLink.prototype.Listen = function (action) {
        return this.$event.pipe(filter(function (x) {
            return x.action === action;
        }), map(function (x) { return x; }));
    };
    UnityWebLink.prototype.getCanvas = function () {
        return this.canvas;
    };
    UnityWebLink.prototype.SetVisible = function (visible) {
        this.canvas.style.display = visible ? '' : 'none';
    };
    return UnityWebLink;
}());
export { UnityWebLink };
//# sourceMappingURL=index.js.map