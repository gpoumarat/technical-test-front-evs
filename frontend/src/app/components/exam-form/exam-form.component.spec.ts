/// <reference types="jasmine" />

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ExamFormComponent } from './exam-form.component';
import { ExamService } from '../../services/exam.service';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ExamStatus } from 'src/app/models/exam.model';
import { CommonModule } from '@angular/common';

describe('ExamFormComponent', () => {
  let component: ExamFormComponent;
  let fixture: ComponentFixture<ExamFormComponent>;
  let examService: jasmine.SpyObj<ExamService>;
  let router: Router;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ExamService', ['addExam']);
    
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterTestingModule,
        ExamFormComponent
      ],
      providers: [
        FormBuilder,
        { provide: ExamService, useValue: spy }
      ]
    }).compileComponents();

    examService = TestBed.inject(ExamService) as jasmine.SpyObj<ExamService>;
    router = TestBed.inject(Router);
    formBuilder = TestBed.inject(FormBuilder);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.examForm.get('student.first_name')?.value).toBe('');
    expect(component.examForm.get('student.last_name')?.value).toBe('');
    expect(component.examForm.get('meeting_point')?.value).toBe('');
    expect(component.examForm.get('status')?.value).toBe('A organiser');
  });

  it('should validate required fields', () => {
    const form = component.examForm;
    expect(form.valid).toBeFalsy();
    
    form.controls['student'].get('first_name')?.setValue('John');
    form.controls['student'].get('last_name')?.setValue('Doe');
    form.controls['meeting_point'].setValue('Paris');
    form.controls['examDate'].setValue('2024-01-01');
    form.controls['examTime'].setValue('10:00');
    
    expect(form.valid).toBeTruthy();
  });

  it('should submit form successfully', fakeAsync(() => {
    const mockExam = {
      student: { first_name: 'John', last_name: 'Doe' },
      meeting_point: 'Paris',
      status: 'A organiser' as ExamStatus,
      date: '2024-01-01T10:00:00'
    };
    
    examService.addExam.and.returnValue(of(mockExam));
    spyOn(router, 'navigate');

    component.examForm.patchValue({
      student: { first_name: 'John', last_name: 'Doe' },
      meeting_point: 'Paris',
      examDate: '2024-01-01',
      examTime: '10:00'
    });

    component.onSubmit();
    tick(); 
    tick(1500);

    expect(examService.addExam).toHaveBeenCalledWith(jasmine.objectContaining(mockExam));
    expect(component.successMessage).toBeTruthy();
    expect(component.errorMessage).toBe('');
    expect(router.navigate).toHaveBeenCalledWith(['/exams']);
  }));

  it('should handle submission error', fakeAsync(() => {
    examService.addExam.and.returnValue(throwError(() => new Error('Server error')));
    
    component.examForm.patchValue({
      student: { first_name: 'John', last_name: 'Doe' },
      meeting_point: 'Paris',
      examDate: '2024-01-01',
      examTime: '10:00'
    });

    component.onSubmit();
    tick();

    expect(component.errorMessage).toBeTruthy();
    expect(component.successMessage).toBe('');
  }));
});