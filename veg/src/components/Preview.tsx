import { useRef } from "react"
import type { ICode } from "../Interfaces"
import { motion } from "motion/react"
import axios from "axios"
import { Loader } from "rsuite"

export const Preview = ({ Code, handleHost, loading } : { Code: ICode, handleHost: () => void, loading: boolean }) => {

  const iFrame = useRef<HTMLIFrameElement>(null)

  const handleFullScreen = () => {
    if (iFrame.current) {
      iFrame.current.requestFullscreen()
    }
  }

  const handleDownload = async () => {
    const res = await axios.post(`${import.meta.env.VITE_API}/downloadCode`, {
      Code
    }, {
      responseType: "blob"
    })

    if (res) {
      const blob = new Blob([res.data], { type: "application/zip" })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "code.zip");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    }
  }

  const previewCode = `
    <html>
      <head>
        <style>
          ${Code.CSS}  
        </style>
        </head>
        <body>
          ${Code.HTML}
          <script>
            ${Code.JavaScript}
          </script>
      </body>
    </html>
  `
  return (
    <div className="relative p-6 min-h-[82vh] rounded-lg h-full flex grow justify-center align-middle border border-neutral-700 m-6">
      {!loading ? (
        <>
        <div className="flex absolute right-8 top-8 gap-2">
        <motion.div whileHover={{ scale: 1.10 }} onClick={handleHost} className="bg-neutral-800/70 p-2 my-auto rounded shadow-2xl cursor-pointer">
          Host
        </motion.div>
        <motion.div whileHover={{ scale: 1.10 }} onClick={handleDownload} className="bg-neutral-800/70 p-2 my-auto rounded shadow-2xl cursor-pointer">
          Download
        </motion.div>
        <motion.div whileHover={{ scale: 1.10 }} onClick={handleFullScreen} className="bg-neutral-800/70 p-2 rounded shadow-2xl cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 3H5a2 2 0 00-2 2v3m0 8v3a2 2 0 002 2h3m8-18h3a2 2 0 012 2v3m0 8v3a2 2 0 01-2 2h-3" />
          </svg>
        </motion.div>
      </div>
      {Code.HTML == "HTML" ? <div className="font-bold text-lg my-auto">Code preview will appear here</div> : <iframe ref={iFrame} allowFullScreen className="min-h-[74vh] h-full w-full flex-1" srcDoc={previewCode} width={"100%"} height={"100%"} sandbox="allow-scripts"/>}</>) : <Loader className="my-auto" size="lg"/>}
    </div>
  )
}
