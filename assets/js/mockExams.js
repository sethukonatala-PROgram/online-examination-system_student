/**
 * ExamPulse - Mock Exams Catalog for 2nd Year B.Tech CSE
 * Authentic, syllabus-aligned Computer Science MCQs with code blocks & explanations.
 */

export const DEFAULT_EXAMS = [
  {
    id: "EXAM-DSA-201",
    code: "CS201",
    title: "Data Structures & Algorithms - Mid-Term Assessment",
    department: "Computer Science & Engineering",
    semester: "Semester 3 / 4",
    durationMinutes: 15,
    totalMarks: 20,
    passingMarks: 10,
    negativeMarking: true,
    negativeValue: 0.25,
    description: "Evaluates core proficiency in asymptotic analysis, balanced binary trees, graph traversals, and dynamic programming.",
    questions: [
      {
        id: 1,
        text: "What is the worst-case time complexity of searching for an element in an unbalanced Binary Search Tree (BST)?",
        codeSnippet: null,
        options: [
          "O(1)",
          "O(log N)",
          "O(N)",
          "O(N log N)"
        ],
        correctIndex: 2,
        explanation: "When a BST degrades into a degenerate/skewed tree (e.g. inserting elements in strictly sorted order), searching requires traversing all N nodes, giving O(N) worst-case."
      },
      {
        id: 2,
        text: "Consider the following recursive Fibonacci function. What is its time complexity without memoization?",
        codeSnippet: `int fib(int n) {
    if (n <= 1) return n;
    return fib(n - 1) + fib(n - 2);
}`,
        options: [
          "O(N)",
          "O(N^2)",
          "O(2^N)",
          "O(log N)"
        ],
        correctIndex: 2,
        explanation: "Each call branches into two recursive calls, creating a recursive call tree of depth N, resulting in exponential time complexity O(2^N)."
      },
      {
        id: 3,
        text: "Which of the following sorting algorithms is GUARANTEED to be stable and have O(N log N) worst-case running time?",
        codeSnippet: null,
        options: [
          "QuickSort",
          "HeapSort",
          "MergeSort",
          "SelectionSort"
        ],
        correctIndex: 2,
        explanation: "MergeSort consistently runs in O(N log N) time in all cases (worst, best, average) and maintains relative ordering of identical elements, making it stable."
      },
      {
        id: 4,
        text: "In Dijkstra's Single Source Shortest Path algorithm implemented with a Min-Heap / Priority Queue, what is the overall time complexity for a graph with V vertices and E edges?",
        codeSnippet: null,
        options: [
          "O(V + E)",
          "O((V + E) log V)",
          "O(V^2)",
          "O(E^2)"
        ],
        correctIndex: 1,
        explanation: "Extracting min V times takes O(V log V) and edge relaxation updates the heap E times taking O(E log V), totaling O((V + E) log V)."
      },
      {
        id: 5,
        text: "What data structure is fundamentally used for performing a Breadth-First Search (BFS) on a graph?",
        codeSnippet: null,
        options: [
          "Stack (LIFO)",
          "Queue (FIFO)",
          "Priority Queue",
          "Disjoint Set Union (DSU)"
        ],
        correctIndex: 1,
        explanation: "BFS explores nodes level by level in the order they are discovered, which requires a First-In-First-Out Queue."
      }
    ]
  },
  {
    id: "EXAM-DBMS-202",
    code: "CS202",
    title: "Database Management Systems (DBMS) Certification",
    department: "Computer Science & Engineering",
    semester: "Semester 4",
    durationMinutes: 10,
    totalMarks: 20,
    passingMarks: 10,
    negativeMarking: false,
    negativeValue: 0.0,
    description: "Covers relational algebra, normal forms (1NF through BCNF), indexing structures (B+ trees), and ACID transaction properties.",
    questions: [
      {
        id: 1,
        text: "Which normal form requires that a relation is in 2NF and has NO transitive functional dependencies between non-prime attributes?",
        codeSnippet: null,
        options: [
          "First Normal Form (1NF)",
          "Second Normal Form (2NF)",
          "Third Normal Form (3NF)",
          "Boyce-Codd Normal Form (BCNF)"
        ],
        correctIndex: 2,
        explanation: "3NF explicitly eliminates transitive dependencies: for every non-trivial functional dependency X -> A, either X is a superkey or A is a prime attribute."
      },
      {
        id: 2,
        text: "Which of the ACID properties guarantees that a transaction's updates become permanent even in the event of an immediate system crash or power outage?",
        codeSnippet: null,
        options: [
          "Atomicity",
          "Consistency",
          "Isolation",
          "Durability"
        ],
        correctIndex: 3,
        explanation: "Durability guarantees that once a transaction commits, its effects survive system crashes, typically via write-ahead logging (WAL)."
      },
      {
        id: 3,
        text: "Why are B+ Trees predominantly preferred over standard Binary Search Trees for disk-based database indexes?",
        codeSnippet: null,
        options: [
          "B+ Trees use less memory than BSTs",
          "B+ Trees have high fan-out, minimizing the number of expensive disk I/O operations",
          "B+ Trees are strictly binary trees",
          "B+ Trees don't require rebalancing"
        ],
        correctIndex: 1,
        explanation: "High branching factor (fan-out) means B+ trees have very low height (e.g. 3-4 levels for millions of records), drastically minimizing disk block reads."
      },
      {
        id: 4,
        text: "Consider the following SQL query. What will be returned if no employees match the department id 50?",
        codeSnippet: `SELECT COUNT(*), AVG(salary) 
FROM employees 
WHERE department_id = 50;`,
        options: [
          "An empty result set (0 rows)",
          "COUNT is 0 and AVG is NULL",
          "COUNT is NULL and AVG is 0",
          "A SQL execution runtime error"
        ],
        correctIndex: 1,
        explanation: "Aggregate queries without GROUP BY always return exactly one row: COUNT(*) returns 0, while AVG(salary) returns NULL when applied to 0 rows."
      }
    ]
  },
  {
    id: "EXAM-OS-203",
    code: "CS203",
    title: "Operating Systems & Concurrency Fundamentals",
    department: "Computer Science & Engineering",
    semester: "Semester 4",
    durationMinutes: 12,
    totalMarks: 20,
    passingMarks: 10,
    negativeMarking: true,
    negativeValue: 0.25,
    description: "Evaluates process synchronization, CPU scheduling algorithms, virtual memory paging, and deadlock avoidance.",
    questions: [
      {
        id: 1,
        text: "Which of the following is NOT one of Coffman's four mandatory conditions required for a deadlock to occur?",
        codeSnippet: null,
        options: [
          "Mutual Exclusion",
          "Hold and Wait",
          "Preemption Allowed",
          "Circular Wait"
        ],
        correctIndex: 2,
        explanation: "The condition is NO preemption (resources cannot be forcibly taken away). If preemption is allowed, deadlocks cannot persist."
      },
      {
        id: 2,
        text: "What phenomenon occurs when a CPU scheduling algorithm suffers from high turnaround times because short processes are queued behind a long CPU-burst process?",
        codeSnippet: null,
        options: [
          "Belady's Anomaly",
          "Convoy Effect",
          "Thrashing",
          "Priority Inversion"
        ],
        correctIndex: 1,
        explanation: "The Convoy Effect occurs particularly in First-Come, First-Served (FCFS) scheduling when I/O-bound jobs wait behind a single CPU-heavy process."
      },
      {
        id: 3,
        text: "What is 'Thrashing' in virtual memory systems?",
        codeSnippet: null,
        options: [
          "When the OS spends significantly more time swapping pages in and out than executing instructions",
          "When two threads access the same memory location simultaneously",
          "When disk sectors become physically corrupted",
          "When the CPU frequency overheats"
        ],
        correctIndex: 0,
        explanation: "Thrashing occurs when the sum of working sets of active processes exceeds physical RAM, causing constant page faults and near-zero CPU throughput."
      }
    ]
  }
];
