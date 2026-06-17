from openai import OpenAI
import os

client = OpenAI(
    base_url="https://api.naga.ac/v1",
    api_key=os.getenv("NAGA_API_KEY"),
)


# calls AI
# TODO: auto fallback
def callAi(model, prompt):
    resp = client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2,
    )
    print(resp.choices[0].message.content)


callAi("llama-3.2-1b-instruct", "hi")
