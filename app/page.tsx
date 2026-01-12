"use client"

import { useState } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import {
  Phone,
  Mail,
  ArrowRight,
  Star,
  CheckCircle,
  MapPin,
  Send,
  X,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import MariMariChatbot from "@/components/Chatbot/MariMariChatbot"
import { AIPartnersBanner } from "@/components/ui/ai-partners-banner"
import { ShiningText } from "@/components/ui/shining-text"
import { MechanicalWaves } from "@/components/ui/mechanical-waves"
import { Navigation } from "@/components/marketing/Navigation"
import { HeroSection } from "@/components/marketing/HeroSection"
import { AgentsSection } from "@/components/marketing/AgentsSection"
import { FAQ } from "@/components/marketing/FAQ"

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
  {
    name: "Dr. Aliyah Rahman",
    business: "Precision Health Clinic",
    location: "Orlando, FL",
    rating: 5,
    review:
      "Implementing Automari's AI for patient intake and record management has drastically cut down our administrative workload. The accuracy is phenomenal, and our staff can now focus more on patient care. It's truly a game-changer for healthcare efficiency!",
    avatar: "AR",
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
    id: "timeline",
    label: "When are you looking to get started?",
    type: "select",
    options: ["Immediately", "Within 2 weeks", "Within 1 month", "Just exploring", "Not sure yet"],
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
  const [surveyData, setSurveyData] = useState<Record<string, any>>({})
  const [surveyStep, setSurveyStep] = useState(0)
  const [showSurvey, setShowSurvey] = useState(false)
  const [surveySubmitted, setSurveySubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const { scrollYProgress } = useScroll()
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])

  const handleSurveyChange = (questionId: string, value: any) => {
    setSurveyData((prev) => ({ ...prev, [questionId]: value }))
  }

  const handleSurveySubmit = async () => {
    // Prevent duplicate submissions
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      const response = await fetch('/api/survey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...surveyData,
          pageUrl: window.location.href,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSurveySubmitted(true);
      } else {
        // Show error but allow retry
        setSubmitError(result.error || 'Failed to submit. Please try again or call 561-201-4365.');
      }
    } catch (error) {
      console.error('Error submitting survey:', error);
      setSubmitError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  const currentQuestion = surveyQuestions[surveyStep]
  const isLastStep = surveyStep === surveyQuestions.length - 1

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* Animated Background */}
      <motion.div className="fixed inset-0 opacity-20 pointer-events-none" style={{ y: backgroundY }}>
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/10 via-blue-900/10 to-slate-900/10" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </motion.div>

      {/* Navigation */}
      <Navigation onStartAssessment={() => setShowSurvey(true)} />

      {/* Hero Section */}
      <HeroSection onStartAssessment={() => setShowSurvey(true)} />

      {/* AI Agents Section */}
      <AgentsSection />

      {/* Mechanical Waves Interactive Section */}
      <section className="relative w-full overflow-hidden py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <style jsx>{`
              @keyframes shimmer {
                0% { background-position: -200% center; }
                100% { background-position: 200% center; }
              }
              .animated-text {
                background: linear-gradient(
                  90deg,
                  #ffffff 0%,
                  #e0e7ff 25%,
                  #ffffff 50%,
                  #c7d2fe 75%,
                  #ffffff 100%
                );
                background-size: 200% auto;
                -webkit-background-clip: text;
                background-clip: text;
                -webkit-text-fill-color: transparent;
                animation: shimmer 4s linear infinite;
              }
              .valleys-text {
                background: linear-gradient(
                  90deg,
                  #60a5fa 0%,
                  #38bdf8 25%,
                  #22d3ee 50%,
                  #38bdf8 75%,
                  #60a5fa 100%
                );
                background-size: 200% auto;
                -webkit-background-clip: text;
                background-clip: text;
                -webkit-text-fill-color: transparent;
                animation: shimmer 3s linear infinite;
              }
            `}</style>
            <h2 className="text-3xl sm:text-5xl font-bold mb-6 leading-tight text-white">
              You decide where you want your business to grow
              <br />
              It&apos;s mountains. <span className="valleys-text">Not the valleys.</span>
            </h2>
          </motion.div>

          {/* Interactive Waves Container */}
          <motion.div
            className="relative w-full flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="relative w-full max-w-6xl h-[600px] md:h-[700px] lg:h-[800px] rounded-2xl overflow-hidden bg-slate-900/50 border border-blue-500/20">
              <MechanicalWaves
                width={1200}
                height={800}
                backgroundColor="transparent"
                foregroundColor="#3b82f6"
                speed={1}
                amplitude={5}
                peakHeight={60}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* AI Partners Slideshow */}
      <AIPartnersBanner />

      {/* Testimonials Section */}
      <section id="results" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-slate-900/50 to-blue-900/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="mb-6">
              <ShiningText size="5xl" className="text-center">
                Success Stories from South Florida
              </ShiningText>
            </div>
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

                  <p className="text-slate-300 text-sm leading-relaxed">&ldquo;{testimonial.review}&rdquo;</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* FAQ */}
      <FAQ />


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
                      <div className="flex flex-col items-end gap-2">
                        {submitError && (
                          <p className="text-red-400 text-sm">{submitError}</p>
                        )}
                        <Button
                          onClick={handleSurveySubmit}
                          disabled={isSubmitting}
                          className="bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSubmitting ? (
                            <>
                              <svg className="animate-spin mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Submitting...
                            </>
                          ) : (
                            <>
                              <Send className="mr-2 h-4 w-4" />
                              Submit Assessment
                            </>
                          )}
                        </Button>
                      </div>
                    ) : (
                      <Button
                        onClick={() => setSurveyStep(surveyStep + 1)}
                        className="bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700"
                        // onMouseEnter={() => triggerRipple(600)} // Removed old ripple trigger
                        // onFocus={() => triggerRipple(600)} // Removed old ripple trigger
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
                    Thank you for completing our business assessment. Based on your responses, we&apos;ll prepare a
                    customized automation strategy for your business.
                  </p>
                  <p className="text-lg font-semibold text-red-400 mb-6">
                    Mike will personally review your assessment and contact you within 24 hours to schedule your
                    discovery call.
                  </p>
                  <Button
                    onClick={() => setShowSurvey(false)}
                    className="bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700"
                    // onMouseEnter={() => triggerRipple(600)} // Removed old ripple trigger
                    // onFocus={() => triggerRipple(600)} // Removed old ripple trigger
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
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-950 via-red-950/20 to-blue-950/20 relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* Gradient bar */}
            <div className="flex justify-center mb-8">
              <div className="h-1 w-full max-w-2xl bg-gradient-to-r from-red-500 via-pink-200 via-white to-blue-400 rounded-full opacity-80" />
            </div>
            
            <div className="mb-8">
              <ShiningText size="5xl" className="text-center">
                Ready to Transform Your Business?
              </ShiningText>
            </div>
            <div className="mb-4">
              <ShiningText size="3xl" className="text-center">
                Automari.Ai
              </ShiningText>
            </div>
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
                href="mailto:contactautomari@gmail.com"
                className="flex items-center justify-center space-x-3 p-6 bg-gradient-to-r from-blue-600/20 to-blue-800/20 backdrop-blur-sm border border-blue-500/30 rounded-2xl hover:border-blue-400/50 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Mail className="h-6 w-6 text-blue-400" />
                <div className="text-left">
                  <div className="text-sm text-slate-400">Email us</div>
                  <div className="text-lg font-semibold text-white">contactautomari@gmail.com</div>
                </div>
              </motion.a>
            </div>

            <Button
              size="lg"
              onClick={() => setShowSurvey(true)}
              className="bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700 text-white border-0 px-12 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-red-500/25 transition-all duration-300"
              // onMouseEnter={() => triggerRipple(600)} // Removed old ripple trigger
              // onFocus={() => triggerRipple(600)} // Removed old ripple trigger
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
                  <Image src="/automari-logo.png" alt="Automari Logo" fill className="object-cover rounded-full" />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500/50 to-blue-500/50 blur-sm opacity-75 animate-pulse" />
                </div>
                <ShiningText size="3xl">
                  Automari
                </ShiningText>
              </motion.div>
              <p className="text-slate-400 mb-6 leading-relaxed">
                America&apos;s most trusted AI agency, streamlining business operations with cutting-edge automation
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
                  href="mailto:contactautomari@gmail.com"
                  className="flex items-center justify-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  <Mail className="h-5 w-5" />
                  <span className="text-lg">contactautomari@gmail.com</span>
                </motion.a>
                <div className="flex items-center justify-center space-x-2 text-slate-400">
                  <MapPin className="h-5 w-5" />
                  <span>Serving South Florida</span>
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

      {/* Mari Mari Chatbot Integration */}
      <MariMariChatbot />
    </div>
  )
}
