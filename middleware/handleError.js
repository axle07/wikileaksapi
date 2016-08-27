// middleware/handleError.js

function handleError(res, reason, message, code) {
    console.log("Error: " + reason);
    res.status(code || 500).json({"error": message});
}

module.exports = handleError;
