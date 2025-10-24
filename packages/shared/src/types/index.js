"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BreedingStatus = exports.LitterStatus = exports.GeneticTestResult = exports.GeneticTestType = exports.HealthRecordType = exports.UserRoleType = exports.Gender = void 0;
// Enums
var Gender;
(function (Gender) {
    Gender["R"] = "R";
    Gender["H"] = "H";
})(Gender || (exports.Gender = Gender = {}));
var UserRoleType;
(function (UserRoleType) {
    UserRoleType["BREEDER"] = "BREEDER";
    UserRoleType["STUD_OWNER"] = "STUD_OWNER";
    UserRoleType["ADMIN"] = "ADMIN";
    UserRoleType["MEMBER"] = "MEMBER";
    UserRoleType["EDITOR"] = "EDITOR";
})(UserRoleType || (exports.UserRoleType = UserRoleType = {}));
var HealthRecordType;
(function (HealthRecordType) {
    HealthRecordType["VACCINATION"] = "VACCINATION";
    HealthRecordType["HEALTH_CERTIFICATE"] = "HEALTH_CERTIFICATE";
    HealthRecordType["BREEDING_CERTIFICATE"] = "BREEDING_CERTIFICATE";
    HealthRecordType["OTHER"] = "OTHER";
})(HealthRecordType || (exports.HealthRecordType = HealthRecordType = {}));
var GeneticTestType;
(function (GeneticTestType) {
    GeneticTestType["HD"] = "HD";
    GeneticTestType["ED"] = "ED";
    GeneticTestType["PRA"] = "PRA";
    GeneticTestType["DM"] = "DM";
    GeneticTestType["VWD"] = "VWD";
    GeneticTestType["OTHER"] = "OTHER";
})(GeneticTestType || (exports.GeneticTestType = GeneticTestType = {}));
var GeneticTestResult;
(function (GeneticTestResult) {
    GeneticTestResult["NORMAL"] = "NORMAL";
    GeneticTestResult["CARRIER"] = "CARRIER";
    GeneticTestResult["AFFECTED"] = "AFFECTED";
    GeneticTestResult["UNKNOWN"] = "UNKNOWN";
})(GeneticTestResult || (exports.GeneticTestResult = GeneticTestResult = {}));
var LitterStatus;
(function (LitterStatus) {
    LitterStatus["PLANNED"] = "PLANNED";
    LitterStatus["IN_PROGRESS"] = "IN_PROGRESS";
    LitterStatus["BORN"] = "BORN";
    LitterStatus["AVAILABLE"] = "AVAILABLE";
    LitterStatus["RESERVED"] = "RESERVED";
    LitterStatus["SOLD"] = "SOLD";
    LitterStatus["CANCELLED"] = "CANCELLED";
})(LitterStatus || (exports.LitterStatus = LitterStatus = {}));
var BreedingStatus;
(function (BreedingStatus) {
    BreedingStatus["VERSTORBEN"] = "VERSTORBEN";
    BreedingStatus["NICHT_VERFUEGBAR"] = "NICHT_VERFUEGBAR";
    BreedingStatus["WURF_GEPLANT"] = "WURF_GEPLANT";
    BreedingStatus["WURF_VORHANDEN"] = "WURF_VORHANDEN";
})(BreedingStatus || (exports.BreedingStatus = BreedingStatus = {}));
//# sourceMappingURL=index.js.map