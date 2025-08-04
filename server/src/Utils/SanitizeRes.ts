export const cleanJsonString = (responseText: string) => {
  return responseText
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim();
}