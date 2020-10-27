"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var excel_export_1 = __importDefault(require("excel-export"));
var query_1 = __importDefault(require("../models/query"));
var dayjs_1 = __importDefault(require("dayjs"));
var router = express_1.default.Router();
var urlencodedParser = body_parser_1.default.urlencoded({ extended: false });
function string10to62(number) {
    var chars = '0123456789abcdefghigklmnopqrstuvwxyzABCDEFGHIGKLMNOPQRSTUVWXYZ'.split('');
    var radix = chars.length;
    var qutient = +number;
    var arr = [];
    do {
        var mod = qutient % radix;
        qutient = (qutient - mod) / radix;
        arr.unshift(chars[mod]);
    } while (qutient);
    return arr.join('');
}
function string62to10(numberCode) {
    var chars = '0123456789abcdefghigklmnopqrstuvwxyzABCDEFGHIGKLMNOPQRSTUVWXYZ';
    var radix = chars.length;
    numberCode = String(numberCode);
    var len = numberCode.length;
    var i = 0;
    var originNumber = 0;
    while (i < len) {
        originNumber += Math.pow(radix, i++) * chars.indexOf(numberCode.charAt(len - i));
    }
    return originNumber;
}
function randomWord(randomFlag, min, max, ruledOutStr) {
    var str = '';
    var range = min;
    var pos = 0;
    var arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    if (ruledOutStr) {
        ruledOutStr.forEach(function (item) {
            arr = arr.join('').split(item).join('').split('');
        });
    }
    // 随机产生
    if (randomFlag) {
        range = Math.round(Math.random() * (max - min)) + min;
    }
    for (var i = 0; i < range; i++) {
        pos = Math.round(Math.random() * (arr.length - 1));
        str += arr[pos];
    }
    return str;
}
function EncodeStr(number) {
    var randomInsertStr = 'a';
    var chars = '0123456789bcdefghigklmnopqrstuvwxyzABCDEFGHIGKLMNOPQRSTUVWXYZ'.split('');
    var radix = chars.length;
    var qutient = +number;
    var arr = [];
    do {
        var mod = qutient % radix;
        qutient = (qutient - mod) / radix;
        arr.unshift(chars[mod]);
    } while (qutient);
    var codeStr = arr.join('');
    codeStr = codeStr.length < 6 ? (codeStr + randomInsertStr + randomWord(false, 5 - codeStr.length, 0, [randomInsertStr])) : codeStr;
    return codeStr;
}
var queryAllSQL = "SELECT employee.*, level.level, department.department\n    FROM employee, level, department\n    WHERE\n        employee.levelId = level.id AND\n        employee.departmentId = department.id";
router.get('/getEmployee', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, name, departmentId, conditions, sql, result, e_1;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = req.query, _b = _a.name, name = _b === void 0 ? '' : _b, departmentId = _a.departmentId;
                conditions = "AND employee.name LIKE '%" + name + "%'";
                if (departmentId) {
                    conditions = conditions + (" AND employee.departmentId=" + departmentId);
                }
                sql = queryAllSQL + " " + conditions + " ORDER BY employee.id DESC";
                _c.label = 1;
            case 1:
                _c.trys.push([1, 3, , 4]);
                return [4 /*yield*/, query_1.default(sql)];
            case 2:
                result = _c.sent();
                result.forEach(function (i) {
                    i.key = i.id;
                });
                res.json({
                    flag: 0,
                    data: result
                });
                return [3 /*break*/, 4];
            case 3:
                e_1 = _c.sent();
                res.json({
                    flag: 1,
                    msg: e_1.toString()
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.post('/create', urlencodedParser, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var host, _a, url, _b, type, insertTime, sql, id, keyword, updateSql, result, e_2, e_3;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                host = req.headers.host;
                console.log('host', req);
                _a = req.body, url = _a.url, _b = _a.type, type = _b === void 0 ? 'system' : _b;
                console.log('url', url);
                insertTime = dayjs_1.default().format('YYYY-MM-DD HH:mm:ss');
                sql = "INSERT INTO links (url, type, insert_at, update_at)\n    VALUES ('" + url + "', '" + type + "', '" + insertTime + "', '" + insertTime + "')";
                _c.label = 1;
            case 1:
                _c.trys.push([1, 7, , 8]);
                return [4 /*yield*/, query_1.default(sql)];
            case 2:
                id = (_c.sent()).insertId;
                console.log('insertId', id);
                keyword = EncodeStr(id);
                console.log('keyWord', keyword);
                updateSql = "UPDATE links\n      SET\n          keyword='" + keyword + "'\n      WHERE\n          id=" + id;
                _c.label = 3;
            case 3:
                _c.trys.push([3, 5, , 6]);
                return [4 /*yield*/, query_1.default(updateSql)];
            case 4:
                result = _c.sent();
                res.json({
                    flag: 0,
                    data: host + '/' + keyword
                });
                return [3 /*break*/, 6];
            case 5:
                e_2 = _c.sent();
                res.json({
                    flag: 1,
                    msg: e_2.toString()
                });
                return [3 /*break*/, 6];
            case 6: return [3 /*break*/, 8];
            case 7:
                e_3 = _c.sent();
                res.json({
                    flag: 1,
                    msg: e_3.toString()
                });
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); });
router.post('/deleteEmployee', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, sql, result, e_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.body.id;
                sql = "DELETE FROM employee WHERE id=" + id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, query_1.default(sql)];
            case 2:
                result = _a.sent();
                res.json({
                    flag: 0
                });
                return [3 /*break*/, 4];
            case 3:
                e_4 = _a.sent();
                res.json({
                    flag: 1,
                    msg: e_4.toString()
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.post('/updateEmployee', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, id, name, departmentId, hiredate, levelId, sql, result, e_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, id = _a.id, name = _a.name, departmentId = _a.departmentId, hiredate = _a.hiredate, levelId = _a.levelId;
                sql = "UPDATE employee\n        SET\n            name='" + name + "',\n            departmentId=" + departmentId + ",\n            hiredate='" + hiredate + "',\n            levelId=" + levelId + "\n        WHERE\n            id=" + id;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, query_1.default(sql)];
            case 2:
                result = _b.sent();
                res.json({
                    flag: 0
                });
                return [3 /*break*/, 4];
            case 3:
                e_5 = _b.sent();
                res.json({
                    flag: 1,
                    msg: e_5.toString()
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
var conf = {
    cols: [
        { caption: '员工ID', type: 'number' },
        { caption: '姓名', type: 'string' },
        { caption: '部门', type: 'string' },
        { caption: '入职时间', type: 'string' },
        { caption: '职级', type: 'string' }
    ],
    rows: []
};
router.get('/downloadEmployee', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result, excel, e_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, query_1.default(queryAllSQL)];
            case 1:
                result = _a.sent();
                conf.rows = result.map(function (i) {
                    return [i.id, i.name, i.department, i.hiredate, i.level];
                });
                excel = excel_export_1.default.execute(conf);
                res.setHeader('Content-Type', 'application/vnd.openxmlformats');
                res.setHeader('Content-Disposition', 'attachment; filename=Employee.xlsx');
                res.end(excel, 'binary');
                return [3 /*break*/, 3];
            case 2:
                e_6 = _a.sent();
                res.send(e_6.toString());
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
