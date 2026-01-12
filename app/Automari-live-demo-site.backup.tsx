"use client"

import { useState, useEffect } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import {
  Phone,
  Mail,
  Menu,
  X,
  MessageSquare,
  Calendar,
  Calculator,
  Users,
  Package,
  TrendingUp,
  BarChart3,
  Share2,
  Shield,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Star,
  CheckCircle,
  MapPin,
  Target,
  Send,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import EmailAutomationDemo from "../components/Demos/EmailAutomationDemo";



const aiAgents = [
  {
    id: 1,
    title: "Customer Support Automation",
    icon: MessageSquare,
    description:
      "24/7 intelligent customer support with natural language processing, sentiment analysis, and automated ticket routing.",
    features: ["Instant Response", "Multi-language Support", "Sentiment Analysis", "Escalation Management"],
    color: "from-red-600 to-red-800",
  },
  {
    id: 2,
    title: "Email Management & Response",
    icon: Mail,
    description:
      "Smart email categorization, automated responses, and priority management to streamline communication workflows.",
    features: ["Smart Categorization", "Auto-responses", "Priority Filtering", "Follow-up Tracking"],
    color: "from-blue-600 to-blue-800",
  },
  {
    id: 3,
    title: "Appointment Scheduling & Calendar",
    icon: Calendar,
    description:
      "Intelligent scheduling system with conflict resolution, timezone management, and automated reminders.",
    features: ["Smart Scheduling", "Conflict Resolution", "Timezone Sync", "Automated Reminders"],
    color: "from-slate-600 to-slate-800",
  },
  {
    id: 4,
    title: "Financial & Accounting Automation",
    icon: Calculator,
    description:
      "Automated bookkeeping, expense tracking, invoice generation, and financial reporting with real-time insights.",
    features: ["Automated Bookkeeping", "Expense Tracking", "Invoice Generation", "Financial Reports"],
    color: "from-red-700 to-red-900",
  },
  {
    id: 5,
    title: "HR & Employee Onboarding",
    icon: Users,
    description: "Streamlined onboarding process with document management, training schedules, and progress tracking.",
    features: ["Document Management", "Training Automation", "Progress Tracking", "Compliance Monitoring"],
    color: "from-blue-700 to-blue-900",
  },
  {
    id: 6,
    title: "Inventory & Supply Chain",
    icon: Package,
    description: "Real-time inventory tracking, automated reordering, supplier management, and demand forecasting.",
    features: ["Real-time Tracking", "Auto Reordering", "Supplier Management", "Demand Forecasting"],
    color: "from-slate-700 to-slate-900",
  },
  {
    id: 7,
    title: "Marketing & Lead Generation",
    icon: TrendingUp,
    description: "Automated lead scoring, nurturing campaigns, conversion optimization, and ROI tracking.",
    features: ["Lead Scoring", "Campaign Automation", "Conversion Optimization", "ROI Analytics"],
    color: "from-red-800 to-red-950",
  },
  {
    id: 8,
    title: "Data Analytics & Reporting",
    icon: BarChart3,
    description: "Advanced data visualization, predictive analytics, automated reporting, and business intelligence.",
    features: ["Data Visualization", "Predictive Analytics", "Automated Reports", "Business Intelligence"],
    color: "from-blue-800 to-blue-950",
  },
  {
    id: 9,
    title: "Social Media Management",
    icon: Share2,
    description:
      "Automated content scheduling, engagement monitoring, trend analysis, and brand reputation management.",
    features: ["Content Scheduling", "Engagement Monitoring", "Trend Analysis", "Reputation Management"],
    color: "from-slate-800 to-slate-950",
  },
  {
    id: 10,
    title: "Cybersecurity & Risk Mitigation",
    icon: Shield,
    description:
      "Proactive threat detection, automated security responses, compliance monitoring, and risk assessment.",
    features: ["Threat Detection", "Automated Response", "Compliance Monitoring", "Risk Assessment"],
    color: "from-red-900 to-red-950",
  },
]

const testimonials = [
  {
    name: "Martin Channing",
    business: "Miami Beach Boutique",
    location: "Miami Beach, FL",
    rating: 5,
    review:
      "Mike and the Automari team transformed our customer service completely. Our response time went from hours to literally minutes, and customer satisfaction increased a good amount as well. Incredible results, very impressed with your work guys, keep it up and glad to be apart of Automari.ai!",
    avatar: "SM",
  },
  {
    name: "Valencia Mendez",
    business: "Vals Salon LLC",
    location: "International",
    rating: 5,
    review:
      "The scheduling automation agent has been a game-changer for my salons and myself. We we're able to eliminate double bookings and have my appointments/stress load be organized and managed without me having to lift a finger... We as a company are more than thrilled and will DEFINITELY be going with more of their agents to help with our business flow. ",
    avatar: "CR",
  },
  {
    name: "Brent Thompson",
    business: "Thompson Legal Services",
    location: "Boca Raton, FL",
    rating: 5,
    review:
      "Automari's email management system handles 80% of our client inquiries automatically. I tried other services but needed something or at least someone to rely on. Tried Automari's agents, to be fair I love my team but It's like having an extra 24/7 assistant, that never messes up. We're extremely grateful our first experience with Ai was with Automari, We're sticking with them. ",
    avatar: "JT",
  },
  {
    name: "David Chen",
    business: "Chen's Restaurant Group",
    location: "West Palm Beach, FL",
    rating: 5,
    review:
      "The inventory management AI has saved us thousands in waste and prevented stockouts. Mike understood our unique needs and delivered beyond expectations. Highly recommend!",
    avatar: "DC",
  },
  {
    name: "Monica & Partners",
    business: "Sunshine Marketing Agency",
    location: "Delray Beach, FL",
    rating: 5,
    review: "Working with Automari has been transformative. The lead generation automation increased our qualified leads by roughly 300%, even higher at this point, just keeps growing. Artificial intelligence I think is the future and Automri is on top of their game. ",
    avatar: "MG",
  },
]

const surveyQuestions = [
  {
    id: "company",
    label: "Company Name",
    type: "text",
    placeholder: "Enter your company name",
    required: true,
  },
  {
    id: "industry",
    label: "Industry",
    type: "select",
    options: [
      "Technology",
      "Healthcare",
      "Finance",
      "Retail",
      "Manufacturing",
      "Professional Services",
      "Real Estate",
      "Restaurant/Hospitality",
      "Other",
    ],
    required: true,
  },
  {
    id: "size",
    label: "Company Size",
    type: "select",
    options: ["1-10 employees", "11-50 employees", "51-200 employees", "200+ employees"],
    required: true,
  },
  {
    id: "revenue",
    label: "Annual Revenue",
    type: "select",
    options: ["Under $1M", "$1M - $5M", "$5M - $10M", "$10M+", "Prefer not to say"],
    required: true,
  },
  {
    id: "painPoints",
    label: "What are your biggest operational challenges?",
    type: "checkbox",
    options: [
      "Customer service response times",
      "Email management and organization",
      "Appointment scheduling conflicts",
      "Manual bookkeeping and accounting",
      "Employee onboarding processes",
      "Inventory management",
      "Lead generation and follow-up",
      "Data analysis and reporting",
      "Social media management",
      "Cybersecurity concerns",
    ],
    required: true,
  },
  {
    id: "timeSpent",
    label: "How many hours per week do you spend on repetitive tasks?",
    type: "select",
    options: ["Less than 5 hours", "5-15 hours", "15-30 hours", "30+ hours"],
    required: true,
  },
  {
    id: "budget",
    label: "What's your monthly budget for automation solutions?",
    type: "select",
    options: ["Under $1,000", "$1,000 - $5,000", "$5,000 - $10,000", "$10,000+", "Not sure yet"],
    required: true,
  },
  {
    id: "timeline",
    label: "When are you looking to implement automation?",
    type: "select",
    options: ["Immediately", "Within 1 month", "Within 3 months", "Within 6 months", "Just exploring"],
    required: true,
  },
]

export default function AutomariWebsite() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [expandedCard, setExpandedCard] = useState<number | null>(null)
  const [surveyData, setSurveyData] = useState<Record<string, any>>({})
  const [surveyStep, setSurveyStep] = useState(0)
  const [showSurvey, setShowSurvey] = useState(false)
  const [surveySubmitted, setSurveySubmitted] = useState(false)
  const { scrollYProgress } = useScroll()
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])

  useEffect(() => {
    const handleScroll = () => {
      if (isMenuOpen) {
        setIsMenuOpen(false)
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isMenuOpen])

  const handleSurveyChange = (questionId: string, value: any) => {
    setSurveyData((prev) => ({ ...prev, [questionId]: value }))
  }

  const handleSurveySubmit = () => {
    setSurveySubmitted(true)
    // Here you would typically send the data to your backend
    console.log("Survey Data:", surveyData)
  }

  const currentQuestion = surveyQuestions[surveyStep]
  const isLastStep = surveyStep === surveyQuestions.length - 1

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white overflow-x-hidden">
      {/* Animated Background */}
      <motion.div className="fixed inset-0 opacity-20" style={{ y: backgroundY }}>
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 via-blue-900/20 to-slate-800/20 animate-pulse" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl animate-bounce" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-slate-400/5 rounded-full blur-2xl animate-float" />
      </motion.div>

      {/* Navigation */}
      <motion.nav
        className="fixed top-0 w-full z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-700/50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div className="flex items-center space-x-3" whileHover={{ scale: 1.05 }}>
              <div className="relative w-10 h-10">
                <Image src="/automari-logo.png" alt="Automari Logo" fill className="object-contain" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-red-400 via-slate-200 to-blue-400 bg-clip-text text-transparent">
                Automari
              </span>
            </motion.div>

            {/* Desktop Contact Info */}
            <div className="hidden md:flex items-center space-x-6">
              <motion.a
                href="tel:561-201-4365"
                className="flex items-center space-x-2 text-red-400 hover:text-red-300 transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                <Phone className="h-4 w-4" />
                <span>561-201-4365</span>
              </motion.a>
              <motion.a
                href="mailto:contact@automari.ai"
                className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                <Mail className="h-4 w-4" />
                <span>contact@automari.ai</span>
              </motion.a>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              whileTap={{ scale: 0.95 }}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="md:hidden backdrop-blur-md bg-slate-950/90 border-t border-slate-700/50"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-4 py-4 space-y-4">
                <motion.a
                  href="tel:561-201-4365"
                  className="flex items-center space-x-2 text-red-400"
                  whileTap={{ scale: 0.95 }}
                >
                  <Phone className="h-4 w-4" />
                  <span>561-201-4365</span>
                </motion.a>
                <motion.a
                  href="mailto:contact@automari.ai"
                  className="flex items-center space-x-2 text-blue-400"
                  whileTap={{ scale: 0.95 }}
                >
                  <Mail className="h-4 w-4" />
                  <span>contact@automari.ai</span>
                </motion.a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <motion.div
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-red-600/20 to-blue-600/20 backdrop-blur-sm border border-red-500/30 rounded-full px-6 py-2 mb-8"
              whileHover={{ scale: 1.05 }}
            >
              <Sparkles className="h-4 w-4 text-red-400" />
              <span className="text-sm font-medium">America's Most Trusted AI Automation Agency</span>
            </motion.div>

            <div className="flex justify-center mb-8">
              <motion.div
                className="relative w-32 h-32 sm:w-40 sm:h-40"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Image
                  src="/automari-logo.png"
                  alt="Automari 3D Logo"
                  fill
                  className="object-contain drop-shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-blue-500/20 rounded-3xl blur-xl animate-pulse" />
              </motion.div>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-slate-100 via-red-200 to-blue-200 bg-clip-text text-transparent">
                Streamline Business
              </span>
              <br />
              <span className="bg-gradient-to-r from-red-400 via-slate-300 to-blue-400 bg-clip-text text-transparent">
                Operations with AI
              </span>
            </h1>

            <p className="text-xl sm:text-2xl text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Transform your business with our specialized AI agents designed to automate, optimize, and revolutionize
              your operations across America.
            </p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700 text-white border-0 px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-red-500/25 transition-all duration-300"
                onClick={() => setShowSurvey(true)}
              >
                <Target className="mr-2 h-5 w-5" />
                Find Your Pain Points
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-slate-400/30 bg-slate-800/20 backdrop-blur-sm hover:bg-slate-700/30 text-white px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300"
              >
                Learn More
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* AI Agents Section */}
      
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-red-400 via-slate-200 to-blue-400 bg-clip-text text-transparent">
                Our AI Agents
              </span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Discover our specialized AI agents, each designed to tackle specific business challenges and drive
              operational excellence across American enterprises.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aiAgents.map((agent, index) => {
              const IconComponent = agent.icon
              const isExpanded = expandedCard === agent.id

              return (
                <motion.div
                  key={agent.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <Card
                    className={`relative overflow-hidden bg-gradient-to-br from-slate-800/40 to-slate-900/60 backdrop-blur-md border border-slate-600/30 hover:border-slate-500/50 transition-all duration-500 cursor-pointer group ${
                      isExpanded ? "scale-105 z-10" : ""
                    }`}
                    onClick={() => setExpandedCard(isExpanded ? null : agent.id)}
                  >
                    <div className="p-6">
                      {/* Card Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className={`p-3 rounded-xl bg-gradient-to-r ${agent.color} bg-opacity-20 backdrop-blur-sm border border-slate-600/30`}
                        >
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        <motion.div animate={{ rotate: isExpanded ? 90 : 0 }} transition={{ duration: 0.3 }}>
                          <ChevronRight className="h-5 w-5 text-slate-400" />
                        </motion.div>
                      </div>

                      <h3 className="text-xl font-bold mb-3 text-white group-hover:text-red-300 transition-colors">
                        {agent.title}
                      </h3>

                      <p className="text-slate-300 text-sm mb-4 line-clamp-2">{agent.description}</p>

                      {/* Expanded Content */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="border-t border-slate-600/30 pt-4 mt-4"
                          >
                            <h4 className="text-sm font-semibold text-red-400 mb-3">Key Features:</h4>
                            <ul className="space-y-2">
                              {agent.features.map((feature, idx) => (
                                <motion.li
                                  key={idx}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                                  className="flex items-center text-sm text-slate-300"
                                >
                                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-3" />
                                  {feature}
                                </motion.li>
                              ))}
                            </ul>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Glassmorphism overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Email Automation Demo Section */}
      <EmailAutomationDemo />

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-slate-900/50 to-blue-900/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-red-400 via-slate-200 to-blue-400 bg-clip-text text-transparent">
                Success Stories from South Florida
              </span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              See how Mike and the Automari team have transformed local businesses across South Florida.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-md border border-slate-600/30 hover:border-slate-500/50 transition-all duration-300 p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{testimonial.name}</h4>
                      <p className="text-sm text-slate-400">{testimonial.business}</p>
                      <div className="flex items-center text-xs text-slate-500">
                        <MapPin className="h-3 w-3 mr-1" />
                        {testimonial.location}
                      </div>
                    </div>
                  </div>

                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>

                  <p className="text-slate-300 text-sm leading-relaxed">"{testimonial.review}"</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Survey Modal */}
      <AnimatePresence>
        {showSurvey && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-600/50 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              {!surveySubmitted ? (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-blue-400 bg-clip-text text-transparent">
                      Business Assessment
                    </h3>
                    <button
                      onClick={() => setShowSurvey(false)}
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="mb-6">
                    <div className="flex justify-between text-sm text-slate-400 mb-2">
                      <span>
                        Question {surveyStep + 1} of {surveyQuestions.length}
                      </span>
                      <span>{Math.round(((surveyStep + 1) / surveyQuestions.length) * 100)}% Complete</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-red-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((surveyStep + 1) / surveyQuestions.length) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="mb-8">
                    <label className="block text-lg font-semibold text-white mb-4">
                      {currentQuestion.label}
                      {currentQuestion.required && <span className="text-red-400 ml-1">*</span>}
                    </label>

                    {currentQuestion.type === "text" && (
                      <Input
                        placeholder={currentQuestion.placeholder}
                        value={surveyData[currentQuestion.id] || ""}
                        onChange={(e) => handleSurveyChange(currentQuestion.id, e.target.value)}
                        className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
                      />
                    )}

                    {currentQuestion.type === "select" && (
                      <select
                        value={surveyData[currentQuestion.id] || ""}
                        onChange={(e) => handleSurveyChange(currentQuestion.id, e.target.value)}
                        className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white"
                      >
                        <option value="">Select an option...</option>
                        {currentQuestion.options?.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    )}

                    {currentQuestion.type === "checkbox" && (
                      <div className="space-y-3">
                        {currentQuestion.options?.map((option) => (
                          <label key={option} className="flex items-center space-x-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={(surveyData[currentQuestion.id] || []).includes(option)}
                              onChange={(e) => {
                                const current = surveyData[currentQuestion.id] || []
                                const updated = e.target.checked
                                  ? [...current, option]
                                  : current.filter((item: string) => item !== option)
                                handleSurveyChange(currentQuestion.id, updated)
                              }}
                              className="w-4 h-4 text-red-500 bg-slate-700 border-slate-600 rounded focus:ring-red-500"
                            />
                            <span className="text-slate-300">{option}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => setSurveyStep(Math.max(0, surveyStep - 1))}
                      disabled={surveyStep === 0}
                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      Previous
                    </Button>

                    {isLastStep ? (
                      <Button
                        onClick={handleSurveySubmit}
                        className="bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700"
                      >
                        <Send className="mr-2 h-4 w-4" />
                        Submit Assessment
                      </Button>
                    ) : (
                      <Button
                        onClick={() => setSurveyStep(surveyStep + 1)}
                        className="bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700"
                      >
                        Next
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <CheckCircle className="h-10 w-10 text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-white mb-4">Assessment Complete!</h3>
                  <p className="text-slate-300 mb-6">
                    Thank you for completing our business assessment. Based on your responses, we'll prepare a
                    customized automation strategy for your business.
                  </p>
                  <p className="text-lg font-semibold text-red-400 mb-6">
                    Mike will personally review your assessment and contact you within 24 hours to schedule your
                    discovery call.
                  </p>
                  <Button
                    onClick={() => setShowSurvey(false)}
                    className="bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700"
                  >
                    Close
                  </Button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contact Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-950 via-red-950/20 to-blue-950/20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-5xl font-bold mb-8">
              <span className="bg-gradient-to-r from-red-400 via-slate-200 to-blue-400 bg-clip-text text-transparent">
                Ready to Transform Your Business?
              </span>
            </h2>
            <p className="text-xl text-slate-300 mb-12">
              Contact us today to discover how our AI agents can revolutionize your operations and drive American
              innovation.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
              <motion.a
                href="tel:561-201-4365"
                className="flex items-center justify-center space-x-3 p-6 bg-gradient-to-r from-red-600/20 to-red-800/20 backdrop-blur-sm border border-red-500/30 rounded-2xl hover:border-red-400/50 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Phone className="h-6 w-6 text-red-400" />
                <div className="text-left">
                  <div className="text-sm text-slate-400">Call Mike</div>
                  <div className="text-lg font-semibold text-white">561-201-4365</div>
                </div>
              </motion.a>

              <motion.a
                href="mailto:contact@automari.ai"
                className="flex items-center justify-center space-x-3 p-6 bg-gradient-to-r from-blue-600/20 to-blue-800/20 backdrop-blur-sm border border-blue-500/30 rounded-2xl hover:border-blue-400/50 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Mail className="h-6 w-6 text-blue-400" />
                <div className="text-left">
                  <div className="text-sm text-slate-400">Email us</div>
                  <div className="text-lg font-semibold text-white">contact@automari.ai</div>
                </div>
              </motion.a>
            </div>

            <Button
              size="lg"
              onClick={() => setShowSurvey(true)}
              className="bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700 text-white border-0 px-12 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-red-500/25 transition-all duration-300"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Start Your Assessment
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="relative border-t border-slate-700/50 py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-950 to-slate-900">
        <div className="absolute inset-0 bg-gradient-to-r from-red-950/10 via-transparent to-blue-950/10" />
        <div className="relative max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            {/* Company Info */}
            <div className="text-center md:text-left">
              <motion.div
                className="flex items-center justify-center md:justify-start space-x-3 mb-6"
                whileHover={{ scale: 1.05 }}
              >
                <div className="relative w-12 h-12">
                  <Image src="/automari-logo.png" alt="Automari Logo" fill className="object-contain" />
                </div>
                <span className="text-3xl font-bold bg-gradient-to-r from-red-400 via-slate-200 to-blue-400 bg-clip-text text-transparent">
                  Automari
                </span>
              </motion.div>
              <p className="text-slate-400 mb-6 leading-relaxed">
                America's most trusted AI agency, streamlining business operations with cutting-edge automation
                solutions.
              </p>
              <div className="flex justify-center md:justify-start space-x-4">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <div className="w-2 h-2 bg-slate-300 rounded-full animate-pulse" style={{ animationDelay: "0.5s" }} />
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: "1s" }} />
              </div>
            </div>

            {/* Contact Info */}
            <div className="text-center">
              <h4 className="text-xl font-semibold text-white mb-6">Get in Touch</h4>
              <div className="space-y-4">
                <motion.a
                  href="tel:561-201-4365"
                  className="flex items-center justify-center space-x-2 text-red-400 hover:text-red-300 transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  <Phone className="h-5 w-5" />
                  <span className="text-lg">561-201-4365</span>
                </motion.a>
                <motion.a
                  href="mailto:contact@automari.ai"
                  className="flex items-center justify-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  <Mail className="h-5 w-5" />
                  <span className="text-lg">contact@automari.ai</span>
                </motion.a>
                <div className="flex items-center justify-center space-x-2 text-slate-400">
                  <MapPin className="h-5 w-5" />
                  <span>Serving South Florida</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="text-center md:text-right">
              <h4 className="text-xl font-semibold text-white mb-6">Our Impact</h4>
              <div className="space-y-4">
                <div>
                  <div className="text-2xl font-bold text-red-400">500+</div>
                  <div className="text-slate-400">Hours Saved Weekly</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-400">50+</div>
                  <div className="text-slate-400">Businesses Automated</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-300">99%</div>
                  <div className="text-slate-400">Client Satisfaction</div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-700/50 pt-8 text-center">
            <p className="text-slate-500 text-sm mb-4">
              © 2024 Automari. All rights reserved. Proudly serving American businesses with innovative AI solutions.
            </p>
            <div className="flex justify-center items-center space-x-2 text-xs text-slate-600">
              <span>🇺🇸</span>
              <span>Made in America</span>
              <span>•</span>
              <span>Powered by Innovation</span>
              <span>•</span>
              <span>Driven by Excellence</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
