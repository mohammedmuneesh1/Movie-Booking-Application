import ErrorHandler from "../utils/errorHandler.js";
const tryCatch = (handler) => {
    return async (req, res, next) => {
        try {
            await handler(req, res, next);
        }
        catch (error) {
            // next(error);
            return ErrorHandler(res, error, handler.name);
        }
    };
};
export default tryCatch;
//# sourceMappingURL=tryCatch.js.map