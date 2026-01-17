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
import { CgMenuGridR } from "react-icons/cg";
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
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
    <div className="relative flex h-screen w-screen overflow-hidden bg-white">
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-zinc-900 text-zinc-100 flex flex-col
      transform transition-transform duration-300 ease-in-out
      ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      md:static md:translate-x-0`}
      >
        <div className="flex items-center gap-2 px-6 py-5 text-lg font-semibold">
          <div className="h-8 w-8 rounded-lg bg-red-500 flex items-center justify-center">
            <Zap className="h-5 w-5 text-white" />
          </div>
          Interview.io
        </div>

        <div className="px-3 flex-1 overflow-y-auto">
          {navItems.map(item => (
            <Button
              key={item.label}
              variant="ghost"
              className={`w-full justify-start gap-3 px-4 py-6 text-sm ${activeTab === item.label
                  ? "bg-red-500 text-white hover:bg-red-500"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                }`}
              onClick={() => {
                setActiveTab(item.label)
                setIsSidebarOpen(false)
              }}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Button>
          ))}
        </div>

        <div className="px-4 pb-6">
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

      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="fixed top-0 left-0 right-0 z-30 flex items-center gap-3
        bg-white border-b border-zinc-800 px-4 py-3 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="text-white"
            onClick={() => setIsSidebarOpen(true)}
          >
            <CgMenuGridR className="text-black size-6" />
          </Button>
          <span className="text-sm font-medium text-zinc-200 truncate">
            {activeTab}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto pt-14 md:pt-0">
          {activeTab === "Mock Interview" && (
            <div className="flex flex-col lg:flex-row w-full h-full">
              <div className="flex-1 p-2">
                <AiInterviewForm />
              </div>
              <div className="w-full lg:w-[420px] p-2">
                <InterviewCards />
              </div>
            </div>
          )}

          {activeTab === "Ai Generated Quiz" && (
            <div className="flex flex-col lg:flex-row w-full h-full">
              <div className="flex-1 p-2">
                <InterviewQuizForm />
              </div>
              <div className="w-full lg:w-[420px] p-2">
                <QuizCards />
              </div>
            </div>
          )}

          {activeTab === "Overview" && (
            <div className="p-2 h-full">
              <OverviewDashboard />
            </div>
          )}

          {activeTab === "Analyse Resume" && (
            <div className="p-2">
              <AnalyseResume />
            </div>
          )}

          {activeTab === "Profile" && (
            <div className="p-2">
              <Profile />
            </div>
          )}
        </div>
      </main>
    </div>
  )


}

export default AfterLoginLayout
