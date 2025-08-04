import { motion } from "framer-motion";
import { useState, type Dispatch, type SetStateAction } from "react";
import Editor from "react-monaco-editor";
import type { ICode } from "../Interfaces";
import { Loader } from "rsuite";

export const Files = ({ Code, loading, setCode } : { Code: ICode[], loading: boolean, setCode: Dispatch<SetStateAction<ICode>> }) => {

  const [fileName, setFileName] = useState<string>("HTML");

  const handleFile = (e: React.MouseEvent<HTMLDivElement>) => {
    setFileName((e.target as HTMLDivElement).innerText);
  };

  const handleChange = (value: string) => {
    setCode(prev => ({...prev, [fileName]: value || "", }))
  }

  return (
    <div className="flex h-[50vh] w-[50vw] flex-col items-center justify-center rounded-lg border border-neutral-700 p-6">
      <motion.div
        className="relative flex w-full items-start justify-between"
      >
        {Code.map((file) =>
          Object.keys(file).map((key, index) => (
            <motion.div
                  whileHover={{ scale: 1.1 }}
                  initial={false}
            onClick={handleFile}
            key={index}
            className="relative flex z-10 w-20 cursor-pointer items-center justify-center text-center  px-2 mx-2 pb-2 mb-2"
            >
              {fileName === key && (
                <motion.div
                  layoutId="code"
                  className="absolute w-20 -z-10 h-8 overflow-clip rounded-md bg-neutral-700"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <span className={`z-10 ${fileName === key ? "text-white" : ""} text-center`}>{key}</span>
            </motion.div>
          )),
        )}
      </motion.div>
      <div className="flex h-full w-full flex-1 flex-col items-center">
        {!loading ? <Editor
          height={"100%"}
          width={"100%"}
          value={Code[0][fileName as keyof typeof Code[0]]}
          theme={"vs-dark"}
          language="HTML"
          onChange={handleChange}
          options={{ minimap: { enabled: false } }}
        /> :
        <div className="flex h-full w-full flex-1 flex-col items-center justify-center">
          <Loader size="md"/>
        </div>}
      </div>
    </div>
  );
};
