import { Student } from './student.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class StudentsService {
    private students: Student[] = [];
    private studentsUpdated = new Subject<Student[]>();

    constructor(private http: HttpClient) { }

    getStudents() {
        this.http
            .get<Student[]>('http://localhost:3000/api/students')
            .pipe(map((postData) => { // formater le _id en id mais en fait ici ça va
                return postData.map(student => {
                    return {
                        _id: student._id,
                        name: student.name,
                        surname: student.surname,
                        mail: student.mail,
                        birthday: student.birthday,
                        sex: student.sex,
                        bus1: student.bus1,
                        bus2: student.bus2,
                        bus3: student.bus3
                    };
                });
            }))
            .subscribe(postData => {
                this.students = postData;
                this.studentsUpdated.next([...this.students]);
            });
    }

    getStudentsUpdateListener() {
        return this.studentsUpdated.asObservable();
    }

    getStudent(_id: string) {
        return this.http.get<{student}>('http://localhost:3000/api/students/' + _id) ;
    }

    addStudent(name: string,
        surname: string,
        mail: string,
        birthday: string,
        sex: string,
        bus1: string,
        bus2: string,
        bus3: string) {
        const student: Student = {
            _id: null,
            name: name,
            surname: surname,
            mail: mail,
            birthday: birthday,
            sex: sex,
            bus1: bus1,
            bus2: bus2,
            bus3: bus3
        }
        this.http.post<{ studentId: string }>('http://localhost:3000/api/students', student)
            .subscribe(responseData => {
                const id = responseData.studentId;
                student._id = id;
                this.students.push(student); //local
                this.studentsUpdated.next([...this.students]);
            });
    }

    updateStudent(_id: string, 
        name: string,
        surname: string,
        mail: string,
        birthday: string,
        sex: string,
        bus1: string,
        bus2: string,
        bus3: string) {
        const student: Student = {
            _id: _id,
            name: name,
            surname: surname,
            mail: mail,
            birthday: birthday,
            sex: sex,
            bus1: bus1,
            bus2: bus2,
            bus3: bus3
        }
        //console.log(student);
        this.http.put('http://localhost:3000/api/students/' + _id, student)
        .subscribe(response => console.log(response));

    }

    deleteStudents(studentId: string) {
        this.http.delete('http://localhost:3000/api/students/' + studentId)
            .subscribe(() => {
                const updatedStudents = this.students.filter(student => student._id != studentId)
                this.students = updatedStudents;
                this.studentsUpdated.next([...this.students]);
            })
    }
}