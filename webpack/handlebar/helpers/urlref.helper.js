module.exports = function (context, options) {
    if (context.includes('?')) {
        return context + '&ref=AssistantApps';
    }
    return context + '?ref=AssistantApps';
};