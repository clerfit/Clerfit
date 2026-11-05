# Phase 16 — Travel & Vehicles Calculators

**Started:** 2026-10-20  
**Branch:** `phase-14-engineering-catalogue`  
**Status:** Scope and candidate catalogue drafted; routes and calculations are not claimed implemented.

## Scope and guardrails

Preserve the established 50-category taxonomy and reconcile these candidates against existing distance, speed, time, fitness and unit calculators before implementation. Do not duplicate routes. Fuel economy, trip cost and range are estimates based on user-entered data; never imply live traffic, live fuel prices, route availability, vehicle diagnostics, or safety certification unless supported by a verified source. Provide clear units and assumptions.

## Maximum candidate inventory

### A. Trip planning and distance/time
1. Trip distance calculator
2. Average speed calculator
3. Travel time from distance and speed
4. Arrival time from departure and duration
5. Departure time from arrival and duration
6. Multi-stop total distance/time arithmetic helper
7. Time-zone travel time converter
8. Layover and connection duration
9. Walking trip duration estimator
10. Cycling trip duration estimator
11. Driving duration estimator from user-supplied average speed
12. Ferry/rail/flight duration sum helper
13. Distance unit converter
14. Nautical mile and knot converter
15. Pace, speed and duration converter
16. Fuel-stop interval estimator
17. Rest-break interval planner (user-defined rules)
18. Elapsed time across midnight
19. Date range and trip-day counter
20. Calendar-day vs overnight count helper
21. Trip duration in weeks/days/hours
22. Time buffer and schedule slack calculator
23. Arrival-time range from speed range
24. Round-trip distance and time
25. Travel speed comparison

### B. Fuel, range and vehicle running cost
26. Fuel economy converter (km/L, L/100 km, mpg with US/Imperial distinction)
27. Trip fuel consumption
28. Fuel required from distance and economy
29. Estimated driving range from tank and economy
30. Fuel cost from distance and economy
31. Fuel cost per distance
32. Split fuel cost among passengers
33. Mixed-route fuel consumption estimate
34. Fuel economy before/after comparison
35. EV energy consumption (kWh/100 km or mi/kWh)
36. EV trip energy estimate
37. EV charging cost estimate
38. EV range from usable battery and consumption
39. Charging time from energy and power (idealized)
40. Charging loss / efficiency estimate
41. Home charging cost per month
42. Public charging session cost from user-entered rates
43. Hybrid fuel/electric running cost comparison
44. Vehicle cost per kilometre/mile
45. Total trip cost estimate
46. Toll/parking/fee subtotal
47. Depreciation per distance estimate (user inputs)
48. Maintenance cost per distance
49. Tyre cost per distance
50. Insurance/tax allocation per trip (user inputs)
51. Ownership cost comparison
52. Annual mileage estimator
53. Commute cost per month
54. Carpool savings estimate
55. Ride-share fare breakdown helper (user inputs only)
56. Rental car total cost estimate
57. Rental mileage overage estimate
58. Vehicle lease mileage allowance tracker
59. Fuel reserve percentage calculator
60. Fuel mass/volume converter (density assumptions stated)

### C. Vehicle performance and mechanics
61. Speed unit converter
62. Acceleration from speed change and time
63. Braking distance idealized estimator (conditions disclosed; not safety advice)
64. Reaction distance calculator (user-selected reaction time)
65. Total stopping distance estimate
66. Kinetic energy from vehicle mass and speed
67. Power-to-weight ratio
68. Torque/power/rpm converter
69. Engine rpm / wheel rpm from gear ratio
70. Gear ratio and final-drive calculator
71. Wheel circumference from tyre dimensions
72. Tyre diameter and circumference calculator
73. Speedometer theoretical error from tyre size change
74. Distance per wheel revolution
75. Engine displacement from bore/stroke/cylinder count
76. Compression ratio from volumes
77. Four-stroke engine cycle frequency helper
78. Vehicle payload and gross mass arithmetic
79. Trailer tongue load percentage helper (not towing approval)
80. Towing weight arithmetic helper (manufacturer limits required)
81. Wheel load distribution arithmetic helper
82. Brake thermal energy estimate
83. Rotational inertia and wheel kinetic energy
84. Suspension spring rate conversion
85. Tyre pressure unit converter
86. Torque unit converter
87. Battery voltage/current/power converter
88. 12V battery runtime estimate (assumptions disclosed)
89. Alternator power/current converter
90. Vehicle electrical energy consumption
91. Idle fuel cost estimate
92. Engine efficiency arithmetic helper
93. Aerodynamic drag estimate (idealized inputs)
94. Rolling resistance estimate (coefficient user supplied)
95. Grade resistance / hill power estimator
96. Climbing energy and power calculator
97. Vehicle acceleration idealized power estimator
98. EV regenerative energy upper-bound estimate

### D. Aviation, marine and rail
99. Knot, nautical mile and statute mile converter
100. Ground speed from airspeed and wind component (simple vector convention)
101. Flight time from distance and ground speed
102. Fuel endurance from burn rate and usable fuel
103. Fuel reserve arithmetic helper
104. Climb/descent rate converter
105. Vertical speed and altitude-change time
106. Density altitude helper (only with validated method and stated conditions)
107. Mach number calculator
108. Aircraft load factor arithmetic helper (not flight-safety assurance)
109. Payload and baggage mass converter
110. Ship speed and voyage time
111. Marine fuel consumption estimate (user inputs)
112. Nautical chart scale converter
113. Train speed and trip time
114. Rail connection buffer calculator
115. Train platform walking time estimate
116. Cargo volume and payload arithmetic helper
117. Container volume and utilization
118. Freight mass/volume chargeable-weight helper (carrier rules vary)
119. Shipping dimensional-weight calculator (carrier divisor user-selected)
120. Pallet loading and container capacity estimate

### E. Commuting, logistics and travel budgeting
121. Commute time per week/year
122. Commute distance per year
123. Work-from-home travel savings
124. Transit fare total from user-entered tickets
125. Travel budget by category
126. Daily travel budget and remaining amount
127. Currency conversion placeholder only when rate is supplied or live source is integrated
128. Baggage weight allowance arithmetic helper
129. Luggage volume estimate
130. Packing list quantity helper
131. Trip cost per person
132. Group accommodation cost split
133. Shared transport cost split
134. Per diem and expense total
135. Business mileage reimbursement calculator
136. Parking duration cost from rate rules
137. Taxi fare estimate from user-supplied tariff
138. Travel insurance premium allocation (user inputs only)
139. Airport arrival buffer calculator (user-defined buffer, not airline advice)
140. Trip itinerary duration sum
141. Time spent in transit summary
142. Delay impact and connection slack calculator
143. Delivery route distance/time sum from supplied legs
144. Fleet utilization percentage
145. Fleet vehicle downtime cost
146. Delivery fuel cost estimate
147. Payload utilization percentage
148. Logistics load factor
149. Cost per shipment
150. Cost per tonne-kilometre
151. Shipping container volume utilization
152. Cargo density and dimensional weight
153. Route average speed from supplied distance/time segments
154. Fleet annual mileage and fuel total
155. Vehicle replacement cost-per-distance comparison
156. Trip carbon-emission estimate from explicit emission factors

## Completion gate

A candidate is not a completed calculator until registry/file parity, formulas, units, known-answer tests, boundary validation, accessible UI and exact-commit verification pass. Dynamic facts such as traffic, timetables, fares, exchange rates and fuel prices must not be fabricated; label user-supplied assumptions or connect a verified source.