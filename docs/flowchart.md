# File and Folder Operations Flow

```mermaid
graph TD
    A[User Interface] --> B[FileTable Component]
    B --> C[API Routes]
    
    %% File Operations
    B -->|Delete All| D[/api/files/delete-all]
    B -->|Move to Trash| E[/api/files/[fileId]/trash]
    B -->|Star File| F[/api/files/[fileId]/star]
    B -->|Download File| G[ImageKit URL]
    
    %% Database & Storage
    D -->|Delete Records| H[(Neon Database)]
    D -->|Delete Files| I[ImageKit Storage]
    E -->|Update Record| H
    F -->|Update Record| H
    
    %% File States
    J[File States] -->|isTrash| K[Trash Folder]
    J -->|isStarred| L[Starred Files]
    J -->|isFolder| M[Folder View]
    
    %% Component Structure
    N[Components] -->|DeleteFolder| O[Delete Confirmation Modal]
    N -->|FileTable| P[File List View]
    N -->|FolderNavigation| Q[Folder Path]
    
    %% Data Flow
    R[Data Flow] -->|Fetch Files| S[GET /api/files]
    R -->|Update File| T[PATCH /api/files/[fileId]]
    R -->|Delete File| U[DELETE /api/files/[fileId]]
    
    %% Storage Flow
    V[Storage Flow] -->|Upload| W[ImageKit Upload]
    V -->|Delete| X[ImageKit Delete]
    V -->|Download| Y[ImageKit Download URL]
    
    %% Database Schema
    Z[Database Schema] -->|files table| AA[File Records]
    AA -->|Fields| AB[id, name, path, type, size, userId, isTrash, isStarred, isFolder]
    
    %% API Endpoints
    AC[API Endpoints] -->|File Operations| AD[/api/files]
    AC -->|Folder Operations| AE[/api/folders]
    AC -->|User Operations| AF[/api/user]
    
    %% Authentication
    AG[Authentication] -->|Clerk Auth| AH[User Session]
    AH -->|Protect Routes| AI[Protected API Routes]
    
    %% Error Handling
    AJ[Error Handling] -->|API Errors| AK[Error Responses]
    AJ -->|UI Feedback| AL[Toast Notifications]
    
    %% File Operations
    AM[File Operations] -->|Create| AN[Upload File]
    AM -->|Read| AO[List Files]
    AM -->|Update| AP[Modify File]
    AM -->|Delete| AQ[Remove File]
    
    %% Folder Operations
    AR[Folder Operations] -->|Create| AS[New Folder]
    AR -->|Navigate| AT[Folder Path]
    AR -->|Delete| AU[Remove Folder]
    
    %% UI Components
    AV[UI Components] -->|FileTable| AW[File List]
    AV -->|DeleteFolder| AX[Delete Modal]
    AV -->|FolderNavigation| AY[Path Navigation]
    AV -->|FileIcon| AZ[File Type Icon]
    
    %% State Management
    BA[State Management] -->|Files State| BB[File List]
    BA -->|Folder State| BC[Current Folder]
    BA -->|Selection State| BD[Selected Files]
    
    %% Event Handlers
    BE[Event Handlers] -->|File Click| BF[Open/Download]
    BE -->|Folder Click| BG[Navigate]
    BE -->|Delete Click| BH[Show Modal]
    BE -->|Star Click| BI[Toggle Star]
```

## Key Components and Their Relationships

1. **User Interface Layer**
   - FileTable Component (Main view)
   - DeleteFolder Modal (Confirmation)
   - FolderNavigation (Path display)
   - File Operations (Star, Trash, Download)

2. **API Layer**
   - File Operations API
   - Folder Operations API
   - User Authentication API

3. **Database Layer (Neon)**
   - Files Table
   - User Associations
   - File Metadata

4. **Storage Layer (ImageKit)**
   - File Storage
   - File URLs
   - File Deletion

5. **Authentication Layer (Clerk)**
   - User Sessions
   - Protected Routes
   - User Verification

## Data Flow

1. **File Operations**
   - Upload → ImageKit Storage → Database Record
   - Delete → ImageKit Delete → Database Delete
   - Download → ImageKit URL → File Download

2. **Folder Operations**
   - Create → Database Record
   - Navigate → Update Current Path
   - Delete → Delete All Contents

3. **State Management**
   - File List State
   - Current Folder State
   - Selection State

## Error Handling

1. **API Errors**
   - 401 Unauthorized
   - 404 Not Found
   - 500 Server Error

2. **UI Feedback**
   - Success Toasts
   - Error Toasts
   - Loading States 