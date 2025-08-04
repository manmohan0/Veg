import axios from "axios";
import crypto from "crypto"
import type { Request, Response } from "express";

export const deploy = async (req: Request, res: Response) => {
    let { HTML, CSS, JavaScript } = req.body.code
    HTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <link rel="stylesheet" href="style.css"/>
        </head>
        <body>
          ${HTML}
          <script src="script.js"></script>
      </body>
    </html>
    `

    const files = {
        "index.html": HTML,
        "style.css": CSS,
        "script.js": JavaScript
    }

    const shaMap: Record<string, string> = {}
    const fileContentMap: Record<string, string> = {};

    for (const path of Object.keys(files) as Array<keyof typeof files>) {
        const content = files[path];
        const hash = crypto.createHash('sha1').update(content).digest("hex")
        shaMap[path] = hash
        fileContentMap[hash] = content
    }

    const resp = await axios.post(`${process.env.NETLIFY_URL}/sites`, {
        files: shaMap
    }, {
        headers: {
            Authorization: `Bearer ${process.env.NETLIFY_API}`
        }
    })

    const { required, deploy_id } = resp.data

    for (const hash of required) {
        const filePath = Object.keys(shaMap).find(key => shaMap[key] === hash);
        if (!filePath) continue;

        const content = fileContentMap[hash];
        if (!content) continue;

        const url = `${process.env.NETLIFY_URL}/deploys/${deploy_id}/files/${filePath}`;
        await axios.put(url, content, {
            headers: {
                Authorization: `Bearer ${process.env.NETLIFY_API}`,
                "Content-Type": "application/octet-stream"
            }
        })
    }

    res.json({ deployedUrl: resp.data })
}