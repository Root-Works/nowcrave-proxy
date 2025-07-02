const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const TARGET_URL = process.env.TARGET_URL || "https://recommendv2-tvegrk7hbq-an.a.run.app";

app.use(cors());
app.use(express.json());

app.post("/recommend", async (req, res) => {
  try {
    const response = await axios.post(TARGET_URL, req.body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: req.headers.authorization || "", // Firebase 토큰 전달
      },
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("🔴 프록시 에러:", error?.response?.data || error.message);
    res.status(error?.response?.status || 500).json({
      error: "프록시 서버 오류 발생",
    });
  }
});

app.listen(PORT, () => {
  console.log(`✅ 프록시 서버가 http://localhost:${PORT} 에서 실행 중입니다`);
});