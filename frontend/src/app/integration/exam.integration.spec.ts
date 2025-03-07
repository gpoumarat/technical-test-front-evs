import 'zone.js';
import 'zone.js/testing';
import { ComponentFixture, TestBed, fakeAsync, tick, getTestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ExamFormComponent } from '../components/exam-form/exam-form.component';
import { ExamListComponent } from '../components/exam-list/exam-list.component';
import { ExamService } from '../services/exam.service';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ExamStatus } from '../models/exam.model';
import { CommonModule, registerLocaleData } from '@angular/common';
import { provideAnimations } from '@angular/platform-browser/animations';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import localeFr from '@angular/common/locales/fr';

// Register French locale
registerLocaleData(localeFr, 'fr-FR');

describe('Exam Integration Tests', () => {
  let examFormComponent: ExamFormComponent;
  let examListComponent: ExamListComponent;
  let examFormFixture: ComponentFixture<ExamFormComponent>;
  let examListFixture: ComponentFixture<ExamListComponent>;
  let examService: ExamService;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeAll(() => {
    getTestBed().resetTestEnvironment();
    getTestBed().initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        ReactiveFormsModule,
        ExamFormComponent,
        ExamListComponent
      ],
      providers: [
        provideAnimations(),
        ExamService,
        FormBuilder
      ]
    }).compileComponents();

    examService = TestBed.inject(ExamService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  beforeEach(() => {
    examFormFixture = TestBed.createComponent(ExamFormComponent);
    examListFixture = TestBed.createComponent(ExamListComponent);
    examFormComponent = examFormFixture.componentInstance;
    examListComponent = examListFixture.componentInstance;
    examFormFixture.detectChanges();
    examListFixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should update exam list after adding new exam', fakeAsync(() => {
    const mockExam = {
      id: '1',
      student: { first_name: 'John', last_name: 'Doe' },
      meeting_point: 'Paris',
      status: 'A organiser' as ExamStatus,
      date: '2024-01-01T10:00:00'
    };

    spyOn(examService, 'addExam').and.returnValue(of(mockExam));
    spyOn(examService, 'getExams').and.returnValue(of([mockExam]));
    const navigateSpy = spyOn(router, 'navigate');

    // Fill and submit the form
    examFormComponent.examForm.patchValue({
      student: { first_name: 'John', last_name: 'Doe' },
      meeting_point: 'Paris',
      examDate: '2024-01-01',
      examTime: '10:00',
      status: 'A organiser'
    });

    examFormFixture.detectChanges();
    examFormComponent.onSubmit();
    examFormFixture.detectChanges();
    tick();

    // Verify form submission
    expect(examService.addExam).toHaveBeenCalled();

    tick(1500); // Wait for the navigation delay
    expect(navigateSpy).toHaveBeenCalledWith(['/exams']);

    // Simulate navigation to exam list
    examListComponent.ngOnInit();
    examListFixture.detectChanges();
    tick();

    // Verify exam list is updated
    expect(examService.getExams).toHaveBeenCalled();
    expect(examListComponent.exams).toContain(mockExam);
  }));

  it('should display error messages properly between components', fakeAsync(() => {
    const mockError = new Error('Network error');
    spyOn(examService, 'getExams').and.returnValue(throwError(() => mockError));
    
    // Check error handling in list component
    examListComponent.ngOnInit();
    examListFixture.detectChanges();
    tick();
    
    expect(examListComponent.error).toBeTruthy();

    // Check error handling in form component
    spyOn(examService, 'addExam').and.returnValue(throwError(() => new Error('Server error')));

    examFormComponent.examForm.patchValue({
      student: { first_name: 'John', last_name: 'Doe' },
      meeting_point: 'Paris',
      examDate: '2024-01-01',
      examTime: '10:00'
    });

    examFormComponent.onSubmit();
    tick();

    expect(examFormComponent.errorMessage).toBeTruthy();
    expect(examFormComponent.successMessage).toBe('');
  }));
});