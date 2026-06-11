'use client'

import React from 'react'
import { motion } from 'framer-motion'

export type TestimonialItem = {
  text: string
  image: string
  name: string
  role: string
}

export const TestimonialsColumn = (props: {
  className?: string
  testimonials: TestimonialItem[]
  duration?: number
}) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{ translateY: '-50%' }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: 'linear',
          repeatType: 'loop',
        }}
        className="flex flex-col gap-6 pb-6"
      >
        {[...new Array(2).fill(0).map((_, index) => (
          <React.Fragment key={index}>
            {props.testimonials.map(({ text, image, name, role }, i) => (
              <div
                key={i}
                className="max-w-xs w-full rounded-3xl border border-gray-200 bg-white p-8"
                style={{ boxShadow: '0 8px 32px rgba(13,13,15,0.07)' }}
              >
                <p className="text-[14px] leading-relaxed text-marine-700" style={{ fontFamily: 'var(--font-jakarta)' }}>
                  &ldquo;{text}&rdquo;
                </p>
                <div className="mt-5 flex items-center gap-3">
                  <img
                    width={40}
                    height={40}
                    src={image}
                    alt={name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div className="flex flex-col">
                    <span className="text-[13px] font-semibold leading-5 text-marine-900">
                      {name}
                    </span>
                    <span className="text-[12px] leading-5 text-marine-400">
                      {role}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))]}
      </motion.div>
    </div>
  )
}
