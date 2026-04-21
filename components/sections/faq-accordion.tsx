"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "What is Atriae?",
    answer:
      "Atriae is a personal system for thinking, planning, learning, and reflection in one calm workspace."
  },
  {
    question: "Who is it for?",
    answer:
      "For people who want better judgment and clearer execution without juggling disconnected tools."
  },
  {
    question: "How is AI used in Atriae?",
    answer:
      "Atriae uses AI to clarify your thinking, reveal patterns, and help you learn from how you make decisions over time."
  },
  {
    question: "Is it available now?",
    answer: "Atriae is currently invite-based while the product is being refined and expanded."
  },
  {
    question: "How do I get access?",
    answer: "Use any “Request access” button to join the invite list."
  }
];

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-3.5">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <article key={faq.question} className="overflow-hidden rounded-xl border border-[#163323]/16 bg-[#fffdf9]/86">
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left md:px-6"
            >
              <span className="text-base font-medium text-[#132318] md:text-lg">{faq.question}</span>
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-[#355242] transition duration-300 ${isOpen ? "rotate-180" : ""}`}
              />
            </button>
            <div
              className={`grid transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
            >
              <p className="overflow-hidden px-5 pb-5 text-sm leading-7 text-[#273a2e]/90 md:px-6 md:text-base">
                {faq.answer}
              </p>
            </div>
          </article>
        );
      })}
    </div>
  );
}
