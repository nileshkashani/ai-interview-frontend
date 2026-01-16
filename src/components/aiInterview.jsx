import { useEffect, useRef, useState } from "react"
import Vapi from "@vapi-ai/web"
import { Button } from "./ui/button"
import axios from "axios"
import { useLocation, useNavigate } from 'react-router-dom'
import { PhoneOff, Mic } from "lucide-react"
import { Spinner } from "./ui/spinner"


const messages = [
    "Generating Results...",
    "Evaluating...",
    "Almost done..."
]
const API = import.meta.env.VITE_API_BASE_URL
const vapi = new Vapi(import.meta.env.VITE_VAPI_PUBLIC_KEY)

export default function AiInterview() {
    const [isCompleted, setIsCompleted] = useState(false);
    const [questions, setQuestions] = useState([])
    const [answers, setAnswers] = useState([])
    const [isActive, setIsActive] = useState(false)
    const { state } = useLocation()
    const [currentAnswer, setCurrentAnswer] = useState("")
    const [interview, setInterview] = useState({});
    const [aiSpeaking, setAiSpeaking] = useState(false)
    const [userSpeaking, setUserSpeaking] = useState(false)
    const [msgIndex, setMsgIndex] = useState(0)


    const navigate = useNavigate()

    const interviewId = state?.interviewId

    useEffect(() => {
        if (!isCompleted) return
        if (msgIndex >= messages.length - 1) return

        const timer = setTimeout(() => {
            setMsgIndex(i => i + 1)
        }, 3000)

        return () => clearTimeout(timer)
    }, [isCompleted, msgIndex])


    useEffect(() => {
        console.log("AI speaking:", aiSpeaking, "User speaking:", userSpeaking)
    }, [aiSpeaking, userSpeaking])
    const hangUpInterview = async () => {
        try {
            setIsCompleted(true)
            setIsActive(false)
            if (currentAnswer.trim()) {
                setAnswers(prev => [...prev, currentAnswer.trim()])
                setCurrentAnswer("")
            }
            const finalAnswers = currentAnswer.trim()
                ? [...answers, currentAnswer.trim()]
                : answers;

            await vapi.stop()
            const updateResp = await axios.put(`${API}/interview/update/${interviewId}`)
            console.log("update: ", updateResp);
            const answerResp = await axios.post(`${API}/answers/add`, { interviewId: interviewId, answers: finalAnswers })
                .then(res => navigate('/postinterview', { state: { interviewId: interviewId } }))
                .catch(r => navigate('/dashboard'));
        }
        catch (e) {
            console.error(e);
        }
    }



    useEffect(() => {

        const handler = (msg) => {
            if (
                msg.type === "transcript" &&
                msg.transcriptType === "final" &&
                msg.role === "user"
            ) {
                console.log(msg.transcript)
                setCurrentAnswer(prev => prev + " " + msg.transcript)
            }

            if (msg.type === "transcript" && msg.role === "user") {
                setUserSpeaking(true)
                setTimeout(() => setUserSpeaking(false), 500)
            }


            if (
                msg.type === "transcript" &&
                msg.transcriptType === "final" &&
                msg.role === "assistant"
            ) {
                const text = msg.transcript?.trim() || ""

                const looksLikeQuestion =
                    text.endsWith("?") ||
                    text.toLowerCase().startsWith("describe") ||
                    text.toLowerCase().startsWith("explain") ||
                    text.toLowerCase().startsWith("how") ||
                    text.toLowerCase().startsWith("what") ||
                    text.toLowerCase().startsWith("when") ||
                    text.toLowerCase().startsWith("why")

                if (looksLikeQuestion && currentAnswer.trim()) {
                    setAnswers(prev => [...prev, currentAnswer.trim()])
                    setCurrentAnswer("")
                }
            }
        }
        const onSpeechStart = () => {
            setAiSpeaking(true)
        }

        const onSpeechEnd = () => {
            setAiSpeaking(false)
        }

        vapi.on("message", handler)
        vapi.on("speech-start", onSpeechStart)
        vapi.on("speech-end", onSpeechEnd)

        return () => {
            vapi.off("message", handler)
            vapi.off("speech-start", onSpeechStart)
            vapi.off("speech-end", onSpeechEnd)
        }

    }, [])

    useEffect(() => {
        const func = async () => {
            const resp = await axios.get(`/${API}/interview/update/${interviewId}`);
            console.log("resp: ", resp);
        }
    }, [])

    const parsedQuestionsRef = useRef([])

    useEffect(() => {
        if (questions.length) {
            parsedQuestionsRef.current = questions.map(q => (q.text))
        }
    }, [questions])  //uncomment to start interview

    useEffect(() => {
        const func = async () => {
            await axios.get(`${API}/questions/${interviewId}`).then(res => {
                setQuestions(res.data.data)
                console.log(res);
            }).catch(e => console.error(e));
        }
        func();
    }, [])

    useEffect(() => {
        async function func() {
            const resp = await axios.get(`${API}/interview/getById/${interviewId}`);
            setInterview(resp.data.data)
        }
        func();
    })

    const startInterview = async () => {
        const assistantOptions = {
            name: "AI Recruiter",
            firstMessage: `Hi ${localStorage.getItem("user") || 'John Doe'}, how are you? Ready for your interview on ${interview.topic || 'for your selected topic'}?`,

            transcriber: {
                provider: "deepgram",
                model: "nova-2",
                language: "en-US",
            },

            voice: {
                provider: "11labs",
                voiceId: "burt",
            },

            model: {
                provider: "openai",
                model: "gpt-4",
                messages: [
                    {
                        role: "system",
                        content: `
You are an AI voice assistant conducting interviews.
Your job is to ask candidates provided interview questions, assess their responses.

Ask one question at a time and wait for the candidate's response before proceeding. Keep the questions clear and concise. Below are the questions which you need to ask one by one to the candidate:
Questions: ${parsedQuestionsRef.current}  

If the candidate struggles, offer hints or rephrase the question without giving away the direct answer. Example:
"Need a hint? Think about how React tracks component updates!"

Provide brief 1-2 lined (30-40 worded), encouraging feedback after each answer. Example:
"Nice! That's a solid answer."
"Hmm, not quite! Want to try again?"

Keep the conversation natural and engaging — use casual phrases like "Alright, next up..." or "Let’s tackle a tricky one!"

After 8-9 questions, wrap up the interview smoothly by summarizing their performance. Example:
"That was great! You handled some tough questions well. Keep sharpening your skills!"

After ending with questions, provide feedback based upon user's answers, communication skills, and completeness of answers also, rate user's overall performance out of 100 and let user know that.

End on a positive note:
"Thankyou so much for appearing for this mock interview, hope you loved this.

Key Guidelines:
• Be friendly, engaging, and witty
• Keep responses short and natural, like a real conversation
• Adapt based on the candidate’s confidence level
• Take questions from interview from provided questions only
• Dont invent your own questions (most imp guideline) again, never ever invent your own questions just choose random question from list of questions provided. location for questions is "Questions: ${parsedQuestionsRef.current}" this.

`,
                    },
                ],
            },
        }
        try {
            await vapi.start(assistantOptions)
            setIsActive(true)
        } catch (e) {
            console.error(e)
        }
    }

    if (isCompleted) {
        return (
            <div className="flex flex-col justify-center items-center text-red-500 h-screen gap-4">
                <Spinner className="h-10 w-10" />
                <p className="text-lg font-medium animate-pulse">
                    {messages[msgIndex]}
                </p>
            </div>
        )
    }

    if (!isActive) {
        return (
            <div className="flex h-screen items-center justify-center bg-zinc-100">
                <Button className="bg-red-500 hover:bg-red-600 text-white px-8 py-6 text-lg" onClick={startInterview}>
                    Start Interview
                </Button>
            </div>
        )
    }

    return (
        <div className="h-screen w-screen bg-zinc-100 flex flex-col">

            <div className="h-screen bg-zinc-100 flex flex-col">
                <div className="flex justify-between items-center px-6 py-4 bg-white border-b">
                    <div className="font-semibold text-zinc-800">AI Interview Session</div>
                </div>

                <div className="flex-1 grid grid-cols-2 gap-6 p-6">
                    <div className="bg-white rounded-xl shadow-sm flex flex-col items-center justify-center gap-4">
                        <div className="relative w-20 h-20 rounded-full flex items-center justify-center text-xl font-semibold
  bg-red-500 text-white
">
                            {aiSpeaking && (
                                <span className="voice-ring border-4 border-red-300" />
                            )}
                            AI
                        </div>

                        <div className="text-zinc-700 font-medium">AI Recruiter</div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm flex flex-col items-center justify-center gap-4">
                        <div className="relative w-20 h-20 rounded-full flex items-center justify-center text-xl font-semibold
  bg-blue-500 text-white
">
                            {userSpeaking && (
                                <span className="voice-ring border-4 border-blue-300" />
                            )}
                            {localStorage.getItem("name").charAt(0).toUpperCase()}
                        </div>

                        <div className="text-zinc-700 font-medium">{localStorage.getItem("name")}</div>
                    </div>
                </div>

                <div className="pb-10 flex flex-col items-center gap-3">
                    <div className="flex gap-6">

                        <button
                            onClick={hangUpInterview}
                            className="w-14 h-14 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition"
                        >
                            <PhoneOff />
                        </button>
                    </div>

                    <div className="text-zinc-500 text-sm">Interview in Progress...</div>
                </div>
            </div>
            )
        </div>
    )
}
