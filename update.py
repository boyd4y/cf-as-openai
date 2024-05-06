import requests
from lxml import html
import json
import time
from datetime import datetime

def fetchSection(section):
  page = requests.get(f'https://developers.cloudflare.com/workers-ai/models/#{section}')

  tree = html.fromstring(page.content)
  models_table = tree.xpath(f'//h2[@id="{section}"]/following-sibling::table')[0]
  models_element = models_table.xpath('.//tr/td/a')

  links = []
  models = []
  for model_element in models_element:
    href = model_element.attrib['href']
    links.append(href)

  for link in links:
    time.sleep(2)
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
  return models

# text-generation
# text-to-image
# text-embeddings
text_models = fetchSection('text-generation')
images_models = fetchSection('text-to-image')
embeddings_models = fetchSection('text-embeddings')
now = datetime.now()

with open('./config/models.json', 'w+', encoding='utf-8') as f:
  json.dump({
    'updated_at': now.strftime("%d/%m/%Y %H:%M:%S"),
    'text_models': text_models,
    'images_models': images_models,
    'embeddings_models': embeddings_models,
  }, f, ensure_ascii=False, indent=4)

print(f'save to file config/models.json success!')
