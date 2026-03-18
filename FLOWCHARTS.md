# System Flowcharts
## AI Research Assistant - StudyMate

---

## 1. Application Startup Flow

```mermaid
flowchart TD
    Start([Application Start]) --> LoadEnv["Load Environment Variables<br/>(dotenv.config)"]
    LoadEnv --> CreateApp["Create Express App<br/>(express)"]
    CreateApp --> ConnectDB["Connect to MongoDB<br/>(mongoose.connect)"]
    ConnectDB --> DBSuccess{MongoDB<br/>Connected?}
    
    DBSuccess -->|Yes| LogSuccess["Log: Connected to MongoDB"]
    DBSuccess -->|No| LogError["Log: Connection Error"]
    LogError --> Exit1([Exit Process])
    
    LogSuccess --> SetupMiddleware["Setup Middleware<br/>- CORS<br/>- JSON Parser<br/>- Morgan Logger"]
    SetupMiddleware --> RegisterRoutes["Register API Routes<br/>- /api/auth<br/>- /api/notes<br/>- /api/citations<br/>- /api/chat<br/>- /api/summarize"]
    RegisterRoutes --> ErrorMiddleware["Add Error Handler Middleware"]
    ErrorMiddleware --> StartServer["Start Server<br/>PORT = 5000"]
    StartServer --> Running([Server Running<br/>Ready for Requests])
```

---

## 2. User Authentication Flow

```mermaid
flowchart TD
    Start([User Registration/Login]) --> ReceiveRequest["Receive Credentials<br/>(email, password)"]
    ReceiveRequest --> Validate{Validate<br/>Input?}
    
    Validate -->|Invalid| ReturnError1["Return 400 Error<br/>Invalid Input"]
    ReturnError1 --> End1([Request Failed])
    
    Validate -->|Valid| QueryDB["Query Database<br/>Find User by Email"]
    QueryDB --> UserExists{User<br/>Exists?}
    
    UserExists -->|Registration & Exists| ReturnError2["Return 409 Error<br/>User Already Exists"]
    ReturnError2 --> End2([Request Failed])
    
    UserExists -->|Registration & Not Exists| HashPassword["Hash Password<br/>(bcryptjs.hash)"]
    HashPassword --> CreateUser["Create New User Document<br/>Save to MongoDB"]
    CreateUser --> UserCreated["User Successfully Created"]
    
    UserExists -->|Login & Exists| ComparePassword["Compare Password<br/>(bcryptjs.compare)"]
    ComparePassword --> PasswordMatch{Password<br/>Correct?}
    
    PasswordMatch -->|No| ReturnError3["Return 401 Error<br/>Invalid Credentials"]
    ReturnError3 --> End3([Authentication Failed])
    
    PasswordMatch -->|Yes| GenerateJWT["Generate JWT Token<br/>(jwt.sign)"]
    GenerateJWT --> ReturnToken["Return Token to Client<br/>(Set in Authorization Header)"]
    ReturnToken --> End4([Authentication Success])
```

---

## 3. Chat/AI Interaction Flow

```mermaid
flowchart TD
    Start([User Sends Message]) --> ReceiveMsg["Receive Message<br/>from Frontend"]
    ReceiveMsg --> CheckAuth{Authorization<br/>Token Valid?}
    
    CheckAuth -->|Invalid/Missing| ReturnUnauth["Return 401<br/>Unauthorized"]
    ReturnUnauth --> End1([Request Failed])
    
    CheckAuth -->|Valid| ExtractUser["Extract User ID<br/>from JWT Token"]
    ExtractUser --> ParsePayload["Parse Message Payload<br/>(message, topic, type)"]
    ParsePayload --> DetermineChatType{Chat Type?}
    
    DetermineChatType -->|General Chat| ChatFlow["Create Chat Prompt<br/>Standard Context"]
    DetermineChatType -->|Research| ResearchFlow["Create Research Prompt<br/>Academic Context<br/>System Message:<br/>Research Assistant"]
    DetermineChatType -->|References| RefFlow["Create Reference Prompt<br/>Citation Context<br/>System Message:<br/>Citation Expert"]
    
    ChatFlow --> CallOpenAI["Call OpenAI API<br/>(gpt-3.5-turbo)"]
    ResearchFlow --> CallOpenAI
    RefFlow --> CallOpenAI
    
    CallOpenAI --> APISuccess{OpenAI<br/>Response<br/>Success?}
    
    APISuccess -->|Failed| LogError["Log Error<br/>ChatGPT API Error"]
    LogError --> ReturnError["Return 500<br/>API Error"]
    ReturnError --> End2([Request Failed])
    
    APISuccess -->|Success| ParseResponse["Parse OpenAI Response<br/>Extract Content"]
    ParseResponse --> CreateRecord["Create ChatMessage Record<br/>- userId<br/>- message<br/>- response<br/>- type<br/>- createdAt"]
    CreateRecord --> SaveDB["Save Record to MongoDB<br/>(chatMessage.save)"]
    SaveDB --> ReturnResponse["Return Response to Client<br/>(JSON Format)"]
    ReturnResponse --> End3([Response Sent Successfully])
```

---

## 4. Chat History Retrieval Flow

```mermaid
flowchart TD
    Start([Request Chat History]) --> ReceiveRequest["Receive GET Request<br/>/api/chat/history"]
    ReceiveRequest --> CheckAuth{Authorization<br/>Token Valid?}
    
    CheckAuth -->|Invalid| ReturnUnauth["Return 401<br/>Unauthorized"]
    ReturnUnauth --> End1([Request Failed])
    
    CheckAuth -->|Valid| ExtractUser["Extract User ID<br/>from JWT Token"]
    ExtractUser --> QueryDB["Query MongoDB<br/>Find ChatMessages<br/>WHERE userId = currentUser"]
    QueryDB --> Sort["Sort by createdAt<br/>Descending Order<br/>Most Recent First"]
    Sort --> Limit["Limit Results<br/>Return Last 50 Messages"]
    Limit --> ParseResults["Parse Query Results<br/>Convert to JSON"]
    ParseResults --> ReturnData["Return Chat History<br/>to Frontend"]
    ReturnData --> End2([Data Retrieved Successfully])
    
    QueryDB -.->|Query Error| HandleError["Handle Database Error"]
    HandleError --> ReturnError["Return 500<br/>Database Error"]
    ReturnError --> End3([Request Failed])
```

---

## 5. Note Management Flow

```mermaid
flowchart TD
    Start([Note Operation]) --> CheckAuth{Authorization<br/>Valid?}
    
    CheckAuth -->|Invalid| Unauth["Return 401<br/>Unauthorized"]
    Unauth --> End1([Failed])
    
    CheckAuth -->|Valid| DetermineOp{Operation<br/>Type?}
    
    DetermineOp -->|Create| CreateNote["Receive Note Data<br/>- title<br/>- content<br/>- tags"]
    CreateNote --> ValidateNote{Validate<br/>Fields?}
    ValidateNote -->|Invalid| ReturnVal1["Return 400<br/>Validation Error"]
    ReturnVal1 --> End2([Failed])
    
    ValidateNote -->|Valid| NewNote["Create New Note Document<br/>- user: userId<br/>- title<br/>- content<br/>- tags<br/>- timestamps"]
    NewNote --> SaveNote["Save to MongoDB"]
    SaveNote --> ReturnCreate["Return Created Note<br/>With _id"]
    ReturnCreate --> Success1([Note Created])
    
    DetermineOp -->|Read| GetNotes["Query Notes<br/>WHERE user = userId"]
    GetNotes --> SortNotes["Sort by createdAt<br/>Descending"]
    SortNotes --> ReturnRead["Return All User Notes"]
    ReturnRead --> Success2([Notes Retrieved])
    
    DetermineOp -->|Update| GetNote["Find Note by ID<br/>WHERE _id = noteId"]
    GetNote --> CheckOwner{User is<br/>Owner?}
    CheckOwner -->|No| ReturnForbid["Return 403<br/>Forbidden"]
    ReturnForbid --> End3([Failed])
    CheckOwner -->|Yes| UpdateNote["Update Fields<br/>- title<br/>- content<br/>- tags"]
    UpdateNote --> SaveUpdate["Save Updated Note"]
    SaveUpdate --> ReturnUpdate["Return Updated Note"]
    ReturnUpdate --> Success3([Note Updated])
    
    DetermineOp -->|Delete| DelNote["Find Note by ID"]
    DelNote --> CheckOwner2{User is<br/>Owner?}
    CheckOwner2 -->|No| ReturnForbid2["Return 403<br/>Forbidden"]
    ReturnForbid2 --> End4([Failed])
    CheckOwner2 -->|Yes| DeleteNote["Delete Note from MongoDB"]
    DeleteNote --> ReturnDel["Return Success Message"]
    ReturnDel --> Success4([Note Deleted])
```

---

## 6. Citation Management Flow

```mermaid
flowchart TD
    Start([Citation Operation]) --> CheckAuth{Authorization<br/>Valid?}
    
    CheckAuth -->|Invalid| Unauth["Return 401"]
    Unauth --> End1([Failed])
    
    CheckAuth -->|Valid| DetermineOp{Operation<br/>Type?}
    
    DetermineOp -->|Add Citation| ReceiveCitation["Receive Citation Data<br/>- title<br/>- authors<br/>- journal<br/>- year<br/>- doi<br/>- url<br/>- abstract"]
    ReceiveCitation --> ValidateCit{Validate<br/>Required<br/>Fields?}
    ValidateCit -->|Invalid| ReturnVal["Return 400<br/>Validation Error"]
    ReturnVal --> End2([Failed])
    
    ValidateCit -->|Valid| NewCitation["Create Citation Document<br/>- user: userId<br/>- all metadata<br/>- timestamps"]
    NewCitation --> SaveCit["Save to MongoDB"]
    SaveCit --> ReturnCit["Return New Citation<br/>With _id"]
    ReturnCit --> Success1([Citation Added])
    
    DetermineOp -->|Retrieve| GetCitations["Query Citations<br/>WHERE user = userId"]
    GetCitations --> ReturnCitations["Return All Citations"]
    ReturnCitations --> Success2([Citations Retrieved])
    
    DetermineOp -->|Search| SearchTerm["Receive Search Term<br/>- doi<br/>- title<br/>- authors"]
    SearchTerm --> QuerySearch["Search MongoDB<br/>WHERE user = userId<br/>AND field CONTAINS term"]
    QuerySearch --> ReturnSearch["Return Search Results"]
    ReturnSearch --> Success3([Search Complete])
```

---

## 7. Request-Response Cycle

```mermaid
flowchart TD
    Frontend["Frontend<br/>(Next.js + React)"]
    
    Frontend -->|1. HTTP Request<br/>Headers: Authorization| API["Backend API<br/>(Express)"]
    
    API -->|2. Check Headers| AuthMiddleware["Authentication Middleware"]
    AuthMiddleware -->|Valid| Route["Route Handler"]
    AuthMiddleware -->|Invalid| Error1["Return 401"]
    Error1 --> Frontend2["Send Error Response"]
    
    Route -->|3. Process Request| Business["Business Logic<br/>- Validate Input<br/>- Query/Modify Data"]
    Business -->|Success| DB["MongoDB<br/>Database"]
    Business -->|Validation Error| Error2["Return 400"]
    Error2 --> Frontend2
    
    DB -->|4. Execute Query| DBReturn["Return Data"]
    DBReturn -->|Query Success| Response["Format Response<br/>(JSON)"]
    DBReturn -->|Query Error| Error3["Return 500"]
    Error3 --> Frontend2
    
    Response -->|5. HTTP Response<br/>Status: 200<br/>Body: JSON| Frontend
    Frontend -->|6. Parse Response| Update["Update State<br/>Update UI"]
    Update --> Display["Display to User"]
```

---

## 8. Error Handling Flow

```mermaid
flowchart TD
    Request["Incoming Request"]
    Request --> ProcessRequest["Process Request"]
    
    ProcessRequest --> ErrorOccurs{Error<br/>Occurs?}
    
    ErrorOccurs -->|No| Success["Request Succeeds<br/>Return 200 OK"]
    Success --> Frontend["Send Response to Frontend"]
    
    ErrorOccurs -->|Yes| ErrorType{Error<br/>Type?}
    
    ErrorType -->|Authentication Error| Auth["401 Unauthorized<br/>- Missing Token<br/>- Invalid Token<br/>- User Not Found"]
    
    ErrorType -->|Authorization Error| Authz["403 Forbidden<br/>- User Not Owner<br/>- Permission Denied"]
    
    ErrorType -->|Validation Error| Valid["400 Bad Request<br/>- Missing Fields<br/>- Invalid Data<br/>- Type Mismatch"]
    
    ErrorType -->|Not Found Error| NotFound["404 Not Found<br/>- Resource Not Found<br/>- Invalid ID"]
    
    ErrorType -->|Server Error| Server["500 Internal Server Error<br/>- Database Connection Failed<br/>- API Service Down<br/>- Unexpected Exception"]
    
    Auth --> LogError["Log Error Details<br/>- Error Message<br/>- Stack Trace<br/>- Timestamp"]
    Authz --> LogError
    Valid --> LogError
    NotFound --> LogError
    Server --> LogError
    
    LogError --> ErrorMiddleware["Error Middleware<br/>errorHandler.ts"]
    ErrorMiddleware --> Format["Format Error Response<br/>{<br/>  status: number,<br/>  message: string,<br/>  error: object<br/>}"]
    Format --> SendError["Send Error Response<br/>to Frontend"]
    SendError --> Frontend2["Frontend Handles Error<br/>- Show Error Message<br/>- Log to Console<br/>- Retry Logic"]
```

---

## 9. Data Flow Through Stack

```mermaid
flowchart LR
    subgraph Frontend["FRONTEND<br/>(Next.js + React)"]
        UI["UI Components<br/>- Chat Interface<br/>- Note Editor<br/>- Citation Manager"]
        State["React State<br/>Context API"]
        API_Client["API Client<br/>(fetch/axios)"]
    end
    
    subgraph Transport["TRANSPORT<br/>(HTTP/REST)"]
        Request["HTTP Request<br/>JSON Payload"]
        Response["HTTP Response<br/>JSON Data"]
    end
    
    subgraph Backend["BACKEND<br/>(Express.js + Node.js)"]
        Routes["Route Handlers<br/>- POST /api/chat<br/>- GET /api/notes<br/>etc."]
        Middleware["Middleware<br/>- Auth<br/>- Validation<br/>- Error"]
        Controllers["Business Logic<br/>- Process Data<br/>- Call OpenAI<br/>- Transform Data"]
        Models["Data Models<br/>- Mongoose Schemas<br/>- Validation Rules"]
    end
    
    subgraph DB["DATABASE<br/>(MongoDB)"]
        Collections["Collections<br/>- users<br/>- chatmessages<br/>- notes<br/>- citations"]
    end
    
    UI -->|User Input| State
    State -->|Prepare Data| API_Client
    API_Client -->|Send| Request
    Request -->|Route| Routes
    Routes -->|Verify| Middleware
    Middleware -->|Process| Controllers
    Controllers -->|Query/Update| Models
    Models -->|CRUD| Collections
    Collections -->|Return Data| Models
    Models -->|Data| Controllers
    Controllers -->|Format| Routes
    Routes -->|Prepare| Response
    Response -->|Receive| API_Client
    API_Client -->|Update| State
    State -->|Re-render| UI
```

---

## 10. Authentication Token Flow

```mermaid
flowchart TD
    Start([User Login]) --> SendCreds["Frontend Sends<br/>email + password"]
    SendCreds --> Backend["Backend Receives<br/>Login Request"]
    
    Backend --> QueryUser["Query User<br/>by Email"]
    QueryUser --> UserFound{User<br/>Found?}
    
    UserFound -->|No| ReturnError1["Return 401<br/>Invalid Credentials"]
    ReturnError1 --> End1([Login Failed])
    
    UserFound -->|Yes| ComparePass["Compare Hashed<br/>Password"]
    ComparePass --> PassMatch{Password<br/>Match?}
    
    PassMatch -->|No| ReturnError2["Return 401<br/>Invalid Credentials"]
    ReturnError2 --> End2([Login Failed])
    
    PassMatch -->|Yes| GenerateToken["Generate JWT Token<br/>jwt.sign<br/>{<br/>  userId,<br/>  expiresIn: 24h<br/>}"]
    GenerateToken --> SendToken["Send Token to Frontend<br/>in Response"]
    SendToken --> StoreToken["Frontend Stores Token<br/>localStorage/sessionStorage"]
    StoreToken --> End3([Login Success])
    
    End3 --> FutureRequest["Future API Requests"]
    FutureRequest --> GetToken["Get Token from Storage"]
    GetToken --> AddHeader["Add to Header<br/>Authorization: Bearer TOKEN"]
    AddHeader --> SendRequest["Send Request<br/>to Backend"]
    SendRequest --> Backend2["Backend Receives"]
    
    Backend2 --> ExtractToken["Extract Token<br/>from Header"]
    ExtractToken --> VerifyToken["Verify Token<br/>jwt.verify"]
    VerifyToken --> ValidToken{Token<br/>Valid?}
    
    ValidToken -->|Expired| ReturnUnauth1["Return 401<br/>Token Expired"]
    ReturnUnauth1 --> RefreshFlow["Frontend Refresh Token<br/>or Re-login"]
    RefreshFlow --> End4([Unauthorized])
    
    ValidToken -->|Invalid| ReturnUnauth2["Return 401<br/>Invalid Token"]
    ReturnUnauth2 --> End5([Unauthorized])
    
    ValidToken -->|Valid| DecodeToken["Decode Token<br/>Extract userId"]
    DecodeToken --> FetchUser["Fetch User<br/>from Database"]
    FetchUser --> AttachUser["Attach User to<br/>req.user Object"]
    AttachUser --> ProcessRequest["Process Request<br/>with User Context"]
    ProcessRequest --> Success["Request Succeeds"]
    Success --> End6([Authorized])
```

---

## 11. OpenAI Integration Flow

```mermaid
flowchart TD
    Start([Chat Request Received]) --> CheckAuth{Authentication<br/>Valid?}
    
    CheckAuth -->|Invalid| ReturnUnauth["Return 401"]
    ReturnUnauth --> End1([Failed])
    
    CheckAuth -->|Valid| ValidateAPI{OpenAI API<br/>Key Valid?}
    
    ValidateAPI -->|Invalid| LogAPIError["Log: API Key Missing/Invalid"]
    LogAPIError --> ReturnError1["Return 500<br/>API Configuration Error"]
    ReturnError1 --> End2([Failed])
    
    ValidateAPI -->|Valid| ConstructPrompt["Construct Prompt<br/>- System Message<br/>- User Message<br/>- Context Parameters"]
    ConstructPrompt --> SetParams["Set Parameters<br/>- model: gpt-3.5-turbo<br/>- temperature: 0.7<br/>- max_tokens: 1000"]
    SetParams --> CallOpenAI["Call OpenAI API<br/>(openai.createChatCompletion)"]
    
    CallOpenAI --> APIResponse{OpenAI<br/>Response?}
    
    APIResponse -->|Network Error| LogNetError["Log: Network Error"]
    LogNetError --> ReturnError2["Return 500<br/>Network Error"]
    ReturnError2 --> End3([Failed])
    
    APIResponse -->|API Error| LogAPIFailure["Log: API Error<br/>Status Code<br/>Error Message"]
    LogAPIFailure --> ReturnError3["Return 500<br/>API Error"]
    ReturnError3 --> End4([Failed])
    
    APIResponse -->|Success| ParseResponse["Parse Response<br/>Extract content<br/>from choices[0]"]
    ParseResponse --> CheckContent{Content<br/>Exists?}
    
    CheckContent -->|No| ReturnEmpty["Return Empty Response<br/>Error"]
    ReturnEmpty --> End5([Failed])
    
    CheckContent -->|Yes| CreateRecord["Create ChatMessage<br/>Record<br/>- userId<br/>- message<br/>- response<br/>- type"]
    CreateRecord --> SaveDB["Save to MongoDB"]
    SaveDB --> SaveSuccess{Save<br/>Success?}
    
    SaveSuccess -->|Failed| LogDBError["Log: Database Error"]
    LogDBError --> ReturnError4["Return 500<br/>Database Error"]
    ReturnError4 --> End6([Failed])
    
    SaveSuccess -->|Success| ReturnResponse["Return Response<br/>to Frontend<br/>{<br/>  response: content,<br/>  messageId: _id<br/>}"]
    ReturnResponse --> End7([Success])
```

---

## 12. Data Persistence Flow

```mermaid
flowchart TD
    Start([Data Requires Persistence]) --> DetermineModel{Data<br/>Type?}
    
    DetermineModel -->|User Data| UserFlow["User Model<br/>- Email (Unique)<br/>- Hashed Password<br/>- Name<br/>- Timestamps"]
    DetermineModel -->|Chat Data| ChatFlow["ChatMessage Model<br/>- userId (FK)<br/>- message<br/>- response<br/>- type<br/>- createdAt"]
    DetermineModel -->|Note Data| NoteFlow["Note Model<br/>- userId (FK)<br/>- title<br/>- content<br/>- tags<br/>- timestamps"]
    DetermineModel -->|Citation Data| CitFlow["Citation Model<br/>- userId (FK)<br/>- title<br/>- authors<br/>- metadata<br/>- timestamps"]
    
    UserFlow --> Validate1["Validate Schema<br/>- Email Format<br/>- Password Min 6<br/>- Name Trimmed"]
    ChatFlow --> Validate2["Validate Schema<br/>- userId Required<br/>- message Required<br/>- type Enum Check"]
    NoteFlow --> Validate3["Validate Schema<br/>- title Required<br/>- content Required<br/>- tags Array"]
    CitFlow --> Validate4["Validate Schema<br/>- title Required<br/>- authors Array<br/>- Optional Fields"]
    
    Validate1 --> PreSave1["Pre-save Hook<br/>Hash Password"]
    Validate2 --> Create["Create Mongoose Document"]
    Validate3 --> Create
    Validate4 --> Create
    PreSave1 --> Create
    
    Create --> ExecuteSave["Execute save()"]
    ExecuteSave --> DBInsert["MongoDB Insert<br/>Operation"]
    DBInsert --> CheckResult{Insert<br/>Success?}
    
    CheckResult -->|Duplicate Key| DupError["Handle Duplicate<br/>Error<br/>E11000"]
    DupError --> ReturnDupError["Return 409<br/>Conflict"]
    ReturnDupError --> End1([Failed])
    
    CheckResult -->|Validation Error| ValError["Handle Validation<br/>Error"]
    ValError --> ReturnValError["Return 400<br/>Bad Request"]
    ReturnValError --> End2([Failed])
    
    CheckResult -->|Other Error| OtherError["Handle Other<br/>MongoDB Error"]
    OtherError --> ReturnOtherError["Return 500<br/>Server Error"]
    ReturnOtherError --> End3([Failed])
    
    CheckResult -->|Success| DocumentSaved["Document Saved<br/>to Collection<br/>- _id Generated<br/>- Timestamps Set"]
    DocumentSaved --> ReturnDocument["Return Document<br/>to Application"]
    ReturnDocument --> End4([Success])
```

---

## Summary of Flows

| Flow # | Name | Purpose |
|--------|------|---------|
| 1 | Application Startup | Initialize server and connect to database |
| 2 | Authentication | User registration and login |
| 3 | Chat/AI Interaction | Process user messages with OpenAI |
| 4 | Chat History | Retrieve conversation history |
| 5 | Note Management | CRUD operations on notes |
| 6 | Citation Management | CRUD operations on citations |
| 7 | Request-Response Cycle | Complete HTTP request lifecycle |
| 8 | Error Handling | Handle and respond to errors |
| 9 | Data Flow Through Stack | Track data from UI to database |
| 10 | Authentication Token | JWT generation and validation |
| 11 | OpenAI Integration | API calls and response handling |
| 12 | Data Persistence | Save data to MongoDB |

---

**Document Created:** December 6, 2025  
**System:** AI Research Assistant - StudyMate  
**Version:** 1.0
