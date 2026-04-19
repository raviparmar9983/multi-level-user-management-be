import express from "express";
import cors from "cors";
import { connectDB } from "./config/db";
import { env } from "./config/env";
import authRoutes from './routes/auth.routes'
import userRoutes from './routes/user.routes';
import { errorHandler } from "./middlewares/error.middleware";
import transactionRoutes from "./routes/transaction.routes";
import walletRoutes from "./routes/wallet.routes";
import adminRoutes from "./routes/admin.routes";
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/wallet", walletRoutes)
app.use("/api/transactions", transactionRoutes);
app.use("/api/admin", adminRoutes)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use(errorHandler);

const startServer = async () => {
  await connectDB();

  app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
  });
};

startServer();