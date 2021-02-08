"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var OptInDTOType;
(function (OptInDTOType) {
    OptInDTOType[OptInDTOType["SIMPLE_DTO_TYPE"] = 1] = "SIMPLE_DTO_TYPE";
    OptInDTOType[OptInDTOType["SIGNAL_DTO_TYPE"] = 2] = "SIGNAL_DTO_TYPE";
    OptInDTOType[OptInDTOType["CONVERT_DTO_TYPE"] = 3] = "CONVERT_DTO_TYPE";
    OptInDTOType[OptInDTOType["COSIGN_DTO_TYPE"] = 4] = "COSIGN_DTO_TYPE";
    OptInDTOType[OptInDTOType["NAMESPACE_DTO_TYPE"] = 5] = "NAMESPACE_DTO_TYPE";
    OptInDTOType[OptInDTOType["VRF_DTO_TYPE"] = 6] = "VRF_DTO_TYPE";
})(OptInDTOType = exports.OptInDTOType || (exports.OptInDTOType = {}));
class OptInDTO {
    constructor(type) {
        this.type = type;
    }
    toMessage() {
        return JSON.stringify(this);
    }
}
exports.OptInDTO = OptInDTO;
