from openai import OpenAI


KEYS = {
  'local': {
    'key': 'cf-123456789',
    'endpoint': 'http://localhost:8787/v1',
    'model': 'gpt-3.5-turbo'
  },
  'cf': {
    'key': 'cf-123456789',
    'endpoint': '<your cf production endpoint>',
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