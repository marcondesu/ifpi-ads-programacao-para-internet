import requests
import requests_cache
from bs4 import BeautifulSoup
from pprint import pprint

requests_cache.install_cache('banco')

response = requests.get('https://www.reddit.com/', verify=False)
soup = BeautifulSoup(response.text, 'html.parser')

cabecalhos = soup.find_all('h3')

for cabecalho in cabecalhos:
    texto = cabecalho.get_text()
    print(" - ", texto)
    