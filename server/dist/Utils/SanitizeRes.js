export const cleanJsonString = (responseText) => {
    return responseText
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();
};
//# sourceMappingURL=SanitizeRes.js.map