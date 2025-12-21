import { isValidObjectId } from "mongoose";
const mongoIdValidate = (id) => {
    return id && typeof id === 'string' && isValidObjectId(id);
};
export default mongoIdValidate;
//# sourceMappingURL=mongoIdValidate.js.map