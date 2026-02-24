# Course Analytics & Statistics Menu - Feature Documentation

## Executive Summary

The **Course Analytics** menu is a teacher-only feature that provides comprehensive performance insights for courses through data visualization and statistical analysis. Teachers can select any of their assigned courses and access a dashboard with four key analytics modules: course overview statistics, performance distribution analysis, at-risk student identification, and category-based mastery breakdown.

---

## 1. Overview & Purpose

### What is the Stats Menu?

The Stats Menu is an advanced analytics dashboard integrated into the LMS navigation bar (visible only to teachers). It enables educators to:
- Monitor class-wide performance metrics
- Identify struggling students proactively
- Analyze score distributions to understand class performance patterns
- Track performance across different assignment types/categories
- Make data-driven decisions about course adjustments and student interventions

### Why Was It Built?

**Educational Benefits:**
1. **Early Intervention** — Identify at-risk students before they fall too far behind
2. **Curriculum Insights** — Understand which topics/categories students struggle with most
3. **Class Health Monitoring** — Get a snapshot of overall class performance at a glance
4. **Equity & Fairness** — Identify performance gaps across the class to ensure equitable teaching
5. **Data-Driven Teaching** — Make adjustments to lesson plans, assignments, and pacing based on evidence

**Business Value:**
1. Improves student retention through proactive support
2. Enhances teaching effectiveness with objective performance data
3. Provides accountability metrics for institutions
4. Reduces student attrition and improves graduation rates

---

## 2. Feature Set & Functionality

### Access & Navigation

**Location:** Top navigation bar (visible to teachers only)
- Icon: Bar chart icon (`BarChart3`)
- Label: "Analytics"
- Route: `/stats`

```
Navigation Menu:
Home | Courses | Analytics | (Report Card for students)
                    ↓
              CourseStats Page
```

### 2.1 Course Selector

**Component:** Dropdown list of teacher's assigned courses

**Functionality:**
- Fetches all courses assigned to the logged-in teacher
- Loads stats for selected course automatically
- Shows course title as option label

**Technical:** Uses `useTeacherStore.fetchTeacherCourses(teacherId)` endpoint

### 2.2 Overview Statistics Cards

Four key metrics displayed in a responsive grid:

| Metric | Description | Use Case |
|--------|-------------|----------|
| **Total Students** | Count of enrolled students | Class size context |
| **Total Assignments** | Number of assignments in course | Workload assessment |
| **Overall Average** | Mean score across all assignments & students | Class performance snapshot |
| **At-Risk Count** | Number of students flagged as at-risk | Intervention priority |

**Secondary Statistics Row:**
- **Std Deviation** — Measure of score variability (spread)
- **Strongest Category** — Assignment type with highest avg performance
- **Weakest Category** — Assignment type with lowest avg performance

---

### 2.3 Performance Distribution Chart

**Visualization:** Interactive bar chart (Recharts)

**What It Shows:**
- Score distribution bucketed into 10-point ranges (0-10, 11-20, ..., 91-100)
- Each bar represents count of grades in that range
- Color-coded bars for visual distinction

**Statistics Displayed:**
- **Mean** — Arithmetic average of all scores
- **Median** — Middle value when scores are sorted
- **Std Deviation** — Measure of variability around the mean

**Interpretation:**
- **Normal Distribution (Bell Curve)** — Balanced class performance
- **Left-Skewed** — Most students scoring low (needs intervention)
- **Right-Skewed** — Most students scoring high (strong performance)
- **Bimodal** — Two distinct performance groups (may indicate mixed readiness)

**Use Case:** Identify if assignment difficulty is appropriate for the class

---

### 2.4 At-Risk Students Table

**Purpose:** Proactive identification of students who need support

**Criteria for At-Risk Flagging:**
1. **Low Performance** — Score significantly below class mean (default: 2 standard deviations below)
2. **Missing Work** — High number of ungraded/missing assignments (default: 3+ missing)

**Table Columns:**

| Column | Meaning |
|--------|---------|
| **Student** | Name of student |
| **Number** | Student ID/Number |
| **Average** | Student's current average score |
| **Class Mean** | Class-wide average for context |
| **Missing** | Ratio of missing/incomplete assignments |
| **Risk Factors** | Tags showing why flagged (e.g., "Low Performance", "Missing Assignments") |

**Risk Factor Badges:**
- `Low Performance` — Current average is 2+ std devs below class mean
- `Missing Assignments` — 3+ ungraded assignments

**Use Case:** Teachers can prioritize outreach to flagged students for tutoring, counseling, or academic support

---

### 2.5 Category Mastery Breakdown

**Purpose:** Understand performance across different assignment types

**What Are Categories?**
Assignment categories represent different assessment types:
- **Exam** — Formal exams/tests
- **Quiz** — Quick assessment quizzes
- **Lab** — Laboratory work/practical assignments
- **Project** — Longer-term projects
- **Homework** — Regular homework assignments

**Metrics per Category:**

| Metric | Description |
|--------|-------------|
| **Avg %** | Average percentage score for assignments in this category |
| **Total Assignments** | Number of assignments in this category |
| **Total Submissions** | Number of grades recorded for this category |
| **Std Deviation** | Consistency of performance in this category |

**Visual Indicators:**
- 🟢 **Green highlight** — Strongest performing category (highest avg)
- 🔴 **Red highlight** — Weakest performing category (lowest avg)
- 🔵 **Blue** — Other categories
- **Progress bar** — Visual representation of performance percentage

**Interpretation:**
- If exams are weak but homework is strong → Students understand content but struggle with test anxiety/format
- If projects are weak → May need better scaffolding, peer support, or resources
- If all categories are weak → Need comprehensive course adjustment

---

## 3. Technical Implementation

### Architecture

```
Navigation.tsx
    ↓ (teacher-only link)
Router (/stats)
    ↓
CourseStats.tsx (Page Component)
    ├─ useAuthStore (get logged-in teacher ID)
    ├─ useTeacherStore (fetch teacher's courses)
    └─ useStatsStore (fetch all stats in parallel)
         ├─ /courses/:id/stats
         ├─ /courses/:id/stats/distribution
         ├─ /courses/:id/stats/at-risk
         └─ /courses/:id/stats/category-mastery
```

### Store: `useStatsStore`

**Location:** `src/stores/useStatsStore.ts`

**Interfaces:**

```typescript
CourseStats {
  course_id: string
  total_students: number
  total_assignments: number
  overall_average: number
  overall_std_deviation: number
  at_risk_count: number
  total_grades_recorded: number
  highest_performing_category: string
  lowest_performing_category: string
}

PerformanceDistribution {
  course_id: string
  assignment_id: string
  buckets: DistributionBucket[] // 10-point range buckets
  mean: number
  median: number
  std_deviation: number
  total_students: number
}

AtRiskStudent {
  student_id: string
  student_name: string
  student_number: string
  current_average: number
  class_mean: number
  deviation_from_mean: number
  missing_assignments: number
  total_assignments: number
  risk_factors: string[]
}

CategoryMasteryItem {
  category: string
  average_score: number
  average_percentage: number
  total_assignments: number
  total_submissions: number
  std_deviation: number
}
```

**Key Methods:**

```typescript
fetchCourseStats(courseId)        // GET /courses/:id/stats
fetchDistribution(courseId)       // GET /courses/:id/stats/distribution
fetchAtRisk(courseId)             // GET /courses/:id/stats/at-risk
fetchCategoryMastery(courseId)    // GET /courses/:id/stats/category-mastery
fetchAllStats(courseId)           // Parallel Promise.all() of above 4
clearStats()                      // Reset state
```

### API Endpoints

All endpoints are **teacher-only** (require teacher authentication token).

#### 1. Course Stats Overview
```
GET /api/v1/courses/:id/stats

Response:
{
  "course_id": "c100...",
  "total_students": 25,
  "total_assignments": 8,
  "overall_average": 72.5,
  "overall_std_deviation": 12.35,
  "at_risk_count": 3,
  "total_grades_recorded": 180,
  "highest_performing_category": "Exam",
  "lowest_performing_category": "Project"
}
```

#### 2. Performance Distribution
```
GET /api/v1/courses/:id/stats/distribution?assignment_id=UUID (optional)

Response:
{
  "course_id": "c100...",
  "assignment_id": "" (empty if all assignments)
  "buckets": [
    {
      "range": "41-50",
      "min_score": 41,
      "max_score": 50,
      "count": 3,
      "percentage": 12.0
    },
    ...
  ],
  "mean": 72.5,
  "median": 75.0,
  "std_deviation": 12.35,
  "total_students": 25
}
```

#### 3. At-Risk Students
```
GET /api/v1/courses/:id/stats/at-risk?missing_threshold=3&std_dev_threshold=2.0

Response:
{
  "course_id": "c100...",
  "at_risk_students": [
    {
      "student_id": "a999...",
      "student_name": "John Doe",
      "student_number": "STD-2026-001",
      "current_average": 45.5,
      "class_mean": 72.5,
      "deviation_from_mean": -2.15,
      "missing_assignments": 2,
      "total_assignments": 8,
      "risk_factors": ["Low Performance"]
    }
  ],
  "class_mean": 72.5,
  "class_std_deviation": 12.35,
  "total_students": 25,
  "at_risk_count": 3
}
```

#### 4. Category Mastery
```
GET /api/v1/courses/:id/stats/category-mastery

Response:
{
  "course_id": "c100...",
  "categories": [
    {
      "category": "Exam",
      "average_score": 78.5,
      "average_percentage": 78.5,
      "total_assignments": 2,
      "total_submissions": 50,
      "std_deviation": 8.2
    },
    ...
  ],
  "strongest_category": "Exam",
  "weakest_category": "Project"
}
```

### Page Component: `CourseStats.tsx`

**Location:** `src/pages/stats/CourseStats.tsx`

**Component Flow:**

1. **Mount** → Fetch teacher's courses via `useTeacherStore`
2. **Course Selection** → User picks course from dropdown
3. **Effect** → Fetch all 4 stats in parallel via `useStatsStore.fetchAllStats()`
4. **Render** → Display all four analytics modules

**Conditional Rendering:**
- Show loading spinner while `isLoading === true`
- Show error message if API fails
- Show each section only if data exists and is not empty
- Show "Select a course" prompt if no course selected

**UI Components Used:**
- Recharts `BarChart`, `Bar`, `XAxis`, `YAxis`, `CartesianGrid`, `Tooltip`
- Lucide icons: `Users`, `BookOpen`, `TrendingUp`, `AlertTriangle`, `Award`, `Target`
- Tailwind CSS for styling

---

## 4. Statistics Theory & Methodology

### 4.1 Descriptive Statistics

**Mean (Average)**
```
μ = (Σ all scores) / n

Example: Scores [95, 88, 76, 92]
Mean = (95 + 88 + 76 + 92) / 4 = 351 / 4 = 87.75
```

**Interpretation:** Center point of the data; affected by outliers

**Use in Stats Menu:** Overall Average card

---

**Median (Middle Value)**
```
Sort scores, take middle value (or average of two middle values)

Scores [95, 88, 76, 92] → Sorted [76, 88, 92, 95]
Median = (88 + 92) / 2 = 90
```

**Interpretation:** More robust than mean; less affected by outliers

**Use in Stats Menu:** Distribution chart displays median alongside mean for comparison

---

**Standard Deviation (Std Dev)**
```
σ = √(Σ(x - μ)² / n)

Step 1: Find mean
Step 2: Find difference between each score and mean: (x - μ)
Step 3: Square each difference: (x - μ)²
Step 4: Average the squared differences: Σ(x - μ)² / n
Step 5: Take square root

Example: Scores [95, 88, 76, 92], Mean = 87.75

Differences:    [7.25, 0.25, -11.75, 4.25]
Squared:        [52.56, 0.06, 138.06, 18.06]
Sum of squares: 208.74
Average:        52.185
Std Dev:        √52.185 = 7.22
```

**Interpretation:**
- **Low Std Dev** (e.g., 5) → Consistent scores, most students cluster around mean
- **High Std Dev** (e.g., 25) → Scattered scores, wide performance range

**Practical Rule of Thumb (68-95-99.7 Rule):**
- 68% of scores fall within 1 std dev of mean
- 95% within 2 std devs
- 99.7% within 3 std devs

**Use in Stats Menu:**
- Overall Std Deviation card shows class consistency
- At-risk threshold: 2 std devs below mean (default)
- Category Mastery shows std dev per category

---

### 4.2 Distribution Analysis

**What is Score Distribution?**

Frequency distribution shows how many students scored in each range.

**Bucketing Method:**
Scores are grouped into 10-point ranges:
- Bucket 1: 0-10
- Bucket 2: 11-20
- ...
- Bucket 10: 91-100

**Normal Distribution (Bell Curve)**

```
      Count
        ↑
        |     ___
        |   /     \
        |  /       \
        | /         \
    ____|____________\___→ Score
        0  30 50 70  100

Mean, Median, Mode all coincide
68% within ±1 std dev (shaded area)
```

**Characteristics:**
- Symmetrical around the mean
- Most scores cluster in middle
- Few extreme high/low scores
- Natural occurrence in many phenomena

**Left-Skewed Distribution**

```
      Count
        |
        |         ___
        |        /
        |       /
        |  ____/
    ____|_________→ Score
        0  30 50 70  100

Mean < Median < Mode
Long tail on left
```

**Interpretation:** Most students score high; few struggling
- Good sign of student understanding
- May indicate easy assignment

**Right-Skewed Distribution**

```
      Count
        |
        |  ___
        |     \
        |      \
        |       \____
    ____|___________→ Score
        0  30 50 70  100

Mode < Median < Mean
Long tail on right
```

**Interpretation:** Most students score low; few excelling
- Warning sign; may need intervention
- Assignment may be too difficult
- Students may need prerequisite review

**Bimodal Distribution**

```
      Count
        |   ___      ___
        |  /   \    /   \
        | /     \  /     \
    ____|_________|_______→ Score
        0  30 50 70  100
```

**Interpretation:** Two distinct groups
- "Prepared" vs "Unprepared" groups
- May need differentiated instruction
- Consider ability-based grouping

---

### 4.3 Z-Score for At-Risk Detection

**Formula:**
```
z = (x - μ) / σ

Where:
x = student's score
μ = class mean
σ = class standard deviation
```

**Interpretation:**
- z = 0 → Student at class mean
- z = 1 → 1 std dev above mean (good)
- z = -1 → 1 std dev below mean (concern)
- z = -2 → 2 std devs below mean (at risk threshold)

**Example:**
```
Class mean: 75
Class std dev: 10
Student score: 55

z = (55 - 75) / 10 = -20 / 10 = -2.0

This student is 2 std devs below mean → FLAGGED AS AT-RISK
```

**Default At-Risk Threshold:**
- **2 standard deviations below mean** (covers bottom ~2.5% in normal distribution)
- **3+ missing assignments**

**Use Case:** Early warning system to identify students who need intervention

---

### 4.4 Percentages & Proportions

**Percentage Score:**
```
Percentage = (Actual Score / Max Score) × 100

Example: 85/100 = 85%
Example: 34/50 = 68%
```

**Percentage in Distribution:**
```
Percentage = (Count in Bucket / Total Count) × 100

Example: 3 students out of 25 in 80-90 bucket
Percentage = (3 / 25) × 100 = 12%
```

**Use in Stats Menu:**
- At-Risk table shows current_average as percentage
- Category Mastery shows average_percentage per category
- Distribution chart shows percentage for each bucket

---

## 5. Data Flow & Integration

### Request Flow

```
Teacher navigates to /stats
        ↓
CourseStats component mounts
        ↓
useTeacherStore.fetchTeacherCourses(teacherId)
        ↓ (API) GET /teachers/:id/courses
Backend (Teacher Service)
        ↓ (response with course list)
        ↓
User selects course from dropdown
        ↓
useStatsStore.fetchAllStats(courseId)
        ↓
Promise.all([
  GET /courses/:id/stats
  GET /courses/:id/stats/distribution
  GET /courses/:id/stats/at-risk
  GET /courses/:id/stats/category-mastery
])
        ↓
Backend (Stats Service)
        ↓
Aggregates data from databases
        ↓
        ↓ (parallel responses)
        ↓
All data loaded in store
        ↓
Component re-renders with data
        ↓
Charts, tables, cards populate
```

### Environment Configuration

**File:** `.env`

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

**Usage in Code:**
```typescript
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1'
```

**Production Deployment:**
Change `.env` to production URL before building:
```env
VITE_API_BASE_URL=https://api.production.edu/api/v1
```

---

## 6. User Workflows

### Workflow 1: Class Performance Monitoring (Weekly Check-in)

```
Teacher logs in
    ↓
Clicks "Analytics" in navbar
    ↓
Selects course from dropdown
    ↓
Checks "Overall Average" and "At-Risk Count" cards
    ↓
Decision:
   If avg > 80 & at-risk = 0 → Keep current pace
   If avg 60-80 & at-risk > 0 → Plan intervention
   If avg < 60 → Review assignment difficulty
    ↓
Views Performance Distribution chart
    ↓
If right-skewed → Slow down, review prerequisites
If left-skewed → Accelerate, add challenge activities
    ↓
Reviews Category Mastery
    ↓
Adjusts upcoming assignments based on weakest category
```

### Workflow 2: Student Intervention Planning

```
Teacher opens Analytics
    ↓
Selects course
    ↓
Scrolls to "At-Risk Students" table
    ↓
Sees John Doe: 45% avg, 2 std devs below mean, 3 missing assignments
    ↓
Actions:
   1. Schedule 1-on-1 meeting
   2. Assign peer tutoring
   3. Provide extra practice materials
   4. Set up weekly check-ins
    ↓
Follows up next week to see if average improved
```

### Workflow 3: Assignment Difficulty Calibration

```
Teacher publishes new assignment
    ↓
Waits 1-2 weeks for sufficient submissions
    ↓
Views Performance Distribution
    ↓
Charts show scores are too spread out (high std dev)
    ↓
Decision: Assignment was either too easy or too hard
    ↓
Reviews Category Mastery for this category
    ↓
Feedback: "Project" category consistently weak
    ↓
Actions:
   1. Provide more scaffolding for projects
   2. Create step-by-step checklist
   3. Add example submissions
   4. Offer office hours
    ↓
Next project should have better results
```

---

## 7. Business Logic & Algorithms

### At-Risk Student Detection Algorithm

```
For each student in course:

  1. Calculate z-score:
     z = (student_avg - class_mean) / class_std_dev

  2. Count missing assignments:
     missing = total_assignments - graded_assignments

  3. Determine risk factors:
     if z < -2.0:
       ADD "Low Performance" to risk_factors
     if missing >= 3:
       ADD "Missing Assignments" to risk_factors

  4. Flag if student has ANY risk factors:
     if len(risk_factors) > 0:
       Mark as AT-RISK
       Record deviation_from_mean = z

  5. Return at-risk student data with factors
```

### Category Mastery Calculation

```
For each category (Exam, Quiz, Lab, Project, Homework):

  1. Find all assignments tagged with this category:
     category_assignments = filter(assignments, category)

  2. Find all grades for these assignments:
     category_grades = filter(grades, category_assignments)

  3. Calculate metrics:
     avg_score = mean(category_grades.scores)
     avg_percentage = (avg_score / avg_max_score) * 100
     std_dev = std_deviation(category_grades.scores)
     total_assignments = len(category_assignments)
     total_submissions = len(category_grades)

  4. Identify strongest/weakest:
     strongest = category with highest avg_percentage
     weakest = category with lowest avg_percentage
```

---

## 8. Limitations & Future Enhancements

### Current Limitations

1. **No Time-Series Data** — Cannot track performance trends over time
2. **No Individual Student Tracking** — Cannot see one student's progress across multiple assignments
3. **No Comparative Analysis** — Cannot compare against previous semesters or other sections
4. **Static Thresholds** — At-risk thresholds are hardcoded; cannot customize per teacher
5. **No Annotations** — Cannot add notes explaining outliers or special circumstances

### Potential Enhancements

1. **Trend Analysis** — Show how class average has changed week-over-week
2. **Predictive Analytics** — Predict final grades based on assignment pattern
3. **Peer Benchmarking** — Compare class performance to school/district averages
4. **Custom Alerts** — Teachers set own at-risk thresholds
5. **Export Reports** — Download PDF/CSV for institutional reporting
6. **Student Dashboard** — Students see their own analytics and comparisons
7. **Intervention Tracking** — Log and track interventions for at-risk students
8. **Learning Gain Analysis** — Measure improvement over semester (pre/post comparison)
9. **Reliability Analysis** — Test internal consistency of assignments/grading
10. **Correlation Analysis** — Identify which assignment types predict final grade

---

## 9. Summary Table

| Feature | Purpose | Theory | Use Case |
|---------|---------|--------|----------|
| **Overall Average** | Class-wide mean score | Arithmetic Mean | Quick snapshot of class performance |
| **Std Deviation** | Performance variability | Statistical Spread | Understand consistency vs diversity |
| **Distribution Chart** | Score frequency visualization | Frequency Distribution | Identify if assignment is too hard/easy |
| **At-Risk Table** | Early warning system | Z-scores + Thresholds | Proactive student support |
| **Category Mastery** | Strength/weakness by type | Group Statistics + Comparison | Curriculum adjustments |
| **Median** | Robust center measure | Descriptive Statistics | Compare with mean to detect outliers |

---

## 10. Getting Started Guide for Teachers

### Step 1: Access the Analytics Menu
1. Log in as a teacher
2. Click "Analytics" in the top navigation bar
3. Wait for the page to load

### Step 2: Select a Course
1. Click the "Select a Course" dropdown
2. Choose one of your assigned courses
3. Analytics will load automatically (may take 2-3 seconds)

### Step 3: Review the Metrics
1. **Overview Cards** — Check if class is healthy (avg > 70%) and how many need help
2. **Distribution Chart** — Understand the shape of performance
3. **At-Risk Table** — Identify which students to reach out to
4. **Category Mastery** — See which assignment types need work

### Step 4: Take Action
- If average is low → Reteach material, slow pace
- If at-risk count is high → Plan interventions
- If distribution is bimodal → Consider ability grouping
- If category is weak → Add resources, scaffolding, practice

---

## Appendix: Statistical Formulas Reference

### Mean
```
μ = Σx / n
```

### Standard Deviation
```
σ = √(Σ(x - μ)² / n)
```

### Z-Score
```
z = (x - μ) / σ
```

### Percentage
```
P = (x / max) × 100
```

### Variance (Std Dev²)
```
σ² = Σ(x - μ)² / n
```

### Coefficient of Variation (relative std dev)
```
CV = σ / μ × 100%
```

---

**Document Version:** 1.0
**Last Updated:** 2026-02-22
**Author:** LMS Development Team
**Status:** Final
