import UserModel from "../models/user.schema.js";
export async function GET_USER_COUNT_SERVICE() {
    const userCount = await UserModel.countDocuments({});
    return userCount;
}
//# sourceMappingURL=user.service.js.map