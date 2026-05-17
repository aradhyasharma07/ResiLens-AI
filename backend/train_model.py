import os
import pickle

from sklearn.model_selection import (
    train_test_split
)

from sklearn.feature_extraction.text import (
    TfidfVectorizer
)

from sklearn.linear_model import (
    LogisticRegression
)

from sklearn.metrics import (
    accuracy_score
)


shortlisted_path = (
    "data/shortlisted"
)

rejected_path = (
    "data/rejected"
)

texts = []

labels = []


def load_folder(
    folder,
    label
):

    for file in os.listdir(folder):

        if file.endswith(".txt"):

            path = os.path.join(
                folder,
                file
            )

            with open(
                path,
                "r",
                encoding="utf-8",
                errors="ignore"
            ) as f:

                text = f.read()

                if text.strip():

                    texts.append(text)

                    labels.append(label)


load_folder(
    shortlisted_path,
    1
)

load_folder(
    rejected_path,
    0
)

print(
    f"Loaded {len(texts)} samples"
)

X_train, X_test, y_train, y_test = (
    train_test_split(
        texts,
        labels,
        test_size=0.2,
        random_state=42,
    )
)

vectorizer = (
    TfidfVectorizer(
        stop_words="english",
        max_features=5000,
    )
)

X_train_vec = (
    vectorizer.fit_transform(
        X_train
    )
)

X_test_vec = (
    vectorizer.transform(
        X_test
    )
)

model = (
    LogisticRegression(
        max_iter=1000
    )
)

model.fit(
    X_train_vec,
    y_train
)

predictions = (
    model.predict(
        X_test_vec
    )
)

accuracy = accuracy_score(
    y_test,
    predictions
)

print(
    f"Model Accuracy: {accuracy * 100:.2f}%"
)

with open(
    "model.pkl",
    "wb"
) as f:

    pickle.dump(
        model,
        f
    )

with open(
    "vectorizer.pkl",
    "wb"
) as f:

    pickle.dump(
        vectorizer,
        f
    )

print(
    "Model and vectorizer saved successfully."
)