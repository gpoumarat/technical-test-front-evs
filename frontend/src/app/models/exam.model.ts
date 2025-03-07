export interface Student {
  first_name: string;
  last_name: string;
}

export type ExamStatus = 'A organiser' | 'Annulé' | 'Recherche de place' | 'Confirmé';

export interface Exam {
  student: Student;
  meeting_point: string;
  date: string; // Format date-time
  status: ExamStatus;
}