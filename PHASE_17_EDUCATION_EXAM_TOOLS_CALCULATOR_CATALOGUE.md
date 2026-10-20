# Phase 17 — Education & Exam Tools

**Started:** 2026-10-20  
**Branch:** `phase-14-engineering-catalogue`  
**Status:** Scope and candidate catalogue drafted; routes and calculations are not claimed implemented.

## Scope and guardrails

Add Education & Exam Tools without removing or renaming any of the existing 50 major categories. Reconcile candidates against current Date & Time, mathematics, statistics and text utilities. Show formulas and intermediate steps when pedagogically useful. Mark approximate estimates and institution-specific grading policies clearly. Do not claim that an estimate predicts an official exam result or admission outcome.

## Maximum candidate inventory

### A. Marks, grades and exam scoring
1. Percentage from marks obtained and maximum marks
2. Marks required for target percentage
3. Weighted average marks
4. Subject-wise weighted total
5. Grade-point average from user-defined scale
6. GPA to percentage converter (scale-specific, not universal)
7. Percentage to grade lookup (user-defined bands)
8. Letter-grade calculator
9. CGPA from semester GPAs and credits
10. SGPA from course credits and grade points
11. Weighted CGPA across semesters
12. Marks normalization helper (user-defined formula)
13. Negative-marking score calculator
14. Correct/incorrect/unattempted score calculator
15. Multiple-section exam score
16. Best-of-subjects total
17. Required marks in remaining subjects
18. Required final-exam score given internal marks
19. Internal/external weighting calculator
20. Pass/fail threshold calculator (user-specified rules)
21. Grace-mark scenario calculator (policy user-specified)
22. Rank percentile from rank and cohort size
23. Percentile-to-approximate rank (method stated; distribution assumptions)
24. Score improvement percentage
25. Marks lost and error-rate calculator
26. Attempt accuracy percentage
27. Question attempt rate
28. Time per question calculator
29. Section-wise time allocation
30. Exam completion buffer calculator

### B. Study planning and revision
31. Days remaining until exam
32. Study hours available before deadline
33. Daily study-hours planner
34. Topic workload and completion estimate
35. Syllabus coverage percentage
36. Revision cycle interval planner
37. Spaced-repetition date planner (user-defined intervals)
38. Revision session count
39. Study session / break schedule arithmetic helper
40. Pomodoro session count and duration
41. Weekly study-time total
42. Subject-wise study-hour allocation
43. Study-time allocation by weakness/priority
44. Chapter-weightage allocation helper (weights supplied by user)
45. Revision backlog size
46. Task completion percentage
47. Study streak day count (no account tracking implied)
48. Daily question-practice target
49. Question-bank completion time
50. PYQ coverage tracker arithmetic
51. Mock-test frequency planner
52. Mock-test score average
53. Mock-test score trend (simple arithmetic only; no prediction claim)
54. Target-score gap calculator
55. Target-score required improvement rate
56. Study efficiency ratio from user-defined inputs
57. Reading-time estimate
58. Notes page count and time estimate
59. Flashcard review duration estimate
60. Learning resource time sum

### C. Mathematics and science learning helpers
61. Fraction simplifier
62. Fraction arithmetic helper
63. Ratio simplifier
64. Proportion solver
65. Percentage change calculator
66. Scientific notation converter
67. Significant figures and rounding helper
68. Exponent and power rules helper
69. Logarithm change-of-base calculator
70. Quadratic equation solver
71. Polynomial evaluation helper
72. Linear equation solver
73. Simultaneous linear equations (supported small systems)
74. Arithmetic sequence nth term and sum
75. Geometric sequence nth term and sum
76. Series sum helper for supported formulas
77. Trigonometric degree/radian converter
78. Right-triangle trigonometry solver
79. Sine rule calculator
80. Cosine rule calculator
81. Triangle area from sides/angle
82. Coordinate distance calculator
83. Midpoint calculator
84. Slope of a line
85. Line equation from supported inputs
86. Circle equation parameter helper
87. Vector magnitude calculator
88. Vector addition/subtraction
89. Dot/scalar product calculator
90. Cross/vector product calculator
91. Angle between vectors
92. Projection of one vector onto another
93. Unit vector calculator
94. 2D/3D distance converter/helper
95. Matrix addition/subtraction
96. Matrix multiplication for supported dimensions
97. 2×2 and 3×3 determinant calculator
98. Inverse of supported nonsingular matrices
99. Complex number arithmetic
100. Complex number polar/rectangular converter
101. Permutations calculator
102. Combinations calculator
103. Binomial coefficient calculator
104. Probability of simple events
105. Conditional probability helper
106. Mean/median/mode calculator
107. Variance and standard deviation calculator
108. Z-score calculator
109. Linear interpolation calculator
110. Unit conversion for physics quantities
111. Speed-distance-time physics triangle
112. Force/mass/acceleration solver
113. Work-energy-power helper
114. Ohm's law learning calculator
115. Molarity and dilution learning calculator
116. Mole-mass-molar-mass converter
117. Ideal gas law learning calculator
118. pH and concentration helper with approximation caveats

### D. Attendance, credits and course planning
119. Attendance percentage
120. Classes needed to reach target attendance
121. Classes that can be missed while maintaining target
122. Attendance across multiple subjects
123. Weighted attendance by session duration
124. Course credit total
125. Credit-weighted grade calculator
126. Course completion percentage
127. Remaining assignments workload
128. Assignment weighted grade
129. Missing assignment impact estimate
130. Required assignment score to reach target
131. Semester workload hours
132. Course schedule overlap helper
133. Timetable gap calculator
134. Break duration between classes
135. Academic term week counter
136. Term date count excluding user-selected holidays
137. Exam timetable gap days
138. Consecutive exam recovery-time summary
139. Lab attendance calculator
140. Practical/theory mark weighting

### E. Entrance exam and admissions planning
141. Cutoff calculator from user-defined official formula
142. Entrance score from component marks and weights
143. Subject-wise cutoff contribution
144. Required subject marks for target cutoff
145. Target score gap by component
146. Rank percentile arithmetic helper
147. Admission eligibility checklist score (rules supplied by user)
148. College preference list organizer (not an admission prediction)
149. Seat/category count arithmetic helper (user-supplied official data)
150. Counselling choice priority worksheet
151. Application deadline countdown
152. Application fee budget total
153. Exam attempt eligibility counter (rules supplied by user)
154. Best-of-attempts score comparison
155. Mock-to-target score gap
156. Topic-wise accuracy and weak-area summary

### F. Writing, reading and classroom utilities
157. Word count
158. Character count with/without spaces
159. Sentence and paragraph count
160. Reading time estimate
161. Speech duration estimate
162. Presentation duration estimate
163. Essay word target progress
164. Citation/reference count helper
165. Page count estimate from words and formatting assumptions
166. Text similarity arithmetic helper only if method is specified (not plagiarism certification)
167. Classroom group allocation calculator
168. Student-to-teacher ratio calculator
169. Seating row/column planner
170. Group/project team size calculator
171. Random group allocation helper (randomness limitations stated)
172. Weighted rubric score calculator
173. Peer assessment weighted total
174. Presentation rubric score
175. Lab dilution/measurement learning helper
176. Unit prefix converter
177. Base-10/base-2 log reference helper
178. Scientific calculator expression reference helper (supported syntax only)

## Completion gate

Every implemented item needs an explicit method, worked examples or known-answer tests, invalid-input handling, unit and rounding rules, accessible labels/errors, and exact-commit regression evidence. User-defined exam rules must remain configurable. Official cutoffs, eligibility rules, grading policies and admission outcomes must not be invented or presented as guaranteed.