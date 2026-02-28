<h1 align="center">
  <br>
  ✦ SummarAI
  <br>
</h1>

<h4 align="center">An Abstractive Text Summariser using NLP, LSTM, Bahdanau Attention, and BART.</h4>

<p align="center">
  <a href="#about-the-project">About The Project</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#features">Features</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#api-reference">API Reference</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/UI-Glassmorphism-8b5cf6?style=flat-square" alt="UI" />
  <img src="https://img.shields.io/badge/Backend-Flask-white?style=flat-square&logo=flask" alt="Backend" />
  <img src="https://img.shields.io/badge/Model-DistilBART-orange?style=flat-square&logo=huggingface" alt="Model" />
  <img src="https://img.shields.io/badge/Python-3.10+-blue?style=flat-square&logo=python" alt="Python" />
</p>


---

## About The Project

**SummarAI** is a Natural Language Processing (NLP) web application designed to generate high-quality, abstractive summaries of long text passages, articles, and documents. 

Unlike *extractive* summarisers which simply pull important sentences from the source text, an **abstractive** summariser understands the context and generates completely new, human-readable sentences — much like a human would summarise an article.

This project originated as a Jupyter Notebook containing a custom-built, trained **Seq2Seq LSTM** model with **Bahdanau Attention**, evaluated using the **BLEU** metric. To provide reliable, production-ready, real-time inferences for the web application, the backend is powered by Hugging Face's **DistilBART** (`sshleifer/distilbart-cnn-12-6`) transformer model.

---

## Architecture

The project is split into two distinct tiers connected via a REST API:

1. **Frontend UI** 
   * A modern, responsive "Glassmorphism" interface built with plain HTML, CSS (Grid/Flexbox), and Vanilla JavaScript.
   * Features dynamic sliders, real-time token tracking, responsive loading states, and clipboard API integration.
2. **Flask Backend**
   * A lightweight Python HTTP server acting as a bridge between the frontend and the Hugging Face AI pipeline.
   * Utilises smart retry logic (exponential backoff) to gracefully handle model cold-start (503) errors from the Inference API.

---

## Features

- **Abstractive Summarisation**: Generates readable, coherent synopses using the DistilBART transformer.
- **Customisable Length**: Dual sliders allow users to define exact minimum and maximum token lengths for the summary.
- **Real-time Analytics**: Tracks input word count, output word count, and calculates the overall compression ratio.
- **Sleek UI**: Interactive mesh gradients, soft glass animations, and a comfortable dark mode aesthetic.
- **Resilient Backend**: Automatic recovery from Hugging Face cold-start API timeouts.

---

## Quick Start

To run this application locally, you will need two separate terminal windows: one for the Flask backend, and one for the static frontend.

### Prerequisites

* Python 3.10+
* A [Hugging Face User Access Token](https://huggingface.co/settings/tokens) (Free tier is sufficient)

### 1. Setup the Backend

```bash
# Clone the repository
git clone https://github.com/rupesh-3/Mini_project.git
cd Mini_project/backend

# Create a virtual environment and install dependencies
python -m venv venv
# On Windows: venv\Scripts\activate.ps1
# On Mac/Linux: source venv/bin/activate
pip install -r requirements.txt

# Configure your Hugging Face Token
cp .env.example .env
# Open .env and replace 'your_hugging_face_token_here' with your actual token
```

### 2. Run the Servers

**Terminal 1 (Backend):**
```bash
cd backend
python app.py
# Runs on http://localhost:5000
```

**Terminal 2 (Frontend):**
```bash
cd frontend
python -m http.server 8080
# Runs on http://localhost:8080
```

Once both servers are running, simply open your browser and navigate to `http://localhost:8080`.

---

## API Reference

The backend exposes a single POST endpoint for summarisation.

### `POST /api/summarize`

**Payload:**
```json
{
  "text": "The long article text goes here...",
  "min_length": 30,
  "max_length": 130
}
```

**Response (200 OK):**
```json
{
  "compression_ratio": 47.1,
  "input_word_count": 51,
  "model": "sshleifer/distilbart-cnn-12-6",
  "summary": "Python is a high-level programming language...",
  "summary_word_count": 27
}
```

## Credits

- Model Architecture based on Seq2Seq LSTM with Bahdanau (Additive) Attention
- Transformer inference provided by [Hugging Face](https://huggingface.co/) `sshleifer/distilbart-cnn-12-6`
