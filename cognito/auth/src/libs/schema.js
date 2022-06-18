const validatePayload = (payload, schema) => {
    try {
        const result = schema.validate(payload);
        if (result.error) {
            const message = Error(result.error).toString();
            throw { code: ERROR_CODE_BAD_REQUEST, message };
        }
        return result.value;
    } catch (err) {
        console.log('[schema.validatePayload] err: ', err);
        throw err;
    }
};

module.exports = validatePayload;
