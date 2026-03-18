# Quick Flowchart Structure Guide
## AI Research Assistant - StudyMate

---

## Core Components Structure

```
┌─────────────────────────────────────────┐
│         FLOWCHART BUILDING BLOCKS        │
└─────────────────────────────────────────┘

1. START/END
   ([Label])

2. PROCESS
   [Action/Operation]

3. DECISION
   {Question?}

4. DATA/DATABASE
   [(Database Operation)]

5. ARROW FLOW
   --> (flow direction)

6. CONDITIONS
   -->|Yes| or -->|No|
```

---

## 7-Step Flowchart Template

```mermaid
flowchart TD
    A([Start]) --> B[Step 1: Receive Input]
    B --> C{Decision Point?}
    C -->|Yes| D[Step 2: Process Path A]
    C -->|No| E[Step 2: Process Path B]
    D --> F[(Database Operation)]
    E --> F
    F --> G[Step 3: Return Result]
    G --> H([End])
```

---

## Quick Reference for Your Code

### Request Lifecycle (3-Step)
```
[Request Received]
    ↓
[Auth Check + Process]
    ↓
[Return Response]
```

### Database Operation (4-Step)
```
[Find/Create Document]
    ↓
[Validate Data]
    ↓
[Save to DB]
    ↓
[Return Result]
```

### Error Handling (2-Step)
```
[Error Occurs?]
    ↓
[Yes: Return Error Code | No: Continue]
```

---

## Minimal Flowchart Examples

### 1. Simple API Endpoint
```mermaid
flowchart TD
    A([GET /api/notes]) --> B{Auth Valid?}
    B -->|No| C["401<br/>Unauthorized"]
    B -->|Yes| D["Query MongoDB"]
    D --> E["Return Notes"]
    C --> F([End])
    E --> F
```

### 2. Create Operation
```mermaid
flowchart TD
    A([POST Request]) --> B["Validate Input"]
    B --> C{Valid?}
    C -->|No| D["400 Error"]
    C -->|Yes| E["Save to DB"]
    E --> F["Return Created"]
    D --> G([End])
    F --> G
```

### 3. Authentication
```mermaid
flowchart TD
    A([Login]) --> B["Hash Password"]
    B --> C["Compare Hashes"]
    C --> D{Match?}
    D -->|Yes| E["Generate JWT"]
    D -->|No| F["401 Error"]
    E --> G([Success])
    F --> G
```

### 4. Error Handling
```mermaid
flowchart TD
    A["Try Operation"] --> B{Error?}
    B -->|Yes| C{Error Type?}
    B -->|No| D["Return 200"]
    C -->|Auth| E["Return 401"]
    C -->|Validation| F["Return 400"]
    C -->|Server| G["Return 500"]
    D --> H([End])
    E --> H
    F --> H
    G --> H
```

---

## Symbols Quick Guide

| Symbol | Meaning | Used For |
|--------|---------|----------|
| `()` | Oval | Start/End |
| `[]` | Rectangle | Process/Action |
| `{}` | Diamond | Decision/Condition |
| `[()]` | Cylinder | Database/Storage |
| `-->` | Arrow | Flow Direction |
| `\|label\|` | Condition | Yes/No paths |

---

## For Your Code Sections

### Backend Routes Pattern
```
Request → Auth Middleware → Route Handler → Business Logic → DB Query → Response
```

### Frontend to Backend Pattern
```
User Action → State Update → API Call → Auth Header → Backend Processing → State Update → UI Render
```

### OpenAI Integration Pattern
```
User Message → Format Prompt → Call OpenAI API → Parse Response → Save to DB → Return to Frontend
```

---

## Mermaid Syntax Cheat Sheet

```mermaid
flowchart TD
    %% Start/End
    A([Start]) --> B([End])
    
    %% Process
    B --> C["Process/Action"]
    
    %% Decision
    C --> D{Condition?}
    
    %% Database
    D --> E[(Database)]
    
    %% Conditional Flow
    D -->|Yes| F["Yes Path"]
    D -->|No| G["No Path"]
    
    %% Styling
    style A fill:#90EE90
    style B fill:#FFB6C6
    style D fill:#87CEEB
    style E fill:#FFD700
```

---

## Step-by-Step: Create a Flowchart

### Step 1: Identify the Process
- What triggers it? (Request, User action, Event)
- What are the main steps? (3-5 steps)
- What decisions are made? (Conditionals)

### Step 2: List Components
- **Input**: What enters the process?
- **Processing**: What operations happen?
- **Decisions**: Any if/else logic?
- **Output**: What's returned?
- **Error Paths**: What if it fails?

### Step 3: Map the Flow
```
START
  ↓
INPUT VALIDATION
  ↓
DECISION POINT
  ├─→ SUCCESS PATH
  │     ↓
  │   PROCESS
  │     ↓
  │   RETURN SUCCESS
  │
  └─→ FAILURE PATH
        ↓
      RETURN ERROR
  ↓
END
```

### Step 4: Implement in Mermaid
```mermaid
flowchart TD
    Start([Process Start])
    Validate{Valid?}
    Success["Process Data"]
    Error["Return Error"]
    End([Process End])
    
    Start --> Validate
    Validate -->|Yes| Success
    Validate -->|No| Error
    Success --> End
    Error --> End
```

---

## Common Patterns in Your Code

### Pattern 1: Authentication Check
```
├─ Extract Token
├─ Verify Token
├─ Find User
└─ Return User or 401
```

### Pattern 2: CRUD Operation
```
├─ Auth Check
├─ Validate Input
├─ Query/Modify DB
├─ Handle Result
└─ Return Response
```

### Pattern 3: AI Integration
```
├─ Auth Check
├─ Format Request
├─ Call API
├─ Parse Response
├─ Save to DB
└─ Return to Client
```

### Pattern 4: Error Handling
```
├─ Try Operation
├─ Catch Error
├─ Determine Type
├─ Return Status Code
└─ Log Error
```

---

## Online Tools

- **Mermaid Live**: https://mermaid.live/
- **Draw.io**: https://app.diagrams.net/
- **Lucidchart**: https://www.lucidchart.com/

---

## Tips for Better Flowcharts

✅ **DO:**
- Keep flowcharts simple (5-10 boxes max)
- Use clear, concise labels
- Show both success and error paths
- Group related operations
- Use consistent arrow directions

❌ **DON'T:**
- Overcomplicate with too many branches
- Use unclear abbreviations
- Mix different diagram types
- Make boxes too small
- Create circular flows without reason

---

## Quick Examples for Your Features

### Notes Feature Flow
```
User Action (Create/Read/Update/Delete)
    ↓
Auth Validation
    ↓
Input Validation
    ↓
Database Operation
    ↓
Return Result
```

### Chat Feature Flow
```
User Message
    ↓
Auth Validation
    ↓
Call OpenAI
    ↓
Save Response
    ↓
Return to User
```

### Citation Feature Flow
```
Citation Input
    ↓
Auth Validation
    ↓
Validate Citation Data
    ↓
Save to Database
    ↓
Return Citation
```

---

## Summary

**Minimal Components Needed:**
1. Start point
2. Key processing steps (2-5)
3. Decision points (if any)
4. End point

**Color Coding (Optional):**
- Green: Start/Success
- Blue: Processes
- Yellow: Decisions/Database
- Red: End/Errors

---

**Last Updated:** December 6, 2025  
**For:** AI Research Assistant - StudyMate
