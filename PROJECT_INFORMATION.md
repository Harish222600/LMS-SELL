# 📚 LMS-SELL - Complete Project Information

---

## 🧩 BASIC INFORMATION

### Project Name / Brand Name
**LMS-SELL** (Learning Management System - SELL)

### Tech Stack Used

#### **Frontend**
- **Framework:** React 18.2.0
- **Build Tool:** Vite 4.4.5
- **State Management:** Redux Toolkit 1.9.5
- **Routing:** React Router DOM 6.16.0
- **Styling:** TailwindCSS 3.3.3
- **UI Libraries:**
  - Framer Motion 10.16.4 (Animations)
  - Chart.js 4.4.0 (Analytics & Charts)
  - React Hook Form 7.46.2 (Form Management)
  - React Hot Toast 2.4.1 (Notifications)
  - Monaco Editor (Code Editor)
  - React Dropzone 14.2.3 (File Uploads)
  - Video React 0.16.0 (Video Player)
  - React Icons 4.11.0
  - React Markdown 9.0.0
  - Swiper 11.2.8 (Carousels)

#### **Backend**
- **Runtime:** Node.js
- **Framework:** Express.js 4.21.2
- **Database:** MongoDB (Mongoose ODM 7.8.7)
- **Authentication:** JWT (jsonwebtoken 9.0.2) + Bcrypt 5.1.1
- **Real-time Communication:** Socket.IO 4.8.1
- **File Storage:** AWS S3 (SDK v3.857.0)
- **Payment Gateway:** Razorpay 2.9.2
- **Email Service:** Nodemailer 6.9.5
- **Image Processing:** Sharp 0.34.2
- **Video Processing:** FFprobe
- **PDF Generation:** PDFKit 0.17.1
- **Task Scheduling:** Node-Cron 3.0.3

#### **Database**
- **Primary Database:** MongoDB (NoSQL)
- **Models:** 28 database schemas
- **ODM:** Mongoose 7.8.7

#### **Cloud Services & Hosting**
- **File Storage:** AWS S3 (Images, Videos, Documents)
- **Region:** ap-south-1 (Asia Pacific - Mumbai)
- **Containerization:** Docker + Docker Compose
- **Email:** Gmail SMTP

### Project Type
**Full-Stack Web Application** (MERN Stack)
- Responsive web application accessible on desktop, tablet, and mobile browsers
- Optimized for modern browsers (Chrome, Firefox, Safari, Edge)
- Progressive Web App (PWA) ready architecture

### Target Audience

#### **Primary Audience:**
1. **Educational Institutions**
   - Colleges and Universities
   - Training Institutes
   - Coaching Centers
   - Professional Training Organizations

2. **Corporate Companies**
   - Employee Training & Development
   - Onboarding Programs
   - Skill Development Initiatives
   - Compliance Training

3. **Individual Instructors**
   - Subject Matter Experts
   - Professional Trainers
   - Content Creators
   - Freelance Educators

4. **Students & Learners**
   - College Students
   - Working Professionals
   - Career Switchers
   - Lifelong Learners

---

## 🎯 FUNCTIONAL HIGHLIGHTS

### Core Features

#### **1. Course Management System**
- **Course Creation & Publishing**
  - Rich course builder with drag-and-drop interface
  - Section and subsection organization
  - Draft and Published status management
  - Course visibility controls (Public/Private)
  - Course deactivation without deletion
  
- **Content Types Supported**
  - Video lectures with chunked upload (supports large files >100MB)
  - Interactive quizzes and assessments
  - Downloadable documents and resources
  - Code snippets with syntax highlighting
  
- **Course Categorization**
  - Hierarchical category system
  - Multi-tag support for better discoverability
  - Featured courses highlighting
  - Free and Paid course options

#### **2. Video Streaming & Management**
- **Advanced Video Upload**
  - Chunked multipart upload for large files
  - AWS S3 storage integration
  - Automatic video metadata extraction (FFprobe)
  - Duration calculation and validation
  - Multiple format support
  
- **Video Playback**
  - Optimized streaming from AWS S3
  - Progress tracking and resume functionality
  - Watch time analytics
  - Content protection (right-click disabled, DevTools blocking)

#### **3. Assessment & Quiz System**
- **Quiz Creation**
  - Multiple choice questions
  - True/False questions
  - Configurable time limits
  - Pass/Fail thresholds
  
- **Quiz Features**
  - Automatic grading system
  - Instant feedback
  - Progress tracking
  - Retake options
  - Quiz analytics for instructors

#### **4. Progress Tracking & Analytics**
- **Student Progress**
  - Course completion percentage
  - Video watch time tracking
  - Quiz scores and attempts
  - Certificate generation on completion
  
- **Instructor Analytics**
  - Student enrollment statistics
  - Course performance metrics
  - Engagement analytics
  - Revenue tracking
  
- **Admin Dashboard**
  - System-wide analytics
  - User growth metrics
  - Revenue reports
  - Course popularity insights
  - Real-time monitoring

#### **5. Payment & Commerce**
- **Razorpay Integration**
  - Secure payment processing
  - Multiple payment methods
  - Automatic payment verification
  - Refund handling
  
- **Pricing Features**
  - Flexible course pricing
  - Discount coupon system
  - Bundle purchases
  - Free course support
  - Admin-controlled pricing
  
- **Order Management**
  - Complete order history
  - Purchase tracking
  - Invoice generation
  - Payment status monitoring

#### **6. Real-time Communication (Socket.IO)**
- **Chat System**
  - Student-Instructor messaging
  - Admin-User communication
  - Real-time message delivery
  - Message history persistence
  
- **Live Features**
  - Typing indicators
  - Online/Offline status
  - Real-time notifications
  - Room-based chat isolation

#### **7. Certificate System**
- **Automatic Generation**
  - PDF certificate creation on course completion
  - QR code for verification
  - Unique certificate IDs
  - Custom certificate templates
  
- **Verification**
  - Public certificate verification portal
  - QR code scanning
  - Certificate authenticity checking
  - Download and print options

#### **8. Job Portal**
- **Job Listings**
  - Job posting by instructors/admins
  - Detailed job descriptions
  - Application deadlines
  - Skill requirements
  
- **Application Management**
  - Student job applications
  - Resume upload
  - Application status tracking
  - Employer-candidate communication

#### **9. User Management**
- **Multi-Role System**
  - **Admin:** Full system control
  - **Instructor:** Course creation and management
  - **Student:** Course enrollment and learning
  
- **Account Features**
  - Email verification with OTP
  - Password reset functionality
  - Profile management
  - Instructor approval workflow
  - Account activation/deactivation

#### **10. Content Protection**
- **Security Measures**
  - Right-click disabled
  - Text selection disabled
  - DevTools keyboard shortcuts blocked
  - Drag prevention
  - Content watermarking ready

### Admin & User Roles

#### **Admin Role**
- **Permissions:**
  - Full system access and control
  - User management (approve/reject instructors)
  - Course management (edit/delete any course)
  - Category management
  - Featured courses management
  - Coupon creation and management
  - Order and payment monitoring
  - System analytics and reports
  - FAQ management
  - Job posting and management
  - Recycle bin management
  - System health monitoring
  - Chat with all users

#### **Instructor Role**
- **Permissions:**
  - Create and publish courses
  - Manage own courses
  - View student enrollments
  - Track course analytics
  - Create quizzes and assignments
  - Issue certificates
  - Chat with enrolled students
  - Post job opportunities
  - View earnings and revenue
  - Request course access for students
  - Manage course pricing (subject to admin approval)

#### **Student Role**
- **Permissions:**
  - Browse and search courses
  - Enroll in courses (free or paid)
  - Watch video lectures
  - Take quizzes and assessments
  - Track learning progress
  - Download certificates
  - Chat with instructors
  - Apply for jobs
  - View purchase history
  - Manage profile and settings
  - Rate and review courses

### Unique Selling Points (USP)

#### **1. Advanced Video Management**
- **Chunked Upload Technology:** Supports large video files (>100MB) with resume capability
- **AWS S3 Integration:** Scalable, reliable cloud storage
- **Automatic Metadata Extraction:** FFprobe integration for video duration and quality detection
- **Optimized Streaming:** Fast video delivery with CDN-ready architecture

#### **2. Role-Based Dashboards**
- **Personalized Experiences:** Each user role has a custom dashboard
- **Admin Analytics:** Comprehensive system-wide insights
- **Instructor Dashboard:** Course performance and student engagement metrics
- **Student Dashboard:** Learning progress and achievements

#### **3. Real-Time Communication**
- **Socket.IO Integration:** Instant messaging between users
- **Live Notifications:** Real-time updates for important events
- **Typing Indicators:** Enhanced chat experience
- **Multi-Room Support:** Isolated conversations for privacy

#### **4. Flexible Course Access**
- **Free & Paid Courses:** Support for both monetized and free content
- **Admin Override:** Admins can make paid courses free
- **Course Access Requests:** Students can request access to courses
- **Bundle Purchases:** Buy multiple courses at discounted rates

#### **5. Comprehensive Analytics**
- **Watch Time Tracking:** Detailed video consumption analytics
- **Engagement Metrics:** Student interaction and participation data
- **Revenue Analytics:** Earnings tracking for instructors and admins
- **Performance Insights:** Course effectiveness measurements

#### **6. Automated Certificate System**
- **Auto-Generation:** Certificates created upon course completion
- **QR Code Verification:** Instant certificate authenticity checking
- **Professional Templates:** Customizable certificate designs
- **Public Verification Portal:** Anyone can verify certificates

#### **7. Content Protection**
- **Multi-Layer Security:** Right-click, text selection, and drag disabled
- **DevTools Blocking:** Prevents content inspection
- **JWT Authentication:** Secure API access
- **Role-Based Access Control:** Fine-grained permissions

#### **8. Scalable Architecture**
- **AWS S3 Storage:** Unlimited storage capacity
- **Docker Support:** Easy deployment and scaling
- **MongoDB:** Flexible NoSQL database
- **Microservices Ready:** Modular architecture for future scaling

#### **9. Job Portal Integration**
- **Career Opportunities:** Connect learners with employers
- **Skill-Based Matching:** Jobs aligned with course content
- **Application Tracking:** Complete hiring workflow
- **Instructor Networking:** Direct employer-instructor connections

#### **10. Soft Delete & Recovery**
- **Recycle Bin System:** Recover accidentally deleted content
- **Scheduled Cleanup:** Automatic permanent deletion after 30 days
- **Admin Control:** Restore or permanently delete items

### Integration Details

#### **1. Payment Gateway - Razorpay**
- **Features:**
  - Multiple payment methods (Cards, UPI, Netbanking, Wallets)
  - Automatic payment verification
  - Webhook integration for real-time updates
  - Refund processing
  - Payment analytics
  
- **Implementation:**
  - Server-side order creation
  - Client-side payment UI
  - Signature verification for security
  - Order status tracking

#### **2. AWS S3 Storage**
- **Buckets:**
  - Images bucket (course thumbnails, profiles, categories)
  - Videos bucket (course videos, chunked uploads)
  - Documents bucket (certificates, resources)
  
- **Features:**
  - Multipart upload for large files
  - Signed URLs for secure access
  - CORS configuration
  - Public read access for content delivery
  - Lifecycle policies for cost optimization
  
- **Auto-Configuration:**
  - Automatic bucket creation
  - CORS policy setup
  - Public access configuration
  - Region-based optimization

#### **3. Email Service - Nodemailer (Gmail SMTP)**
- **Use Cases:**
  - OTP verification emails
  - Password reset emails
  - Course enrollment confirmations
  - Certificate delivery
  - Notification emails
  - Welcome emails
  
- **Configuration:**
  - Gmail SMTP integration
  - HTML email templates
  - Attachment support
  - Error handling and retry logic

#### **4. Real-Time Communication - Socket.IO**
- **Features:**
  - JWT-based authentication
  - Room-based messaging
  - Typing indicators
  - Online/Offline status
  - Message persistence
  
- **Events:**
  - authenticate, join_chat, leave_chat
  - send_message, typing_start, typing_stop
  - new_message, user_typing, error

#### **5. Image Processing - Sharp**
- **Features:**
  - Image resizing and optimization
  - Format conversion
  - Quality compression
  - Thumbnail generation
  - Fast processing

#### **6. Video Processing - FFprobe**
- **Features:**
  - Video duration extraction
  - Metadata reading
  - Format detection
  - Quality analysis
  - Codec information

#### **7. PDF Generation - PDFKit**
- **Use Cases:**
  - Certificate generation
  - Invoice creation
  - Report generation
  
- **Features:**
  - Custom layouts
  - Image embedding
  - QR code integration
  - Professional formatting

#### **8. Task Scheduling - Node-Cron**
- **Scheduled Tasks:**
  - Recycle bin cleanup (automatic deletion after 30 days)
  - Database maintenance
  - Analytics aggregation
  - Email notifications

#### **9. Code Editor - Monaco Editor**
- **Features:**
  - Syntax highlighting
  - Multiple language support
  - IntelliSense
  - Code snippets
  - Theme customization

#### **10. Charts & Analytics - Chart.js**
- **Visualizations:**
  - Line charts (progress over time)
  - Bar charts (course comparisons)
  - Pie charts (category distribution)
  - Doughnut charts (completion rates)
  - Interactive tooltips

---

## 🏗️ ARCHITECTURE OVERVIEW

### System Architecture
```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT LAYER                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │  React 18 + Vite + TailwindCSS + Redux Toolkit   │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                          │
                          │ HTTPS/WSS
                          ▼
┌─────────────────────────────────────────────────────────┐
│                   API GATEWAY LAYER                     │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Express.js + CORS + JWT Auth + Rate Limiting    │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                          │
                ┌─────────┴─────────┐
                │                   │
                ▼                   ▼
┌───────────────────────┐  ┌──────────────────────┐
│   BUSINESS LOGIC      │  │  REAL-TIME LAYER     │
│   ┌───────────────┐   │  │  ┌──────────────┐   │
│   │ Controllers   │   │  │  │  Socket.IO   │   │
│   │ Services      │   │  │  │  Chat/Notif  │   │
│   │ Middleware    │   │  │  └──────────────┘   │
│   └───────────────┘   │  └──────────────────────┘
└───────────────────────┘
                │
        ┌───────┴───────┐
        │               │
        ▼               ▼
┌──────────────┐  ┌──────────────────┐
│   DATABASE   │  │  CLOUD STORAGE   │
│  ┌────────┐  │  │  ┌────────────┐  │
│  │MongoDB │  │  │  │  AWS S3    │  │
│  │28 Models│  │  │  │Images/Vids │  │
│  └────────┘  │  │  └────────────┘  │
└──────────────┘  └──────────────────┘
        │
        ▼
┌──────────────────────────────────┐
│   EXTERNAL INTEGRATIONS          │
│  ┌────────────┐  ┌────────────┐  │
│  │ Razorpay   │  │ Nodemailer │  │
│  │ Payment    │  │ Email      │  │
│  └────────────┘  └────────────┘  │
└──────────────────────────────────┘
```

### Database Schema (28 Models)
1. **User** - User accounts and authentication
2. **Profile** - Extended user information
3. **Course** - Course definitions
4. **Section** - Course sections/modules
5. **SubSection** - Individual lectures/videos
6. **CourseProgress** - Student progress tracking
7. **Category** - Course categories
8. **Quiz** - Quiz definitions
9. **Certificate** - Generated certificates
10. **Order** - Payment transactions
11. **Coupon** - Discount codes
12. **RatingAndReview** - Course reviews
13. **Chat** - Chat conversations
14. **Message** - Individual messages
15. **Notification** - System notifications
16. **Job** - Job postings
17. **JobApplication** - Job applications
18. **ContactMessage** - Contact form submissions
19. **FeaturedCourses** - Homepage featured courses
20. **FAQ** - Frequently asked questions
21. **RecycleBin** - Soft-deleted items
22. **TokenBlacklist** - Invalidated JWT tokens
23. **OTP** - One-time passwords
24. **CourseAccessRequest** - Course access requests
25. **BundleAccessRequest** - Bundle access requests
26. **ChunkedVideo** - Chunked upload tracking
27. **AdminSectionViews** - Admin view tracking
28. **UserNotificationStatus** - Notification read status

---

## 📊 PROJECT STATISTICS

### Codebase Metrics
- **Total Models:** 28 database schemas
- **Backend Controllers:** 34 controller files
- **API Routes:** 23 route files
- **Frontend Pages:** 37+ pages
- **Redux Slices:** 7 state management slices
- **Backend Dependencies:** 30+ packages
- **Frontend Dependencies:** 65+ packages

### Feature Completeness
- ✅ User Authentication & Authorization
- ✅ Course Management (CRUD)
- ✅ Video Upload & Streaming
- ✅ Quiz & Assessment System
- ✅ Payment Integration
- ✅ Certificate Generation
- ✅ Real-time Chat
- ✅ Analytics Dashboard
- ✅ Job Portal
- ✅ Email Notifications
- ✅ Content Protection
- ✅ Recycle Bin System
- ✅ Coupon System
- ✅ Multi-role Access Control
- ✅ Progress Tracking

---

## 🚀 DEPLOYMENT & SCALABILITY

### Current Deployment Setup
- **Containerization:** Docker + Docker Compose
- **Services:**
  - Backend (Node.js on port 5001)
  - Frontend (Nginx on port 5173)
  - MongoDB (port 27017)
- **Persistent Storage:** Docker volumes for MongoDB data

### Environment Configuration
```env
# Server
NODE_ENV=production
PORT=5001
HOST=localhost
PUBLIC_IP=your_public_ip

# Database
MONGODB_URL=mongodb://localhost:27017/lms

# AWS S3
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=ap-south-1
AWS_S3_BUCKET_NAME=your_bucket

# Authentication
JWT_SECRET=your_jwt_secret

# Payment
RAZORPAY_KEY=your_key
RAZORPAY_SECRET=your_secret

# Email
MAIL_HOST=smtp.gmail.com
MAIL_USER=your_email
MAIL_PASS=your_password

# Frontend
FRONTEND_URL=http://localhost:5173
```

### Scalability Features
- AWS S3 for unlimited storage
- MongoDB with connection pooling
- Stateless API design
- JWT-based authentication
- Docker containerization
- Horizontal scaling ready

---

## 🎨 UI/UX HIGHLIGHTS

### Design System
- **Theme:** Classic Academic Design
- **Color Palette:**
  - Navy Blue (#1e3a8a) - Primary
  - Gold (#d97706) - Accent
  - Cream (#fef7ed) - Background
  - Warm White (#fefefe) - Cards
  
- **Typography:**
  - Playfair Display (Headings)
  - Crimson Text (Subheadings)
  - Inter (Body text)

### Responsive Design
- Mobile-first approach
- Breakpoints: xs (320px) to 3xl (1920px)
- Touch-friendly interfaces
- Optimized for all devices

### Animations
- Framer Motion for smooth transitions
- Custom animations (fade-in, slide-up, bounce)
- Loading states and skeletons
- Interactive hover effects

---

## 🔐 SECURITY FEATURES

### Authentication & Authorization
- JWT token-based authentication
- Bcrypt password hashing
- Token blacklisting on logout
- OTP verification for signup
- Password reset with secure tokens
- Role-based access control (RBAC)

### Data Protection
- Input validation and sanitization
- SQL injection prevention (Mongoose ODM)
- XSS prevention
- CORS configuration
- Rate limiting
- Secure file upload validation
- Cookie security (httpOnly, secure)

### Content Protection
- Right-click disabled
- Text selection disabled
- DevTools keyboard shortcuts blocked
- Drag prevention
- Video content protection

---

## 📈 FUTURE ROADMAP

### Planned Enhancements
1. **AI Integration**
   - Personalized course recommendations
   - Chatbot for student support
   - Automated content tagging

2. **Mobile Application**
   - React Native mobile app
   - Offline course access
   - Push notifications

3. **Advanced Analytics**
   - Predictive analytics
   - Learning path recommendations
   - Engagement heatmaps

4. **Live Classes**
   - WebRTC video streaming
   - Interactive whiteboard
   - Screen sharing

5. **Gamification**
   - Badges and achievements
   - Leaderboards
   - Points system

6. **Internationalization**
   - Multi-language support
   - RTL language support
   - Currency conversion

---

## 📞 SUPPORT & DOCUMENTATION

### Available Documentation
- ✅ AWS S3 Migration Guide
- ✅ Chunked Video Upload Documentation
- ✅ S3 Auto-Configuration Guide
- ✅ Project Analysis Document
- ✅ Authentication Fix Documentation
- ✅ Video Duration Fix Documentation

### Contact & Support
- **Email:** sample@lms.com
- **Project Repository:** GitHub (Harish222600/LMS-SELL)

---

## 🏆 PROJECT STRENGTHS

1. **Comprehensive Feature Set** - Full-featured LMS platform
2. **Modern Tech Stack** - Latest versions of popular frameworks
3. **Scalable Storage** - AWS S3 integration
4. **Real-Time Capabilities** - Socket.IO for live features
5. **Secure Architecture** - JWT, RBAC, content protection
6. **Payment Integration** - Production-ready Razorpay
7. **Professional UI/UX** - Classic academic design
8. **Docker Support** - Containerization ready
9. **Well-Documented** - Comprehensive migration docs
10. **Production-Ready** - Functional and feature-complete

---

**Document Version:** 1.0  
**Last Updated:** October 10, 2025  
**Project Status:** Production-Ready  
**Overall Rating:** ⭐⭐⭐⭐☆ (4/5)
