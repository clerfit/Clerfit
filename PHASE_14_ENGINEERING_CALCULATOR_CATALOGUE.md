# Phase 14 — Engineering Calculator Catalogue and Execution Plan

**Started:** 2026-10-20  
**Branch:** `phase-14-engineering-catalogue`  
**Baseline:** `main` at `e7ca8b97db5b3683d6df08993c94a268f9473e72`  
**Status:** Catalogue and implementation plan started; calculator routes are not claimed implemented by this document.

## Non-negotiable project rules

- Preserve the existing 50-major-category taxonomy. Phase 14 is an additive category/workstream, not a replacement for existing categories.
- Treat this document as a maximum-scope candidate inventory. Items may already exist, be missing, overlap another route, or require specialist review; reconcile each against the live registry and master inventory before coding.
- Do not create duplicate routes merely to inflate counts. Aliases and equivalent calculators must be identified.
- Each implemented calculator must document equation/method, units, assumptions, input bounds, expected outputs and limitations.
- Prefer SI units as a documented internal basis; any display-unit selector is local to that calculator only. No global unit preference.
- Use small round tooltip buttons for advanced concepts and non-obvious inputs; tooltips must be keyboard accessible.
- Reject non-finite values and invalid ranges; provide accessible inline errors and do not silently coerce invalid inputs.
- No charts, dynamic progress indicators or one-click share features unless separately requested.
- Do not make unsupported safety, structural certification, clinical, financial or engineering-compliance claims. Structural/chemical/electrical results are educational estimates and require qualified engineering validation for real designs.
- Keep professional pictorial icons, responsive layouts, keyboard focus, and the existing navigation conventions.

## Phase 14 candidate inventory

This deliberately broad catalogue covers mechanical, electrical/electronics, civil/structural, chemical/process, industrial/manufacturing, environmental, aerospace, materials, energy, instrumentation, engineering economics and general engineering. It is the maximum candidate scope for reconciliation—not a statement that every entry belongs as a separate route or is already implemented.

### A. General engineering, dimensions and conversions

1. Engineering unit converter (SI, Imperial and common technical units)
2. Force unit converter
3. Torque unit converter
4. Pressure and stress unit converter
5. Energy and work unit converter
6. Power unit converter
7. Mass flow and volumetric flow converter
8. Temperature and temperature-difference converter
9. Angular unit converter
10. Rotational speed converter (rpm, rad/s)
11. Linear speed and acceleration converter
12. Density and specific-volume converter
13. Dynamic and kinematic viscosity converter
14. Thermal conductivity and heat-transfer coefficient converter
15. Specific heat capacity converter
16. Engineering notation and significant-figures helper
17. Tolerance stack-up calculator (documented worst-case method)
18. Dimensional-analysis / unit-consistency checker (limited to supported dimensions)

### B. Mechanical engineering and machine design

19. Newton's second-law force calculator
20. Weight from mass and local gravitational acceleration
21. Torque from force and lever arm
22. Rotational power from torque and angular speed
23. Linear mechanical power from force and velocity
24. Mechanical work and energy calculator
25. Mechanical efficiency calculator
26. Mechanical advantage calculator
27. Gear ratio calculator
28. Driven gear speed calculator
29. Gear torque ratio estimator (ideal and efficiency-adjusted)
30. Belt and pulley ratio calculator
31. Chain/sprocket ratio calculator
32. Lead screw travel per revolution calculator
33. Screw jack ideal mechanical advantage calculator
34. Spring rate calculator (linear spring)
35. Spring force and deflection calculator
36. Spring energy storage calculator
37. Axial stress calculator
38. Normal strain calculator
39. Young's modulus calculator
40. Shear stress calculator
41. Shear strain calculator
42. Poisson's ratio relationship calculator
43. Thermal expansion calculator
44. Thermal stress estimate (assumptions and restraint model required)
45. Beam deflection for supported standard cases (case-specific equations only)
46. Shaft torsion / angle-of-twist calculator
47. Polar moment of inertia for common sections
48. Area moment of inertia for common sections
49. Section modulus calculator
50. Euler column buckling estimator (boundary conditions explicit)
51. Factor of safety calculator (user-supplied allowable and calculated demand)
52. Friction force calculator
53. Inclined-plane force calculator
54. Centripetal acceleration and force calculator
55. Flywheel kinetic energy calculator
56. Rotational inertia for common simple shapes
57. Fluid power / hydraulic cylinder force calculator
58. Pneumatic cylinder force estimator
59. Pump hydraulic power and efficiency estimator
60. Fan power and pressure-flow estimator (assumptions disclosed)
61. Reynolds number calculator
62. Darcy-Weisbach pipe friction loss calculator
63. Minor-loss coefficient calculator
64. Bernoulli equation helper for supported idealized cases
65. Hydraulic head / pressure head converter
66. Cavitation NPSH bookkeeping helper (not a pump-selection guarantee)
67. Lubrication film / bearing parameter helper (only with defined method)
68. Machining cutting speed calculator
69. Feed rate calculator for turning/milling/drilling
70. Spindle speed calculator
71. Machining material-removal rate calculator
72. Cutting time estimator
73. Surface speed / chip-load converter
74. Weld size / nominal throat geometry calculator (not a weld-code approval)
75. Fastener preload / torque estimator (friction assumptions stated)
76. Bolt-circle geometry calculator
77. Bearing life L10 estimator (catalogue load-rating assumptions)
78. Flywheel speed/energy relation calculator

### C. Electrical engineering and electronics

79. Ohm's law calculator
80. Electrical power from voltage and current
81. Electrical energy and operating-time calculator
82. Series resistance calculator
83. Parallel resistance calculator
84. Series capacitor calculator
85. Parallel capacitor calculator
86. Series inductor calculator
87. Parallel inductor calculator
88. Voltage divider calculator
89. Loaded voltage divider estimator
90. Current divider calculator
91. Kirchhoff loop/node simple-circuit helper (limited supported topologies)
92. RC time constant calculator
93. RL time constant calculator
94. LC resonant frequency calculator
95. RLC resonant frequency calculator
96. AC impedance magnitude calculator
97. Capacitive reactance calculator
98. Inductive reactance calculator
99. AC RMS / peak / peak-to-peak converter
100. Frequency and angular-frequency converter
101. Power factor calculator
102. Real, reactive and apparent power calculator
103. Three-phase power calculator (line/phase convention explicit)
104. Transformer turns ratio calculator
105. Ideal transformer voltage/current estimator
106. Transformer efficiency calculator
107. Voltage regulation calculator
108. LED series resistor calculator (supply, forward voltage/current assumptions)
109. Resistor power dissipation calculator
110. Resistor divider power calculator
111. Battery series/parallel voltage and capacity estimator
112. Battery runtime estimator (load and usable capacity assumptions)
113. Coulomb / amp-hour / milliamp-hour converter
114. Wire resistance calculator (material, length, area, temperature assumptions)
115. Voltage drop in cable calculator
116. Electrical conductor loss calculator
117. Fuse nominal current planning helper (not code compliance)
118. Transformer and motor power unit converter
119. Motor speed/slip estimator
120. Motor torque from power and speed
121. Motor efficiency calculator
122. PWM duty-cycle average voltage estimator
123. ADC resolution / quantization-step calculator
124. DAC step-size calculator
125. Op-amp ideal gain calculator (common configurations)
126. Non-inverting/inverting amplifier resistor calculator
127. Filter cutoff frequency calculator (first-order RC)
128. Decibel voltage/power ratio converter
129. Logic gate truth-table helper
130. Binary/decimal/hex conversion for digital electronics
131. LED resistor power and margin helper
132. Solar panel electrical output estimate (conditions and derating disclosed)

### D. Civil and structural engineering

133. Rectangle/circle/triangle cross-sectional area calculator
134. Common-section centroid calculator (supported shapes only)
135. Area moment of inertia for common sections
136. Section modulus for common sections
137. Simply supported beam reaction calculator (point loads)
138. Cantilever beam reaction calculator (supported loads)
139. Shear-force and bending-moment calculator for supported beam cases
140. Beam deflection calculator for named standard cases
141. Axial stress and strain calculator
142. Concrete volume calculator
143. Concrete mix quantity estimator (mix ratio is user-specified; no strength guarantee)
144. Cement, sand and aggregate quantity estimator
145. Mortar quantity estimator
146. Brick/block count and mortar allowance estimator
147. Plaster quantity estimator
148. Tile quantity and wastage estimator
149. Paint coverage estimator
150. Excavation / earthwork volume calculator
151. Trapezoidal cross-section earthwork calculator
152. Road gradient / slope calculator
153. Rise-run-grade converter
154. Roof pitch and rafter geometry calculator
155. Stair rise/tread geometry calculator (code compliance not implied)
156. Pipe slope and fall calculator
157. Tank volume calculator (cylindrical, rectangular, horizontal-cylinder methods as supported)
158. Water pressure with depth calculator
159. Hydrostatic force on a plane surface (supported cases)
160. Buoyancy force calculator
161. Flow rate from volume and time
162. Manning open-channel flow estimator (geometry/roughness assumptions stated)
163. Rainfall intensity/volume calculator
164. Runoff volume estimator (coefficient method; assumptions stated)
165. Surveying distance / bearing / coordinate calculator
166. Coordinate traverse helper (closure error shown)
167. Horizontal curve geometry calculator (defined inputs and conventions)
168. Vertical curve geometry calculator (defined inputs and conventions)
169. Road superelevation helper (design limits not certified)
170. Land area and parcel unit converter
171. Map scale and drawing scale converter
172. Quantity take-off subtotal / contingency calculator
173. Rebar length and mass estimator
174. Steel section mass calculator (based on declared dimensions/density)
175. Foundation bearing-pressure arithmetic helper (not a geotechnical design approval)
176. Retaining wall lateral pressure estimator (simplified assumptions stated)
177. Factor of safety arithmetic helper for supplied geotechnical inputs (not certification)
178. Water tank capacity and freeboard arithmetic helper

### E. Chemical and process engineering

179. Molar mass calculator from formula input (supported element table)
180. Mole–mass–molar-mass converter
181. Molarity calculator
182. Molality calculator
183. Normality calculator (reaction equivalent explicitly specified)
184. Dilution calculator
185. Mass fraction and mass-percent calculator
186. Volume-percent and volume-fraction calculator
187. Mole fraction calculator
188. ppm / ppb converter with basis specified
189. Ideal gas law calculator
190. Combined gas law calculator
191. Gas density estimator (ideal-gas assumptions)
192. Partial pressure calculator
193. Stoichiometric reagent quantity calculator for balanced equations
194. Limiting reagent and theoretical yield calculator
195. Percent yield calculator
196. Conversion, selectivity and yield calculator
197. Material balance for non-reactive mixing/splitting
198. Single-reaction mass balance helper (balanced reaction required)
199. Volumetric flow / mass flow conversion
200. Residence time calculator
201. Space velocity calculator
202. Pump / pipe pressure-drop helper (model and assumptions stated)
203. Heat duty calculator (sensible heat)
204. Latent heat calculator
205. Combined heating/cooling duty estimator (separate sensible/latent terms)
206. Heat exchanger LMTD calculator (validity conditions stated)
207. Heat exchanger effectiveness calculator (defined model)
208. Thermal energy balance calculator
209. Batch reactor time / rate estimator for specified kinetic model only
210. First-order reaction half-life calculator
211. Arrhenius equation rate-constant estimator
212. pH from hydrogen-ion concentration (ideal dilute approximation stated)
213. Hydrogen-ion concentration from pH
214. Buffer Henderson–Hasselbalch helper (validity limits stated)
215. Solution density / concentration interpolation helper (user-supplied table)
216. Distillation component material balance helper (not column design)
217. Extraction recovery / partition ratio calculator
218. Filtration flux and throughput calculator
219. Drying moisture-content converter
220. Humidity ratio / relative-humidity helper (defined psychrometric method)
221. Process yield and loss calculator
222. Process mass / volume / time batch sizing calculator

### F. Industrial, manufacturing and operations engineering

223. Production rate calculator
224. Cycle time calculator
225. Takt time calculator
226. Line balancing efficiency calculator
227. OEE calculator (availability × performance × quality, definitions shown)
228. Availability / reliability / maintainability calculator
229. MTBF and MTTR calculator
230. Failure rate and exponential reliability estimator (model assumptions stated)
231. Scrap rate and first-pass yield calculator
232. Defect rate / DPMO calculator
233. Process capability Cp calculator
234. Process capability Cpk calculator (distribution/normality limitations stated)
235. Control-chart limit helper for supported chart types (not a full SPC package)
236. Inventory reorder point calculator
237. Economic order quantity calculator (classical assumptions disclosed)
238. Safety stock calculator (chosen demand/lead-time model disclosed)
239. Kanban quantity calculator
240. Work-in-process / Little's Law calculator
241. Queue utilization and waiting-time helper (specified queue model only)
242. Project critical path and float calculator
243. PERT expected-time estimator
244. Project schedule variance calculator
245. Workforce capacity / staffing estimator
246. Shift coverage calculator
247. Labor productivity calculator
248. Material utilization and yield calculator
249. Scrap recovery value arithmetic helper (user-provided prices only)
250. Batch sizing and lot-size calculator
251. Machine utilization calculator
252. Setup-time reduction percentage calculator
253. Standard time from observed time and allowances
254. Learning-curve cost/time estimator (model assumptions stated)
255. Work sampling proportion calculator
256. Ergonomic lifting screening arithmetic helper (no medical/safety certification)
257. Warehouse volume and pallet capacity estimator
258. Packaging cube utilization calculator
259. Transport load utilization calculator
260. Pareto cumulative percentage helper
261. Weighted decision matrix calculator
262. Break-even quantity calculator
263. Unit manufacturing cost calculator
264. Make-or-buy cost comparison (user-specified cost inputs)
265. Engineering project NPV calculator (cash-flow assumptions stated)
266. Engineering project IRR estimator (limitations and multiple-solution caveat)
267. Payback period calculator
268. Energy cost per unit calculator
269. Cost of downtime calculator
270. Carbon intensity per unit output calculator (emission factors user-specified)

### G. Energy, environmental and related engineering

271. Electrical energy cost calculator
272. Thermal energy cost calculator
273. Heat loss through a plane wall (steady one-dimensional model)
274. Composite-wall thermal resistance calculator
275. Conduction / convection / radiation unit helpers
276. Solar irradiance-to-energy estimator (panel performance assumptions stated)
277. Solar PV string voltage arithmetic helper (manufacturer limits must be checked)
278. Battery storage sizing estimator (autonomy, depth-of-discharge and efficiency explicit)
279. Wind power theoretical estimator (not site-yield prediction)
280. Pumping energy consumption estimator
281. Compressed-air energy estimate (assumptions stated)
282. Boiler efficiency estimate (method inputs disclosed)
283. Heat pump COP calculator
284. Refrigeration COP calculator
285. Cooling load arithmetic helper for specified components (not a full HVAC design)
286. Air-change / ventilation flow calculator
287. Duct velocity and flow calculator
288. Fan laws speed/flow/pressure/power estimator
289. Psychrometric sensible heat helper
290. Water consumption and wastewater flow calculator
291. Water treatment removal efficiency calculator
292. Pollutant concentration dilution / mass-load calculator
293. Emission factor × activity emissions calculator
294. Carbon dioxide equivalent calculator using explicit GWP inputs
295. Waste diversion / recycling rate calculator
296. Noise level logarithmic addition helper (dB)
297. Decibel distance attenuation estimator (idealized assumptions)
298. Illumination inverse-square helper (idealized point source)
299. Lumen / lux / area converter (geometry limitations stated)
300. Cooling-water heat balance calculator

### H. Materials, aerospace, instrumentation and specialist candidates

301. Material density from mass and volume
302. Linear mass / areal density calculator
303. Hardness-scale conversion lookup (only if validated table and caveats available)
304. Thermal diffusivity calculator
305. Specific strength / stiffness calculator
306. Fatigue-life arithmetic helper for specified model/data only
307. Fracture mechanics stress-intensity helper for defined geometry only
308. Composite volume-fraction / mass-fraction calculator
309. Mixture density estimator under stated assumptions
310. Corrosion rate estimator from mass loss and exposed area/time
311. Galvanic-series lookup helper (reference source and limitations required)
312. Aircraft speed unit converter
313. Mach number calculator
314. Standard-atmosphere lookup helper (declared model/altitude range)
315. Lift equation calculator (inputs and assumptions stated; no flight-safety claim)
316. Drag equation calculator (inputs and assumptions stated)
317. Thrust-specific fuel consumption converter
318. Rocket delta-v ideal equation helper (idealized equation; no vehicle design assurance)
319. Orbital period calculator for ideal two-body circular orbit
320. Centripetal load / g-force calculator
321. Sensor linear calibration calculator
322. Two-point linear interpolation calculator
323. Linear regression calibration helper (sample data and residuals shown)
324. Instrument error / percent error calculator
325. Measurement uncertainty propagation for supported independent variables
326. Combined standard uncertainty calculator (specified inputs only)
327. Resolution / sensitivity / span calculator
328. Calibration correction and offset calculator
329. Signal-to-noise ratio calculator
330. Sampling frequency / Nyquist frequency helper
331. Sensor voltage-divider calculator
332. Thermocouple conversion helper (only validated type-specific tables)
333. Strain gauge bridge output estimator (circuit assumptions stated)
334. PID proportional/integral/derivative term arithmetic helper (not automatic tuning)
335. Control-system first-order time constant and settling estimate (model-specific)
336. Transfer-function pole/zero helper for supported low-order forms
337. PLC scan-time / I/O update estimator
338. Industrial network bandwidth / packet load estimator

## Implementation and verification sequence

### 14.1 — Inventory reconciliation
- Compare all 338 candidates against the master 50-category inventory, current registry, existing routes and prior calculator lists.
- Mark each candidate: existing verified, existing needs repair, missing and approved, duplicate/alias, deferred, or specialist-review-required.
- Keep category and route counts truthful; do not report candidate counts as implemented calculator counts.

### 14.2 — Prioritization
- Implement low-risk, deterministic unit conversions and general equations first.
- Next implement mechanical, electrical and basic material/flow calculations with well-defined equations and test vectors.
- Gate structural, chemical, geotechnical, aerospace, HVAC, safety and code-dependent calculators behind explicit assumptions and subject-matter review where appropriate.
- Avoid implying that a calculator replaces licensed engineering, equipment datasheets, local codes, or a validated design package.

### 14.3 — Required per-calculator artifacts
- Formula/method and primary reference or derivation
- Variable glossary with SI base units and sign conventions
- Supported unit choices and round-trip conversion tests
- At least one independent known-answer test and one unit-equivalence test
- Zero, negative, non-finite, extreme and cross-field validation tests as relevant
- Accessible labels, error messages, focus behavior and tooltip content
- Route registry, category listing, sitemap and metadata consistency
- Limitations and model validity notes visible to users

### 14.4 — Release gates
- Run the repository's current test commands and new Phase 14-specific tests on the exact candidate SHA.
- Build the staged site and verify source-to-staging parity.
- Run route-level browser interaction checks and accessibility smoke checks.
- Verify responsive layout at mobile, tablet and desktop widths.
- Record results and failures; never substitute a plan or inventory for execution evidence.
- Do not deploy to `main` or publish a release solely because this catalogue has been added.

## Initial disposition

**Phase 14 has started as an additive catalogue/planning workstream.** The inventory above is a maximum candidate set for reconciliation. The calculators themselves remain unverified until matched to the registry and implemented/tested. Phase 13 re-audit findings are recorded in `PHASE_13_REAUDIT_2026-10-20.md`; Phase 13 remains open until its implementation and exact-commit verification gates pass.
