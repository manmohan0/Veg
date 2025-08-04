export interface ITextArea { 
    value: string, 
    isValid: boolean, 
    handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void, 
    loading: boolean, 
    onSubmit: () => void 
}

export interface ICode {
    HTML: string,
    CSS: string,
    JavaScript: string
}