import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Exam } from '../../models/exam.model';
import { ExamService } from '../../services/exam.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-exam-list',
  templateUrl: './exam-list.component.html',
  styleUrls: ['./exam-list.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class ExamListComponent implements OnInit, OnDestroy {
  exams: Exam[] = [];
  loading: boolean = false;
  error: string | null = null;
  private subscription: Subscription | null = null;

  constructor(private examService: ExamService) { }

  ngOnInit(): void {
    this.loadExams();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  loadExams(): void {
    this.loading = true;
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.subscription = this.examService.getExams().subscribe({
      next: (data) => {
        this.exams = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors de la récupération des examens.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Confirmé':
        return 'badge bg-success';
      case 'A organiser':
        return 'badge bg-warning text-dark';
      case 'Recherche de place':
        return 'badge bg-info text-dark';
      case 'Annulé':
        return 'badge bg-danger';
      default:
        return 'badge bg-secondary';
    }
  }
}