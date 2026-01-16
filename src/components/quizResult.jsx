import { useLocation, useNavigate } from 'react-router-dom'
import ScoreCircle from './ui/scoreCircle'
import { Button } from './ui/button'

const QuizResult = () => {
    const { state } = useLocation()
    const score = Number(state?.score ?? 0)
    const noOfQuestions = Number(state?.noOfQuestions ?? 0)
    const navigate = useNavigate()

    return (
        <div className="flex flex-col items-center h-screen gap-3 justify-center mb-6">
            <div className='font-bold text-xl'>
                Your Score
            </div>
            <ScoreCircle score={score} total={noOfQuestions} size={160} />
            <div>
                <Button onClick={() => navigate('/dashboard')}>Dashboard</Button>
            </div>
        </div>

    )
}

export default QuizResult