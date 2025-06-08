import sklearn_crfsuite
from sklearn_crfsuite import metrics
from sklearn.model_selection import train_test_split
import pickle

# Step 1: Parse "word/POS" lines into [(word, tag), ...]
def parse_line(line):
    tokens = line.strip().split()
    return [tuple(tok.rsplit('/', 1)) for tok in tokens if '/' in tok]

def load_dataset(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    return [parse_line(line) for line in lines if line.strip()]

# Step 2: Feature Extraction
def word2features(sent, i):
    word = sent[i][0]
    features = {
        'bias': 1.0,
        'word': word,
        'suffix3': word[-3:] if len(word) >= 3 else word,
        'prefix1': word[0] if word else '',
        'is_digit': word.isdigit(),
    }
    if i > 0:
        features.update({'-1:word': sent[i-1][0]})
    else:
        features['BOS'] = True
    if i < len(sent) - 1:
        features.update({'+1:word': sent[i+1][0]})
    else:
        features['EOS'] = True
    return features
def sent2features(sent): return [word2features(sent, i) for i in range(len(sent))]
def sent2labels(sent): return [label for token, label in sent]

# Step 3: Load data
sentences = load_dataset('DogriDataset.txt')
X = [sent2features(s) for s in sentences]
y = [sent2labels(s) for s in sentences]

# Step 4: Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# Step 5: Train CRF model
crf = sklearn_crfsuite.CRF(
    algorithm='lbfgs',
    max_iterations=100,
    all_possible_transitions=True
)
crf.fit(X_train, y_train)

# Step 6: Evaluate
y_pred = crf.predict(X_test)
print(metrics.flat_classification_report(y_test, y_pred))

# Step 7: Save model
with open('hindi_crf_model.pkl', 'wb') as f:
    pickle.dump(crf, f)

print("✅ Model trained and saved as hindi_crf_model.pkl")
