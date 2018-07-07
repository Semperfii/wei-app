import { NgModule, Component, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { Student } from '../student.model';
import { StudentsService } from '../students.service';
import { ActivatedRoute, ParamMap, RouterLink } from '@angular/router';






@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.css']
})
export class StudentFormComponent implements OnInit {

  constructor(public studentsService: StudentsService, public route: ActivatedRoute) {
  }

  sex = ['Homme', 'Femme'];
  bus = ['Wei', 'Adr', 'Wacs'];

  model = {
    _id: "0",
    name: "John",
    surname: "Doe",
    mail: "john.doe@gmail.com",
    birthday: "1998-12-31",
    sex: "Homme",
    bus1: this.bus[0],
    bus2: this.bus[1],
    bus3: this.bus[2]
  }

  public mode = "create";
  private studentId: string;
  student: Student = this.model;

  onRegisterStudent(form: NgForm) {
    if (this.mode === "create") {
      this.studentsService.addStudent(form.value.name, form.value.surname, form.value.mail, form.value.birthday, form.value.sex, form.value.bus1, form.value.bus2, form.value.bus3);
    }
    else if (this.mode === "edit") {
      this.studentsService.updateStudent(this.studentId, form.value.name, form.value.surname, form.value.mail, form.value.birthday, form.value.sex, form.value.bus1, form.value.bus2, form.value.bus3);
    } 
  }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('studentId')) {
        this.mode = "edit";
        this.studentId = paramMap.get('studentId');
        this.studentsService.getStudent(this.studentId).subscribe(studentData => {
          this.student = {
            _id: studentData.student._id,
            name: studentData.student.name,
            surname: studentData.student.surname,
            mail: studentData.student.mail,
            birthday: studentData.student.birthday,
            sex: studentData.student.sex,
            bus1: studentData.student.bus1,
            bus2: studentData.student.bus2,
            bus3: studentData.student.bus3
          }
        });
      }
      else {
        this.mode = "create";
        this.studentId = null;
      }
    });
  }

}
