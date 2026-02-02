export type QuestionType = 
  | 'single' 
  | 'multiple' 
  | 'ranking' 
  | 'text' 
  | 'textarea' 
  | 'info' 
  | 'conditional';

export interface Option {
  label: string;
  value: string;
  isOther?: boolean;
}

export interface Question {
  id: string;
  type: QuestionType;
  title: string;
  description?: string;
  options?: Option[];
  required?: boolean;
  placeholder?: string;
  conditionalId?: string; // The ID of the question that triggers this
  conditionalValue?: string | string[]; // The value(s) that trigger this
  subQuestions?: Question[]; // For complex nested logic
  image?: string;
}

export interface Section {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

export type FormData = Record<string, any>;