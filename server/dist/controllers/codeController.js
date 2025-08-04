import fs from "fs";
import path from "path";
import os from "os";
import archiver from "archiver";
import { ai } from "../config/Gemini.js";
import { cleanJsonString } from "../Utils/SanitizeRes.js";
export const generateCode = async (req, res) => {
    try {
        const { prompt } = req.body;
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction: "You are a code generator who generates code for the working responsive website according to given prompt. You generate code ONLY in HTML, CSS, and JavaScript. Javascript should work with dom. After generating the code, you will write the code in JSON format with keys as HTML, CSS and, JavaScript that should be able to parse using JSON.parse() function without any markdown like ```JSON .....``` or anything like that."
            }
        });
        const clearRes = cleanJsonString(response.text);
        const { HTML, CSS, JavaScript } = JSON.parse(clearRes);
        res.json({ HTML, CSS, JavaScript });
    }
    catch {
        res.json({ message: "Please enter a valid prompt" });
    }
};
export const downloadCode = async (req, res) => {
    try {
        const { HTML, CSS, JavaScript } = req.body.Code;
        // Create a temporary directory
        const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "code-download-"));
        // Write HTML file, linking CSS and JS
        const htmlContent = `
            <!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <title>Generated Code</title>
                    <link rel="stylesheet" href="style.css">
                </head>
                <body>
                    ${HTML}
                    <script src="script.js"></script>
                </body>
            </html>
            `;
        fs.writeFileSync(path.join(tempDir, "index.html"), htmlContent, "utf8");
        fs.writeFileSync(path.join(tempDir, "style.css"), CSS, "utf8");
        fs.writeFileSync(path.join(tempDir, "script.js"), JavaScript, "utf8");
        // Create a zip archive
        const zipPath = path.join(tempDir, "code.zip");
        const output = fs.createWriteStream(zipPath);
        const archive = archiver("zip", { zlib: { level: 9 } });
        output.on("close", () => {
            res.setHeader("Content-Type", "application/zip");
            res.setHeader("Content-Disposition", "attachment; filename=code.zip");
            res.download(zipPath, (err) => {
                if (err) {
                    console.error("Error sending file:", err);
                    // Optionally, return res.status(500).send("Failed to send file.");
                }
            });
            res.on("finish", () => {
                // Clean up temp files after sending
                try {
                    fs.rmSync(tempDir, { recursive: true, force: true });
                }
                catch (e) {
                    console.error("Failed to delete tempDir:", e);
                }
            });
        });
        archive.on("error", (err) => {
            // Only attempt to send a response if headers haven't been sent yet
            if (!res.headersSent) {
                // Attempt to clean up temp files before sending error response
                try {
                    fs.rmSync(tempDir, { recursive: true, force: true });
                }
                catch (cleanupErr) {
                    // Log cleanup error, but do not throw
                    console.error("Cleanup error after zip failure:", cleanupErr);
                }
                res.status(500).json({ error: "Failed to create zip file." });
            }
        });
        archive.pipe(output);
        archive.file(path.join(tempDir, "index.html"), { name: "index.html" });
        archive.file(path.join(tempDir, "style.css"), { name: "style.css" });
        archive.file(path.join(tempDir, "script.js"), { name: "script.js" });
        await archive.finalize();
    }
    catch (error) {
        res.status(500).json({ error: "Failed to process download." });
    }
};
//# sourceMappingURL=codeController.js.map