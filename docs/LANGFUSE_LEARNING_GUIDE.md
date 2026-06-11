# Langfuse Learning Guide

MedTrace is designed so each major Langfuse concept is visible in both code and UI.

## 1. Create the runtime prompt

Create a **chat prompt** named `doctor-assistant` in Langfuse. Add these variables:

- `patient_message`
- `rag_context`
- `chat_history`

The backend intentionally contains no runtime medical system prompt. It fetches this prompt from Langfuse using `production` or `staging` labels and compiles the variables at request time.

Create at least two versions:

1. Label the stable version `production`.
2. Label an experimental version `staging`.
3. Keep the same variable names in both versions.

## 2. Observe a request

Send a message from AI Doctor. In Langfuse, the trace contains:

- Root `doctor-chat` span with session, user, environment, input, and output
- `medical-knowledge-retrieval` observation with retrieved source scores
- `openai-doctor-response` generation linked to the exact prompt version
- Model parameters, latency, and OpenAI token usage

The application stores operational trace fields in PostgreSQL for the local dashboard. Langfuse remains the source of truth for detailed AI observability and model cost.

## 3. Run an experiment

`PROMPT_LABEL_A`, `PROMPT_LABEL_B`, and `EXPERIMENT_SPLIT` control routing. The default split is 50/50. Each trace records the selected prompt label and version, allowing metrics to be grouped by prompt version in Langfuse.

For production, persist experiment configuration in PostgreSQL or a feature-flag service instead of environment variables.

## 4. Capture evaluations

Thumb feedback calls `POST /api/v1/evaluations/feedback`. The score is:

- Stored locally for application analytics
- Sent to Langfuse as the numeric `user-feedback` score
- Associated with the generation trace

Add Langfuse evaluators for groundedness, safety, relevance, and hallucination detection to complement human feedback.

## 5. Test RAG

Upload a trusted PDF in Knowledge Center:

1. `pypdf` extracts text.
2. The service creates overlapping chunks.
3. OpenAI creates embeddings.
4. ChromaDB persists vectors and metadata.
5. Chat retrieves the top semantic matches.
6. Retrieved context is compiled into the Langfuse prompt.

Only ingest content you are licensed and authorized to use. Do not use this demonstration for real patient care or protected health information.
