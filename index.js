const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

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
    const response = await axios.post(TARGET_URL, req.body, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(error);
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