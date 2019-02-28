let HelperProto = function () {
};

HelperProto.prototype.type_check = function (data, conf) {
    let Common = this;
    for (let key of Object.keys(conf)) {
        switch (key) {
            case 'type':
            case 'value':
            case 'enum':
                let newConf = {};
                newConf[key] = conf[key];
                if (!Common.type_check_v2(data, newConf)) return false;
                break;
            case 'properties':
                for (let prop of Object.keys(conf[key])) {
                    if (data[prop] === undefined) return false;
                    if (!Common.type_check(data[prop], conf[key][prop])) return false;
                }
                break;
        }
    }

    return true;
};

HelperProto.prototype.type_check_v2 = function (data, conf) {
    let Common = this;
    for (let key of Object.keys(conf)) {
        switch (key) {
            case 'type':
                if (!Common.type_check_v1(data, conf[key])) return false;
                break;
            case 'value':
                if (JSON.stringify(data) !== JSON.stringify(conf[key])) return false;
                break;
            case 'enum':
                let valid = false;
                for (let value of conf[key]) {
                    valid = Common.type_check_v2(data, {value});
                    if (valid) break;
                }
                if (!valid) return false;
        }
    }

    return true;
};

HelperProto.prototype.type_check_v1 = function type_check_v1(data, type) {
    switch (typeof data) {
        case "number":
        case "string":
        case "boolean":
        case "undefined":
        case "function":
            return type === typeof data;
        case "object":
            switch (type) {
                case "null":
                    return data === null;
                case "array":
                    return Array.isArray(data);
                default:
                    return data !== null && !Array.isArray(data);
            }

    }

    return false;
};

HelperProto.prototype.isOdd = function (num) {
    return num % 2;
};

let Helper = new HelperProto();

export default Helper;