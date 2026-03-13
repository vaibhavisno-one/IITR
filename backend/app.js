import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())

import authRoutes from "./src/routes/auth.routes.js"
import userRoutes from "./src/routes/user.routes.js"
import projectRoutes from "./src/routes/project.routes.js"
import milestoneRoutes from "./src/routes/milestone.routes.js"
import submissionRoutes from "./src/routes/submission.routes.js"
import paymentRoutes from "./src/routes/payment.routes.js"
import pfiRoutes from "./src/routes/pfi.routes.js"
import projectNestedRoutes from "./src/routes/project-nested.routes.js"

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/projects", projectRoutes)
app.use("/api/projects", projectNestedRoutes)
app.use("/api/milestones", milestoneRoutes)
app.use("/api/submissions", submissionRoutes)
app.use("/api/payments", paymentRoutes)
app.use("/api/pfi", pfiRoutes)

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const message = err.message || "Internal Server Error"
    
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        errors: err.errors || [],
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined
    })
})

export { app }