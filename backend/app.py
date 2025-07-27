from fastapi import FastAPI
from pydantic import BaseModel
import random
from transformers import pipeline
from fastapi.middleware.cors import CORSMiddleware
import re
from threading import Lock

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

generator = pipeline( "text-generation",
                         model="gpt2",
                         device=-1)

PROMPT_TEMPLATES = [
    "Only output a funny 5–10 word quote about: {task}. No extra words.",
    "Brief: In exactly 5–10 words, give a positive quote about: {task}.",
    "What is one uplifting sentence max 10 words about: {task}?",
    "Give only the funny quote, max 10 words, about: {task}.",
    "Generate exactly 10 words in a positive quote about: {task}."
]


class TaskRequest(BaseModel):
    task: str

generator_lock = Lock()

@app.post("/generate-quote")
def generate_quote(request: TaskRequest):
    prompt = random.choice(PROMPT_TEMPLATES).format(task=request.task)
    with generator_lock:
        results = generator(
            prompt,
            max_new_tokens=20,
            do_sample=True,
            temperature=0.8,
            truncation=True
        )
        full_text = results[0]['generated_text'].strip()
        if full_text.startswith(prompt):
            generated_only = full_text[len(prompt):].strip()
        else:
            generated_only = full_text

        cleaned = generated_only.replace('\n', ' ').strip()

        match = re.search(r'^(.*?[.!?])(\s|$)', cleaned)
        if match:
            quote = match.group(1).strip()
        else:
            words = cleaned.split()
            quote = ' '.join(words[:10])

    return {"quote": quote}





