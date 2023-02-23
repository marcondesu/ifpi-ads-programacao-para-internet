import requests
import requests_cache
from bs4 import BeautifulSoup

requests_cache.install_cache('banco')

busca = input('O que desejas? ')
print('...\n')

response = requests.get(f'https://www.google.com/search?q={busca}', verify=False)
soup = BeautifulSoup(response.content, 'html.parser')

resultados = soup.find_all('h3')

for resultado in resultados:
    print(resultado.text)
