import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { ExamService } from '../../services/exam.service';
import { Exam, ExamStatus } from '../../models/exam.model';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-exam-form',
  templateUrl: './exam-form.component.html',
  styleUrls: ['./exam-form.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class ExamFormComponent implements OnInit, OnDestroy {
  examForm!: FormGroup;
  submitting = false;
  successMessage = '';
  errorMessage = '';
  showForm = false;
  private subscription: Subscription | null = null;
  private readonly NAVIGATION_DELAY = 1500;
  
  statusOptions: ExamStatus[] = ['A organiser', 'Recherche de place', 'Confirmé', 'Annulé'];

  constructor(
    private fb: FormBuilder,
    private examService: ExamService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  initForm(): void {
    this.examForm = this.fb.group({
      student: this.fb.group({
        first_name: ['', [Validators.required]],
        last_name: ['', [Validators.required]]
      }),
      meeting_point: ['', [Validators.required]],
      examDate: ['', [Validators.required]],
      examTime: ['', [Validators.required, this.validateTimeStep]],
      status: ['A organiser', [Validators.required]]
    });
  }

  private validateTimeStep(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    
    const time = control.value;
    const [hours, minutes] = time.split(':').map(Number);
    
    // Ensure we're strictly checking for 00 or 30 minutes
    if (minutes !== 0 && minutes !== 30) {
      return { invalidTimeStep: { message: 'Les minutes doivent être soit 00 soit 30', value: control.value } };
    }
    
    return null;
  }

  private combineDateAndTime(date: string, time: string): string {
    if (!date || !time) return '';
    const [year, month, day] = date.split('-');
    const [hours, minutes] = time.split(':');
    return `${year}-${month}-${day}T${hours}:${minutes}:00`;
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (this.showForm) {
      this.initForm();
      this.successMessage = '';
      this.errorMessage = '';
    }
  }

  onSubmit(): void {
    if (this.examForm.invalid) {
      this.examForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const formValue = this.examForm.value;
    const { examDate, examTime, ...rest } = formValue;
    const examData: Exam = {
      ...rest,
      date: this.combineDateAndTime(examDate, examTime)
    };
    
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    
    this.subscription = this.examService.addExam(examData).subscribe({
      next: () => {
        this.successMessage = 'Examen ajouté avec succès';
        this.errorMessage = '';
        this.submitting = false;
        this.showForm = false;
        this.initForm();
        setTimeout(() => {
          this.router.navigate(['/exams']);
        }, this.NAVIGATION_DELAY);
      },
      error: (error) => {
        this.errorMessage = error?.message || 'Erreur lors de l\'ajout de l\'examen.';
        this.successMessage = '';
        this.submitting = false;
        console.error('Error adding exam:', error);
      }
    });
  }
}