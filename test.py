from openai import OpenAI


KEYS = {
  'local': {
    'key': 'cf-BHysWVezUVCiRRv596rcQtrJNohu3Zi5',
    'endpoint': 'http://localhost:8787/v1',
    'model': 'gpt-3.5-turbo'
  },
  'cf': {
    'key': 'cf-BHysWVezUVCiRRv596rcQtrJNohu3Zi5',
    'endpoint': 'https://white-scene-699e.boyd4y.workers.dev/v1',
    'model': '@cf/qwen/qwen1.5-0.5b-chat'
  }
}

def test(key):
  openai = OpenAI(base_url=KEYS[key]['endpoint'], api_key=KEYS[key]['key'])
  completion = openai.chat.completions.create(
    model=KEYS[key]['model'],
    messages=[
      {"role": "user", "content": "who are you"}
    ],
    stream=True
  )

  for chunk in completion:
    print(chunk.choices[0].delta.content, end='')

test('cf')