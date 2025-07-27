from fastapi import FastAPI
from pydantic import BaseModel
import random
from transformers import pipeline
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
   allow_origins=[
           "http://localhost:3000",
           "http://localhost:8080",
           "http://127.0.0.1:8080",
       ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

generator = pipeline('text-generation', model='EleutherAI/gpt-neo-125M')

PROMPT_TEMPLATES = [
    "Only output a funny 5–10 word quote about: {task}. No extra words.",
    "Brief: In exactly 5–10 words, give a positive quote about: {task}.",
    "What is one uplifting sentence (5–10 words) about: {task}?",
    "Give only the funny quote, max 10 words, about: {task}.",
    "Generate exactly 8 words in a positive quote about: {task}."
]


class TaskRequest(BaseModel):
    task: str

@app.post("/generate-quote")
def generate_quote(request: TaskRequest):
    prompt = random.choice(PROMPT_TEMPLATES).format(task=request.task)
    results = generator(
        prompt,
        max_length=50,
        num_return_sequences=1,
        do_sample=True,
        temperature=0.9,
    )
    full_text = results[0]['generated_text'].strip()
    if full_text.startswith(prompt):
        generated_only = full_text[len(prompt):].strip()
    else:
        generated_only = full_text
    words = generated_only.split()
    limited_words = words[:30]
    quote = ' '.join(limited_words)
    return {"quote": quote}


