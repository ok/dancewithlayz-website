import { JetBrains_Mono, Syne } from "next/font/google"

// Display + body face. Exposed as a CSS variable used by app/layz.css.
export const syne = Syne({
  subsets: ["latin"],
  weight: ["500", "700", "800"],
  variable: "--font-syne",
  display: "swap",
})

// Labels, metadata, timecodes.
export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-jetbrains",
  display: "swap",
})
