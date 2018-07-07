import { Component, OnInit, OnDestroy } from '@angular/core';
import { Student } from '../student.model';

import { Subscription } from 'rxjs';

import { StudentsService } from '../students.service';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css']
})
export class StudentListComponent implements OnInit, OnDestroy {

  students: Student[] = [];
  private studentsSub: Subscription;

  displayedColumns: string[] = ['name', 'surname', 'sex', 'birthday','mail','bus1','bus2','bus3','button'];

  constructor(public studentService: StudentsService) {}

  ngOnInit() {
    this.studentService.getStudents();
    this.studentsSub = this.studentService.getStudentsUpdateListener()
      .subscribe((students: Student[]) => {
        this.students = students;
      });
  }

  onDelete(studentId: string) {
    let result = confirm("Etes vous sur de vouloir supprimer ?");
    if (result) {
      this.studentService.deleteStudents(studentId);
    }
  }

  ngOnDestroy() {
    this.studentsSub.unsubscribe();
  }


}
