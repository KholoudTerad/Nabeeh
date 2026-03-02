# ============================
# 📁 engagement_pipeline2.py
# ============================

import os
import cv2
import torch
import timm
import joblib
import pandas as pd
from PIL import Image
from io import BytesIO
from torchvision import transforms
import matplotlib.pyplot as plt
import base64

def run_engagement_pipeline(video_path):
    # === Fixed Paths ===
    base_dir = r"C:\Users\pc\Downloads\Nabeeh\gp2_of_b0"
    frames_dir = os.path.join(base_dir, "frames")
    b0_output_dir = os.path.join(base_dir, "b0_output")
    openface_output_dir = os.path.join(base_dir, "of_output")
    os.makedirs(frames_dir, exist_ok=True)
    os.makedirs(b0_output_dir, exist_ok=True)
    os.makedirs(openface_output_dir, exist_ok=True)

    # === Extract face frames ===
    cap = cv2.VideoCapture(video_path)
    fps = int(cap.get(cv2.CAP_PROP_FPS))
    frame_interval =fps
    face_net = cv2.dnn.readNetFromCaffe("deploy.prototxt", "res10_300x300_ssd_iter_140000.caffemodel")
    frame_count, saved_count = 0, 0

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        if frame_count % frame_interval == 0:
            h, w = frame.shape[:2]
            blob = cv2.dnn.blobFromImage(frame, 1.0, (300, 300), (104.0, 177.0, 123.0))
            face_net.setInput(blob)
            detections = face_net.forward()
            for i in range(detections.shape[2]):
                confidence = detections[0, 0, i, 2]
                if confidence > 0.6:
                    box = detections[0, 0, i, 3:7] * [w, h, w, h]
                    (x1, y1, x2, y2) = box.astype("int")
                    face = frame[y1:y2, x1:x2]
                    if face.size > 0:
                        filename = f"frame_{frame_count//fps:03d}_face_{i}.jpg"
                        cv2.imwrite(os.path.join(frames_dir, filename), face)
                        saved_count += 1
        frame_count += 1
    cap.release()

    # === Run EfficientNet-B0 ===
    model_path = os.path.join(base_dir, "attention_classifier_epoch5.pth")
    model = timm.create_model("efficientnet_b0", pretrained=False)
    model.classifier = torch.nn.Sequential(
        torch.nn.Dropout(0.3),
        torch.nn.Linear(model.classifier.in_features, 1)
    )
    model.load_state_dict(torch.load(model_path, map_location="cpu"))
    model.eval()
    predict_transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])

    def predict_attention(image_path):
        image = Image.open(image_path).convert("RGB")
        input_tensor = predict_transform(image).unsqueeze(0)
        with torch.no_grad():
            output = model(input_tensor)
            prob = torch.sigmoid(output).item()
            label = "Attentive" if prob > 0.5 else "Not Attentive"
        return label, prob

    results = []
    frame_files = sorted([f for f in os.listdir(frames_dir) if f.endswith('.jpg')])
    for idx, fname in enumerate(frame_files, start=1):
        label, prob = predict_attention(os.path.join(frames_dir, fname))
        results.append((idx, fname, label, prob))

    b0_csv_path = os.path.join(b0_output_dir, "b0_predictions.csv")
    pd.DataFrame(results, columns=["frame", "Frame_Name", "Prediction", "Confidence"]).to_csv(b0_csv_path, index=False)

    # === Run OpenFace ===
    openface_dir = r"C:\OpenFace\OpenFace_2.2.0_win_x64"
    openface_cmd = f'cd /d "{openface_dir}" && FeatureExtraction.exe -fdir "{frames_dir}" -out_dir "{openface_output_dir}" -gaze'
    os.system(openface_cmd)
    openface_csv_path = os.path.join(openface_output_dir, "frames.csv")
    if not os.path.exists(openface_csv_path):
        return {"error": "OpenFace failed to generate output."}

    # === Predict engagement ===
    openface_df = pd.read_csv(openface_csv_path)
    b0_df = pd.read_csv(b0_csv_path)
    merged_df = pd.merge(openface_df, b0_df, on="frame", how="inner")

    def is_engaged(row):
        forward_gaze = abs(row[' gaze_angle_x']) < 0.2 and abs(row[' gaze_angle_y']) < 0.2
        attentive = "Attentive" in row['Prediction']
        return int(attentive and forward_gaze)

    merged_df['Engaged'] = merged_df.apply(is_engaged, axis=1)

    svm = joblib.load(os.path.join(base_dir, "svm_engagement.pkl"))
    X = merged_df[[' gaze_angle_x', ' gaze_angle_y', 'Confidence']]
    y_pred = svm.predict(X)

    engaged_percentage = round((sum(y_pred) / len(y_pred)) * 100, 2)

    def plot_to_base64():
        buf = BytesIO()
        plt.savefig(buf, format='png')
        plt.close()
        buf.seek(0)
        return base64.b64encode(buf.read()).decode('utf-8')

    # === Chart 1: Pie
    plt.figure()
    plt.pie([engaged_percentage, 100 - engaged_percentage], labels=['Engaged', 'Not Engaged'], autopct='%1.1f%%', startangle=90)
    plt.title('Classroom Engagement Overview')
    pie_chart = plot_to_base64()

    # === Chart 2: Line
    engagement_over_time = merged_df.groupby('frame')['Engaged'].mean() * 100
    plt.figure(figsize=(10, 4))
    plt.plot(engagement_over_time, marker='o')
    plt.title("Engagement Over Time")
    plt.xlabel("Frame Number")
    plt.ylabel("Engagement %")
    plt.grid(True)
    plt.tight_layout()
    line_chart = plot_to_base64()

    # === Chart 3: Smoothed
    plt.figure(figsize=(10, 4))
    engagement_over_time.rolling(window=3).mean().plot(color='orange')
    plt.title("Smoothed Engagement Over Time")
    plt.xlabel("Frame Number")
    plt.ylabel("Engagement %")
    plt.grid(True)
    plt.tight_layout()
    smooth_chart = plot_to_base64()
    
    # === Cleanup: Delete video and extracted frames ===
    try:
        # Delete the video file
        if os.path.exists(video_path):
            os.remove(video_path)
        
        # Delete all frame images
        for f in os.listdir(frames_dir):
            file_path = os.path.join(frames_dir, f)
            if os.path.isfile(file_path):
                os.remove(file_path)
    except Exception as e:
        print(f"⚠️ Cleanup failed: {e}")
        
    return {
        "engagement": engaged_percentage,
        "pie_chart": pie_chart,
        "line_chart": line_chart,
        "smooth_chart": smooth_chart
    }