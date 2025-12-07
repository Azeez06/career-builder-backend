dotenv.config();
connectDB();

const app = express();

// ⚡ Add this BEFORE routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: [
    "https://my-real-final-plp-project-8q5a.vercel.app",
    "https://my-real-final-plp-pro-git-2df1a0-azeezsulaiman05-9367s-projects.vercel.app",
    "https://my-real-final-plp-project-8q5a-h020aldie.vercel.app",
    "http://localhost:5173"
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);

// Health check
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// 404 + error handler
app.use(notFound);
app.use(errorHandler);

export default app;
