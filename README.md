# Nabeeh: AI-Based Attention Monitoring System for Students

![Nabeeh Logo](./frontend/GP2/front-end/public/nabeeh-logo.png)

## Overview

**Nabeeh** is an artificial intelligence-powered system designed to monitor and enhance student engagement in classrooms through automated video analysis. The system analyzes classroom recordings to detect student attention patterns using facial expression recognition and eye gaze tracking, providing educators with objective, data-driven insights to improve teaching strategies.

### Key Innovation
Unlike traditional real-time monitoring systems, Nabeeh processes **pre-recorded classroom videos post-session**, eliminating privacy concerns while still delivering meaningful engagement analytics.

---

## Features

### Core Capabilities

- **Emotion Recognition**: Fine-tuned EfficientNet-B0 model for binary classification (Attentive/Not Attentive)
  - Accuracy: 84% on validation set
  - Trained on child-focused datasets (EmoReact + Autistic Children Emotions)

- **Gaze Tracking**: OpenFace 2.2.0 for real-time eye gaze direction estimation
  - Detects forward-facing attention using gaze angle thresholds
  - No additional model training required

- **Multi-Modal Integration**: SVM classifier combines emotion and gaze signals
  - Final Engagement Classification Accuracy: 96%
  - Robust handling of individual component weaknesses

- **Visual Analytics**: Comprehensive reporting with
  - Overall engagement percentage (pie charts)
  - Engagement over time (smoothed line graphs)
  - Frame-by-frame analysis visualization

- **Teacher Dashboard**: Intuitive interface for
  - Video upload and processing
  - Real-time progress tracking
  - PDF report generation and download
  - Historical report archive

- **Administrator Dashboard**: Extended controls for
  - Teacher account management
  - Class creation and assignment
  - Centralized engagement analytics
  - Data storage and organization

---

## Technical Stack

### Backend
- **Language**: Python 3.8+
- **Framework**: FastAPI
- **ML/DL Libraries**:
  - PyTorch (model inference)
  - TensorFlow/Keras (training)
  - timm (EfficientNet implementation)
  - scikit-learn (SVM)
  - OpenCV (video processing)

### Frontend
- **Framework**: React 18.3.1 with Vite
- **Build Tool**: Vite 6.0.5
- **Styling**: CSS3
- **Dependencies**:
  - React Router DOM v7.1.5 (routing)
  - Axios v1.8.4 (HTTP requests)
  - Firebase v11.4.0 (real-time database)
  - jsPDF v3.0.1 (PDF generation)
  - Swiper v11.2.6 (UI components)

### Database
- **Firebase Realtime Database**: Cloud-hosted NoSQL
  - Hierarchical JSON structure
  - Real-time synchronization
  - Role-based access control

### AI/Computer Vision Tools
- **EfficientNet-B0**: Binary emotion classification
- **OpenFace 2.2.0**: Facial landmark and gaze tracking
- **ResNet-SSD (OpenCV)**: Face detection

---

## System Architecture

### Layered Pipe-and-Filter Architecture

```
Input Layer (Video Upload)
    ↓
Preprocessing Layer (Frame Extraction, Resizing, Normalization)
    ↓
Processing Layer (Emotion Detection + Gaze Tracking)
    ↓
Feature Integration Layer (SVM Engagement Prediction)
    ↓
Report Formatting Layer (PDF Generation, Chart Creation)
    ↓
Central Repository Layer (Firebase Database)
    ↓
Output Layer (Teacher & Admin Dashboards)
```

### Data Flow

1. **Video Upload**: Teacher uploads pre-recorded classroom video
2. **Frame Extraction**: OpenCV extracts frames at 5 FPS per detected face
3. **Face Detection**: ResNet-SSD identifies and crops facial regions
4. **Parallel Processing**:
   - EfficientNet predicts emotion (Attentive/Not Attentive)
   - OpenFace extracts gaze vectors (x, y angles)
5. **Feature Fusion**: SVM integrates emotion + gaze → Engagement Score
6. **Visualization**: Matplotlib generates charts (base64 encoded)
7. **Storage**: Only engagement percentage saved; raw frames deleted post-processing
8. **Report Generation**: PDF compiled with charts and metadata
9. **Dashboard Display**: Results shown in real-time; engagement stored in Firebase

---

## Getting Started

### Prerequisites

- **Python**: 3.8 or higher
- **Node.js**: 16 or higher
- **npm**: 8 or higher
- **OpenFace 2.2.0**: Pre-installed on system (Windows recommended: `C:\OpenFace\`)
- **PyTorch**: GPU support optional (CPU supported)

### Installation

#### 1. Clone Repository
```bash
git clone https://github.com/your-org/Nabeeh.git
cd Nabeeh
```

#### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create Python virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt
```

#### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend/GP2/front-end

# Install Node dependencies
npm install
```

### Running the Application

#### Start FastAPI Backend

```bash
# From backend directory with activated virtual environment
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at: `http://localhost:8000`

#### Start React Frontend

```bash
# From frontend/GP2/front-end directory
npm run dev
```

Frontend will be available at: `http://localhost:5173`

---

## Architecture Details

### Database Schema

**Firebase Realtime Database Structure:**

```json
{
  "users": {
    "userId123": {
      "name": "Teacher Name",
      "username": "teacher123",
      "email": "teacher@example.com",
      "role": "teacher"
    }
  },
  "classes": {
    "classId456": {
      "created_at": "2025-04-22T09:30:00Z",
      "grade": "4th",
      "subject": "Math",
      "teacherId": "userId123"
    }
  },
  "sessions": {
    "sessionId789": {
      "engagement_level": 82.35,
      "grade": "4th",
      "subject": "Math",
      "teacherId": "userId123",
      "timestamp": "2025-04-22T09:30:00Z"
    }
  }
}
```

### Model Specifications

#### EfficientNet-B0 for Emotion Recognition
- **Architecture**: Compound scaled CNN with MBConv blocks
- **Input Size**: 224×224 pixels
- **Output**: Binary classification (Attentive/Not Attentive)
- **Parameters**: ~5.3 million
- **Training**: Fine-tuned on merged EmoReact + Autistic Children Emotions datasets
- **Optimization**: Adam optimizer (lr=0.0001)
- **Regularization**: Dropout (0.3)

#### Support Vector Machine (SVM) for Engagement Classification
- **Inputs**: Gaze angles (x, y) + Emotion confidence
- **Output**: Binary engagement prediction
- **Accuracy**: 96% on validation set
- **Purpose**: Integrates weak individual models for robust final classification

---

## Datasets

### EmoReact Dataset
- **Source**: Multimodal emotion dataset for children (4-14 years)
- **Size**: 1,102 videos
- **Annotations**: 17 affective states (6 basic emotions + neutral + valence + 9 complex emotions)
- **Duration**: 3-21 seconds per video (avg. ~5 seconds)
- **Subjects**: 63 children (32 female, 31 male, ethnically diverse)
- **Features**: OpenFace visual features + COVAREP audio features

### Autistic Children Emotions Dataset
- **Source**: Static facial expressions of children in therapeutic settings
- **Size**: 580 images
- **Age Range**: 6-14 years
- **Labels**: 6 basic emotions (joy, sadness, anger, fear, surprise, neutral)
- **Preprocessing**: Resized to 224×224, normalized
- **Diversity**: Multiple ethnicities and facial variations

### Why These Datasets?
✅ Child-focused (matching target age group)
✅ Diverse emotional representation
✅ Publicly available with academic licensing
✅ Complementary modalities (video + static)
✅ Cultural and ethnic diversity

---

## User Interfaces

### Teacher Dashboard
- **Upload Video**: Select classroom recording and metadata
- **View Results**: Real-time engagement metrics
- **Download Report**: PDF with charts and analysis
- **Report History**: Archive of previous analyses
- **Account Management**: Personal profile settings

### Administrator Dashboard
- **User Management**: Create/edit/delete teacher accounts
- **Class Management**: Create courses and assign teachers
- **Data Storage**: Organized by year and month
- **System Reports**: Platform-wide engagement analytics
- **Account Settings**: Admin profile management

---

## Performance Metrics

### System Component Evaluation

| Component | Model | Accuracy | Notes |
|-----------|-------|----------|-------|
| Face Detection | ResNet-SSD | Variable (53%-110%) | Depends on video quality |
| Emotion Recognition | EfficientNet-B0 | 84% | Binary classification |
| Gaze Tracking | OpenFace | 34%-90% | Rule-based, depends on pose |
| Engagement Classification | SVM | 96% | Multi-modal fusion |

### Test Results (on 3 classroom videos)

| Video | Duration | Faces | Frames Extracted | Gaze Engagement | Emotion Engagement | Final Engagement |
|-------|----------|-------|------------------|------------------|--------------------|------------------|
| 1 | 6 sec | 6 | 20 | 85% | 10% | 80% |
| 2 | 11 sec | 7 | 84 | 90% | 89% | 94.05% |
| 3 | 9 sec | 4 | 19 | 34% | 5% | 31.58% |

---

## Key Findings & Limitations

### Strengths

✅ **Non-Intrusive**: Post-session analysis preserves privacy
✅ **Objective Metrics**: Data-driven rather than subjective observation
✅ **Multi-Modal**: Combines facial and gaze information
✅ **Scalable**: Works across different classroom settings
✅ **Child-Focused**: Trained on child-specific datasets
✅ **User-Friendly**: Intuitive dashboards for teachers and admins

### Identified Limitations

⚠️ **Video Quality Dependent**: Face detection varies with lighting and camera angle
⚠️ **Post-Session Analysis**: No real-time feedback during class
⚠️ **Dataset Mismatch**: External datasets may not reflect local cultural contexts
⚠️ **Individual Variation**: Different students express attention differently
⚠️ **Gaze Threshold Fixed**: Binary threshold (±0.2 radians) may not suit all contexts

### Future Improvements

1. **Model Optimization**: Quantization and cloud processing for reduced resource consumption
2. **Classroom Deployment**: Collect localized video data for fine-tuning
3. **Hybrid Feedback**: Basic live cues during session + full analysis post-session
4. **Student Dashboard**: Self-awareness tool for student engagement tracking
5. **Localized Training**: Fine-tune on recordings from actual classrooms
6. **Cultural Adaptation**: Account for regional emotional expression variations

---

## Privacy & Security

### Data Protection Measures

- **No Continuous Monitoring**: Analysis occurs only on uploaded videos
- **Automatic Cleanup**: Raw videos and extracted frames deleted post-processing
- **Engagement-Only Storage**: Only engagement percentages stored in database
- **Firebase Security Rules**: Role-based access control
- **No Facial Recognition**: System detects attention, not identity
- **Teacher Access Control**: Teachers only see their own class data

### Ethical Considerations

✅ Post-session processing (not real-time surveillance)
✅ Data minimalism (metrics only, no raw images)
✅ Educational benefit focus
✅ Privacy-by-design architecture
✅ Transparent student/parent notification recommended

---

## File Structure

```
Nabeeh/
├── backend/
│   ├── main.py                          # FastAPI application
│   ├── engagement_pipeline_img.py       # Core ML pipeline
│   ├── deploy.prototxt                  # Face detection model config
│   ├── res10_300x300_ssd_iter_*.caffemodel  # Face detection weights
│   ├── attention_classifier_epoch5.pth  # Fine-tuned EfficientNet weights
│   ├── svm_engagement.pkl               # Trained SVM model
│   ├── videos/                          # Uploaded videos (temp)
│   ├── frames/                          # Extracted frames (temp)
│   ├── b0_output/                       # EfficientNet outputs
│   └── of_output/                       # OpenFace outputs
├── frontend/
│   └── GP2/front-end/
│       ├── src/
│       ├── public/
│       ├── package.json
│       ├── vite.config.js
│       └── eslint.config.js
├── README.md                            # This file
└── How To run Nabeeh.txt                # Quick start guide
```

---

## Troubleshooting

### Common Issues

**Issue**: FastAPI not starting on port 8000
```bash
# Solution: Change port
uvicorn main:app --reload --host 0.0.0.0 --port 8001
```

**Issue**: OpenFace not found
```bash
# Ensure OpenFace is installed at: C:\OpenFace\OpenFace_2.2.0_win_x64
# Update path in engagement_pipeline_img.py line 90 if different
```

**Issue**: React app can't connect to backend
```bash
# Verify backend is running: http://localhost:8000
# Check CORS settings in main.py
```

**Issue**: Out of memory during video processing
```bash
# Reduce frame extraction rate
# Modify frame_interval in engagement_pipeline_img.py line 30
```

---

## Contributing

### Development Workflow

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes and test locally
3. Create pull request with clear description
4. Ensure tests pass before merging

### Code Standards

- **Python**: PEP 8 compliance
- **JavaScript**: ESLint configuration included
- **Commits**: Clear, descriptive messages

---

## Team

**Developed by:**
- Bayan Aljaber (443007697)
- Rand Alsabi (443007650)
- Kholoud Alterad (443007638)
- Razan Alharbi (443007655)

**Supervised by:** Dr. Abeer Alarfaj

**Institution:** Princess Nourah bint Abdulrahman University (PNU), College of Computer Sciences and Information, Riyadh, KSA

**Year:** 2024

---

## References

Key papers and resources:

1. Tan et al. (2019) - EfficientNet: Rethinking model scaling for CNNs
2. Baltrusaitis et al. (2016) - OpenFace: Facial behavior analysis toolkit
3. Nojavanasghari et al. (2016) - EmoReact: Multimodal emotion recognition dataset
4. Ekman & Friesen (1978) - Facial Action Coding System (FACS)
5. Schölkopf & Smola (2002) - Support Vector Machines for Learning

Complete references available in the project documentation PDF.

---

## License

This project is developed as a graduation project at Princess Nourah bint Abdulrahman University. For educational and research purposes only.

---

## Support

For questions or issues:
1. Check the troubleshooting section above
2. Review the detailed project documentation PDF
3. Contact the development team through the system's "Contact Us" page

---

**Last Updated:** March 3, 2026
**Version:** 1.0.0
