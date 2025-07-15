const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();
const { GoogleAuth } = require("google-auth-library");

const app = express();
const PORT = process.env.PORT || 3000;

if (!process.env.TARGET_URL) {
  throw new Error("❌ .env에 TARGET_URL이 정의되어야 합니다");
}
const TARGET_URL = process.env.TARGET_URL;

app.use(cors({
  origin: "https://nowcrave.rootworks.co.kr"
}));
app.use(express.json());

app.post("/recommend", async (req, res) => {
  try {
    const { modelType } = req.body;

    const auth = new GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON),
    });

    const client = await auth.getIdTokenClient(TARGET_URL);

    const response = await client.request({
      url: TARGET_URL,
      method: "POST",
      data: req.body,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("🔥 프록시 에러 상세:", error?.response?.data || error.message);
    res.status(error?.response?.status || 500).json({
      error: "프록시 서버 오류 발생",
    });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log("✅ 프록시 서버 실행 중");

  if (process.env.RENDER_EXTERNAL_URL) {
    console.log(`🔗 실제 접속 주소: ${process.env.RENDER_EXTERNAL_URL}`);
  } else {
    console.log(`🔗 로컬 접속 주소: http://localhost:${PORT}`);
  }
});