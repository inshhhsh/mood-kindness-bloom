-- Create users table for tracking points
CREATE TABLE public.users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID UNIQUE,
  points INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create kindness_tasks table
CREATE TABLE public.kindness_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_text TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('self', 'others')),
  mood_tag TEXT NOT NULL CHECK (mood_tag IN ('sad', 'tired', 'okay', 'energized')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create reflections table
CREATE TABLE public.reflections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID REFERENCES public.kindness_tasks(id),
  mood_selected TEXT NOT NULL,
  user_feedback TEXT,
  user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kindness_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reflections ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is a demo app)
CREATE POLICY "Anyone can view kindness tasks" 
ON public.kindness_tasks 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can view and modify users" 
ON public.users 
FOR ALL 
USING (true);

CREATE POLICY "Anyone can create reflections" 
ON public.reflections 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can view reflections" 
ON public.reflections 
FOR SELECT 
USING (true);

-- Insert sample kindness tasks
INSERT INTO public.kindness_tasks (task_text, category, mood_tag) VALUES
-- Sad mood tasks
('Write down three things you''re grateful for today', 'self', 'sad'),
('Send a supportive message to a friend who might need it', 'others', 'sad'),
('Take a warm bath or shower to comfort yourself', 'self', 'sad'),

-- Tired mood tasks  
('Take a 10-minute nap or rest break', 'self', 'tired'),
('Make yourself a warm cup of tea or coffee', 'self', 'tired'),
('Offer to help someone with a small task', 'others', 'tired'),

-- Okay mood tasks
('Smile at a stranger or neighbor', 'others', 'okay'),
('Organize one small area of your living space', 'self', 'okay'),
('Leave a positive review for a local business', 'others', 'okay'),

-- Energized mood tasks
('Go for a walk and pick up any litter you see', 'others', 'energized'),
('Call or video chat with someone you haven''t spoken to in a while', 'others', 'energized'),
('Do 10 minutes of exercise or stretching', 'self', 'energized');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();