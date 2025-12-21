const ResponseHandler = (res, status, success, data, response) => {
    return res.status(status).json({ success: success, data: data, response: response });
};
export default ResponseHandler;
//# sourceMappingURL=responseHandler.js.map