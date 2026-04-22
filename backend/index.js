const express = require("express")
const cors = require("cors")
require("dotenv").config()
const path = require("path")

const app = express() // HARUS DI ATAS

app.use(cors())
app.use(express.json())

// serve frontend
app.use(express.static(path.join(__dirname, "../public")))

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"))
})

const API_KEY = process.env.GEMINI_API_KEY

app.post("/api/chat", async (req, res) => {
  const message = req.body.message

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: message }]
            }
          ]
        })
      }
    )

    const data = await response.json()

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "AI lagi error, coba lagi."

    res.json({ reply })
  } catch (err) {
    res.json({ reply: "Server error." })
  }
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log("Server jalan di port", PORT)
})