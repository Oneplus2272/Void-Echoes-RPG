import logging
import asyncio
import uvicorn
import os
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel
from typing import Optional
from aiogram import Bot, Dispatcher, types
from aiogram.filters import Command
from aiogram.types import WebAppInfo, InlineKeyboardMarkup, InlineKeyboardButton

# --- НАСТРОЙКИ ---
API_TOKEN = '8315913789:AAHbwt28aOlyfAaxbDhfOcbgpOSxLMzPYdw'
WEBAPP_URL = 'https://oneplus2272.github.io/Void-Echoes-RPG/'

# --- БАЗА ДАННЫХ ---
SQLALCHEMY_DATABASE_URL = "sqlite:///./game.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class UserORM(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, nullable=True)
    hero_class = Column(String, nullable=True) # Новая колонка для класса
    level = Column(Integer, default=1)
    gold = Column(Integer, default=100)
    hp = Column(Integer, default=100)
    max_hp = Column(Integer, default=100)
    attack = Column(Integer, default=10)

Base.metadata.create_all(bind=engine)

class UserSchema(BaseModel):
    id: int
    username: Optional[str]
    hero_class: Optional[str]
    level: int
    gold: int
    hp: int
    max_hp: int
    attack: int
    class Config: from_attributes = True

app = FastAPI()
bot = Bot(token=API_TOKEN)
dp = Dispatcher()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try: yield db
    finally: db.close()

@dp.message(Command("start"))
async def cmd_start(message: types.Message):
    markup = InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text="🎮 Войти в Арену", web_app=WebAppInfo(url=WEBAPP_URL))]
    ])
    await message.answer("⚔️ **Void Echoes**\nМир Бездны ждет тебя!", reply_markup=markup, parse_mode="Markdown")

# Получение данных героя
@app.get("/get_hero/{user_id}", response_model=UserSchema)
def get_hero(user_id: int, db: Session = Depends(get_db)):
    user = db.query(UserORM).filter(UserORM.id == user_id).first()
    if not user:
        user = UserORM(id=user_id, username=f"Player_{user_id}")
        db.add(user); db.commit(); db.refresh(user)
    return user

# Сохранение выбранного класса
@app.post("/set_hero/{user_id}/{hero_class}")
def set_hero(user_id: int, hero_class: str, db: Session = Depends(get_db)):
    user = db.query(UserORM).filter(UserORM.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.hero_class = hero_class
    db.commit()
    return {"status": "success", "class": hero_class}

@app.post("/train/{user_id}/{stat}")
def train_stat(user_id: int, stat: str, db: Session = Depends(get_db)):
    user = db.query(UserORM).filter(UserORM.id == user_id).first()
    if not user or user.gold < 10: return {"status": "error"}
    if stat == "attack": user.attack += 1
    user.gold -= 10
    db.commit()
    return {"status": "success"}

async def main():
    logging.basicConfig(level=logging.INFO)
    port = int(os.environ.get("PORT", 8000))
    config = uvicorn.Config(app, host="0.0.0.0", port=port)
    server = uvicorn.Server(config)
    # Запускаем бота и сервер параллельно
    await asyncio.gather(dp.start_polling(bot), server.serve())

if __name__ == "__main__":
    asyncio.run(main())
