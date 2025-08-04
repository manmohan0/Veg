import axios from 'axios'
import { useState } from 'react'
import { TextArea } from './components/TextArea'
import { Files } from './components/Files'
import { Preview } from './components/Preview'
import type { ICode } from './Interfaces'
import { motion } from 'motion/react'
import toast, { Toaster } from 'react-hot-toast'

export const App = () => {
  
  const [prompt, setPrompt] = useState<string>('')
  const [isValid, setIsValid] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [hosted, setHosted] = useState<boolean>(false)
  const [hostUrl, setHostUrl] = useState<string>("")

  const [code, setCode] = useState<ICode>({
    HTML: "HTML",
    CSS: "CSS",
    JavaScript: "JavaScript"
  })

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setIsValid(e.target.value.length > 0)
    setPrompt(e.target.value)
  }
  
  const handleHost = async () => {
    const res = await axios.post(`${import.meta.env.VITE_API}/deploy`, {
      code
    })

    if (res) {
      setHosted(true)
      setHostUrl(res.data.deployedUrl.url)
    }
  }

  const onSubmit = async () => {  
      if (!isValid) return;

      setLoading(true)

      const res = await axios.post(`${import.meta.env.VITE_API}/generateCode`, {
        prompt
      })
      
      console.log(res.data)

      if (res && res.data.message) {
        toast.error("Please enter a valid prompt");
        setLoading(false)
        return;
      }
      
      if (res) {
        setCode({ HTML: res.data.HTML, CSS: res.data.CSS, JavaScript: res.data.JavaScript })
        setLoading(false)
      }
  }
  
  return (
    <>
    <Toaster/>
    <div className='flex flex-col items-center justify-center h-screen w-screen mx-auto'>
      {hosted && hostUrl && <motion.div initial={{ y: -10, opacity: 0 }} transition={{ duration: 0.5 }} animate={{ y: 0, opacity: 1 }} className='font-bold text-black w-auto p-2 bg-green-400 mt-2 rounded-lg'>
        URL: <a href={hostUrl} target="_blank" rel="noopener noreferrer">{hostUrl}</a>
      </motion.div>}
      <div className='flex items-center justify-center h-full w-full'>
        <motion.div initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.7 }} className='basis-1/2'>
          <Preview loading={loading} Code={code} handleHost={handleHost} />
        </motion.div>
        <div className='flex flex-1 basis-1/2 flex-col items-center align-middle justify-center min-w-[400px] space-y-6'>
          <motion.div initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7 }} className='w-full'>
            <TextArea value={prompt} isValid={isValid} handleChange={handleChange} loading={loading} onSubmit={onSubmit} />
          </motion.div>
          <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7 }} className='w-full'>
            <Files setCode={setCode} loading={loading} Code={[code]}/>
          </motion.div>
        </div>
      </div>
    </div>
    </>
  )
}

export default App