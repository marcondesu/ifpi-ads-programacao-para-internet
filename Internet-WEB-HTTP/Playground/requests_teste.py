import requests
import requests_cache

requests_cache.install_cache('banco')
response = requests.get('http://www.google.com')

print(response.status_code)
#print(response.headers['content-type'])
# print(response.text)
