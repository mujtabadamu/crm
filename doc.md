CHAPTER FOUR
SYSTEM IMPLEMENTATION, TESTING AND RESULTS
4.1 Introduction
This chapter presents the implementation, testing, and results of the Customer Relationship
Management (CRM) system developed for San Hussein Mall, Jimeta, Yola, Adamawa State. The
implementation was based on the requirements and system design presented in Chapter Three.
The system was developed as a web-based application using the LAMP technology stack. PHP
was used for application development and business logic, MySQL was used for database
management, while HTML5, CSS3, and JavaScript were used to develop the user interface. The
system provides facilities for customer registration, customer search, transaction recording,
loyalty point management, promotion management, reporting, and user access control.
The chapter also presents the major system interfaces, functional testing, test cases, and
discussion of the results obtained from testing the developed system.
4.2 System Implementation
System implementation involved converting the design specifications into a functional software
application. The implementation followed the three-tier architecture specified in Chapter Three,
consisting of the presentation layer, application layer, and data layer.
4.2.1 Presentation Layer
The presentation layer provides the interface through which users interact with the CRM system.
HTML5 and CSS3 were used to structure and style the interface, while JavaScript was used to
provide client-side interaction and validation.
The interface was designed according to the principles identified in Chapter Three, including
simplicity, consistency, efficiency, feedback, and accessibility. Large buttons and clearly
labelled input fields were incorporated to make the system suitable for cashier operations.
4.2.2 Application Layer
The application layer contains the business logic of the CRM system. PHP was used to process
user requests, authenticate users, manage customer information, process transactions, calculate
loyalty points, manage promotions, and generate reports.
The application layer also provides communication between the user interface and the MySQL
database.
4.2.3 Data Layer
MySQL was used as the database management system. The database was designed using the
tables identified in Chapter Three:
1. Users
2. Customers
3. Products
4. Transactions
5. Transaction_details
6. Promotions
7. Loyalty_redemption
8. Audit_log
The database structure enables customer information, transactions, loyalty information,
promotions, and system activities to be stored in an organized manner.
4.3 Description of the Implemented System
The developed CRM system consists of several functional modules designed to address the
problems identified in the existing system.
4.3.1 Login and Authentication Module
The login module provides controlled access to the system. Users are required to provide their
username and password before accessing the application.
The system supports different user roles, particularly Administrator and Cashier. The
Administrator has access to system management functions, while the Cashier is provided with
functions required for customer and transaction management.
Password hashing and session management are incorporated as part of the security design.
4.3.2 Customer Management Module
The customer management module provides a centralized location for registering and managing
customer information.
The module captures important customer details such as:
• First name
• Last name
• Phone number
• Email address
• Address
• Loyalty points
• Total amount spent
The customer search function enables staff to locate an existing customer using relevant
information, particularly the customer's phone number.
This functionality addresses the problem of fragmented customer information identified in the
existing system.
4.3.3 Product Management Module
The product management module enables authorized users to add, update, search, and manage
product information.
The major product information includes:
• Product name
• Category
• Price
• Stock quantity
The module provides a structured method for maintaining product records and supports
transaction processing.
4.3.4 Transaction Management Module
The transaction module enables staff to record sales and associate transactions with registered
customers.
During a transaction, the cashier can search for the customer, select products, specify quantities,
and record the sale. The system calculates the transaction amount and records the transaction
against the relevant customer.
Linking transactions to customer profiles makes it possible to maintain customer purchase
history.
4.3.5 Loyalty Point Management Module
The loyalty module automates the calculation and management of customer loyalty points.
Based on the requirement specified in Chapter Three, the system awards:
1 loyalty point for every ₦100 spent.
The system records points earned and maintains the customer's current point balance. Where
points are redeemed, the redemption is recorded in the loyalty redemption table.
This replaces the paper-based stamp card approach used in the existing system.
4.3.6 Promotion Management Module
The promotion module allows authorized users to create and manage promotional activities.
Promotion records include:
• Promotion title
• Discount type
• Discount value
• Start date
• End date
This functionality provides a foundation for more organized promotional management and
enables the business to manage promotional activities through the CRM system.
4.3.7 Reporting Module
The reporting module provides management with information that can support decision-making.
The system provides reports such as:
• Sales summary
• Top customers
• Product performance
• Loyalty summary
The sales summary provides information relating to transactions and total sales. The top
customer report helps identify customers according to their spending. The product performance
report provides information about product sales, while the loyalty report provides information
about points earned and redeemed.
4.3.8 User Management Module
The user management module allows administrators to manage authorized users of the system.
The module supports role-based access control, ensuring that users only access functions
appropriate to their responsibilities.
4.3.9 Audit Log Module
The audit log records important activities performed within the system.
The recorded information includes the user, action performed, date/time, and other relevant
activity information. The audit trail supports accountability and improves the ability of
management to monitor system activities.
4.4 System Interfaces
The developed system contains a number of interfaces through which users perform different
activities.
4.4.1 Login Interface
The login interface provides username and password fields. A valid user must authenticate
before gaining access to the system.
Figure 4.1: Login Interface
[Insert screenshot of the implemented login page here]
4.4.2 Dashboard Interface
The dashboard provides an overview of important system information. It serves as the main
navigation point for authorized users.
Figure 4.2: System Dashboard
[Insert screenshot of the implemented dashboard here]
4.4.3 Customer Registration Interface
The customer registration interface provides fields for entering customer details such as name,
phone number, email, and address.
Figure 4.3: Customer Registration Interface
[Insert screenshot of the customer registration page here]
4.4.4 Customer Search Interface
The customer search interface enables staff to locate existing customers. The phone number
search functionality was incorporated based on the feedback identified during the prototyping
process.
Figure 4.4: Customer Search Interface
[Insert screenshot of the customer search page here]
4.4.5 Transaction Interface
The transaction interface allows the cashier to select a customer, add products, specify quantities,
apply available promotions, and record payment information.
Figure 4.5: Sales Transaction Interface
[Insert screenshot of the transaction page here]
4.4.6 Loyalty Management Interface
The loyalty interface displays the customer's loyalty point balance and provides functionality for
recording point redemption.
Figure 4.6: Loyalty Management Interface
[Insert screenshot of the loyalty management page here]
4.4.7 Promotion Management Interface
The promotion interface allows authorized users to create and manage promotions.
Figure 4.7: Promotion Management Interface
[Insert screenshot of the promotion management page here]
4.4.8 Reporting Interface
The reporting interface provides management with summarized information about sales,
customers, products, and loyalty activities.
Figure 4.8: Reporting Interface
[Insert screenshot of the reporting page here]
4.5 System Testing
Testing was conducted to determine whether the implemented system satisfied the functional
requirements identified during system analysis.
The testing focused on:
• User authentication
• Customer registration
• Customer search
• Product management
• Transaction recording
• Loyalty point calculation
• Loyalty point redemption
• Promotion management
• Report generation
• Role-based access
4.6 Test Cases
S/N Test Function Test Input/Action Expected Result
1 User Login
Enter valid username and
password User is granted access
2 Invalid Login Enter incorrect login details Access is denied
3
Customer
Registration
Enter valid customer
information
Customer record is created
4 Customer Search Enter registered phone number Customer record is displayed
Product
5
Registration Enter valid product details Product is stored
6 Sales Transaction Select customer and products Transaction is successfully
recorded
7 Loyalty
Calculation Record an eligible purchase Loyalty points are automatically
calculated
8 Point Redemption Enter valid redemption details
Points are deducted and
redemption recorded
S/N Test Function Test Input/Action Expected Result
9 Promotion Create a valid promotion Promotion is stored
10 Sales Report Request sales report
Relevant sales information is
displayed
11 Customer Report Request customer information Customer records are displayed
12 Access Control Cashier attempts restricted
admin function
Unauthorized access is
prevented
4.7 Results of System Testing
The testing demonstrated that the major functional components of the CRM system were capable
of performing their intended operations.
The login functionality provided controlled access to the system. Customer registration and
search provided a centralized mechanism for managing customer information. Transaction
recording enabled sales to be linked to customer profiles, thereby providing the basis for
maintaining customer purchase history.
The loyalty module automated the calculation of points according to the specified business rule
of one point for every ₦100 spent. The system also provided functionality for tracking redeemed
points.
The reporting module provided structured information that can assist management in reviewing
sales, customer activity, product performance, and loyalty information.
The role-based access mechanism provided a means of separating administrative functions from
cashier operations.
4.8 Comparison Between Existing and Proposed System
The developed CRM system provides improvements over the existing manual customer
management process.
Area Existing System Proposed CRM System
Customer
Information
Paper receipts, cards and
notebooks Centralized digital database
Area Existing System Proposed CRM System
Customer Search Manual searching Purchase History Difficult to retrieve Loyalty
Digital search
Linked to customer profile
Management Paper stamp cards Automated points
Promotions
Posters and verbal
announcements Digital promotion management
Reporting Basic sales totals Sales, customer, product and
loyalty reports
Data Security Paper records vulnerable to
damage/loss
Database access control and audit
trail
Decision Making Mainly intuition-based Supported by stored customer and
sales data
4.9 Discussion of Results
The implementation and testing of the CRM system indicate that the proposed solution addresses
several of the challenges identified in the existing system.
The centralized customer database addresses the problem of fragmented customer information.
Staff can store and retrieve customer information without depending entirely on paper records.
The transaction management functionality provides a link between customers and their
purchases. This creates a structured purchase history that can support customer understanding
and future relationship management.
The automated loyalty point mechanism also improves upon the existing paper-based stamp card
system. Instead of depending on physical cards that may be lost, customer loyalty information
can be maintained electronically.
The reporting functionality provides management with information that was previously
unavailable through the manual system. Such information can support more informed decisions
concerning customers, sales, products, and loyalty activities.
Overall, the developed system is aligned with the requirements identified in Chapter Three and
provides a practical foundation for customer relationship management within the SME retail
environment.
4.10 Summary
This chapter presented the implementation and testing of the CRM system developed for San
Hussein Mall. The implementation was based on the three-tier architecture and LAMP
technology stack specified in Chapter Three.
The chapter described the major system modules, including authentication, customer
management, product management, transaction management, loyalty management, promotion
management, reporting, user management, and audit logging.
Functional testing was also presented, demonstrating how the system can address the major
operational problems identified in the existing system.
CHAPTER FIVE
SUMMARY, CONCLUSION AND RECOMMENDATIONS
5.1 Introduction
This chapter presents the summary of the study, conclusion, recommendations, contribution of
the study, limitations, and suggestions for further studies.
5.2 Summary of the Study
The study focused on the development of a Customer Relationship Management (CRM) system
for Small and Medium Enterprises, using San Hussein Mall, Jimeta, Yola, Adamawa State, as
the case study.
The study was motivated by the challenges associated with the existing manual approach to
customer management at the mall. These challenges included fragmented customer records,
inefficient operations, ineffective marketing, poor customer retention, limited customer insight,
and data security risks.
Chapter One established the background of the study, statement of the problem, aim and
objectives, significance, scope and limitations, and definition of key terms.
Chapter Two reviewed relevant literature concerning CRM, SMEs, CRM functionalities, CRM
theories, related technologies, and empirical studies. The literature review established that CRM
can contribute to customer satisfaction, loyalty, and business performance, while also
highlighting challenges faced by SMEs such as cost, infrastructure, technical expertise, and
usability.
Chapter Three presented the system analysis and design. Data collection involved interviews,
observation, and document review. The Prototyping Model was selected as the system
development approach. The chapter also analyzed the existing system and identified the
requirements of the proposed CRM system.
The proposed system was designed using a three-tier architecture comprising presentation,
application, and data layers. PHP, MySQL, HTML5, CSS3, and JavaScript were selected as the
major technologies.
Chapter Four presented the implementation and testing of the system. The major modules
implemented include customer management, transaction management, loyalty management,
promotion management, reporting, authentication, user management, and audit logging.
5.3 Achievement of the Objectives
The study objectives were considered in the implementation of the developed CRM system.
Objective One
The first objective was to analyze the existing customer management processes at San Hussein
Mall and identify requirements and challenges.
This was addressed through interviews, observation, and document review. The analysis
identified challenges such as fragmented customer information, paper-based loyalty
management, inefficient searching, limited reporting, and lack of customer insight.
Objective Two
The second objective was to design a user-friendly CRM system for centralized management of
customer information, sales records, and interactions.
This objective was addressed through the design of a three-tier web-based CRM system with
centralized database storage and user-friendly interfaces.
Objective Three
The third objective was to implement a functional CRM system with customer management,
transaction tracking, and promotional communication capabilities.
The system design and implementation incorporated customer management, transaction
recording, loyalty management, promotion management, and reporting modules.
Objective Four
The fourth objective was to test the developed system to ensure its functionality, reliability, and
usability.
Functional testing was conducted on the major modules of the system. The test cases
demonstrated that the major functions were designed to perform according to their specified
requirements.
5.4 Conclusion
Based on the analysis, design, implementation, and testing presented in this study, the developed
CRM system provides a practical technology-based approach to addressing customer
management challenges within the SME retail environment.
The system provides a centralized platform for managing customer information, recording
customer-linked transactions, managing loyalty points, handling promotions, and generating
reports. These capabilities provide a structured alternative to fragmented paper-based customer
management practices.
The study also demonstrates that a CRM solution for an SME does not necessarily require the
complexity of large enterprise CRM platforms. A system designed around the specific
operational requirements of the organization can provide relevant functionality while remaining
relatively simple and user-friendly.
The developed system therefore provides a suitable foundation for improving customer
information management and supporting customer relationship activities at San Hussein Mall.
5.5 Recommendations
Based on the findings and development of the CRM system, the following recommendations are
made:
1. 2. 3. 4. 5. Adoption of the CRM System: San Hussein Mall should consider adopting the
developed CRM system for structured customer information and transaction
management.
Staff Training: Staff who will use the system should receive adequate training before
deployment to ensure effective utilization.
Regular Data Backup: The organization should maintain regular database backups to
protect customer and transaction information against data loss.
Security Maintenance: User passwords, access privileges, and audit logs should be
regularly reviewed to maintain system security.
System Maintenance: The system should be regularly maintained and updated to
address technical issues and changing operational requirements.
6. 7. 8. Customer Data Quality: Staff should ensure that customer information entered into the
system is accurate and regularly updated.
Future Integration: The system may be integrated with other business systems in the
future where such integration becomes necessary.
Improved Infrastructure: Reliable electricity supply, local network infrastructure, and
appropriate hardware should be provided to support effective system operation.
5.6 Contribution of the Study
The study contributes to the application of information management technology within the SME
retail sector.
The major contribution is the development of a CRM solution designed around the operational
requirements of a retail SME in Jimeta, Yola. The study also provides an example of how
relatively simple web-based technologies can be used to address practical customer management
challenges.
The project can serve as a reference for future researchers and developers interested in CRM
implementation within SMEs, particularly in environments where cost, infrastructure, usability,
and technical expertise are important considerations.
5.7 Limitations of the Developed System
The developed system focuses on foundational CRM requirements and therefore does not
include some advanced enterprise-level capabilities.
The system does not cover:
• Advanced predictive analytics
• Full ERP integration
• Fully automated marketing suites
• Dedicated mobile application development
• Advanced artificial intelligence-based customer prediction
These areas were outside the scope established for the study.
5.8 Suggestions for Further Studies
Future studies and system improvements may consider the following areas:
1. 2. 3. 4. Development of a dedicated Android and iOS mobile application.
Integration of advanced customer analytics and visualization.
Integration with accounting and inventory management systems.
Development of automated SMS and email marketing functionality.
5. 6. 7. 8. Integration of online payment platforms.
Introduction of artificial intelligence for customer behavior prediction.
Development of cloud-based deployment for multi-branch access.
Implementation of advanced customer segmentation and personalized marketing.
5.9 Final Summary
The project successfully addressed the need for a structured CRM solution for the selected SME
case study. The developed system provides core facilities for customer management, transaction
tracking, loyalty management, promotion management, and reporting.
The system design was guided by the identified operational requirements and developed using a
web-based architecture with PHP and MySQL. Testing focused on the major functional
requirements and provided a basis for evaluating the system.
The study concludes that a simple, affordable, user-oriented CRM system can provide a practical
foundation for improving customer relationship management within an SME retail environment
such as San Hussein Mall.