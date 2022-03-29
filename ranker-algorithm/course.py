class Course:
    def __init__(self, department, course, year, semester, prof, gpa, section, a, b, c, d, f, q, finished, enrolled):
        self.department = department
        self.course = course
        self.year = year
        self.semester = semester
        self.prof = prof
        self.gpa = float(gpa)
        self.section = section
        self.a = int(a)
        self.b = int(b)
        self.c = int(c)
        self.d = int(d)
        self.f = int(f)
        self.q = int(q)
        self.finished = int(finished)
        self.enrolled = int(enrolled)
