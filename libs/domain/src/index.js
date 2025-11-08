"use strict";
/**
 * @pet/domain - Business domain library
 * Shared types, validation, and business logic
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.z = void 0;
const tslib_1 = require("tslib");
// Builder domain
tslib_1.__exportStar(require("./lib/builder"), exports);
// User domain
tslib_1.__exportStar(require("./lib/user/types"), exports);
// Order domain
tslib_1.__exportStar(require("./lib/order/types"), exports);
// Pet domain
tslib_1.__exportStar(require("./lib/pet"), exports);
// Re-export commonly used utilities
var zod_1 = require("zod");
Object.defineProperty(exports, "z", { enumerable: true, get: function () { return zod_1.z; } });
// Utest domain
tslib_1.__exportStar(require("./lib/test"), exports);
//# sourceMappingURL=index.js.map