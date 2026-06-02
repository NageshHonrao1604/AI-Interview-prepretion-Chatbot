# import json
# import random

# # ─────────────────────────────────────────────────────────
# # QUESTION BANKS — role / category / tier
# # ─────────────────────────────────────────────────────────
# BANKS = {
#   "Software Developer": {
#     "Technical": {
#       "basic": [
#         "What is the difference between a stack and a queue? When would you use each?",
#         "Explain object-oriented programming and its four core principles.",
#         "What is the difference between synchronous and asynchronous programming?",
#         "What is a REST API and how does it work?",
#         "What is version control and what Git commands do you use most often?",
#         "What is recursion? Explain with a simple example.",
#         "What is the difference between an abstract class and an interface?",
#         "What is a database index and why is it important?",
#         "Explain what HTTP methods (GET, POST, PUT, DELETE) are used for.",
#         "What is the difference between == and === in JavaScript?",
#       ],
#       "intermediate": [
#         "How would you design a caching system to improve application performance?",
#         "Explain the SOLID principles with real examples.",
#         "When would you choose SQL over NoSQL and why?",
#         "How do you handle race conditions in concurrent programming?",
#         "What is dependency injection and how does it improve testability?",
#         "Explain microservices architecture and its trade-offs vs monolith.",
#         "How would you implement pagination for a large dataset REST API?",
#         "What is the difference between horizontal and vertical scaling?",
#         "How do you approach debugging a production issue with minimal logs?",
#         "Explain the Observer and Factory design patterns with use-cases.",
#       ],
#       "advanced": [
#         "Design a high-availability system that handles 1 million requests per second.",
#         "How would you architect a real-time notification system for a social platform?",
#         "Explain CAP theorem and how you'd design around it.",
#         "How would you implement a distributed transaction across microservices?",
#         "Describe implementing a rate limiter for a public API at scale.",
#         "How would you design a search indexing system for 100 million documents?",
#         "What is eventual consistency? Give a real-world example.",
#         "How would you process 10TB of user event data daily?",
#         "Describe how you'd implement a circuit breaker pattern in production.",
#         "How would you design a multi-tenant SaaS ensuring data isolation?",
#       ],
#     },

#     "HR": {
#       "basic": [
#         "Why did you choose software development as a career?",
#         "How do you stay updated with new technologies?",
#         "Tell me about a project you're most proud of.",
#         "How do you handle code review feedback?",
#         "What kind of development environment do you prefer and why?",
#       ],

#       "intermediate": [
#         "Describe a technical disagreement with a teammate. How did you resolve it?",
#         "How do you manage multiple projects with competing deadlines?",
#         "Tell me about a time you had to learn a new technology very quickly.",
#         "How do you explain complex technical concepts to non-technical stakeholders?",
#         "Describe a situation where you identified and fixed a critical production bug.",
#       ],

#       "advanced": [
#         "Tell me about a time you led a team through a major technical migration.",
#         "How do you mentor junior developers? Give an example of measurable impact.",
#         "Describe a time you pushed back on a technical decision from leadership.",
#         "How do you balance technical debt with delivering new features?",
#         "Tell me about a project you led that failed and what you learned.",
#       ],
#     },

#     "Behavioral": {
#       "basic": [
#         "Tell me about a challenging coding problem. How did you approach it?",
#         "How do you handle tight deadlines in development?",
#         "Describe a situation where you adapted quickly to changing requirements.",
#         "Give an example of going above and beyond what was expected.",
#         "How do you prioritize tasks when you have multiple things to work on?",
#       ],

#       "intermediate": [
#         "Tell me about a conflict in a development team and how you resolved it.",
#         "Describe a time you improved a process or workflow in your team.",
#         "Tell me about working with incomplete or ambiguous requirements.",
#         "How have you handled a situation where a teammate wasn't contributing?",
#         "Describe how you responded to and implemented critical feedback.",
#       ],

#       "advanced": [
#         "Tell me about the most complex technical project you've worked on.",
#         "Describe a trade-off you made between code quality and delivery speed.",
#         "How have you driven adoption of a new technology in your organization?",
#         "Tell me about a time you influenced stakeholders without direct authority.",
#         "Describe your most impactful individual contribution to a software project.",
#       ],
#     },
#   },
# }

# FALLBACK = {
#     "basic": [
#         "Can you walk me through your background and main skills?",
#         "What motivates you in your professional life?",
#         "How do you approach learning new skills?",
#         "What would your colleagues say are your greatest strengths?",
#         "How do you handle working in a fast-paced environment?",
#     ],

#     "intermediate": [
#         "Describe a challenging project and your approach to solving it.",
#         "How do you handle competing priorities and deadlines?",
#         "Tell me about a conflict with a colleague and how you resolved it.",
#         "How do you stay updated on industry developments?",
#         "Describe a process improvement you implemented.",
#     ],

#     "advanced": [
#         "What is the highest-impact contribution you've made in your career?",
#         "Describe how you've influenced organizational strategy or direction.",
#         "Tell me about leading through significant ambiguity.",
#         "How do you build trust with new stakeholders quickly?",
#         "Describe the most complex challenge you've faced and how you resolved it.",
#     ],
# }

# # ─────────────────────────────────────────────────────────
# # HELPER: find the right bank
# # ─────────────────────────────────────────────────────────
# def _find_bank(role: str, category: str):

#     role_key = next(
#         (
#             k for k in BANKS
#             if k.lower() in role.lower() or role.lower() in k.lower()
#         ),
#         None
#     )

#     if not role_key:
#         return None, None

#     cat_key = next(
#         (
#             k for k in BANKS[role_key]
#             if k.lower() in category.lower() or category.lower() in k.lower()
#         ),
#         None
#     )

#     if not cat_key:
#         cat_key = list(BANKS[role_key].keys())[0]

#     return role_key, cat_key


# # ─────────────────────────────────────────────────────────
# # QUESTION GENERATION
# # ─────────────────────────────────────────────────────────
# def generate_interview_question(
#     role: str,
#     category: str,
#     difficulty: str,
#     question_number: int,
#     asked_questions: list = None,
# ) -> str:

#     asked = set(asked_questions or [])

#     # Tier based on question number (1-10)
#     if question_number <= 3:
#         tier = "basic"
#     elif question_number <= 7:
#         tier = "intermediate"
#     else:
#         tier = "advanced"

#     role_key, cat_key = _find_bank(role, category)

#     if role_key and cat_key:
#         tier_pool = BANKS[role_key][cat_key][tier][:]

#         all_pool = (
#             BANKS[role_key][cat_key]["basic"]
#             + BANKS[role_key][cat_key]["intermediate"]
#             + BANKS[role_key][cat_key]["advanced"]
#         )

#     else:
#         tier_pool = FALLBACK[tier][:]
#         all_pool = (
#             FALLBACK["basic"]
#             + FALLBACK["intermediate"]
#             + FALLBACK["advanced"]
#         )

#     random.shuffle(tier_pool)

#     for q in tier_pool:
#         if q not in asked:
#             return q

#     # Fallback to any tier
#     random.shuffle(all_pool)

#     for q in all_pool:
#         if q not in asked:
#             return q

#     return (
#         tier_pool[0]
#         if tier_pool
#         else f"Describe an advanced challenge you've faced as a {role}."
#     )


# # ─────────────────────────────────────────────────────────
# # ANSWER EVALUATION
# # ─────────────────────────────────────────────────────────
# def evaluate_answer(question: str, answer: str) -> dict:

#     words = answer.split()
#     word_count = len(words)
#     a = answer.lower()

#     # ── Depth signals ──
#     has_example = any(
#         p in a for p in [
#             "for example",
#             "for instance",
#             "such as",
#             "like when",
#             "in my experience",
#             "i worked on",
#             "we implemented",
#             "at my previous",
#             "in one project",
#             "i once",
#         ]
#     )

#     has_structure = any(
#         p in a for p in [
#             "first",
#             "second",
#             "third",
#             "firstly",
#             "additionally",
#             "furthermore",
#             "however",
#             "therefore",
#             "in conclusion",
#             "to summarize",
#         ]
#     )

#     tech_hits = sum(
#         1 for kw in [
#             "algorithm",
#             "architect",
#             "framework",
#             "pattern",
#             "database",
#             "api",
#             "cache",
#             "scal",
#             "perform",
#             "optim",
#             "deploy",
#             "refactor",
#             "abstract",
#             "encapsulat",
#             "inherit",
#             "polymorph",
#             "pipeline",
#             "model",
#             "metric",
#             "cluster",
#             "microservice",
#         ] if kw in a
#     )

#     uncertain = any(
#         p in a for p in [
#             "i'm not sure",
#             "i think maybe",
#             "not really sure",
#             "i don't know",
#         ]
#     )

#     # ── Base score ──
#     score = 4

#     if word_count >= 100:
#         score += 3
#     elif word_count >= 50:
#         score += 2
#     elif word_count >= 25:
#         score += 1

#     if has_example:
#         score += 1

#     if has_structure:
#         score += 1

#     score = min(10, max(3, score))

#     # ── Sub-metrics ──
#     relevance = min(10, max(2, score + (1 if has_example else 0)))

#     technical_accuracy = min(
#         10,
#         max(
#             2,
#             score + (
#                 1 if tech_hits >= 3
#                 else (-1 if tech_hits == 0 else 0)
#             )
#         )
#     )

#     communication = min(
#         10,
#         max(2, score + (1 if has_structure else -1))
#     )

#     confidence = min(
#         10,
#         max(
#             2,
#             score
#             + (1 if word_count >= 60 else 0)
#             - (2 if uncertain else 0)
#         )
#     )

#     # ── Strength (specific, varied) ──
#     strength_opts = []

#     # if has_example:
#     #     strength_opts.append("Strengthened the answer with a concrete real-world example, which adds credibility and clarity.")

#     # if has_structure:
#     #     strength_opts.append("Organised thoughts in a logical flow, making the response easy to follow.")

#     # if word_count >= 60:
#     #     strength_opts.append("Provided a thorough, detailed response demonstrating solid domain understanding.")

#     # if tech_hits >= 2:
#     #     strength_opts.append("Used precise technical vocabulary, signalling hands-on expertise.")

#     # if not strength_opts:
#     #     strength_opts.append("Addressed the core of the question with a direct, honest attempt.")

#     # strength = random.choice(strength_opts)

#     if has_example:
#         strength_opts.append(
#             "Used practical examples effectively to support the explanation."
#         )

#     if has_structure:
#         strength_opts.append(
#             "Presented the answer in a structured and logical manner."
#         )

#     if word_count >= 80:
#         strength_opts.append(
#             "Demonstrated strong depth of knowledge with detailed explanation."
#         )

#     if tech_hits >= 3:
#         strength_opts.append(
#             "Showed solid technical expertise using relevant concepts and terminology."
#         )

#     if confidence >= 8:
#         strength_opts.append(
#             "Communicated ideas confidently and professionally."
#         )

#     if communication >= 8:
#         strength_opts.append(
#             "Explained concepts clearly with excellent communication clarity."
#         )

#     if not strength_opts:
#         strength_opts.append(
#             "Attempted to answer directly and stayed relevant to the question."
#         )

#     strength = " | ".join(strength_opts[:2])

#     # ── Weakness (specific, varied) ──

#     # weakness_opts = []

#     # if not has_example:
#     #     weakness_opts.append("The response would benefit from a specific example or scenario to make the point tangible.")

#     # if not has_structure:
#     #     weakness_opts.append("The answer lacked structured organisation; a clear beginning, middle, and conclusion would improve impact.")

#     # if word_count < 30:
#     #     weakness_opts.append("The answer was too brief — a deeper explanation with supporting details is needed.")

#     # if tech_hits == 0 and "technical" in question.lower():
#     #     weakness_opts.append("The response missed technical depth; incorporating domain-specific concepts would strengthen it significantly.")

#     # if uncertain:
#     #     weakness_opts.append("Expressing uncertainty without reasoning through it signals low confidence — attempt a structured best-guess instead.")

#     # if not weakness_opts:
#     #     weakness_opts.append("Consider exploring trade-offs and edge cases to elevate the answer to an expert level.")

#     # weakness = random.choice(weakness_opts)

#     weakness_opts = []

#     if not has_example:
#         weakness_opts.append(
#             "Include real-world examples to make the response more convincing."
#         )

#     if not has_structure:
#         weakness_opts.append(
#             "Organize the answer better using a structured approach."
#         )

#     if word_count < 40:
#         weakness_opts.append(
#             "Provide more detailed explanations to demonstrate deeper understanding."
#         )

#     if tech_hits == 0 and "technical" in question.lower():
#         weakness_opts.append(
#             "Add more technical depth and domain-specific concepts."
#         )

#     if uncertain:
#         weakness_opts.append(
#             "Avoid uncertain language and answer with more confidence."
#         )

#     if confidence < 5:
#         weakness_opts.append(
#             "Improve confidence while communicating technical ideas."
#         )

#     if communication < 5:
#         weakness_opts.append(
#             "Focus on clearer communication and concise explanations."
#         )

#     if not weakness_opts:
#         weakness_opts.append(
#             "Explore advanced trade-offs and edge cases for stronger answers."
#         )

#     weakness = " | ".join(weakness_opts[:2])

#     # ── Improvement tip ──
#     tips = [
#         "Use the STAR format (Situation, Task, Action, Result) — it keeps answers structured and memorable.",
#         "Add a real example: even a one-sentence scenario makes the response far more credible.",
#         "Quantify your impact (e.g., 'reduced latency by 40%') — numbers are persuasive in interviews.",
#         "Address trade-offs explicitly; showing awareness of limitations signals senior-level thinking.",
#         "Explain the 'why' behind your decisions, not just the 'what' — reasoning is what interviewers value most.",
#     ]

#     if not has_example:
#         tip = tips[1]
#     elif not has_structure:
#         tip = tips[0]
#     elif word_count < 40:
#         tip = tips[2]
#     else:
#         tip = tips[3]

#     # ── Ideal answer (question-keyed) ──
#     ideal = _ideal_for(question)

#     return {
#         "score": score,
#         "relevance": relevance,
#         "technical_accuracy": technical_accuracy,
#         "communication_clarity": communication,
#         "confidence": confidence,
#         "strengths": strength,
#         "weaknesses": weakness,
#         "suggested_improvement": tip,
#         "ideal_sample_answer": ideal,
#     }


# # ─────────────────────────────────────────────────────────
# # IDEAL ANSWER TEMPLATES
# # ─────────────────────────────────────────────────────────
# _IDEAL_MAP = {

#     ("stack", "queue"): (
#         "A stack follows LIFO (Last In, First Out) — like a stack of plates; used for undo/redo or call stacks. "
#         "A queue follows FIFO (First In, First Out) — like a bank line; used for job scheduling or BFS traversal."
#     ),

#     ("rest", "api"): (
#         "REST uses HTTP methods (GET, POST, PUT, DELETE) to operate on resources identified by URLs. "
#         "The server is stateless — each request carries all needed information. Responses are typically JSON. "
#         "Example: GET /users returns all users; POST /users creates a new one."
#     ),

#     ("sql", "nosql"): (
#         "SQL databases (PostgreSQL, MySQL) use structured schemas and support ACID transactions — ideal for relational data. "
#         "NoSQL (MongoDB, DynamoDB) is schema-flexible and horizontally scalable — ideal for unstructured or high-throughput data. "
#         "Choose SQL for financial systems; NoSQL for user profiles or real-time feeds."
#     ),

#     ("object-oriented", "oop"): (
#         "OOP rests on four principles: Encapsulation (hide state behind interfaces), Abstraction (expose only what's needed), "
#         "Inheritance (child classes extend parent behaviour), Polymorphism (same interface, different implementations). "
#         "Example: a Shape base class with a draw() method overridden differently by Circle and Rectangle."
#     ),

#     ("microservices",): (
#         "Microservices split an application into independently deployable services each owning its data. "
#         "Benefits: independent scaling, tech flexibility, fault isolation. "
#         "Trade-offs: network overhead, distributed tracing complexity. "
#         "I've used an API gateway routing to dedicated auth, orders, and payments services."
#     ),

#     ("solid",): (
#         "SOLID: Single Responsibility (one reason to change), Open/Closed (extend without modifying), "
#         "Liskov Substitution (subtypes replace base types safely), Interface Segregation (small, focused interfaces), "
#         "Dependency Inversion (depend on abstractions). These reduce coupling and aid maintainability."
#     ),

#     ("a/b test", "ab test"): (
#         "Define a clear hypothesis, randomly split users into control (A) and variant (B), determine sample size for 95% confidence, "
#         "measure primary metric + guardrail metrics. Avoid peeking at results before the test ends. "
#         "Multi-armed bandit is an alternative that dynamically allocates traffic to better-performing variants."
#     ),

#     ("churn",): (
#         "Define churn (e.g., 30 days inactive), engineer features (session frequency, feature adoption, support tickets), "
#         "train a gradient-boosted classifier, validate with cross-validation. "
#         "Feed high-risk users into a proactive CS outreach playbook and measure its effectiveness with a separate A/B test."
#     ),

#     ("cap theorem",): (
#         "CAP states a distributed system can guarantee at most two of: Consistency, Availability, Partition tolerance. "
#         "Since network partitions are inevitable, you choose between CP (consistent, may be unavailable — e.g., HBase) "
#         "or AP (available, eventually consistent — e.g., Cassandra). Choose based on your business requirements."
#     ),

#     ("rate limit",): (
#         "Implement a token bucket or sliding window algorithm. Store counters in Redis with TTL. "
#         "For a distributed setup, use Redis Lua scripts for atomic counter updates. "
#         "Return 429 Too Many Requests with a Retry-After header. Separate limits by API key and endpoint tier."
#     ),
# }


# def _ideal_for(question: str) -> str:

#     q = question.lower()

#     for keys, answer in _IDEAL_MAP.items():
#         if all(k in q for k in keys):
#             return answer

#     return (
#         "An ideal response: clearly state your approach, support it with a specific example from your experience, "
#         "explain the outcome or impact, and discuss any trade-offs or lessons learned. "
#         "The strongest answers demonstrate not just knowledge, but practical application in realistic scenarios."
#     )

import json
import random

# ─────────────────────────────────────────────────────────
# QUESTION BANKS — role / category / tier
# ─────────────────────────────────────────────────────────
BANKS = {
  "Software Developer": {
    "Technical": {
      "basic": [
        "What is the difference between a stack and a queue? When would you use each?",
        "Explain object-oriented programming and its four core principles.",
        "What is the difference between synchronous and asynchronous programming?",
        "What is a REST API and how does it work?",
        "What is version control and what Git commands do you use most often?",
        "What is recursion? Explain with a simple example.",
        "What is the difference between an abstract class and an interface?",
        "What is a database index and why is it important?",
        "Explain what HTTP methods (GET, POST, PUT, DELETE) are used for.",
        "What is the difference between == and === in JavaScript?",
      ],
      "intermediate": [
        "How would you design a caching system to improve application performance?",
        "Explain the SOLID principles with real examples.",
        "When would you choose SQL over NoSQL and why?",
        "How do you handle race conditions in concurrent programming?",
        "What is dependency injection and how does it improve testability?",
        "Explain microservices architecture and its trade-offs vs monolith.",
        "How would you implement pagination for a large dataset REST API?",
        "What is the difference between horizontal and vertical scaling?",
        "How do you approach debugging a production issue with minimal logs?",
        "Explain the Observer and Factory design patterns with use-cases.",
      ],
      "advanced": [
        "Design a high-availability system that handles 1 million requests per second.",
        "How would you architect a real-time notification system for a social platform?",
        "Explain CAP theorem and how you'd design around it.",
        "How would you implement a distributed transaction across microservices?",
        "Describe implementing a rate limiter for a public API at scale.",
        "How would you design a search indexing system for 100 million documents?",
        "What is eventual consistency? Give a real-world example.",
        "How would you process 10TB of user event data daily?",
        "Describe how you'd implement a circuit breaker pattern in production.",
        "How would you design a multi-tenant SaaS ensuring data isolation?",
      ],
    },

    "HR": {
      "basic": [
        "Why did you choose software development as a career?",
        "How do you stay updated with new technologies?",
        "Tell me about a project you're most proud of.",
        "How do you handle code review feedback?",
        "What kind of development environment do you prefer and why?",
      ],
      "intermediate": [
        "Describe a technical disagreement with a teammate. How did you resolve it?",
        "How do you manage multiple projects with competing deadlines?",
        "Tell me about a time you had to learn a new technology very quickly.",
        "How do you explain complex technical concepts to non-technical stakeholders?",
        "Describe a situation where you identified and fixed a critical production bug.",
      ],
      "advanced": [
        "Tell me about a time you led a team through a major technical migration.",
        "How do you mentor junior developers? Give an example of measurable impact.",
        "Describe a time you pushed back on a technical decision from leadership.",
        "How do you balance technical debt with delivering new features?",
        "Tell me about a project you led that failed and what you learned.",
      ],
    },

    "Behavioral": {
      "basic": [
        "Tell me about a challenging coding problem. How did you approach it?",
        "How do you handle tight deadlines in development?",
        "Describe a situation where you adapted quickly to changing requirements.",
        "Give an example of going above and beyond what was expected.",
        "How do you prioritize tasks when you have multiple things to work on?",
      ],
      "intermediate": [
        "Tell me about a conflict in a development team and how you resolved it.",
        "Describe a time you improved a process or workflow in your team.",
        "Tell me about working with incomplete or ambiguous requirements.",
        "How have you handled a situation where a teammate wasn't contributing?",
        "Describe how you responded to and implemented critical feedback.",
      ],
      "advanced": [
        "Tell me about the most complex technical project you've worked on.",
        "Describe a trade-off you made between code quality and delivery speed.",
        "How have you driven adoption of a new technology in your organization?",
        "Tell me about a time you influenced stakeholders without direct authority.",
        "Describe your most impactful individual contribution to a software project.",
      ],
    },
  },
}

FALLBACK = {
    "basic": [
        "Can you walk me through your background and main skills?",
        "What motivates you in your professional life?",
        "How do you approach learning new skills?",
        "What would your colleagues say are your greatest strengths?",
        "How do you handle working in a fast-paced environment?",
    ],
    "intermediate": [
        "Describe a challenging project and your approach to solving it.",
        "How do you handle competing priorities and deadlines?",
        "Tell me about a conflict with a colleague and how you resolved it.",
        "How do you stay updated on industry developments?",
        "Describe a process improvement you implemented.",
    ],
    "advanced": [
        "What is the highest-impact contribution you've made in your career?",
        "Describe how you've influenced organizational strategy or direction.",
        "Tell me about leading through significant ambiguity.",
        "How do you build trust with new stakeholders quickly?",
        "Describe the most complex challenge you've faced and how you resolved it.",
    ],
}


# ─────────────────────────────────────────────────────────
# HELPER: find the right bank
# ─────────────────────────────────────────────────────────
def _find_bank(role: str, category: str):
    role_key = next(
        (k for k in BANKS if k.lower() in role.lower() or role.lower() in k.lower()),
        None
    )
    if not role_key:
        return None, None
    cat_key = next(
        (k for k in BANKS[role_key] if k.lower() in category.lower() or category.lower() in k.lower()),
        None
    )
    if not cat_key:
        cat_key = list(BANKS[role_key].keys())[0]
    return role_key, cat_key


# ─────────────────────────────────────────────────────────
# QUESTION GENERATION
# ─────────────────────────────────────────────────────────
def generate_interview_question(
    role: str,
    category: str,
    difficulty: str,
    question_number: int,
    asked_questions: list = None,
) -> str:

    asked = set(asked_questions or [])

    if question_number <= 3:
        tier = "basic"
    elif question_number <= 7:
        tier = "intermediate"
    else:
        tier = "advanced"

    role_key, cat_key = _find_bank(role, category)

    if role_key and cat_key:
        tier_pool = BANKS[role_key][cat_key][tier][:]
        all_pool  = (
            BANKS[role_key][cat_key]["basic"]
            + BANKS[role_key][cat_key]["intermediate"]
            + BANKS[role_key][cat_key]["advanced"]
        )
    else:
        tier_pool = FALLBACK[tier][:]
        all_pool  = FALLBACK["basic"] + FALLBACK["intermediate"] + FALLBACK["advanced"]

    random.shuffle(tier_pool)
    for q in tier_pool:
        if q not in asked:
            return q

    random.shuffle(all_pool)
    for q in all_pool:
        if q not in asked:
            return q

    return (
        tier_pool[0] if tier_pool
        else f"Describe an advanced challenge you've faced as a {role}."
    )


# ─────────────────────────────────────────────────────────
# ANSWER EVALUATION
# ─────────────────────────────────────────────────────────
def evaluate_answer(question: str, answer: str) -> dict:

    words      = answer.split()
    word_count = len(words)
    a          = answer.lower()

    has_example = any(p in a for p in [
        "for example", "for instance", "such as", "like when",
        "in my experience", "i worked on", "we implemented",
        "at my previous", "in one project", "i once",
    ])
    has_structure = any(p in a for p in [
        "first", "second", "third", "firstly", "additionally",
        "furthermore", "however", "therefore", "in conclusion", "to summarize",
    ])
    tech_hits = sum(1 for kw in [
        "algorithm", "architect", "framework", "pattern", "database", "api",
        "cache", "scal", "perform", "optim", "deploy", "refactor", "abstract",
        "encapsulat", "inherit", "polymorph", "pipeline", "model", "metric",
        "cluster", "microservice",
    ] if kw in a)
    uncertain = any(p in a for p in [
        "i'm not sure", "i think maybe", "not really sure", "i don't know",
    ])

    score = 4
    if word_count >= 100: score += 3
    elif word_count >= 50: score += 2
    elif word_count >= 25: score += 1
    if has_example:   score += 1
    if has_structure: score += 1
    score = min(10, max(3, score))

    relevance         = min(10, max(2, score + (1 if has_example else 0)))
    technical_accuracy = min(10, max(2, score + (1 if tech_hits >= 3 else (-1 if tech_hits == 0 else 0))))
    communication     = min(10, max(2, score + (1 if has_structure else -1)))
    confidence        = min(10, max(2, score + (1 if word_count >= 60 else 0) - (2 if uncertain else 0)))

    # ── Strengths ──
    strength_opts = []
    if has_example:   strength_opts.append("Used practical examples effectively to support the explanation.")
    if has_structure: strength_opts.append("Presented the answer in a structured and logical manner.")
    if word_count >= 80: strength_opts.append("Demonstrated strong depth of knowledge with detailed explanation.")
    if tech_hits >= 3:   strength_opts.append("Showed solid technical expertise using relevant concepts and terminology.")
    if confidence >= 8:  strength_opts.append("Communicated ideas confidently and professionally.")
    if communication >= 8: strength_opts.append("Explained concepts clearly with excellent communication clarity.")
    if not strength_opts:
        strength_opts.append("Attempted to answer directly and stayed relevant to the question.")
    strength = " | ".join(strength_opts[:2])

    # ── Weaknesses ──
    weakness_opts = []
    if not has_example:  weakness_opts.append("Include real-world examples to make the response more convincing.")
    if not has_structure: weakness_opts.append("Organize the answer better using a structured approach.")
    if word_count < 40:  weakness_opts.append("Provide more detailed explanations to demonstrate deeper understanding.")
    if tech_hits == 0 and "technical" in question.lower():
        weakness_opts.append("Add more technical depth and domain-specific concepts.")
    if uncertain:        weakness_opts.append("Avoid uncertain language and answer with more confidence.")
    if confidence < 5:   weakness_opts.append("Improve confidence while communicating technical ideas.")
    if communication < 5: weakness_opts.append("Focus on clearer communication and concise explanations.")
    if not weakness_opts:
        weakness_opts.append("Explore advanced trade-offs and edge cases for stronger answers.")
    weakness = " | ".join(weakness_opts[:2])

    # ── Improvement tip ──
    tips = [
        "Use the STAR format (Situation, Task, Action, Result) — it keeps answers structured and memorable.",
        "Add a real example: even a one-sentence scenario makes the response far more credible.",
        "Quantify your impact (e.g., 'reduced latency by 40%') — numbers are persuasive in interviews.",
        "Address trade-offs explicitly; showing awareness of limitations signals senior-level thinking.",
        "Explain the 'why' behind your decisions, not just the 'what' — reasoning is what interviewers value most.",
    ]
    if not has_example:    tip = tips[1]
    elif not has_structure: tip = tips[0]
    elif word_count < 40:  tip = tips[2]
    else:                  tip = tips[3]

    # ── Ideal answer — question-specific ──
    ideal = _ideal_for(question)

    return {
        "score":                score,
        "relevance":            relevance,
        "technical_accuracy":   technical_accuracy,
        "communication_clarity": communication,
        "confidence":           confidence,
        "strengths":            strength,
        "weaknesses":           weakness,
        "suggested_improvement": tip,
        "ideal_sample_answer":  ideal,
    }


# ─────────────────────────────────────────────────────────
# IDEAL ANSWER LOOKUP  (question-specific, keyword-matched)
# ─────────────────────────────────────────────────────────

# Each entry: (tuple-of-keywords-ALL-must-match, ideal-answer-string)
# Keywords are lowercased substrings of the question.
_IDEAL_MAP = [

    # ── Technical / Basic ──────────────────────────────────
    (("stack", "queue"),
     "A stack is LIFO (Last In, First Out) — like a call stack during recursion or an undo history. "
     "A queue is FIFO (First In, First Out) — like a print queue or BFS graph traversal. "
     "Use a stack when you need to reverse operations; use a queue when order of arrival matters."),

    (("object-oriented", "four core"),
     "OOP has four pillars: Encapsulation (bundle data + behaviour, hide internals), "
     "Abstraction (expose only what's necessary), Inheritance (child classes reuse parent logic), "
     "Polymorphism (same interface, different implementations). "
     "Example: a Shape base class with an overridden draw() method in Circle and Rectangle."),

    (("synchronous", "asynchronous"),
     "Synchronous code executes line-by-line — each operation blocks until it finishes. "
     "Asynchronous code (callbacks, Promises, async/await) lets the program continue while waiting "
     "for I/O operations like API calls or file reads. "
     "Use async patterns whenever you have operations that don't need CPU time while waiting."),

    (("rest api", "how does it work"),
     "REST uses HTTP methods on resource URLs: GET retrieves, POST creates, PUT updates, DELETE removes. "
     "The server is stateless — every request is self-contained. Responses are usually JSON. "
     "Example: GET /users/42 returns user 42; POST /users creates a new one."),

    (("rest", "how does"),
     "REST uses HTTP methods on resource URLs: GET retrieves, POST creates, PUT updates, DELETE removes. "
     "The server is stateless — every request is self-contained. Responses are usually JSON. "
     "Example: GET /users/42 returns user 42; POST /users creates a new one."),

    (("version control", "git"),
     "Version control tracks changes to code over time, enabling collaboration and rollback. "
     "Core Git commands: git clone (copy repo), git add/commit (snapshot changes), "
     "git push/pull (sync with remote), git branch/merge (parallel development), "
     "git log (history), git rebase (clean history). I use branching strategies like Git Flow for team projects."),

    (("recursion",),
     "Recursion is a function calling itself with a simpler sub-problem until it reaches a base case. "
     "Example: factorial(n) = n * factorial(n-1), base case factorial(0) = 1. "
     "Key: always define a base case to prevent infinite recursion. "
     "Use recursion for tree traversal, divide-and-conquer algorithms, and parsing nested structures."),

    (("abstract class", "interface"),
     "An abstract class can have both implemented and abstract methods; it represents an 'is-a' relationship "
     "and supports constructors and state. An interface defines a contract of behaviour with no implementation "
     "(in most languages). Use abstract classes for shared code across related types; "
     "use interfaces when unrelated classes need to share a behaviour contract."),

    (("database index",),
     "An index is a data structure (usually a B-tree) that speeds up query lookups at the cost of extra storage "
     "and slower writes. Without an index, a full table scan is required (O(n)); with one, lookups are O(log n). "
     "Create indexes on columns used in WHERE, JOIN, and ORDER BY clauses. "
     "Avoid over-indexing — each index slows INSERT/UPDATE operations."),

    (("http methods", "get, post, put, delete"),
     "GET — retrieve a resource (idempotent, no body). "
     "POST — create a new resource (not idempotent, has body). "
     "PUT — replace an existing resource entirely (idempotent). "
     "PATCH — partially update a resource. "
     "DELETE — remove a resource (idempotent). "
     "Always use the semantically correct method for predictable, cache-friendly APIs."),

    (("== and ===",),
     "== is abstract equality — it coerces types before comparing (e.g., '5' == 5 is true). "
     "=== is strict equality — it checks value AND type (e.g., '5' === 5 is false). "
     "Always prefer === to avoid subtle bugs from type coercion. "
     "The only common exception is null == undefined when you want to catch both cases at once."),

    # ── Technical / Intermediate ───────────────────────────
    (("caching system",),
     "Design: identify hot data (high read, low write frequency), choose a cache layer (Redis for distributed, "
     "in-memory LRU for single server), define a TTL per data type, and implement a cache-aside pattern "
     "(check cache → miss → load DB → write cache). Handle invalidation explicitly: on write, either "
     "delete the cache key or update it. Monitor hit rate — aim for >90% on read-heavy routes."),

    (("solid principles",),
     "SOLID: Single Responsibility (each class has one reason to change), Open/Closed (extend without modifying), "
     "Liskov Substitution (subtypes must be safely replaceable for their base type), "
     "Interface Segregation (many small interfaces beat one fat one), "
     "Dependency Inversion (depend on abstractions, not concretions). "
     "Example: using a Repository interface instead of directly calling a DB class satisfies D and O."),

    (("sql", "nosql"),
     "Choose SQL (PostgreSQL, MySQL) when you need ACID transactions, complex joins, and a well-defined schema — "
     "financial systems, ERP, booking engines. Choose NoSQL (MongoDB, DynamoDB, Cassandra) when you need "
     "schema flexibility, horizontal scaling, or high write throughput — user profiles, event logs, real-time feeds. "
     "Hybrid architectures are common: SQL for transactional data, Redis for caching, Elasticsearch for search."),

    (("race condition",),
     "Race conditions occur when shared state is accessed concurrently without synchronisation. "
     "Solutions: use locks/mutexes for critical sections, atomic operations (compare-and-swap), "
     "optimistic locking in databases (version columns), or message queues to serialise updates. "
     "In Python use threading.Lock; in Java use synchronized or java.util.concurrent.atomic classes. "
     "Design stateless services where possible to eliminate shared state entirely."),

    (("dependency injection",),
     "DI is the practice of passing dependencies into a class rather than creating them internally. "
     "Benefits: easier unit testing (inject mocks), looser coupling, swappable implementations. "
     "Example: instead of UserService creating a new DatabaseRepository(), receive it via constructor. "
     "DI containers (Spring, .NET DI) automate wiring. Pair with Dependency Inversion principle."),

    (("microservices", "monolith"),
     "Microservices decompose an app into independently deployable services, each owning its data. "
     "Pros: independent scaling, fault isolation, tech freedom per service. "
     "Cons: network latency, distributed tracing complexity, harder transactions. "
     "Start with a monolith; extract microservices when a bounded context has clear scaling or team-ownership needs. "
     "Use an API gateway, service mesh (Istio), and centralised logging (ELK) in production."),

    (("pagination",),
     "Two main strategies: offset pagination (LIMIT/OFFSET) is simple but slow on large offsets due to full scans; "
     "cursor-based pagination (WHERE id > last_seen_id LIMIT n) is O(log n) via index and handles inserts correctly. "
     "Return a next_cursor in the response. For public APIs, cap page size (e.g., max 100) and add rate limiting."),

    (("horizontal", "vertical scaling"),
     "Vertical scaling (scale up) adds more CPU/RAM to a single server — simple but has a hard ceiling. "
     "Horizontal scaling (scale out) adds more servers behind a load balancer — theoretically unlimited but requires "
     "stateless application design (no local session state), shared storage, and distributed caching. "
     "Most cloud-native architectures prefer horizontal scaling for resilience and cost flexibility."),

    (("debugging", "production"),
     "Start with metrics (CPU, memory, latency, error rate) to narrow the time window. "
     "Check recent deployments — most production issues are regression-related. "
     "Use structured logs with correlation IDs to trace a single request. "
     "Add temporary verbose logging, reproduce in staging, and use feature flags to isolate changes. "
     "Write a post-mortem with a root cause and preventative action items."),

    (("observer", "factory"),
     "Observer: defines a one-to-many dependency so dependents (observers) are notified when the subject changes. "
     "Use case: event systems, UI state management (React uses this pattern). "
     "Factory: encapsulates object creation logic, decoupling the caller from concrete types. "
     "Use case: creating different payment processor objects based on config without if/else chains. "
     "Both reduce coupling and improve extensibility."),

    # ── Technical / Advanced ───────────────────────────────
    (("1 million requests",),
     "Key components: global CDN (static assets), load balancers (L4 + L7), horizontally-scaled stateless app servers, "
     "distributed cache (Redis Cluster) for hot data, read replicas for DB, async processing via message queues (Kafka). "
     "Design for auto-scaling with health checks. Use circuit breakers to prevent cascade failures. "
     "Target p99 latency SLOs, monitor with Prometheus/Grafana, and load-test with tools like k6 before launch."),

    (("real-time notification",),
     "Use WebSockets or Server-Sent Events for push delivery. "
     "Pub/Sub backend (Redis Pub/Sub or Kafka topics per user): when an event occurs, publish to the user's topic; "
     "the connected WebSocket server pushes it to the client. "
     "For offline users, store notifications in a DB and deliver on reconnect. "
     "Fan-out at write time for small follower counts; fan-out at read time for celebrities with millions of followers."),

    (("cap theorem",),
     "CAP: a distributed system can guarantee at most two of Consistency, Availability, and Partition tolerance. "
     "Since network partitions are unavoidable, you trade between CP (consistent, may become unavailable — HBase, Zookeeper) "
     "and AP (always available, eventually consistent — Cassandra, DynamoDB). "
     "Choose based on business rules: financial systems need CP; social feeds tolerate AP."),

    (("distributed transaction",),
     "Use the Saga pattern: each service performs a local transaction and publishes an event; "
     "compensating transactions handle rollbacks on failure. "
     "Two-phase commit (2PC) is an alternative but creates blocking and single points of failure. "
     "Outbox pattern ensures reliable event publishing alongside DB writes. "
     "Design for idempotency so retries are safe."),

    (("rate limit",),
     "Implement a token bucket or sliding window counter. Store counts in Redis with TTL for distributed enforcement. "
     "Use Lua scripts for atomic increment-and-check. Apply limits per API key, IP, and endpoint tier. "
     "Return 429 Too Many Requests with a Retry-After header. "
     "Add a rate limit dashboard and alert when clients approach their quota."),

    (("search indexing", "100 million"),
     "Use an inverted index (like Elasticsearch/Lucene): tokenise documents, map each token to posting lists of doc IDs. "
     "Shard the index across nodes for parallelism. Use an async ingestion pipeline (Kafka → indexer workers). "
     "Support fuzzy search with BM25 ranking. Cache popular queries. "
     "Re-index incrementally on updates; use aliases for zero-downtime re-indexing."),

    (("eventual consistency",),
     "Eventual consistency means replicas will converge to the same value given no new updates — there is no guarantee "
     "of immediate consistency. Real-world example: DNS propagation, shopping cart in Amazon (AP system). "
     "Handle it with: last-write-wins (timestamp), vector clocks, or CRDTs for conflict-free merging. "
     "Communicate clearly to users when data may be stale (e.g., 'refreshing…' spinners)."),

    (("10tb", "event data"),
     "Use a batch + stream hybrid (Lambda/Kappa architecture). Ingest via Kafka, process with Spark or Flink, "
     "store raw events in S3 (data lake) with Parquet format for columnar queries. "
     "Use partitioning by date and event type. Run aggregations with Spark jobs; query with Athena or BigQuery. "
     "Implement data quality checks at ingestion and monitor pipeline lag."),

    (("circuit breaker",),
     "A circuit breaker wraps external calls and tracks failure rates. "
     "States: Closed (normal) → Open (failures exceed threshold, fast-fail) → Half-Open (probe one request). "
     "Libraries: Resilience4j (Java), Polly (.NET), pybreaker (Python). "
     "Configure failure threshold (e.g., 50% in 10s) and timeout. "
     "Combine with bulkhead pattern to isolate failure domains and prevent thread pool exhaustion."),

    (("multi-tenant", "data isolation"),
     "Three approaches: separate databases per tenant (strongest isolation, expensive), "
     "shared DB with schema per tenant (medium isolation), or shared schema with tenant_id column (cheapest). "
     "Use row-level security (PostgreSQL RLS) to enforce tenant_id at the DB layer automatically. "
     "Encrypt tenant data with tenant-specific keys. Audit all cross-tenant data access."),

    # ── HR questions ───────────────────────────────────────
    (("why did you choose software",),
     "A strong answer combines intrinsic motivation with a concrete origin story. "
     "Example: 'I built my first website at 15 to solve a real problem for my school club — seeing it work for real users "
     "was addictive. I pursued CS because I wanted to create things that scale beyond one person.' "
     "Tie your passion to impact, continuous learning, and the role you're applying for."),

    (("stay updated", "new technolog"),
     "Mention specific, credible sources: official documentation, release notes, GitHub trending, "
     "newsletters (TLDR, Bytes), podcasts (Syntax, Software Engineering Daily), and conferences (Google I/O, AWS re:Invent). "
     "Describe a learning habit: 'I spend 30 minutes daily reading, and I build a small side project for each major "
     "technology I want to evaluate — I learn best by doing.'"),

    (("project you're most proud",),
     "Use STAR format. Describe the problem it solved, the technical challenge you overcame, your personal contribution, "
     "and the measurable outcome (users, performance, revenue, cost saved). "
     "End with what you'd do differently — it shows growth mindset. "
     "Pick a project that aligns with the target role's tech stack."),

    (("code review feedback",),
     "Describe treating code review as a learning opportunity, not a personal critique. "
     "Example: 'I read every comment carefully, ask clarifying questions when I disagree rather than defending immediately, "
     "and always explain my reasoning when I push back with data.' "
     "Mention that you also give constructive reviews to others — praise publicly, suggest privately."),

    (("development environment",),
     "Cover your IDE (VS Code / JetBrains with extensions), terminal setup (oh-my-zsh, tmux), "
     "containerised local dev (Docker Compose for services), linting/formatting (ESLint, Prettier, pre-commit hooks), "
     "and why each tool increases your productivity. "
     "Mention any remote/cloud dev setups if relevant (GitHub Codespaces, DevContainer)."),

    (("technical disagreement", "teammate"),
     "Use STAR. Focus on: listening first to understand their reasoning, presenting your case with data or a proof-of-concept, "
     "and proposing a time-boxed experiment if still deadlocked. "
     "Key: show you can disagree professionally and commit to the team decision once made. "
     "Avoid framing the colleague as wrong — frame it as two valid approaches with different trade-offs."),

    (("multiple projects", "competing deadlines"),
     "Describe your prioritisation framework: impact vs effort matrix, stakeholder communication on trade-offs, "
     "and breaking work into shippable increments. "
     "Example: 'I use a Kanban board, flag blockers early, and negotiate deadlines proactively — I'd rather tell a PM "
     "about a delay 3 days early than the night before.' Mention tools like Jira/Linear."),

    (("learn a new technology very quickly",),
     "Structure the answer: what forced the rapid learning, your learning strategy (official docs + build something small), "
     "how long it took, what you shipped, and the outcome. "
     "Interviewers want to see that you have a repeatable, effective self-learning process under pressure."),

    (("explain complex technical", "non-technical"),
     "Use the 'no jargon + analogy + impact' formula. Example: explaining an API — 'It's like a waiter: "
     "you give the waiter your order (request), the kitchen prepares it (server), and the waiter brings your food (response).' "
     "Always lead with the business outcome, not the implementation. "
     "Validate understanding by asking a question back."),

    (("critical production bug",),
     "STAR format. Cover: how you detected it (monitoring alert vs user report), your investigation process (logs, metrics), "
     "the fix (hotfix vs rollback), how you communicated to stakeholders during the incident, "
     "and the post-mortem action items to prevent recurrence. "
     "Quantify the impact: 'affected 2,000 users for 45 minutes; we added an automated regression test.'"),

    # ── Behavioral questions ───────────────────────────────
    (("challenging coding problem",),
     "Use STAR. Describe: the specific problem (be technical), your initial wrong approach, "
     "how you pivoted (researched, rubber-ducked, asked for help), and the final solution. "
     "Emphasise your problem-solving process — interviewers value how you think, not just that you solved it. "
     "End with what you learned and how it changed your approach."),

    (("tight deadlines",),
     "Show you can triage scope, not just work harder. 'I identify the must-have vs nice-to-have features, "
     "communicate the trade-off to the PM, cut scope before cutting quality, and focus on shipping a working core. "
     "I've never missed a deadline by not communicating — I raise blockers early.' "
     "Mention a concrete example with outcome."),

    (("adapted quickly to changing requirements",),
     "Use STAR. Key points: you validated the change with the requester to confirm scope, updated estimates transparently, "
     "refactored the affected parts without a big rewrite (modular design helps), and shipped on the revised timeline. "
     "Show that good architecture (loose coupling) makes you resilient to change."),

    (("above and beyond",),
     "Pick an example where you voluntarily solved an adjacent problem or helped a teammate, not just worked extra hours. "
     "Example: 'I noticed our deploy process had no rollback procedure. I wasn't asked, but I wrote a runbook and "
     "automated a one-command rollback — it saved us 2 hours the first time we needed it.' Quantify the impact."),

    (("prioritize tasks",),
     "Describe a framework: urgency-impact matrix, MoSCoW method, or simply 'what blocks others goes first.' "
     "Mention tools you use (Notion, Jira, sticky notes). "
     "Key point: 'I time-box deep work, batch interruptions, and protect at least one 2-hour focus block daily.' "
     "Show you have a system, not just instinct."),

    (("conflict in a development team",),
     "STAR with emphasis on listening, seeking to understand the other person's constraints, "
     "finding a solution that serves the team goal (not ego), and following up after resolution. "
     "Avoid making the other person the villain. Interviewers reward self-awareness and maturity."),

    (("improved a process or workflow",),
     "Quantify: before and after metrics. Example: 'Our PR review cycle averaged 3 days. I introduced a checklist "
     "template and a 24-hour SLA convention — we got to 18 hours average within a month.' "
     "Show you identified the bottleneck, proposed the change, got buy-in, measured the result."),

    (("incomplete or ambiguous requirements",),
     "Show a structured approach: list your assumptions explicitly, ask the 3 most critical clarifying questions "
     "(not 20), build the smallest verifiable increment, and demo early to validate direction. "
     "'I'd rather build the wrong thing for 2 days and correct it than build it for 2 weeks.' "
     "Prototyping and fast feedback loops are key."),

    (("teammate wasn't contributing",),
     "Show empathy first — check if something is wrong before assuming disengagement. "
     "Then: have a private, direct conversation focused on impact not blame. "
     "If it continues, involve a team lead. Never let it fester or complain to others first. "
     "Frame the example around how you handled it professionally and the outcome."),

    (("responded to", "critical feedback",),
     "Show a three-part response: thank them, ask for specifics, and act on it visibly. "
     "Example: 'My manager told my code was hard to read. I asked for a specific example, studied clean code "
     "principles, and applied them to my next PR. My next review mentioned improved readability.' "
     "Interviewers love candidates who close the feedback loop."),
]


def _ideal_for(question: str) -> str:
    """Return a specific ideal answer for the question using keyword matching."""
    q = question.lower()

    for keywords, answer in _IDEAL_MAP:
        if all(kw in q for kw in keywords):
            return answer

    # ── Smart dynamic fallback (never static) ──────────────
    # Build a tailored hint based on detectable question type

    is_behavioral = any(p in q for p in [
        "tell me about", "describe a time", "give an example",
        "how did you", "describe how you", "describe a situation",
    ])
    is_design = any(p in q for p in [
        "design", "architect", "system", "scale", "build",
    ])
    is_explain = any(p in q for p in [
        "what is", "explain", "what are", "what does", "how does", "difference between",
    ])
    is_hr = any(p in q for p in [
        "why did you", "how do you handle", "what kind", "what motivates",
        "where do you see", "what are your",
    ])

    if is_behavioral:
        return (
            "Use the STAR method: describe the Situation briefly, the specific Task or challenge you faced, "
            "the Action you personally took (use 'I', not 'we'), and the measurable Result or outcome. "
            "Quantify impact where possible. End with what you learned from the experience."
        )
    if is_design:
        return (
            "Structure your answer as: clarify requirements and constraints → define components and their responsibilities "
            "→ describe data flow → discuss scalability and failure handling → identify trade-offs. "
            "Use concrete numbers (e.g., '10K requests/sec') and name specific technologies you'd choose and why."
        )
    if is_explain:
        return (
            "A strong explanation covers: a clear one-sentence definition, the core mechanism or principle behind it, "
            "a concrete real-world example, and when to use it vs an alternative. "
            "Avoid jargon without definition. Show you understand not just 'what' but 'why' and 'when'."
        )
    if is_hr:
        return (
            "Be specific and authentic. Back every claim with a concrete example from your experience. "
            "Connect your answer to the role you're applying for and the value you'd bring to the team. "
            "Avoid clichés like 'I'm a perfectionist' — interviewers want evidence, not adjectives."
        )

    # absolute last resort — still more specific than a generic template
    return (
        "A strong answer for this question should: state your position clearly in the first sentence, "
        "support it with a specific example from your real experience, "
        "explain the outcome or trade-off, and connect it back to the context of this role. "
        "Concrete details and numbers always outperform vague generalities."
    )