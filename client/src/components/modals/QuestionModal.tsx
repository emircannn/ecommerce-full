import useQuestionModal from "@/hooks/QuestionModalStore"
import Modal from "./Modal"
import { useEffect, useState } from "react"
import { Textarea } from "../ui/textarea"

const QuestionModal = () => {

    const questionModal = useQuestionModal()
    const [isLoading, setIsLoading] = useState(false)
    const [text, setText] = useState('')

    useEffect(() => {
        setIsLoading(false)
    }, [])
    

    const body = (
        <div className="space-y-4 876:space-y-6">
            <Textarea
                placeholder="Напиши что-нибудь..."
                disabled={isLoading}
                value={text}
                onChange={(e) => setText(e.target.value)}
                maxLength={355}
            />

            <div className="flex items-center gap-3">
                <input 
                type="checkbox"
                className="w-5 shrink-0 aspect-square outline-none accent-scrx focus:border-pr"/>
                <p className="text-xs 876:text-sm font-semibold text-third-dark">
                Этот шаг можно увидеть в разделе вопросов и ответов.
                </p>
            </div>
        </div>
    )

  return (
    <Modal
    title="Задайте вопрос по этому товару"
    isOpen={questionModal.isOpen}
    onClose={questionModal.onClose}
    disabled={isLoading}
    actionLabel="Задавать вопрос"
    onSubmit={questionModal.onOpen}
    body={body}
    />
  )
}

export default QuestionModal