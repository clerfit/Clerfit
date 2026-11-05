# Phase 15 — Construction & Home Calculators

**Started:** 2026-10-20  
**Branch:** `phase-14-engineering-catalogue`  
**Status:** Scope and candidate catalogue drafted; routes and calculations are not claimed implemented.

## Scope and guardrails

Phase 15 adds Construction & Home as a distinct workstream within the existing 50-category taxonomy. Reconcile every candidate against the central registry before creating routes. Do not duplicate existing calculators. Calculations are planning estimates, not building-code approval, structural design, electrical safety certification, or contractor quotes. Display assumptions, waste allowances, material units, and regional variation clearly. Use accessible inputs, unit-local selectors, round keyboard-accessible tooltips for advanced inputs, and tested validation.

## Maximum candidate inventory

### A. Building measurements and geometry
1. Room area
2. Multi-room floor area
3. Wall surface area
4. Ceiling area
5. Paintable wall area after doors/windows
6. Floor perimeter and skirting length
7. Rectangle/circle/triangle/trapezoid area
8. Room volume
9. Irregular room area by segmented rectangles
10. Roof area from footprint and pitch
11. Roof pitch, rise, run and angle conversion
12. Stair rise, tread and total run
13. Ramp slope and rise/run
14. Door/window opening area
15. Tile layout area and count
16. Flooring plank/board count
17. Wallpaper roll count
18. Baseboard/skirting quantity
19. Linear-to-area material conversion
20. Drawing scale and real dimension converter

### B. Concrete, cement, masonry and finishes
21. Concrete volume for slab
22. Concrete volume for footing
23. Concrete volume for column
24. Concrete volume for beam
25. Concrete volume for steps
26. Concrete volume for circular pier
27. Concrete batch quantity estimator
28. Cement bag count from user-selected mix ratio
29. Sand and aggregate volume estimator
30. Mortar volume estimator
31. Brick count with mortar-joint allowance
32. Block count with mortar-joint allowance
33. Wall plaster volume/material estimator
34. Floor screed quantity
35. Grout quantity estimate
36. Tile adhesive quantity estimate
37. Tile count with cuts/wastage
38. Paver count and bedding quantity
39. Asphalt volume/mass estimator
40. Drywall/gypsum board count
41. Joint compound estimator
42. Insulation board count
43. Sealant/bead length and cartridge count
44. Roofing sheet count
45. Roofing shingle/tiles count
46. Rebar length and mass estimate
47. Wire mesh area/count estimate
48. Formwork contact area
49. Excavation volume
50. Backfill volume
51. Soil volume expansion/shrinkage allowance
52. Aggregate base/sub-base quantity
53. Paint quantity by coverage and coats
54. Primer quantity
55. Wood stain/varnish quantity
56. Wallpaper rolls with pattern-repeat allowance

### C. Home utilities and energy
57. Electricity consumption and bill estimate
58. Appliance running cost
59. Monthly energy consumption from watts and hours
60. Lighting load estimate
61. LED replacement energy savings
62. Solar panel count and approximate output
63. Home battery capacity and autonomy estimate
64. Backup generator load sum
65. Air-conditioner cooling capacity rough estimator (not HVAC design)
66. Room ventilation flow arithmetic helper
67. Fan energy cost
68. Water heater energy and cost
69. Water tank capacity
70. Daily household water demand estimate
71. Rainwater harvesting volume estimate
72. Roof runoff collection estimate
73. Pump energy and operating cost
74. Pipe flow rate and fill/drain time
75. Water pressure head converter
76. Pipe length and fitting allowance tracker
77. Irrigation water volume
78. Lawn watering volume
79. Drip irrigation emitter-flow sum
80. Household waste volume estimate

### D. Home planning and materials
81. Furniture fit / clearance calculator
82. Moving-box count estimate
83. Storage volume calculator
84. Shelf load arithmetic helper (not safety certification)
85. Cabinet panel area and board yield
86. Timber volume and board-foot converter
87. Lumber count and cut-list waste estimate
88. Deck board count
89. Fence length and post count
90. Fence panel and concrete-post-footing volume
91. Garden bed soil volume
92. Raised-bed soil volume
93. Mulch volume
94. Compost volume and coverage
95. Topsoil volume
96. Gravel coverage
97. Driveway area and material quantity
98. Patio paver quantity
99. Pool volume
100. Pool fill time
101. Pond volume
102. Hot tub volume
103. Furniture fabric length estimate
104. Curtain fabric and fullness estimate
105. Blind/shade size helper
106. Stair runner/carpet length
107. Carpet area and roll estimate
108. Countertop area
109. Backsplash tile count
110. Kitchen cabinet linear length
111. Closet rod/shelf length
112. Door casing and trim length
113. Picture-frame moulding length
114. Gutter length and downspout count estimate

### E. Household budgeting and project management
115. Renovation cost breakdown
116. Material subtotal and tax
117. Labor-hour and labor-cost estimator
118. Contractor quote comparison
119. Contingency percentage and total budget
120. Project cost per square unit
121. Cost per room
122. Cost per tile/flooring unit
123. Monthly mortgage payment (assumptions disclosed)
124. Mortgage affordability arithmetic helper (not financial advice)
125. Loan amortization calculator
126. Simple/compound home-improvement loan interest
127. Payback period for home energy upgrades
128. Appliance lifetime cost estimate
129. Water-saving payback estimate
130. Solar payback estimate (assumptions disclosed)
131. Renovation schedule duration estimate
132. Task dependency / critical path helper
133. Material delivery buffer calculator
134. Waste percentage and reorder quantity
135. Home inventory replacement-cost sum
136. Moving volume and vehicle capacity estimator

### F. Garden, exterior and property
137. Plot area from dimensions
138. Plot area unit converter
139. Fence perimeter
140. Garden irrigation run time
141. Plant spacing and plant count
142. Seed quantity from area/rate
143. Fertilizer quantity from label application rate
144. Soil amendment quantity
145. Compost/soil coverage depth converter
146. Tree mulch ring volume
147. Hedge length and plant count
148. Lawn seed coverage
149. Lawn sod/pallet count
150. Slope percentage and elevation change
151. Retaining-wall face area and block count (not structural design)
152. Drainage fall and pipe slope
153. Rain barrel capacity
154. Roof/gutter rainfall capture
155. Driveway slope
156. Outdoor lighting energy estimate
157. Solar outdoor light runtime estimate
158. Deck/patio material quantity
159. Pool chemical dilution arithmetic helper (label directions only; never mix chemicals)
160. Fence paint quantity
161. Exterior siding area
162. Gutter downspout catchment helper
163. Property boundary unit converter
164. Map scale / plan dimension converter

## Completion gate

The candidate list is not an implemented route count. Phase 15 closure requires registry reconciliation, documented methods, independent known-answer tests, unit-equivalence tests, boundary tests, accessible error handling, tooltips where needed, responsive browser checks, and exact-commit regression evidence.