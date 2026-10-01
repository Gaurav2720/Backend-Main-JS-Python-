from sqlalchemy import create_engine, Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import declarative_base, sessionmaker, relationship
from datetime import date

# Create database connection
engine = create_engine("sqlite:///students_lab.db")
Base = declarative_base()
Session = sessionmaker(bind=engine)
session = Session()

class Department(Base):
    __tablename__ = "departments"
    id = Column(Integer, primary_key=True)
    name = Column(String(100), unique=True, nullable=False)
    
    students = relationship("Student", back_populates="department")
    courses = relationship("Course", back_populates="department")

class Student(Base):
    __tablename__ = "students"
    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    branch = Column(String(50))
    enrollment_date = Column(Date)
    department_id = Column(Integer, ForeignKey("departments.id"))
    
    department = relationship("Department", back_populates="students")
    # Added cascade delete so enrollments are removed when a student is deleted
    enrollments = relationship("Enrollment", back_populates="student", cascade="all, delete-orphan")

class Course(Base):
    __tablename__ = "courses"
    id = Column(String(10), primary_key=True)
    title = Column(String(100), nullable=False)
    credits = Column(Integer, nullable=False)
    department_id = Column(Integer, ForeignKey("departments.id"))
    
    department = relationship("Department", back_populates="courses")
    enrollments = relationship("Enrollment", back_populates="course", cascade="all, delete-orphan")

class Enrollment(Base):
    __tablename__ = "enrollments"
    student_id = Column(Integer, ForeignKey("students.id"), primary_key=True)
    course_id = Column(String(10), ForeignKey("courses.id"), primary_key=True)
    semester = Column(String(20))
    grade = Column(String(2))
    
    student = relationship("Student", back_populates="enrollments")
    course = relationship("Course", back_populates="enrollments")

# Create tables
Base.metadata.create_all(engine)

def run_crud_operations():
    print("--- Setting up initial data ---")
    dept_cs = session.query(Department).filter_by(name="Computer Science").first()
    if not dept_cs:
        dept_cs = Department(name="Computer Science")
        session.add(dept_cs)
        session.commit()

    # 1. Create a new student with department assignment
    print("\n--- CREATE ---")
    new_student = Student(
        name="John Doe",
        email="john.doe@example.com",
        branch="CSE",
        enrollment_date=date(2023, 8, 15),
        department_id=dept_cs.id
    )
    session.add(new_student)
    session.commit()
    print(f"Student '{new_student.name}' created with department ID '{new_student.department_id}'.")

    # Add an enrollment to test cascade delete
    course1 = session.query(Course).filter_by(id="CS101").first()
    if not course1:
        course1 = Course(id="CS101", title="Intro to Programming", credits=4, department_id=dept_cs.id)
        session.add(course1)
        session.commit()
    
    enrollment1 = Enrollment(student_id=new_student.id, course_id=course1.id, semester="Fall 2023", grade="A")
    session.add(enrollment1)
    session.commit()
    print(f"Enrollment created for '{new_student.name}' in course '{course1.id}'.")

    # 2. Retrieve all students in a specific branch
    print("\n--- READ ---")
    cse_students = session.query(Student).filter(Student.branch == "CSE").all()
    print(f"CSE Students: {[s.name for s in cse_students]}")

    # 3. Update a student's branch
    print("\n--- UPDATE ---")
    student_to_update = session.query(Student).filter_by(name="John Doe").first()
    if student_to_update:
        student_to_update.branch = "IT"
        session.commit()
        print(f"Student '{student_to_update.name}' branch updated to {student_to_update.branch}.")

    # 4. Delete a student and verify cascade behavior
    print("\n--- DELETE ---")
    student_to_delete = session.query(Student).filter_by(name="John Doe").first()
    if student_to_delete:
        student_id = student_to_delete.id
        session.delete(student_to_delete)
        session.commit()
        print(f"Student '{student_to_delete.name}' deleted.")
        
        # Verify cascade
        enrollments = session.query(Enrollment).filter_by(student_id=student_id).all()
        print(f"Enrollments for deleted student (should be empty array): {enrollments}")

if __name__ == "__main__":
    run_crud_operations()
