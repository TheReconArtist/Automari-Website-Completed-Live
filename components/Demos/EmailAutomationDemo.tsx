"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Inbox, Mail, Send, Settings, ChevronLeft, User, Bell, Search, PlusCircle, Archive, Trash, Tag, Clock, CheckCircle, XCircle, Wand2, Sparkles } from "lucide-react"
import { Input } from "@/components/ui/input"

const emails = [
  {
    id: 1,
    sender: "Sales Inquiry",
    subject: "Urgent: Partnership Opportunity",
    body: "Hi Team, We are very interested in your AI automation solutions and would like to schedule a call to discuss a potential partnership. Please let us know your availability.",
    time: "2m ago",
    read: false,
    category: "leads",
  },
  {
    id: 2,
    sender: "Support Ticket #1234",
    subject: "Issue with current setup",
    body: "Dear Automari Support, I am experiencing an issue with my current AI agent setup. It's not categorizing emails correctly. Can you please assist?",
    time: "15m ago",
    read: false,
    category: "support",
  },
  {
    id: 3,
    sender: "Newsletter Subscription",
    subject: "Welcome to Automari!",
    body: "Thank you for subscribing to our newsletter! Get ready for the latest updates on AI automation and business efficiency.",
    time: "1h ago",
    read: true,
    category: "marketing",
  },
  {
    id: 4,
    sender: "Invoice #2024-001",
    subject: "Your monthly invoice from Automari",
    body: "Please find attached your invoice for the month of May. Total amount due: $2,500. Due date: June 15, 2024.",
    time: "2h ago",
    read: true,
    category: "billing",
  },
]

export default function EmailAutomationDemo() {
  const [currentEmails, setCurrentEmails] = useState(emails)
  const [selectedEmail, setSelectedEmail] = useState<typeof emails[0] | null>(null)
  const [automationStep, setAutomationStep] = useState(0)
  const [aiAction, setAiAction] = useState<string | null>(null)

  useEffect(() => {
    if (automationStep < emails.length) {
      const timer = setTimeout(() => {
        const emailToProcess = emails[automationStep]
        const updatedEmails = currentEmails.map((email) =>
          email.id === emailToProcess.id ? { ...email, read: true } : email
        )
        setCurrentEmails(updatedEmails)
        setSelectedEmail(emailToProcess)
        setAiAction(null) // Reset AI action for next step

        // Simulate AI actions
        setTimeout(() => {
          if (emailToProcess.category === "leads") {
            setAiAction("Categorizing as Lead, Drafting personalized response...")
            setTimeout(() => {
              setAiAction("Response drafted and sent! Scheduling follow-up.")
            }, 2000)
          } else if (emailToProcess.category === "support") {
            setAiAction("Categorizing as Support, Assigning to support team...")
            setTimeout(() => {
              setAiAction("Ticket created and assigned. Notifying customer.")
            }, 2000)
          } else if (emailToProcess.category === "marketing") {
            setAiAction("Categorizing as Marketing, Archiving...")
            setTimeout(() => {
              setAiAction("Archived. No further action required.")
            }, 1500)
          } else if (emailToProcess.category === "billing") {
            setAiAction("Categorizing as Billing, Forwarding to finance...")
            setTimeout(() => {
              setAiAction("Forwarded to finance. Marking as processed.")
            }, 1500)
          }
          setTimeout(() => {
            setAutomationStep((prev) => prev + 1)
            setSelectedEmail(null) // Clear selected email after processing
            setAiAction(null)
          }, 4000) // Wait for AI actions to complete
        }, 1500) // Wait for email to be selected
      }, 5000) // Process next email every 5 seconds

      return () => clearTimeout(timer)
    } else {
      // Reset demo after all emails are processed
      const resetTimer = setTimeout(() => {
        setCurrentEmails(emails)
        setSelectedEmail(null)
        setAutomationStep(0)
        setAiAction(null)
      }, 5000)
      return () => clearTimeout(resetTimer)
    }
  }, [automationStep, currentEmails])

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900/50 to-blue-900/30">
      <div className="max-w-7xl mx-auto text-center mb-16">
        <motion.h2
          className="text-3xl sm:text-5xl font-bold mb-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <span className="bg-gradient-to-r from-red-400 via-slate-200 to-blue-400 bg-clip-text text-transparent">
            Live Demo: AI Email Automation
          </span>
        </motion.h2>
        <motion.p
          className="text-xl text-slate-300 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          See our intelligent AI agents in action, revolutionizing email management for businesses.
        </motion.p>
      </div>

      <div className="max-w-6xl mx-auto bg-gradient-to-br from-slate-800/60 to-slate-900/80 rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden relative min-h-[600px] md:min-h-[700px]">
        {/* Decorative Particles */}
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-red-400 rounded-full mix-blend-screen filter blur-xl animate-blob" />
          <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-blue-400 rounded-full mix-blend-screen filter blur-xl animate-blob animation-delay-2000" />
          <div className="absolute bottom-1/4 left-1/2 w-40 h-40 bg-slate-400 rounded-full mix-blend-screen filter blur-xl animate-blob animation-delay-4000" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row h-full">
          {/* Sidebar */}
          <motion.div
            className="w-full md:w-64 bg-slate-900/70 border-b md:border-b-0 md:border-r border-slate-700/50 p-4 flex-shrink-0"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <Sparkles className="h-6 w-6 text-red-400" />
              <span className="text-xl font-bold text-white">Automari AI</span>
            </div>
            <nav className="space-y-2">
              <a
                href="#"
                className="flex items-center space-x-3 p-3 rounded-lg text-red-400 bg-red-400/20 hover:bg-red-400/30 transition-colors"
              >
                <Inbox className="h-5 w-5" />
                <span>Inbox</span>
                <span className="ml-auto bg-red-500/30 text-white text-xs px-2 py-0.5 rounded-full">
                  {currentEmails.filter((e) => !e.read).length}
                </span>
              </a>
              <a href="#" className="flex items-center space-x-3 p-3 rounded-lg text-slate-300 hover:bg-slate-700/50 transition-colors">
                <Send className="h-5 w-5" />
                <span>Sent</span>
              </a>
              <a href="#" className="flex items-center space-x-3 p-3 rounded-lg text-slate-300 hover:bg-slate-700/50 transition-colors">
                <Archive className="h-5 w-5" />
                <span>Archive</span>
              </a>
              <a href="#" className="flex items-center space-x-3 p-3 rounded-lg text-slate-300 hover:bg-slate-700/50 transition-colors">
                <Trash className="h-5 w-5" />
                <span>Trash</span>
              </a>
              <a href="#" className="flex items-center space-x-3 p-3 rounded-lg text-slate-300 hover:bg-slate-700/50 transition-colors">
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </a>
            </nav>
            <div className="mt-8 pt-6 border-t border-slate-700/50">
                <button className="w-full flex items-center justify-center space-x-2 p-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors">
                    <PlusCircle className="h-5 w-5" />
                    <span>New Email</span>
                </button>
            </div>
          </motion.div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <motion.div
              className="bg-slate-800/70 border-b border-slate-700/50 p-4 flex items-center justify-between flex-wrap gap-4"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex items-center space-x-4">
                {selectedEmail && (
                  <button
                    onClick={() => setSelectedEmail(null)}
                    className="text-slate-400 hover:text-white md:hidden"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                )}
                <h3 className="text-xl font-semibold text-white">
                  {selectedEmail ? selectedEmail.subject : "Inbox"}
                </h3>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search emails..."
                    className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 pr-10"
                  />
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                </div>
                <Bell className="h-5 w-5 text-slate-400" />
                <User className="h-5 w-5 text-slate-400" />
              </div>
            </motion.div>

            <div className="flex flex-1 overflow-hidden">
              {/* Email List */}
              <motion.div
                className={`w-full md:w-1/2 lg:w-2/5 bg-slate-800/50 border-r border-slate-700/50 overflow-y-auto flex-shrink-0 ${
                  selectedEmail ? "hidden md:block" : "block"
                }`}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                {currentEmails.length === 0 && (
                  <div className="p-6 text-center text-slate-400">No emails in inbox.</div>
                )}
                <AnimatePresence initial={false}>
                  {currentEmails.map((email) => (
                    <motion.div
                      key={email.id}
                      layout
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.3 }}
                      className={`p-4 border-b border-slate-700/50 cursor-pointer hover:bg-slate-700/50 transition-colors ${
                        selectedEmail?.id === email.id ? "bg-slate-700/60" : ""
                      } ${email.read ? "opacity-70" : "font-semibold"}`}
                      onClick={() => setSelectedEmail(email)}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-white">{email.sender}</span>
                        <span className="text-xs text-slate-400">{email.time}</span>
                      </div>
                      <h4 className="text-base text-white truncate">{email.subject}</h4>
                      <p className="text-sm text-slate-400 truncate">{email.body}</p>
                      {email.category && (
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${
                            email.category === "leads"
                              ? "bg-red-500/20 text-red-300"
                              : email.category === "support"
                              ? "bg-blue-500/20 text-blue-300"
                              : email.category === "marketing"
                              ? "bg-green-500/20 text-green-300"
                              : "bg-purple-500/20 text-purple-300"
                          }`}
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          {email.category.charAt(0).toUpperCase() + email.category.slice(1)}
                        </span>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* Email View / AI Actions */}
              <motion.div
                className={`flex-1 bg-slate-800/70 p-6 overflow-y-auto ${
                  selectedEmail ? "block" : "hidden md:block"
                }`}
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                {selectedEmail ? (
                  <motion.div
                    key={selectedEmail.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-2xl font-bold text-white">{selectedEmail.subject}</h3>
                      <span className="text-sm text-slate-400">{selectedEmail.time}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-slate-300 mb-6">
                      <User className="h-4 w-4" />
                      <span>{selectedEmail.sender}</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">{selectedEmail.body}</p>

                    {aiAction && (
                      <motion.div
                        className="mt-8 p-4 bg-blue-600/20 rounded-lg flex items-center space-x-3"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Wand2 className="h-5 w-5 text-blue-300" />
                        <span className="text-blue-200 font-medium">{aiAction}</span>
                      </motion.div>
                    )}

                    <div className="mt-8 pt-6 border-t border-slate-700/50 flex space-x-4">
                      <button className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-medium transition-colors">
                        <Send className="h-4 w-4" />
                        <span>Reply with AI</span>
                      </button>
                      <button className="flex items-center space-x-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white font-medium transition-colors">
                        <Archive className="h-4 w-4" />
                        <span>Archive</span>
                      </button>
                      <button className="flex items-center space-x-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white font-medium transition-colors">
                        <Trash className="h-4 w-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 text-lg">
                    <Mail className="h-16 w-16 mb-4" />
                    <span>Select an email to view its content and AI actions.</span>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
  