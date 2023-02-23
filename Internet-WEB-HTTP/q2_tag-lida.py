import requests
import requests_cache
from bs4 import BeautifulSoup

requests_cache.install_cache('banco')

response = requests.get('https://www.reddit.com/', verify=False)
soup = BeautifulSoup(response.content, 'html.parser')

tag_lida = input('Tag a ser lida: ')

for tag in soup.find_all(tag_lida):
    print(tag)
