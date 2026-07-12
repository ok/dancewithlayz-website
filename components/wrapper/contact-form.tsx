"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { GeistMono } from "geist/font/mono"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const contactSchema = z.object({
  name: z.string().trim().min(1, "Tell us who you are"),
  email: z.string().trim().email("Enter a valid email"),
  message: z.string().trim().min(10, "A few more words would help"),
  "bot-field": z.string().optional(),
})

type ContactValues = z.infer<typeof contactSchema>

function encodeFormData(data: Record<string, string>): string {
  return Object.keys(data)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
    .join("&")
}

// Posts to Netlify Forms (form name "contact", registered via public/forms.html
// since Netlify's build bot can't see this client-rendered form). Netlify
// filters spam with Akismet, rejects anything with the bot-field honeypot
// filled, and emails whoever is set as a notification recipient in the
// Netlify dashboard under Site settings > Forms > Form notifications.
async function submitToNetlify(values: ContactValues): Promise<void> {
  const response = await fetch("/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: encodeFormData({ "form-name": "contact", ...values }),
  })
  if (!response.ok) {
    throw new Error(`Form submission failed: ${response.status}`)
  }
}

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", message: "", "bot-field": "" },
  })

  async function onSubmit(values: ContactValues) {
    if (values["bot-field"]) {
      // A real visitor never sees or fills this field — only bots that blindly
      // fill every input do. Pretend it worked and drop it silently.
      form.reset()
      return
    }

    setIsSubmitting(true)
    try {
      await submitToNetlify(values)
      toast.success("Message sent — thanks for reaching out!")
      form.reset()
    } catch {
      toast.error("Something went wrong sending that. Try again in a bit.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        name="contact"
        data-netlify="true"
        data-netlify-honeypot="bot-field"
        className={`${GeistMono.className} max-w-xl space-y-5`}
      >
        <input type="hidden" name="form-name" value="contact" />
        <div className="hidden" aria-hidden="true">
          <label>
            Leave this field empty
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              {...form.register("bot-field")}
            />
          </label>
        </div>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[0.65rem] uppercase tracking-[0.14em] text-white/70">
                Name
              </FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[0.65rem] uppercase tracking-[0.14em] text-white/70">
                Email
              </FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[0.65rem] uppercase tracking-[0.14em] text-white/70">
                Message
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Booking, collab, press, whatever's on your mind..."
                  rows={5}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-[hsl(var(--acid))] text-background hover:bg-[hsl(var(--acid-dim))] uppercase tracking-[0.14em] text-xs"
        >
          {isSubmitting ? "Sending..." : "Send message"}
        </Button>
      </form>
    </Form>
  )
}
