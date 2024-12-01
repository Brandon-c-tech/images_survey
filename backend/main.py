import json
from datetime import datetime
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

app = FastAPI()

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://34.68.127.14:3000",
        "http://34.68.127.14"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 获取项目根目录的绝对路径
project_root = "/root/survey-project"
assets_dir = os.path.join(project_root, "assets")

# 修改静态文件挂载
app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

# 创建日志目录
LOG_DIR = Path("../log")
LOG_DIR.mkdir(exist_ok=True)

# 加载问卷数据
QUESTIONNAIRE_PATH = Path("/root/survey-project/assets/questionnaire_modified.json")

def load_questions():
    try:
        with open(QUESTIONNAIRE_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
            return data["questions"]
    except Exception as e:
        print(f"加载问卷数据失败: {e}")
        return []

# 替换原有的静态questions变量
questions = load_questions()

@app.get("/api/questions")
async def get_questions():
    return questions

@app.get("/api/question/{question_id}")
async def get_question(question_id: int):
    for q in questions:
        if q["id"] == question_id:
            return q
    return {"error": "Question not found"}

@app.post("/api/submit")
async def submit_answer(answer: dict):
    # 生成时间戳作为文件名的一部分
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S_%f")
    username = answer.get("username", "anonymous")
    
    # 创建用户专属目录
    user_dir = LOG_DIR / username
    user_dir.mkdir(exist_ok=True)
    
    # 保存答案
    filename = f"question_{answer['questionId']}_{timestamp}.json"
    with open(user_dir / filename, "w", encoding="utf-8") as f:
        json.dump(answer, f, ensure_ascii=False, indent=2)
    
    return {"status": "success"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)