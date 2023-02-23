import requests
import requests_cache
from bs4 import BeautifulSoup

requests_cache.install_cache('banco')

response = requests.get('https://www.reddit.com/', verify=False)
soup = BeautifulSoup(response.content, 'html.parser')

for tag_a in soup.find_all('a', href=True):
    print(tag_a['href'])
