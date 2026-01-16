import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useNavigate } from 'react-router-dom'
import { Spinner } from './ui/spinner'

const API = import.meta.env.VITE_API_BASE_URL

const messages = [
    "Generating quiz questions...",
    "Getting quiz ready...",
    "Almost Done"
]

const InterviewQuizForm = () => {
    const [topic, setTopic] = useState("")
    const [noOfQuestions, setNoOfQuestions] = useState(10)
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [msgIndex, setMsgIndex] = useState(0)

    const navigate = useNavigate()
    const handleClick = async () => {
        setIsSubmitting(true)
        const resp = await axios.post(`${API}/quiz/add`, { topic: topic, noOfQuestions: noOfQuestions, userId: localStorage.getItem("userUid") });
        console.log(resp);
        if (resp.data.success) {
            navigate('/quiz', { state: { quizId: resp.data.data._id } });
        }
        else{
            return (<div className='flex h-screen text-center'>Something went wrong from google gemini's side</div>)
        }
    }
    useEffect(() => {
        if (!isSubmitting) return
        if (msgIndex >= messages.length - 1) return

        const timer = setTimeout(() => {
            setMsgIndex(i => i + 1)
        }, 3000)

        return () => clearTimeout(timer)
    }, [isSubmitting, msgIndex])

    if (isSubmitting) {
        return (
            <div className="flex flex-col justify-center items-center text-red-500 h-screen gap-4">
                <Spinner className="h-10 w-10" />
                <p className="text-lg font-medium animate-pulse">
                    {messages[msgIndex]}
                </p>
            </div>
        )
    }
    return (
        <div className="bg-white  h-full px-6 py-10 pt-2 overflow-hidden">
            <Card className="w-full max-w-screen h-full border-zinc-300">
                <CardHeader className="pb-8">
                    <CardTitle className="text-2xl text-red-500 font-bold">
                        Quiz Setup
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-10">
                    <div className="flex flex-col gap-10">
                        <div className="space-y-3 w-full">
                            <Label className="text-black text-base overflow-clip">
                                Quiz Topic
                            </Label>
                            <Input
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="eg: Java Programing, Python Programing, etc"
                                className="h-14 text-base border-zinc-300"
                            />
                        </div>

                        <div className="space-y-3">
                            <Label className="text-black text-base">
                                No of Questions
                            </Label>
                            <Input
                                onChange={(e) => setNoOfQuestions(e.target.value)}
                                placeholder="default: 10"
                                className="h-14 text-base border-zinc-300"
                            />
                        </div>
                    </div>

                    <Button
                        onClick={handleClick}
                        disabled={isSubmitting}
                        className={`w-full h-14 text-base bg-red-500 hover:bg-red-600 ${isSubmitting ? "opacity-60 cursor-not-allowed" : ""}`}
                    >
                        {isSubmitting ? "Generating questions..." : "Start Quiz"}
                    </Button>

                </CardContent>
            </Card>
        </div>
    )
}

export default InterviewQuizForm