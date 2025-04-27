const questions = [
    {
        question: "What is the time complexity of the V8 engine's array sort implementation?",
        options: [
            "O(n log n) always",
            "O(n²) always",
            "O(n log n) for arrays > 10 elements, O(n²) for smaller arrays",
            "O(1) using parallel processing"
        ],
        correct: 2,
        language: "JavaScript"
    },
    {
        question: "In Python, what's the output of: list(map(lambda x: x*2, filter(lambda x: x%2==0, range(5))))?",
        options: [
            "[0, 4, 8]",
            "[0, 2, 4]",
            "[2, 4, 6]",
            "[0, 2, 4, 6, 8]"
        ],
        correct: 0,
        language: "Python"
    },
    {
        question: "What happens when virtual inheritance is used in C++?",
        options: [
            "Multiple copies of base class are created",
            "Only one copy of base class is shared",
            "Compilation error occurs",
            "Runtime error occurs"
        ],
        correct: 1,
        language: "C++"
    },
    {
        question: "Which MySQL join type will return all records from both tables, regardless of matches?",
        options: [
            "INNER JOIN",
            "LEFT JOIN",
            "FULL OUTER JOIN",
            "CROSS JOIN"
        ],
        correct: 2,
        language: "MySQL"
    },
    {
        question: "What's the output of: console.log(typeof NaN === typeof Number(undefined))?",
        options: [
            "false",
            "true",
            "undefined",
            "TypeError"
        ],
        correct: 1,
        language: "JavaScript"
    },
    {
        question: "In Python, what's the difference between __new__ and __init__?",
        options: [
            "No difference, they're aliases",
            "__new__ creates instance, __init__ initializes it",
            "__init__ creates instance, __new__ initializes it",
            "__new__ is deprecated, __init__ is the modern way"
        ],
        correct: 1,
        language: "Python"
    },
    {
        question: "What's the most efficient way to implement a memory pool in C++?",
        options: [
            "Using new/delete operators",
            "Using smart pointers",
            "Using placement new with preallocated memory",
            "Using std::allocator"
        ],
        correct: 2,
        language: "C++"
    },
    {
        question: "Which MySQL isolation level allows phantom reads but prevents dirty reads?",
        options: [
            "READ UNCOMMITTED",
            "READ COMMITTED",
            "REPEATABLE READ",
            "SERIALIZABLE"
        ],
        correct: 1,
        language: "MySQL"
    },
    {
        question: "What's the output of: console.log([] + {})?",
        options: [
            "[]{}",
            "[object Object]",
            "TypeError",
            "undefined"
        ],
        correct: 1,
        language: "JavaScript"
    },
    {
        question: "In Python, what's the memory impact of using generators vs lists?",
        options: [
            "Generators use more memory",
            "Lists use more memory",
            "They use the same amount",
            "Depends on Python version"
        ],
        correct: 1,
        language: "Python"
    },
    {
        question: "What's the difference between std::move and std::forward in C++?",
        options: [
            "They are the same",
            "std::move always casts to rvalue, std::forward preserves value category",
            "std::forward always casts to rvalue, std::move preserves value category",
            "std::move is for classes, std::forward for primitives"
        ],
        correct: 1,
        language: "C++"
    },
    {
        question: "Which MySQL feature allows you to execute the same query on multiple shards simultaneously?",
        options: [
            "Partitioning",
            "Replication",
            "Spider Storage Engine",
            "Federation"
        ],
        correct: 2,
        language: "MySQL"
    },
    {
        question: "What's the output of: console.log(1 < 2 < 3) vs console.log(3 > 2 > 1)?",
        options: [
            "true, true",
            "true, false",
            "false, true",
            "false, false"
        ],
        correct: 1,
        language: "JavaScript"
    },
    {
        question: "In Python, what's the time complexity of a.extend(b) where a and b are lists?",
        options: [
            "O(1)",
            "O(len(b))",
            "O(len(a))",
            "O(len(a) + len(b))"
        ],
        correct: 1,
        language: "Python"
    },
    {
        question: "What's the size of an empty class in C++?",
        options: [
            "0 bytes",
            "1 byte",
            "4 bytes",
            "8 bytes"
        ],
        correct: 1,
        language: "C++"
    },
    {
        question: "Which MySQL feature provides the fastest full-text search capability?",
        options: [
            "LIKE with wildcards",
            "REGEXP",
            "MATCH AGAINST",
            "FULLTEXT index"
        ],
        correct: 3,
        language: "MySQL"
    },
    {
        question: "What's the output of: console.log(0.1 + 0.2 === 0.3)?",
        options: [
            "true",
            "false",
            "undefined",
            "NaN"
        ],
        correct: 1,
        language: "JavaScript"
    },
    {
        question: "In Python, what happens when you modify a list while iterating over it?",
        options: [
            "Nothing unusual",
            "RuntimeError",
            "Unpredictable results",
            "SyntaxError"
        ],
        correct: 2,
        language: "Python"
    },
    {
        question: "What's the difference between constexpr and const in C++?",
        options: [
            "No difference",
            "constexpr is evaluated at compile-time, const at runtime",
            "const is evaluated at compile-time, constexpr at runtime",
            "constexpr is for functions, const for variables"
        ],
        correct: 2,
        language: "C++"
    },
    {
        question: "Which MySQL statement is most efficient for inserting multiple rows?",
        options: [
            "Multiple INSERT statements",
            "INSERT ... SELECT",
            "INSERT ... VALUES with multiple value lists",
            "LOAD DATA INFILE"
        ],
        correct: 3,
        language: "MySQL"
    },
    {
        question: "What's the output of: typeof typeof undefined?",
        options: [
            "undefined",
            "string",
            "object",
            "function"
        ],
        correct: 1,
        language: "JavaScript"
    },
    {
        question: "In Python, what's the difference between deepcopy and copy?",
        options: [
            "No difference",
            "deepcopy copies nested objects, copy doesn't",
            "copy copies nested objects, deepcopy doesn't",
            "deepcopy is faster than copy"
        ],
        correct: 1,
        language: "Python"
    },
    {
        question: "What's the purpose of std::launder in C++17?",
        options: [
            "Memory cleanup",
            "Thread synchronization",
            "Handling object lifetime in placement new",
            "Exception handling"
        ],
        correct: 2,
        language: "C++"
    },
    {
        question: "Which MySQL engine provides ACID compliance?",
        options: [
            "MyISAM",
            "MEMORY",
            "InnoDB",
            "ARCHIVE"
        ],
        correct: 2,
        language: "MySQL"
    },
    {
        question: "What's the output of: console.log([] == ![])?",
        options: [
            "true",
            "false",
            "undefined",
            "TypeError"
        ],
        correct: 0,
        language: "JavaScript"
    }
];
