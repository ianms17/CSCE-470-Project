import sys
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import dotenv
from course import Course
from settings import json_file

cred = credentials.Certificate(json_file)
firebase_admin.initialize_app(cred)
db = firestore.client()

course_num = int(sys.argv[1])
docs = db.collection(u'courses').where(u'course', '==', course_num).stream()
course_list = []

# get listing of all
for doc in docs:
    doc_dict = doc.to_dict()
    course = Course(
        doc_dict['department'],
        doc_dict['course'],
        doc_dict['year'],
        doc_dict['semester'],
        doc_dict['prof'],
        doc_dict['gpa'],
        doc_dict['section'],
        doc_dict['a'],
        doc_dict['b'],
        doc_dict['c'],
        doc_dict['d'],
        doc_dict['f'],
        doc_dict['q'],
        doc_dict['finished'],
        doc_dict['enrolled']
    )
    course_list.append(course)

# calculate totals for a, q-drop, and pass rates, and avg gpa and number of times taught
prof_a_rate = {}
prof_q_rate = {}
prof_pass_rate = {}
prof_avg_gpa = {}
num_times_taught = {}
for course in course_list:
    if course.prof in prof_a_rate:
        prof_a_rate[course.prof] += course.a / course.finished
        prof_q_rate[course.prof] += course.q / course.enrolled
        prof_avg_gpa[course.prof] += course.gpa
        prof_pass_rate[course.prof] += (course.a + course.b + course.c + course.d) / course.finished
        num_times_taught[course.prof] += 1
    else:
        prof_a_rate[course.prof] = course.a / course.finished
        prof_q_rate[course.prof] = course.q / course.enrolled
        prof_avg_gpa[course.prof] = course.gpa
        prof_pass_rate[course.prof] = (course.a + course.b + course.c + course.d) / course.finished
        num_times_taught[course.prof] = 1

# aggregate totals found
for prof in prof_a_rate:
    prof_a_rate[prof] /= num_times_taught[prof]
    prof_q_rate[prof] /= num_times_taught[prof]
    prof_pass_rate[prof] /= num_times_taught[prof]
    prof_avg_gpa[prof] /= num_times_taught[prof]

# score professors based on rates found
a_weight = 0.2
q_weight = 0.7
pass_weight = 0.5
gpa_weight = 0.75
num_taught_weight = 0.15
prof_scores = {}
for prof in prof_a_rate:
    prof_scores[prof] = (
        prof_a_rate[prof] * a_weight
        + prof_q_rate[prof] * q_weight
        + prof_pass_rate[prof] * pass_weight
        + prof_avg_gpa[prof] * gpa_weight
        + num_times_taught[prof] * num_taught_weight
    )

# sort prof scores and print them
sorted_scores = sorted(prof_scores, key=prof_scores.get)
for prof in sorted_scores:
    print(prof, '|', prof_scores[prof])
