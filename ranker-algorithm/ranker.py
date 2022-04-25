import sys
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from course import Course
from settings import json_file


cred = credentials.Certificate(json_file)
firebase_admin.initialize_app(cred)
db = firestore.client()


def rank():
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
    q_weight = 1
    pass_weight = 0.5
    gpa_weight = 0.75
    num_taught_weight = 0.005
    prof_scores = {}
    for prof in prof_a_rate:
        prof_scores[prof] = (
            prof_a_rate[prof] * a_weight
            - prof_q_rate[prof] * q_weight
            + prof_pass_rate[prof] * pass_weight
            + prof_avg_gpa[prof] * gpa_weight
            + num_times_taught[prof] * num_taught_weight
        )

    # sort prof scores and print them
    sorted_scores = sorted(prof_scores, key=prof_scores.get)
    sorted_scores_order = []

    for i in sorted_scores[::-1]:
        sorted_scores_order.append(i)

    for prof in sorted_scores_order:
        print(prof, '|', prof_scores[prof])
    return sorted_scores_order


def precision_at_k(k, ranking, rmp):
    total_pos_correct = 0
    for i in range(k):
        if ranking[i] == rmp[i]:
            total_pos_correct += 1
    print('Precision at', k, 'is:', total_pos_correct / k)
    return total_pos_correct / k


def recall_at_k(k, ranking, rmp):
    total_top_k_correct = 0
    for i in range(k):
        if ranking[i] in rmp[0: k]:
            total_top_k_correct += 1
    print('Recall at', k, 'is:', total_top_k_correct / k)
    return total_top_k_correct / k


def evaluate():
    course_num = int(sys.argv[1])
    ranking = rank()
    prof_list = []

    for prof in ranking:
        doc = db.collection(u'rating').where(u'prof', u'==', prof).get()
        if len(doc) == 0:
            prof_list.append((prof, 2.5))
        else:
            doc_dict = doc[0].to_dict()
            prof_list.append((doc_dict['prof'], doc_dict['quality']))

    num_profs = len(prof_list)
    if num_profs > 5:
        k = 5
    else:
        k = num_profs

    prof_list = prof_list[0: k]

    for i in range(len(prof_list)):
        for j in range(len(prof_list) - i - 1):
            if prof_list[j][1] > prof_list[j+1][1]:
                prof_list[j], prof_list[j+1] = prof_list[j+1], prof_list[j]

    sorted_prof_list = []
    for pair in prof_list:
        sorted_prof_list.append(pair[0])

    fixed_prof_list = []
    for i in range(len(sorted_prof_list)):
        if '(H)' not in sorted_prof_list[i]:
            fixed_prof_list.append(sorted_prof_list[i])
        else:
            k -= 1

    fixed_prof_list = list(reversed(fixed_prof_list))

    print('==============================')
    print(fixed_prof_list)
    print('==============================')

    precision_at_k(k, ranking, fixed_prof_list)
    recall_at_k(k, ranking, fixed_prof_list)


evaluate()


