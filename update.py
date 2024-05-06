import requests
from lxml import html
import json
import time

page = requests.get('https://developers.cloudflare.com/workers-ai/models/#text-generation')

tree = html.fromstring(page.content)
models_table = tree.xpath('//h2[@id="text-generation"]/following-sibling::table')[0]
models_element = models_table.xpath('.//tr/td/a')

links = []
models = []
for model_element in models_element:
  href = model_element.attrib['href']
  links.append(href)

for link in links:
  time.sleep(0.3)
  model_detail = requests.get(f'https://developers.cloudflare.com/{link}')
  model_tree = html.fromstring(model_detail.content)

  name = model_tree.xpath('//div[@id="main"]/article/div/h1/text()')[0]
  id = model_tree.xpath('//div[@id="main"]/article/p/code/text()')[0]
  description = model_tree.xpath('//div[@id="main"]/article/p/text()')[1]
  beta = len(model_tree.xpath('//div[@id="main"]/article/div/div[contains(@class, "DocsMarkdown--pill-beta")]')) > 0
  print(f"id {id} name {name} beta {beta} description {description}")

  models.append({
    'link': link,
    'id': id,
    'name': name,
    'beta': beta,
    'description': description
  })

with open('./config/models.json', 'w+', encoding='utf-8') as f:
  json.dump(models, f, ensure_ascii=False, indent=4)

print(f'save to file config/models.json success!')
