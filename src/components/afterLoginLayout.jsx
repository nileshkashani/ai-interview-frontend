import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  LayoutGrid,
  LogOut,
  Zap,
} from "lucide-react"
import { useEffect, useState } from "react"
import { RiRobot3Line } from "react-icons/ri";
import AiInterviewForm from "./aiInterviewForm"
import { logoutUser } from "@/services/authService"
import InterviewCards from "./interviewCards"
import InterviewQuizForm from "./interviewQuizForm"
import QuizCards from "./quizCards"
import OverviewDashboard from "./overviewDashboard"
import { MdOutlineFindInPage, MdOutlineQuiz } from "react-icons/md";
import AnalyseResume from "./analyseResume";
import { FaRegUser } from "react-icons/fa6";
import { useLocation } from 'react-router-dom'
import profile from "./profile";
import Profile from "./profile";

const navItems = [
  { label: "Overview", icon: LayoutGrid },
  { label: "Mock Interview", icon: RiRobot3Line },
  { label: "Ai Generated Quiz", icon: MdOutlineQuiz },
  { label: "Analyse Resume", icon: MdOutlineFindInPage },
  { label: "Profile", icon: FaRegUser },

]

const AfterLoginLayout = () => {

  const [activeTab, setActiveTab] = useState("Overview");
  const location = useLocation()
  const tab = location.state?.tab


  useEffect(() => {
    if (tab) {
      setActiveTab(tab)
      window.history.replaceState({}, document.title)
    } else {
      setActiveTab("Overview")
    }
  }, [tab])


  const handleLogout = async () => {
    await logoutUser();
  }
  return (
    <div className="flex max-h-screen max-w-screen overflow-hidden">
      <aside className="h-screen w-64 bg-zinc-900 text-zinc-100 flex flex-col">
        <div className="flex items-center gap-2 px-6 py-5 text-lg font-semibold">
          <div className="h-8 w-8 rounded-lg bg-red-500 flex items-center justify-center">
            <Zap className="h-5 w-5 text-white" />
          </div>
          Interview.io
        </div>

        <div className="px-3">
          {navItems.map(item => (
            <Button
              key={item.label}
              variant="ghost"
              className={`w-full justify-start gap-3 px-4 py-6 text-sm ${activeTab === item.label
                ? "bg-red-500 text-white hover:bg-red-500"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                }`}
              onClick={() => setActiveTab(item.label)}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Button>
          ))}
        </div>

        <div className="mt-auto px-4 pb-6">
          <Separator className="mb-4 bg-zinc-800" />
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-zinc-400 hover:text-white hover:bg-zinc-800 cursor-pointer"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            Logout
          </Button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">
        {activeTab === "Mock Interview" && (
          <div className="flex flex-col lg:flex-row w-full h-full overflow-hidden">

            <div className="flex-1 p-2">
              <AiInterviewForm />
            </div>

            <div className=" lg:w-[420px] p-2">
              <InterviewCards />
            </div>

          </div>
        )}
        {activeTab === "Ai Generated Quiz" && (
          <div className="flex flex-col lg:flex-row w-full h-full">
            <div className="flex-1 p-2">
              <InterviewQuizForm />
            </div>
            <div className=" lg:w-[420px] p-2">
              <QuizCards />
            </div>
          </div>
        )}
        {activeTab === "Overview" && (
          <div className="h-full overflow-hidden">
            <div className="p-2 h-full">
              <OverviewDashboard />
            </div>
          </div>
        )}

        {activeTab === "Analyse Resume" && (
          <div>
            <AnalyseResume />
          </div>
        )}
        {activeTab === 'Profile' &&
          <Profile/>
        }
      </main>
    </div>
  )
}

export default AfterLoginLayout
