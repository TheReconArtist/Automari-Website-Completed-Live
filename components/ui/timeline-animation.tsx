"use client"

import { useEffect, useRef, useState } from "react"
import { motion, HTMLMotionProps } from "framer-motion"
import { cn } from "@/lib/utils"

interface TimelineContentProps extends Omit<HTMLMotionProps<"div">, "as"> {
  animationNum: number
  timelineRef: React.RefObject<HTMLElement>
  customVariants?: any
  as?: "div" | "p" | "span" | "section" | "article"
}

export function TimelineContent({
  animationNum,
  timelineRef,
  customVariants,
  as = "div",
  className,
  children,
  ...props
}: TimelineContentProps) {
  const [isVisible, setIsVisible] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px",
      }
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current)
      }
    }
  }, [])

  const defaultVariants = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: animationNum * 0.1,
        duration: 0.5,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
    },
  }

  const variants = customVariants || defaultVariants

  const MotionComponent = motion[as]

  return (
    <MotionComponent
      ref={elementRef}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={variants}
      className={cn(className)}
      {...props}
    >
      {children}
    </MotionComponent>
  )
}

