export interface StudentProject {
  id: number;
  studentName: string;
  projectTitle: string;
  description: string;
  longDescription: string;
  techStack: string[];
  category: 'Healthcare' | 'Fintech' | 'Sustainability' | 'Mobility' | 'Education' | 'Productivity' | 'Entertainment' | 'Social';
  image: string;
  githubLink?: string;
  demoLink?: string;
  dateSubmitted: string;
  featured?: boolean;
}

const projects: StudentProject[] = [
  {
    id: 1,
    studentName: "Alex Chen",
    projectTitle: "Real-Time Stock Market Prediction",
    description: "ML model predicting stock prices using sentiment analysis and historical data with 87% accuracy",
    longDescription: "Developed a comprehensive machine learning system that combines sentiment analysis from social media and news sources with historical stock market data. The model uses LSTM neural networks to predict stock price movements with 87% accuracy. Features include real-time data processing, interactive visualizations, and backtesting capabilities. Deployed on AWS with automated daily retraining.",
    techStack: ["Python", "TensorFlow", "AWS", "Pandas", "Flask"],
    category: "Fintech",
    image: "/images/projects/placeholder-1.jpg",
    githubLink: "https://github.com",
    demoLink: "https://demo.com",
    dateSubmitted: "2025-03",
    featured: true
  },
  {
    id: 2,
    studentName: "Sarah Martinez",
    projectTitle: "Medical Image Classification System",
    description: "Deep learning model for detecting pneumonia from chest X-rays with 94% accuracy using CNNs",
    longDescription: "Built a convolutional neural network to classify chest X-ray images for pneumonia detection. The model was trained on 5,000+ medical images and achieves 94% accuracy. Implemented data augmentation, transfer learning with ResNet50, and model interpretability using Grad-CAM visualizations. Developed a web interface for radiologists to upload and analyze images in real-time.",
    techStack: ["Python", "PyTorch", "React", "Docker", "FastAPI"],
    category: "Healthcare",
    image: "/images/projects/placeholder-2.jpg",
    githubLink: "https://github.com",
    dateSubmitted: "2025-02",
    featured: true
  },
  {
    id: 3,
    studentName: "Michael Johnson",
    projectTitle: "Sentiment Analysis Dashboard",
    description: "NLP pipeline analyzing social media sentiment for brand monitoring with interactive visualizations",
    longDescription: "Created an end-to-end NLP pipeline that collects, processes, and analyzes social media data for brand sentiment monitoring. Uses BERT for sentiment classification and LDA for topic modeling. The dashboard provides real-time insights with interactive charts, word clouds, and trend analysis. Processes over 10,000 tweets per day with automated reporting.",
    techStack: ["Python", "BERT", "MongoDB", "D3.js", "Node.js"],
    category: "Productivity",
    image: "/images/projects/placeholder-3.jpg",
    githubLink: "https://github.com",
    demoLink: "https://demo.com",
    dateSubmitted: "2025-01",
    featured: false
  },
  {
    id: 4,
    studentName: "Emily Rodriguez",
    projectTitle: "Climate Data Visualization Platform",
    description: "Interactive platform visualizing 50 years of global climate data with predictive modeling",
    longDescription: "Developed a comprehensive data visualization platform showcasing historical climate data from 1970-2020. Features interactive maps, time-series analysis, and predictive models for temperature and sea-level rise. Built with React and D3.js for smooth animations and responsive design. Includes educational resources and citations from peer-reviewed climate research.",
    techStack: ["React", "D3.js", "Python", "PostgreSQL", "Vercel"],
    category: "Sustainability",
    image: "/images/projects/placeholder-4.jpg",
    githubLink: "https://github.com",
    demoLink: "https://demo.com",
    dateSubmitted: "2024-12",
    featured: false
  },
  {
    id: 5,
    studentName: "David Kim",
    projectTitle: "Automated Resume Screening Tool",
    description: "NLP-based system matching candidate resumes to job descriptions with 91% accuracy",
    longDescription: "Built an intelligent resume screening system that uses natural language processing to match candidate qualifications with job requirements. Implements custom word embeddings, skill extraction, and similarity scoring algorithms. The system reduces hiring team review time by 70% while maintaining high accuracy. Includes bias detection and mitigation features to ensure fair candidate evaluation.",
    techStack: ["Python", "spaCy", "scikit-learn", "Flask", "React"],
    category: "Productivity",
    image: "/images/projects/placeholder-5.jpg",
    githubLink: "https://github.com",
    dateSubmitted: "2024-11",
    featured: false
  },
  {
    id: 6,
    studentName: "Jessica Thompson",
    projectTitle: "E-Commerce Recommendation Engine",
    description: "Collaborative filtering system providing personalized product recommendations with 3x click-through rate",
    longDescription: "Developed a hybrid recommendation system combining collaborative filtering and content-based approaches for an e-commerce platform. Uses matrix factorization and deep learning to generate personalized product suggestions. A/B testing showed a 3x improvement in click-through rates and 45% increase in average order value. Handles 100,000+ products and millions of user interactions.",
    techStack: ["Python", "TensorFlow", "Redis", "FastAPI", "React"],
    category: "Fintech",
    image: "/images/projects/placeholder-6.jpg",
    demoLink: "https://demo.com",
    dateSubmitted: "2024-10",
    featured: true
  },
  {
    id: 7,
    studentName: "Ryan Patel",
    projectTitle: "Real-Time Object Detection for Autonomous Vehicles",
    description: "YOLO-based detection system processing 30 FPS for self-driving car applications",
    longDescription: "Implemented a real-time object detection system optimized for autonomous vehicle applications. Uses YOLOv8 architecture with custom training on driving datasets including pedestrians, vehicles, traffic signs, and road conditions. Achieves 30 FPS processing on edge devices with 92% mAP. Includes distance estimation and trajectory prediction for detected objects.",
    techStack: ["Python", "PyTorch", "OpenCV", "CUDA", "ROS"],
    category: "Mobility",
    image: "/images/projects/placeholder-7.jpg",
    githubLink: "https://github.com",
    dateSubmitted: "2024-09",
    featured: false
  },
  {
    id: 8,
    studentName: "Amanda Lee",
    projectTitle: "Customer Churn Prediction Model",
    description: "Ensemble ML model predicting customer churn with 89% accuracy for subscription businesses",
    longDescription: "Built an ensemble machine learning model combining Random Forest, XGBoost, and Neural Networks to predict customer churn for subscription-based businesses. Feature engineering included RFM analysis, customer lifetime value, and engagement metrics. Deployed model provides churn probability scores and actionable insights for retention strategies, resulting in 25% reduction in churn rate.",
    techStack: ["Python", "XGBoost", "scikit-learn", "Streamlit", "AWS"],
    category: "Fintech",
    image: "/images/projects/placeholder-8.jpg",
    githubLink: "https://github.com",
    demoLink: "https://demo.com",
    dateSubmitted: "2024-08",
    featured: false
  },
  {
    id: 9,
    studentName: "Brandon Wu",
    projectTitle: "Full-Stack Data Science Platform",
    description: "Collaborative platform for data scientists with notebook sharing, model deployment, and team features",
    longDescription: "Developed a comprehensive web platform for data science collaboration. Features include Jupyter notebook sharing, dataset management, model versioning, and automated ML pipelines. Built with microservices architecture for scalability. Supports team workspaces, commenting, and real-time collaboration. Integrates with popular ML frameworks and cloud providers for seamless model deployment.",
    techStack: ["React", "Django", "Docker", "Kubernetes", "PostgreSQL"],
    category: "Productivity",
    image: "/images/projects/placeholder-9.jpg",
    githubLink: "https://github.com",
    demoLink: "https://demo.com",
    dateSubmitted: "2024-07",
    featured: false
  },
  {
    id: 10,
    studentName: "Olivia Garcia",
    projectTitle: "Financial Fraud Detection System",
    description: "Anomaly detection model identifying fraudulent transactions with 96% precision and minimal false positives",
    longDescription: "Created a sophisticated fraud detection system using unsupervised anomaly detection and supervised classification techniques. Processes millions of transactions in real-time using Apache Kafka and Spark. Implements SMOTE for handling imbalanced data and achieves 96% precision with only 0.1% false positive rate. Features include transaction risk scoring, pattern analysis, and automated alerting system.",
    techStack: ["Python", "Apache Spark", "Kafka", "scikit-learn", "Elasticsearch"],
    category: "Fintech",
    image: "/images/projects/placeholder-10.jpg",
    githubLink: "https://github.com",
    dateSubmitted: "2024-06",
    featured: false
  },
  {
    id: 11,
    studentName: "Chris Anderson",
    projectTitle: "Natural Language Chatbot for Healthcare",
    description: "Conversational AI providing symptom assessment and health information using GPT and medical databases",
    longDescription: "Built an intelligent healthcare chatbot that assists users with symptom assessment and provides reliable health information. Uses fine-tuned GPT models on medical literature and integrates with verified health databases. Implements context-aware conversation flow, multi-turn dialogue management, and appropriate medical disclaimers. Includes sentiment analysis to detect urgent cases and recommendation for professional consultation.",
    techStack: ["Python", "OpenAI GPT", "LangChain", "FastAPI", "React"],
    category: "Healthcare",
    image: "/images/projects/placeholder-11.jpg",
    demoLink: "https://demo.com",
    dateSubmitted: "2024-05",
    featured: false
  },
  {
    id: 12,
    studentName: "Rachel Kim",
    projectTitle: "Sports Analytics Dashboard",
    description: "Interactive platform analyzing player performance and team statistics with predictive game outcome modeling",
    longDescription: "Developed a comprehensive sports analytics dashboard that aggregates data from multiple sources to provide insights on player performance, team dynamics, and game predictions. Features advanced statistics visualization, player comparison tools, and machine learning models for predicting game outcomes. Built with real-time data updates and supports multiple sports including basketball, football, and soccer.",
    techStack: ["React", "Python", "Plotly", "PostgreSQL", "Next.js"],
    category: "Entertainment",
    image: "/images/projects/placeholder-12.jpg",
    githubLink: "https://github.com",
    demoLink: "https://demo.com",
    dateSubmitted: "2024-04",
    featured: false
  }
];

// Sort projects by date (newest first) and featured status
export const sortedProjects = [...projects].sort((a, b) => {
  // Featured projects first
  if (a.featured && !b.featured) return -1;
  if (!a.featured && b.featured) return 1;
  
  // Then by date
  return new Date(b.dateSubmitted).getTime() - new Date(a.dateSubmitted).getTime();
});

export const categories = Array.from(new Set(projects.map(p => p.category)));
export const allTechStack = Array.from(new Set(projects.flatMap(p => p.techStack))).sort();

