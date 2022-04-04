class Course {
    constructor (department, course, year, semester, prof, gpa, section, a, b, c, d, f, q, finished, enrolled) {
        this.department = department;
        this.course = course;
        this.year = year;
        this.semester = semester;
        this.prof = prof;
        this.gpa = Number.parseFloat(gpa);
        this.section = section;
        this.a = Number.parseInt(a);
        this.b = Number.parseInt(b);
        this.c = Number.parseInt(c);
        this.d = Number.parseInt(d);
        this.f = Number.parseInt(f);
        this.q = Number.parseInt(q);
        this.finished = Number.parseInt(finished);
        this.enrolled = Number.parseInt(enrolled);
    }

}