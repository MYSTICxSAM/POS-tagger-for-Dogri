import pickle

# Load trained model
with open('hindi_crf_model.pkl', 'rb') as f:
    crf = pickle.load(f)

# Feature extractor for prediction
def word2features(sent, i):
    word = sent[i]
    features = {
        'bias': 1.0,
        'word': word,
        'suffix3': word[-3:],
        'prefix1': word[0],
        'is_digit': word.isdigit(),
    }
    if i > 0:
        features.update({'-1:word': sent[i-1]})
    else:
        features['BOS'] = True
    if i < len(sent) - 1:
        features.update({'+1:word': sent[i+1]})
    else:
        features['EOS'] = True
    return features

def sent2features(sent): return [word2features(sent, i) for i in range(len(sent))]

# Prediction function
def tag_sentence(sentence):
    words = sentence.strip().split()
    features = sent2features(words)
    tags = crf.predict_single(features)
    return list(zip(words, tags))

# 🔍 Test Example
#sentence = "अंश ते समर्थ विश्व-विद्यालय च सभनें शा महान न |"
#sentence = "हमारे विभागाध्यक्ष सर हमेशा विद्यार्थियों का मार्गदर्शन करते हैं।"
for word, tag in tag_sentence(sentence):
    print(f"{word} => {tag}")
