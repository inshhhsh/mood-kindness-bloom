from fastapi import FastAPI
from pydantic import BaseModel
import random
import os
from transformers import pipeline
from supabase import create_client, Client

supabase: Client = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_KEY")
)

def ensure_prompt_column_exists():
    """Checks and adds the prompt column if missing"""
    try:
        supabase.table('kindness_tasks').select("prompt").limit(1).execute()
    except Exception as e:
        if 'column "prompt" does not exist' in str(e):
            supabase.rpc('add_prompt_column').execute()
            print("Added prompt column to table")
        else:
            raise e

def create_column_addition_function():
    """Creates the SQL function we'll call later"""
    supabase.rpc('create_or_replace_function', {
        'function_name': 'add_prompt_column',
        'function_definition': """
        BEGIN
            EXECUTE 'ALTER TABLE kindness_tasks ADD COLUMN IF NOT EXISTS prompt TEXT';
            RETURN TRUE;
        END;
        """
    }).execute()


app = FastAPI()

PROMPT_TEMPLATES = [
    "Write a short funny quote about: {task}.",
    "Give me a funny quote on: {task}.",
    "Create an uplifting quote related to: {task}.",
    "Create a funny prompt for this kindness task: {task}.",
    "Make a brief, funny quote about: {task}."
]

generator = pipeline('text-generation', model='EleutherAI/gpt-neo-125M')

class TaskRequest(BaseModel):
    task: str

@app.post("/generate-quote")
def generate_quote(request: TaskRequest):
    prompt = random.choice(PROMPT_TEMPLATES).format(task=request.task)
    results = generator(prompt, max_length=50, num_return_sequences=1, do_sample=True, temperature=0.9)
    quote = results[0]['generated_text'].strip()
    return {"quote": quote}

@app.post("/generate-tasks")
async def generate_tasks(mood: str):
    tasks = get_tasks_from_db(mood)
    return {
        "tasks": [{
            "id": task.id,
            "task_text": task.task_text,
            "prompt": task.prompt or None,
            "category": task.category,
            "mood_tag": task.mood_tag
        } for task in tasks]
    }

create_column_addition_function()
ensure_prompt_column_exists()