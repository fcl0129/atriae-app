"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "What is Atriae?",
    answer: "Atriae is a personal system for notes, planning, focus, and reflection in one calm workspace."
  },
  {
    question: "Who is it for?",
    answer: "For people who want a quieter way to think and execute without juggling disconnected tools."
  },
  {
    question: "How is it different?",
    answer: "Atriae is designed around clarity and intentionality rather than engagement loops or noisy feeds."
  },
  {
    question: "Is it available now?",
    answer: "Atriae is currently invite-based while the product is refined and expanded."
  },
  {
    question: "How do I get access?",
    answer: "Use any “Request access” button and submit your details to join the invite list."
  }
];

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <article key={faq.question} className="overflow-hidden rounded-2xl border border-[#163323]/16 bg-[#fffdf9]/85">
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex w-full items-center justify-between px-5 py-4 text-left"
            >
              <span className="text-base font-medium text-[#132318] md:text-lg">{faq.question}</span>
              <ChevronDown className={`h-4 w-4 text-[#355242] transition ${isOpen ? "rotate-180" : ""}`} />
            </button>
            <div
              className={`grid transition-all duration-300 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
            >
              <p className="overflow-hidden px-5 pb-4 text-sm leading-7 text-[#273a2e]/90 md:text-base">{faq.answer}</p>
            </div>
          </article>
        );
      })}
    </div>
  );
}
