"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Send, Bot, UserRound, Headphones } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "@/lib/auth/SessionProvider";
import { answerCustomer } from "@/modules/cs/service";
import { currentCustomerId } from "@/modules/orders/service";

interface Msg {
  from: "customer" | "ai" | "human";
  text: string;
}

export function ChatThread({
  initial,
  customerName,
}: {
  initial: Msg[];
  customerName: string;
}) {
  const { industry } = useSession();
  const [messages, setMessages] = React.useState<Msg[]>(initial);
  const [input, setInput] = React.useState("");
  const [typing, setTyping] = React.useState(false);
  const [escalated, setEscalated] = React.useState(false);
  const endRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  async function send() {
    const q = input.trim();
    if (!q || typing) return;
    setMessages((m) => [...m, { from: "customer", text: q }]);
    setInput("");
    setTyping(true);
    const cid = currentCustomerId(industry);
    const res = answerCustomer(industry, cid, q);
    setTimeout(() => {
      setMessages((m) => [...m, { from: res.escalate ? "human" : "ai", text: res.text }]);
      if (res.escalate) setEscalated(true);
      setTyping(false);
    }, 650);
  }

  const quick = ["我的訂單到哪了?", "可以幫我報價嗎?", "有什麼優惠?"];

  return (
    <div className="flex h-[calc(100dvh-11rem)] flex-col rounded-2xl border border-slate-200 bg-white shadow-card">
      {/* header */}
      <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-white">
          <Bot className="h-4 w-4" />
        </span>
        <div>
          <div className="text-[14px] font-semibold text-slate-800">AI 客服小助手</div>
          <div className="text-[11px] text-emerald-500">● 線上 · 秒回</div>
        </div>
        {escalated && (
          <span className="ml-auto flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-[11px] font-medium text-amber-600">
            <Headphones className="h-3 w-3" /> 已轉真人
          </span>
        )}
      </div>

      {/* messages */}
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((m, i) => (
          <Bubble key={i} msg={m} />
        ))}
        {typing && (
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-50 text-brand-600">
              <Bot className="h-3.5 w-3.5" />
            </span>
            <div className="flex gap-1 rounded-2xl rounded-tl-sm bg-slate-100 px-3 py-2.5">
              {[0, 1, 2].map((d) => (
                <motion.span
                  key={d}
                  className="h-1.5 w-1.5 rounded-full bg-slate-400"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: d * 0.2 }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* quick replies */}
      {messages.length <= initial.length + 1 && (
        <div className="flex flex-wrap gap-2 px-4 pb-2">
          {quick.map((q) => (
            <button
              key={q}
              onClick={() => setInput(q)}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[12px] text-slate-600 active:scale-95"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* input */}
      <div className="flex items-center gap-2 border-t border-slate-100 p-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder={`以 ${customerName} 身分提問…`}
          className="h-10 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 text-[14px] outline-none focus:ring-2 focus:ring-brand-300"
        />
        <button
          onClick={send}
          disabled={!input.trim() || typing}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white active:scale-95 disabled:opacity-40"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function Bubble({ msg }: { msg: Msg }) {
  const mine = msg.from === "customer";
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("flex items-end gap-2", mine && "flex-row-reverse")}
    >
      <span
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
          mine
            ? "bg-slate-200 text-slate-500"
            : msg.from === "human"
            ? "bg-amber-100 text-amber-600"
            : "bg-brand-50 text-brand-600"
        )}
      >
        {mine ? (
          <UserRound className="h-3.5 w-3.5" />
        ) : msg.from === "human" ? (
          <Headphones className="h-3.5 w-3.5" />
        ) : (
          <Bot className="h-3.5 w-3.5" />
        )}
      </span>
      <div
        className={cn(
          "max-w-[78%] rounded-2xl px-3 py-2 text-[13px] leading-relaxed",
          mine
            ? "rounded-br-sm bg-brand-600 text-white"
            : "rounded-tl-sm bg-slate-100 text-slate-700"
        )}
      >
        {msg.text}
      </div>
    </motion.div>
  );
}
