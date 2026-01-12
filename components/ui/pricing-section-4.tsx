"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Sparkles as SparklesComp } from "@/components/ui/sparkles";
import { TimelineContent } from "@/components/ui/timeline-animation";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";
import { cn } from "@/lib/utils";
import NumberFlow from "@number-flow/react";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { Sprout, Rocket, Crown } from "lucide-react";

const plans = [
  {
    name: "Seed",
    description: "Perfect for small businesses getting started with AI automation",
    price: 497,
    yearlyPrice: 4970,
    buttonText: "Calculate Your Savings",
    buttonVariant: "outline" as const,
    icon: Sprout,
    includes: [
      "Everything included:",
      "24/7 AI automation agents",
      "1,000 automation actions/month",
      "Email management & responses",
      "Basic appointment scheduling",
      "Call routing & notifications",
      "5-minute setup process",
      "Email support",
    ],
  },
  {
    name: "Tree",
    description: "Best value for growing businesses that need advanced features",
    price: 797,
    yearlyPrice: 7970,
    buttonText: "Calculate Your Savings",
    buttonVariant: "default" as const,
    icon: Rocket,
    popular: true,
    includes: [
      "Everything in Seed, plus:",
      "3,000 automation actions/month",
      "Advanced routing & CRM integration",
      "SMS alerts & custom configurations",
      "Dedicated success manager",
      "Priority support",
      "Advanced analytics dashboard",
    ],
  },
  {
    name: "Forrest",
    description: "Advanced plan with unlimited access for established businesses",
    price: 1497,
    yearlyPrice: 14970,
    buttonText: "Calculate Your Savings",
    buttonVariant: "outline" as const,
    icon: Crown,
    includes: [
      "Everything in Tree, plus:",
      "Unlimited automation actions",
      "Multi-location support",
      "Advanced analytics & reporting",
      "Custom integrations",
      "White-label options",
      "24/7 priority support",
    ],
  },
];

const PricingSwitch = ({ onSwitch }: { onSwitch: (value: string) => void }) => {
  const [selected, setSelected] = useState("0");
  const handleSwitch = (value: string) => {
    setSelected(value);
    onSwitch(value);
  };

  return (
    <div className="flex justify-center">
      <div className="relative z-10 mx-auto flex w-fit rounded-full bg-neutral-900 border border-gray-700 p-1">
        <button
          onClick={() => handleSwitch("0")}
          className={cn(
            "relative z-10 w-fit h-10 rounded-full sm:px-6 px-3 sm:py-2 py-1 font-medium transition-colors",
            selected === "0" ? "text-white" : "text-gray-200",
          )}
        >
          {selected === "0" && (
            <motion.span
              layoutId={"switch"}
              className="absolute top-0 left-0 h-10 w-full rounded-full border-4 shadow-sm shadow-blue-600 border-blue-600 bg-gradient-to-t from-blue-500 to-blue-600"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative">Monthly</span>
        </button>
        <button
          onClick={() => handleSwitch("1")}
          className={cn(
            "relative z-10 w-fit h-10 flex-shrink-0 rounded-full sm:px-6 px-3 sm:py-2 py-1 font-medium transition-colors",
            selected === "1" ? "text-white" : "text-gray-200",
          )}
        >
          {selected === "1" && (
            <motion.span
              layoutId={"switch"}
              className="absolute top-0 left-0 h-10 w-full rounded-full border-4 shadow-sm shadow-blue-600 border-blue-600 bg-gradient-to-t from-blue-500 to-blue-600"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative flex items-center gap-2">Yearly</span>
        </button>
      </div>
    </div>
  );
};

export default function PricingSection4() {
  const [isYearly, setIsYearly] = useState(false);
  const pricingRef = useRef<HTMLDivElement>(null);

  const revealVariants = {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.4,
        duration: 0.5,
      },
    }),
    hidden: {
      filter: "blur(10px)",
      y: -20,
      opacity: 0,
    },
  };

  const togglePricingPeriod = (value: string) =>
    setIsYearly(Number.parseInt(value) === 1);

  return (
    <div
      className="min-h-screen mx-auto relative bg-black overflow-x-hidden"
      ref={pricingRef}
    >
      <TimelineContent
        animationNum={4}
        timelineRef={pricingRef}
        customVariants={revealVariants}
        className="absolute top-0 h-96 w-screen overflow-hidden [mask-image:radial-gradient(50%_50%,white,transparent)] pointer-events-none"
      >
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:70px_80px] opacity-50"></div>
        <SparklesComp
          density={1200}
          direction="bottom"
          speed={0.8}
          color="#60A5FA"
          className="absolute inset-x-0 bottom-0 h-full w-full [mask-image:radial-gradient(50%_50%,white,transparent_85%)]"
        />
      </TimelineContent>

      <TimelineContent
        animationNum={5}
        timelineRef={pricingRef}
        customVariants={revealVariants}
        className="absolute left-0 top-0 w-full h-full flex flex-col items-start justify-start content-start flex-none flex-nowrap gap-2.5 overflow-hidden p-0 z-0"
      >
        <motion.div
          className="absolute inset-0"
          animate={{
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)",
              filter: "blur(60px)",
            }}
          />
          <div
            className="absolute left-1/4 top-1/3 w-[600px] h-[600px] rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(6, 182, 212, 0.1) 0%, transparent 70%)",
              filter: "blur(50px)",
            }}
          />
          <div
            className="absolute right-1/4 bottom-1/3 w-[700px] h-[700px] rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, transparent 70%)",
              filter: "blur(55px)",
            }}
          />
        </motion.div>
      </TimelineContent>

      <article className="text-center mb-6 pt-32 max-w-3xl mx-auto space-y-2 relative z-50">
        <h2 className="text-4xl font-medium text-white">
          <VerticalCutReveal
            splitBy="words"
            staggerDuration={0.15}
            staggerFrom="first"
            reverse={true}
            containerClassName="justify-center"
            transition={{
              type: "spring",
              stiffness: 250,
              damping: 40,
              delay: 0,
            }}
          >
            Plans that work best for your business
          </VerticalCutReveal>
        </h2>
        <TimelineContent
          as="p"
          animationNum={0}
          timelineRef={pricingRef}
          customVariants={revealVariants}
          className="text-gray-300"
        >
          Trusted by businesses across America. We help teams automate operations and capture revenue they're missing. Explore which option is right for you.
        </TimelineContent>
        <TimelineContent
          as="div"
          animationNum={1}
          timelineRef={pricingRef}
          customVariants={revealVariants}
        >
          <PricingSwitch onSwitch={togglePricingPeriod} />
        </TimelineContent>
      </article>

      <motion.div
        className="absolute top-0 left-[10%] right-[10%] w-[80%] h-full z-0 pointer-events-none"
        animate={{
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          backgroundImage: `radial-gradient(circle at center, rgba(59, 130, 246, 0.3) 0%, transparent 70%)`,
        }}
      />

      <div className="grid md:grid-cols-3 max-w-5xl gap-4 py-6 mx-auto relative z-10">
        {plans.map((plan, index) => {
          const IconComponent = plan.icon;
          return (
            <TimelineContent
              key={plan.name}
              as="div"
              animationNum={2 + index}
              timelineRef={pricingRef}
              customVariants={revealVariants}
            >
              <Card
                className={cn(
                  "relative text-white border-neutral-800",
                  plan.popular
                    ? "bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 shadow-[0px_-13px_300px_0px_#0900ff] z-20"
                    : "bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 z-10"
                )}
              >
                <CardHeader className="text-left">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-3xl mb-2">{plan.name}</h3>
                    <IconComponent className="h-6 w-6 text-blue-400" />
                  </div>
                  <div className="flex items-baseline">
                    <span className="text-4xl font-semibold">
                      $
                      <NumberFlow
                        format={{
                          currency: "USD",
                        }}
                        value={isYearly ? plan.yearlyPrice : plan.price}
                        className="text-4xl font-semibold"
                      />
                    </span>
                    <span className="text-gray-300 ml-1">
                      /{isYearly ? "year" : "month"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 mb-4">{plan.description}</p>
                </CardHeader>
                <CardContent className="pt-0">
                  <button
                    className={cn(
                      "w-full mb-6 p-4 text-xl rounded-xl",
                      plan.popular
                        ? "bg-gradient-to-t from-blue-500 to-blue-600 shadow-lg shadow-blue-800 border border-blue-500 text-white"
                        : plan.buttonVariant === "outline"
                          ? "bg-gradient-to-t from-neutral-950 to-neutral-600 shadow-lg shadow-neutral-900 border border-neutral-800 text-white"
                          : ""
                    )}
                  >
                    {plan.buttonText}
                  </button>
                  <div className="space-y-3 pt-4 border-t border-neutral-700">
                    <h4 className="font-medium text-base mb-3">
                      {plan.includes[0]}
                    </h4>
                    <ul className="space-y-2">
                      {plan.includes.slice(1).map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-2">
                          <span className="h-2.5 w-2.5 bg-neutral-500 rounded-full grid place-content-center"></span>
                          <span className="text-sm text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TimelineContent>
          );
        })}
      </div>
    </div>
  );
}

