import requests
import requests_cache
from bs4 import BeautifulSoup

requests_cache.install_cache('banco')

response = requests.get('https://www.meutimao.com.br/tabela-de-classificacao/campeonato_brasileiro/', verify=False)
soup = BeautifulSoup(response.content, 'html.parser')
tabela = soup.find('table', {'class': 'classificacao_campeonato campeonato_brasileiro'})

print(tabela)
